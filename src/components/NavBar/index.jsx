import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { DarkModeContext } from '../../context/Theme';

const Navbar = () => {
  const [user, loading] = useAuthState(auth);
  const [userData, setUserData] = useState({ firstName: '', photoURL: '' });
  const [isOpen, setIsOpen] = useState(false);
  const { isDark, toggleDarkMode } = useContext(DarkModeContext);

  const fetchUserData = useCallback(async () => {
    if (!user) return;
    
    try {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const { firstName = '', photoURL = '' } = docSnap.data();
        setUserData({ firstName, photoURL });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }, [user]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const toggleMenu = () => setIsOpen(prev => !prev);

  const navLinkClass = 'transition-colors duration-200 hover:text-pink-500 focus:text-pink-500 focus:outline-none';
  
  const DesktopNavItems = () => (
    <nav className="hidden md:flex md:items-center md:space-x-6">
      {loading ? (
        <span className="text-gray-600 dark:text-gray-300">Loading...</span>
      ) : user ? (
        <>
          <Link to="/coach" className={`${navLinkClass} flex items-center text-gray-200`}>
            <i className="fas fa-book mr-2" aria-hidden="true"></i>
            My Coach
          </Link>
          <Link 
            to="/profile" 
            className={`${navLinkClass} flex items-center text-gray-200`}
          >
            <span className="mr-2">
              Hello, {userData.firstName || user.email}
            </span>
            {userData.photoURL && (
              <img
                src={userData.photoURL}
                alt={`${userData.firstName || 'User'}'s avatar`}
                className="w-8 h-8 rounded-full object-cover"
                loading="lazy"
              />
            )}
          </Link>
          <button
            onClick={toggleDarkMode}
            className="p-2 text-gray-800 dark:text-gray-200 hover:scale-105 transition-transform duration-300 focus:outline-none"
            aria-label="Toggle dark mode"
          >
            {isDark ? '☀️' : '🌙'}
          </button>
        </>
      ) : (
        <>
          <Link 
            to="/login" 
            className={`${navLinkClass} text-gray-200`}
          >
            Login
          </Link>
          <Link 
            to="/signup" 
            className={`${navLinkClass} text-gray-200`}
          >
            Sign Up
          </Link>
          <button
            onClick={toggleDarkMode}
            className="p-2 text-gray-200 hover:scale-105 transition-transform duration-300 focus:outline-none"
            aria-label="Toggle dark mode"
          >
            {isDark ? '☀️' : '🌙'}
          </button>
        </>
      )}
    </nav>
  );

  const MobileNavItems = () => (
    <nav className={`fixed inset-0 bg-white/30 dark:bg-gray-900/50 backdrop-blur-md z-40
      flex flex-col items-center justify-center p-8 transition-transform duration-300
      ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
    >
      <button
        onClick={toggleMenu}
        className="absolute top-4 right-4 p-2 text-gray-800 dark:text-gray-200"
        aria-label="Close menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      
      {loading ? (
        <span className="text-xl py-4 text-gray-600 dark:text-gray-300">Loading...</span>
      ) : user ? (
        <>
          <Link 
            to="/coach" 
            onClick={toggleMenu} 
            className={`${navLinkClass} text-xl py-4 flex items-center text-gray-800 dark:text-gray-200`}
          >
            <i className="fas fa-book mr-2" aria-hidden="true"></i>
            My Coach
          </Link>
          <Link 
            to="/profile" 
            onClick={toggleMenu} 
            className={`${navLinkClass} text-xl py-4 flex items-center text-gray-800 dark:text-gray-200`}
          >
            <span className="mr-2">Hello, {userData.firstName || user.email}</span>
            {userData.photoURL && (
              <img
                src={userData.photoURL}
                alt={`${userData.firstName || 'User'}'s avatar`}
                className="w-8 h-8 rounded-full object-cover"
                loading="lazy"
              />
            )}
          </Link>
          <button 
            onClick={toggleDarkMode} 
            className={`${navLinkClass} text-xl py-4 text-gray-800 dark:text-gray-200`}
          >
            {isDark ? 'Light Mode ☀️' : 'Dark Mode 🌙'}
          </button>
        </>
      ) : (
        <>
          <Link 
            to="/login" 
            onClick={toggleMenu} 
            className={`${navLinkClass} text-xl py-4 text-gray-800`}
          >
            Login
          </Link>
          <Link 
            to="/signup" 
            onClick={toggleMenu} 
            className={`${navLinkClass} text-xl py-4 text-gray-800`}
          >
            Sign Up
          </Link>
          <button 
            onClick={toggleDarkMode} 
            className={`${navLinkClass} text-xl py-4 text-gray-800`}
          >
            {isDark ? 'Light Mode ☀️' : 'Dark Mode 🌙'}
          </button>
        </>
      )}
    </nav>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 py-2">
      <div className="container mx-auto">
        <div className="flex items-center justify-between bg-gray-800/50 dark:bg-gray-800/50 
          backdrop-blur-md rounded-lg shadow-lg p-4">
          <Link
            to="/"
            className="font-bold text-xl transform hover:scale-105 transition-transform 
              duration-300 text-white focus:outline-none"
          >
            4D Leader
          </Link>

          <button
            className="md:hidden p-2 text-gray-100 dark:text-gray-200 transform 
              transition-transform duration-300 hover:scale-110"
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
          >
            <svg
              className={`w-6 h-6 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
              />
            </svg>
          </button>

          <DesktopNavItems />
        </div>
      </div>
      <MobileNavItems />
    </header>
  );
};

export default Navbar;