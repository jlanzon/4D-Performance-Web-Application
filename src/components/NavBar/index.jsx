import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';

const Navbar = () => {
  const [user, loading] = useAuthState(auth);
  const [firstName, setFirstName] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchFirstName = async () => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFirstName(data.firstName);
        }
      }
    };

    fetchFirstName();
  }, [user]);

  return (
    <div className="bg-gray-800 p-4 text-white fixed top-0 left-0 right-0 z-50 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo with bounce animation on hover */}
        <div className="font-bold transform hover:scale-105 transition-transform duration-300">
          <Link to="/">4D Leader</Link>
        </div>

        {/* Hamburger Button with rotation animation */}
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
              d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>

        {/* Navigation Links with slide-in animation */}
        <div
          className={`${
            isOpen ? 'block opacity-100 translate-y-0' : 'hidden opacity-0 -translate-y-4'
          } md:flex md:items-center md:space-x-4 absolute md:static top-12 left-0 right-0 bg-gray-800 md:bg-transparent p-4 md:p-0 transition-all duration-300 ease-in-out md:opacity-100 md:translate-y-0`}
        >
          <Link
            to="/"
            className="block md:inline-block py-2 md:py-0 hover:text-gray-300 transition-colors duration-200 hover:pl-1"
          >
            Home
          </Link>
          {loading ? (
            <span className="block md:inline-block py-2 md:py-0">Loading...</span>
          ) : user ? (
            <>
              <span className="block md:inline-block py-2 md:py-0 opacity-80">
                Hello, {firstName ? firstName : user.email}
              </span>
              <Link
                to="/profile"
                className="block md:inline-block py-2 md:py-0 hover:text-gray-300 transition-colors duration-200 hover:pl-1"
              >
                Profile
              </Link>
              <Link
                to="/coach"
                className="block md:inline-block py-2 md:py-0 hover:text-gray-300 transition-colors duration-200 hover:pl-1"
              >
                My Coach
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block md:inline-block py-2 md:py-0 hover:text-gray-300 transition-colors duration-200 hover:pl-1"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="block md:inline-block py-2 md:py-0 hover:text-gray-300 transition-colors duration-200 hover:pl-1"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;