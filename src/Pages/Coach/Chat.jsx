import React, { useState, useRef, useEffect, useContext } from "react";
import { auth, db, functions } from "../../firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  serverTimestamp,
  limit,
  getDocs,
  startAfter,
} from "firebase/firestore";
import { doc, getDoc } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { ModelNameContext } from "../../context/ModelName";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [coachDetails, setCoachDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [totalMessages, setTotalMessages] = useState(0);
  const [lastMessageId, setLastMessageId] = useState(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const user = auth.currentUser;
  const chatId = user ? user.uid : null;

  const { modelName } = useContext(ModelNameContext);

  useEffect(() => {
    const fetchCoachDetails = async () => {
      if (!user) return;
      const docRef = doc(db, "coachDetails", user.uid);
      const docSnap = await getDoc(docRef);
      setCoachDetails(docSnap.exists() ? docSnap.data() : { name: "Your AI Coach" });
    };
    fetchCoachDetails();
  }, [user]);

  useEffect(() => {
    if (!chatId) return;

    const fetchInitialMessages = async () => {
      const messagesRef = collection(db, `chats/${chatId}/messages`);
      const q = query(messagesRef, orderBy("timestamp", "desc"), limit(10));
      const snapshot = await getDocs(q);
      const initialMessages = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .reverse();
      setMessages(initialMessages);
      if (snapshot.docs.length > 0) {
        setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      }
      setHasMore(snapshot.docs.length === 10);
    };

    const fetchTotalMessages = async () => {
      const messagesRef = collection(db, `chats/${chatId}/messages`);
      const snapshot = await getDocs(messagesRef);
      setTotalMessages(snapshot.size);
    };

    fetchInitialMessages();
    fetchTotalMessages();
  }, [chatId]);

  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].id !== lastMessageId) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      setLastMessageId(messages[messages.length - 1].id);
    }
  }, [messages]);

  const handleScroll = async () => {
    const container = messagesContainerRef.current;
    if (!container || isFetchingMore || !hasMore) return;
  
    if (container.scrollTop === 0) {
      setIsFetchingMore(true);
      const previousHeight = container.scrollHeight;
  
      const messagesRef = collection(db, `chats/${chatId}/messages`);
      const q = query(
        messagesRef,
        orderBy("timestamp", "desc"),
        startAfter(lastDoc),
        limit(10)
      );
      const snapshot = await getDocs(q);
      const moreMessages = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .reverse();
  
      if (moreMessages.length > 0) {
        setMessages((prev) => [...moreMessages, ...prev]);
        setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
        setHasMore(snapshot.docs.length === 10);
  
        requestAnimationFrame(() => {
          const newHeight = container.scrollHeight;
          const heightDifference = newHeight - previousHeight;
          container.scrollTop = heightDifference;
        });
      } else {
        setHasMore(false);
      }
      setIsFetchingMore(false);
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !chatId) return;

    const userMessage = { text: newMessage, sender: "user", timestamp: serverTimestamp() };
    setNewMessage("");
    setIsLoading(true);

    try {
      // Add user message to Firestore
      const userDocRef = await addDoc(collection(db, `chats/${chatId}/messages`), userMessage);
      setTotalMessages((prev) => prev + 1);

      // Fetch updated messages after adding user message
      const messagesRef = collection(db, `chats/${chatId}/messages`);
      const q = query(messagesRef, orderBy("timestamp", "desc"), limit(10));
      const snapshot = await getDocs(q);
      const updatedMessages = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .reverse();
      setMessages(updatedMessages);
      if (snapshot.docs.length > 0) {
        setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      }

      // Generate and add AI response
      const generateAIResponse = httpsCallable(functions, "generateAIResponse");
      const { data } = await generateAIResponse({ messages: updatedMessages, userMessage: newMessage });
      await addDoc(collection(db, `chats/${chatId}/messages`), {
        text: data.response,
        sender: "coach",
        timestamp: serverTimestamp(),
      });
      setTotalMessages((prev) => prev + 1);

      // Fetch updated messages after AI response
      const finalSnapshot = await getDocs(q);
      const finalMessages = finalSnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .reverse();
      setMessages(finalMessages);
      if (finalSnapshot.docs.length > 0) {
        setLastDoc(finalSnapshot.docs[finalSnapshot.docs.length - 1]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      await addDoc(collection(db, `chats/${chatId}/messages`), {
        text: "Oops, something went wrong. Try again?",
        sender: "coach",
        timestamp: serverTimestamp(),
      });
      setTotalMessages((prev) => prev + 1);

      // Fetch updated messages after error
      const messagesRef = collection(db, `chats/${chatId}/messages`);
      const q = query(messagesRef, orderBy("timestamp", "desc"), limit(10));
      const snapshot = await getDocs(q);
      const updatedMessages = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .reverse();
      setMessages(updatedMessages);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (timestamp) => {
    if (timestamp && typeof timestamp.toDate === "function") {
      return timestamp.toDate().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    return ""; // Fallback for unresolved timestamps
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
          Please sign in to start chatting
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-gray-100 dark:bg-gray-900 flex flex-col">
      <header className="bg-white dark:bg-gray-800 shadow-sm p-4 sticky top-0 z-10">
        <div className="mx-auto flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {coachDetails?.name || modelName || "Chat with Your AI Coach"}
          </p>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {totalMessages} messages
          </div>
        </div>
      </header>

      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto w-full mx-auto p-4 space-y-6"
        onScroll={handleScroll}
      >
        {isFetchingMore && (
          <div className="text-center">
            <div className="inline-block w-16 h-1 bg-gray-400 dark:bg-gray-600 rounded animate-pulse"></div>
          </div>
        )}
        {!hasMore && messages.length > 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400">
            No more messages
          </div>
        )}
        {messages.length === 0 && !isLoading && (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-10">
            Start the conversation below...
          </div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "coach" ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 shadow-sm ${
                msg.sender === "coach"
                  ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
                  : "bg-blue-500 text-white"
              }`}
            >
              {msg.sender === "coach" && (
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  {coachDetails?.name || modelName || "AI Coach"}
                </div>
              )}
              <div className="whitespace-pre-wrap text-sm">{msg.text}</div>
              <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                {formatTime(msg.timestamp)}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm">
              <div className="flex space-x-2 animate-pulse">
                <div className="w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <footer className="bg-white dark:bg-gray-800 shadow-lg p-2 sticky bottom-0">
        <div className="max-w-4xl mx-auto flex gap-2">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-1 p-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white 
              border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 
              focus:ring-blue-500 resize-none min-h-[60px] max-h-[120px] text-sm"
            rows={2}
          />
          <button
            onClick={handleSend}
            disabled={newMessage.trim() === "" || isLoading}
            className="px-4 py-6 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
              disabled:bg-gray-300 disabled:text-gray-500 transition-colors duration-200 
              flex items-center self-end"
          >
            {isLoading ? (
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </div>
        <div className="text-xs text-gray-400 dark:text-gray-500 text-center mt-2">
          Press Enter to send, Shift+Enter for new line
        </div>
      </footer>
    </div>
  );
};

export default Chat;