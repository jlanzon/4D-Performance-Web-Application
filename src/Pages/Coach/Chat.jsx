import React, { useState } from "react";

const Chat = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Welcome to your coach chat!", sender: "coach" },
    { id: 2, text: "How can I help you today?", sender: "coach" },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSend = () => {
    if (newMessage.trim() === "") return;
    const message = { id: Date.now(), text: newMessage, sender: "user" };
    setMessages([...messages, message]);
    setNewMessage("");
  };

  return (
    <div className="p-4 text-white bg-slate-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Coach Chat</h1>
      <div className="bg-slate-800 p-4 rounded mb-4 h-96 overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-2 ${msg.sender === "coach" ? "text-blue-400" : "text-green-400"}`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow p-2 rounded-l bg-slate-700 text-white"
        />
        <button onClick={handleSend} className="bg-blue-600 p-2 rounded-r hover:bg-blue-700 transition">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
