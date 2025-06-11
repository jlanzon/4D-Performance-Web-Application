import React, { useState, useContext, useEffect } from 'react';
import { motion, useMotionValue, animate, useMotionTemplate } from 'framer-motion';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { DarkModeContext } from '../context/Theme';

const COLORS_TOP = ["#13FFAA", "#1E67C6", "#CE84CF", "#DD335C"];

const WaitingList = () => {
  const { isDark } = useContext(DarkModeContext);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const color = useMotionValue(COLORS_TOP[0]);

  useEffect(() => {
    animate(color, COLORS_TOP, {
      ease: "easeInOut",
      duration: 10,
      repeat: Infinity,
      repeatType: "mirror",
    });
  }, []);

  const border = useMotionTemplate`1px solid ${color}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'waitingList'), {
        email,
        submittedAt: new Date(),
      });
      setSubmitted(true);
      setEmail('');
      setError(null);
    } catch (err) {
      console.error('Error adding document: ', err);
      setError('There was an error submitting your email. Please try again.');
    }
  };

  return (
    <div className={` font-sans ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className="container mx-auto px-6 py-16">
        <div
          className={`w-full max-w-lg mx-auto rounded-2xl shadow-xl p-8 ${
            isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          }`}
        >
          <p
            className={`text-base md:text-lg mb-6 ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            Sign up for the <strong>4D Leader App</strong> waiting list to boost your leadership skills with AI-powered coaching designed for peak performance.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="waiting-email"
                className={`block mb-1 font-medium ${
                  isDark ? 'text-gray-200' : 'text-gray-900'
                }`}
              >
                Email
              </label>
              <input
                type="email"
                id="waiting-email"
                name="waitingEmail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDark
                    ? 'bg-gray-700 border-gray-600 text-gray-200'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
            <motion.button
              type="submit"
              style={{ border }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                isDark
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              Join Waiting List
            </motion.button>
          </form>
          {submitted && (
            <p className="mt-4 text-green-500">
              Thank you for joining the waiting list!
            </p>
          )}
          {error && (
            <p className="mt-4 text-red-500">
              {error}
            </p>
          )}
        </div>
      </div>

      {/* Decorative Background Elements */}
      <div>
        <span className="absolute top-[30vh] left-[70%] -z-10 h-[100px] lg:h-[500px] w-[100px] lg:w-[600px] -translate-x-[50%] rounded-full bg-gradient-to-r from-violet-600/20 to-indigo-600/20 blur-3xl" />
        <span className="absolute top-[70vh] left-[20%] -z-10 h-[100px] lg:h-[500px] w-[100px] lg:w-[600px] -translate-x-[50%] rounded-full bg-gradient-to-r from-red-600/20 to-green-600/20 blur-3xl" />
      </div>
    </div>
  );
};

export default WaitingList;