import React, { useState } from "react";

const DailyCheckIn = () => {
  const [mood, setMood] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you'd post the check-in to Firestore
    setMessage("Thank you for your check-in!");
    setMood("");
  };

  return (
    <div className="p-4 text-white bg-slate-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Daily Check-In</h1>
      <form onSubmit={handleSubmit} className="max-w-md">
        <label className="block mb-2">How are you feeling today?</label>
        <input
          type="text"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          placeholder="Enter your mood..."
          className="w-full p-2 rounded bg-slate-700 text-white mb-4"
        />
        <button type="submit" className="bg-blue-600 p-2 rounded hover:bg-blue-700">
          Submit
        </button>
      </form>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
};

export default DailyCheckIn;
