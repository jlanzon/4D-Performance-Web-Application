import React, { useState, useRef, useEffect } from "react";
import { auth, db, functions } from "../../firebase"; 
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { doc, getDoc } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [coachDetails, setCoachDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const user = auth.currentUser;
  const chatId = user ? user.uid : null;

  // Fetch coach details on mount
  useEffect(() => {
    const fetchCoachDetails = async () => {
      if (!user) {
        console.log("No user is signed in");
        return;
      }
      const docRef = doc(db, "coachDetails", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setCoachDetails(docSnap.data());
      } else {
        console.log("No coach details found");
        setCoachDetails({ name: "Your AI Coach" }); // Fallback
      }
    };
    fetchCoachDetails();
  }, [user]);

  // Fetch and listen to messages from Firestore
  useEffect(() => {
    if (!chatId) return;

    const messagesRef = collection(db, `chats/${chatId}/messages`);
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(fetchedMessages);
    }, (error) => {
      console.error("Error fetching messages:", error);
    });

    return () => unsubscribe();
  }, [chatId]);

  // Scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message and get AI response
  const handleSend = async () => {
    if (newMessage.trim() === "" || !chatId) return;

    const userMessage = {
      text: newMessage,
      sender: "user",
      timestamp: serverTimestamp(),
    };

    // Add user message to Firestore
    await addDoc(collection(db, `chats/${chatId}/messages`), userMessage);
    setNewMessage("");
    setIsLoading(true);

    try {
      const generateAIResponse = httpsCallable(functions, "generateAIResponse");
      const { data } = await generateAIResponse({
        messages: messages,
        userMessage: newMessage,
      });

      // Add AI response to Firestore
      await addDoc(collection(db, `chats/${chatId}/messages`), {
        text: data.response,
        sender: "coach",
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error sending message:", error);
      await addDoc(collection(db, `chats/${chatId}/messages`), {
        text: "Sorry, I couldn't process that. Please try again.",
        sender: "coach",
        timestamp: serverTimestamp(),
      });
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
    if (!timestamp) return "";
    const date = timestamp.toDate(); // Firestore timestamp to JS Date
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  if (!user) {
    return (
      <div className="p-4 text-white bg-slate-900 min-h-screen">
        <h1 className="text-3xl font-bold mb-4">Please sign in to chat</h1>
      </div>
    );
  }

  return (
    <div className="p-4 text-white bg-slate-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Coach Chat</h1>
      <h2 className="text-2xl mb-4">
        Chatting with {coachDetails?.name || "Your AI Coach"}
      </h2>
      <div className="bg-slate-800 p-4 rounded mb-4 h-96 overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-2 flex ${
              msg.sender === "coach" ? "justify-start" : "justify-end"
            }`}
          >
            <div
              className={`p-2 rounded ${
                msg.sender === "coach"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-green-100 text-green-800"
              } flex flex-col max-w-[70%]`}
            >
              {msg.sender === "coach" && (
                <div className="text-sm font-bold text-gray-700">
                  {coachDetails?.name || "AI Coach"}
                </div>
              )}
              <div className="whitespace-pre-wrap">{msg.text}</div>
              <div className="text-xs text-gray-500 mt-1">
                {formatTime(msg.timestamp)}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start mb-2">
            <div className="bg-blue-100 text-blue-800 p-2 rounded">
              <div className="animate-pulse">Thinking...</div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex">
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
          className="flex-grow p-2 rounded-l bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[50px] max-h-[150px]"
          rows={2}
        />
        <button
          onClick={handleSend}
          disabled={newMessage.trim() === "" || isLoading}
          className="bg-blue-600 px-4 rounded-r hover:bg-blue-700 transition disabled:bg-blue-300 flex items-center"
        >
          {isLoading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default Chat;