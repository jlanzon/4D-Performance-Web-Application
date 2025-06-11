import React, { Children, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { FiArrowRight } from 'react-icons/fi';

const WaitingListModal = ({disableButton, border, boxShadow}) => {
  const [isOpen, setIsOpen] = useState(true);
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

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    setSubmitted(false);
    setError(null);
    setEmail('');
  };

  return (
    <>

      

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-stone-900/50 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-stone-50 dark:bg-stone-800 rounded-lg p-6 w-full max-w-md mx-4 shadow-xl"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
                  Join the 4D Leader Waitlist
                </h2>
                <button
                  onClick={closeModal}
                  className="text-stone-600 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200"
                  aria-label="Close modal"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <p className="text-stone-700 dark:text-stone-300 mb-4">
                Thank you for completing the 4D Leadership Intelligence Scorecard! To improve your 4D leadership skills, please sign up for the waiting list for the <strong>4D Leader App</strong>.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="waiting-email"
                    className="block text-stone-900 dark:text-stone-100 mb-1"
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
                    className="w-full p-2 border border-stone-300 dark:border-stone-600 rounded text-stone-900 dark:text-stone-100 bg-white dark:bg-stone-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 dark:bg-indigo-500 text-white dark:text-stone-100 py-2 px-4 rounded hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-500"
                >
                  Join Waiting List
                </button>
              </form>

              {submitted && (
                <p className="mt-4 text-green-600 dark:text-green-400">
                  Thank you for joining the waiting list!
                </p>
              )}
              {error && (
                <p className="mt-4 text-red-600 dark:text-red-400">{error}</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default WaitingListModal;