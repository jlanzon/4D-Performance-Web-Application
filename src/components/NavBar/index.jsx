import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { DarkModeContext } from '../../context/Theme';

const Navbar = () => {
  const [user, loading] = useAuthState(auth);
  const [firstName, setFirstName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { isDark, toggleDarkMode } = useContext(DarkModeContext);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFirstName(data.firstName || '');
          setPhotoURL(data.photoURL || '');
        }
      }
    };

    fetchUserData();
  }, [user]);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 p-4 mx-auto container">
      <div className="w-full flex justify-between md:w-full bg-white-500/50 dark:bg-zinc-800/20 backdrop-blur-md text-white dark:text-pink-100 rounded-lg shadow-lg p-4">
        <div className="flex items-center justify-between w-full md:w-[50%] ">
          <div className="font-bold text-xl transform hover:scale-105 transition-transform duration-300 text-black dark:text-white">
            <Link to="/">4D Leader</Link>
          </div>
          <div className="flex items-center space-x-4">
           
            <button
              className="md:hidden focus:outline-none transform transition-transform duration-300 hover:scale-110"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              <svg
                className={`w-6 h-6 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="hidden md:flex md:items-center md:space-x-4 mt-2 p-4 md:p-0">
          {loading ? (
            <span className="block md:inline-block py-2 md:py-0">Loading...</span>
          ) : user ? (
            <>
              <Link
                to="/coach"
                className="block md:inline-block py-2 md:py-0 rounded transition-colors duration-200"
              >
                <i className="fas fa-book mr-2"></i>My Coach
              </Link>
              <Link
                to="/profile"
                className="flex items-center py-2 md:py-0 rounded transition-colors duration-200"
              >
                <p className="mr-2">Hello, {firstName || user.email}</p>
                {photoURL && (
                  <img
                    src={photoURL}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full"
                  />
                )}
              </Link>
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full text-black dark:text-white"
                aria-label="Toggle dark mode"
              >
                {isDark ? '🌙' : '☀️'}
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block md:inline-block py-2 md:py-0 text-white dark:text-stone-100 px-2 rounded transition-colors duration-200"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="block md:inline-block py-2 md:py-0 text-white dark:text-stone-100 px-2 rounded transition-colors duration-200"
              >
                Sign Up
              </Link>
              {/* <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full"
                aria-label="Toggle dark mode"
              >
                {isDark ? '☀️' : '🌙'}
              </button> */}
            </>
          )}
        </div>
      </div>

      <div
        className={`fixed top-0 left-0 w-screen h-screen bg-white-500/50 dark:bg-stone-800/50 backdrop-blur-md text-black dark:text-white z-40 transition-transform duration-300
          flex flex-col items-center justify-center p-8
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 focus:outline-none"
          aria-label="Close menu"
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

        {loading ? (
          <span className="text-xl mb-4">Loading...</span>
        ) : user ? (
          <>
            <Link
              onClick={() => setIsOpen(false)}
              to="/coach"
              className="text-xl mb-4 hover:underline"
            >
              <i className="fas fa-book mr-2"></i>My Coach
            </Link>
            <Link
              onClick={() => setIsOpen(false)}
              to="/profile"
              className="text-xl mb-4 hover:underline flex items-center"
            >
              <span className="mr-2">Hello, {firstName || user.email}</span>
              {photoURL && (
                <img
                  src={photoURL}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full"
                />
              )}
            </Link>
            <button
              onClick={toggleDarkMode}
              className="text-xl mb-4 hover:underline flex items-center"
            >
              {isDark ? 'Light Mode ☀️' : 'Dark Mode 🌙'}
            </button>
          </>
        ) : (
          <>
            <Link
              onClick={() => setIsOpen(false)}
              to="/login"
              className="text-xl mb-4 hover:underline"
            >
              Login
            </Link>
            <Link
              onClick={() => setIsOpen(false)}
              to="/signup"
              className="text-xl mb-4 hover:underline"
            >
              Sign Up
            </Link>
            <button
              onClick={toggleDarkMode}
              className="text-xl mb-4 hover:underline flex items-center"
            >
              {isDark ? 'Light Mode ☀️' : 'Dark Mode 🌙'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;