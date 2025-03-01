// WaitingList.jsx
import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

const WaitingList = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'waitingList'), {
        email,
        submittedAt: new Date(),
      });
      setSubmitted(true);
      setEmail('');
    } catch (err) {
      console.error('Error adding document: ', err);
      setError('There was an error submitting your email. Please try again.');
    }
  };

  return (
    <div className="mt-6 p-4 bg-gray-100 rounded-lg">
      <p className="text-black mb-4">
        To improve your 4D Intelligence Score and enhance your leadership skills, sign up for the waiting list for the <strong>4D Leader App</strong>. Get AI-powered coaching to boost clarity, confidence, and resilience for peak performance leadership.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="waiting-email" className="block text-black mb-1">Email</label>
          <input
            type="email"
            id="waiting-email"
            name="waitingEmail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded text-black focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Join Waiting List
        </button>
      </form>
      {submitted && <p className="mt-4 text-green-600">Thank you for joining the waiting list!</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  );
};

export default WaitingList;
