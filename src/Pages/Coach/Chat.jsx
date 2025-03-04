import React, { useState, useRef, useEffect } from "react";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

const Chat = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Welcome to your coach chat!", sender: "coach" },
    { id: 2, text: "How can I help you today?", sender: "coach" },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [coachDetails, setCoachDetails] = useState(null);
  const messagesEndRef = useRef(null);

  // Fetch coach details on mount
  useEffect(() => {
    const fetchCoachDetails = async () => {
      if (auth.currentUser) {
        const docRef = doc(db, "coachDetails", auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCoachDetails(docSnap.data());
        } else {
          console.log("No coach details found");
        }
      } else {
        console.log("No user is signed in");
      }
    };
    fetchCoachDetails();
  }, []);



  const handleSend = () => {
    if (newMessage.trim() === "") return;
    const message = { id: Date.now(), text: newMessage, sender: "user" };
    setMessages([...messages, message]);
    setNewMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-4 text-white bg-slate-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Coach Chat</h1>
      <h2 className="text-2xl mb-4">
        Chatting with {coachDetails?.name || "Your Coach"}
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
              } flex flex-col`}
            >
              {msg.sender === "coach" && (
                <div className="text-sm font-bold text-gray-700">
                  {coachDetails?.name || "Coach"}
                </div>
              )}
              <div>{msg.text}</div>
              <div className="text-xs text-gray-500 mt-1">
                {formatTime(msg.id)}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="flex-grow p-2 rounded-l bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSend}
          disabled={newMessage.trim() === ""}
          className="bg-blue-600 p-2 rounded-r hover:bg-blue-700 transition disabled:bg-blue-300"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;