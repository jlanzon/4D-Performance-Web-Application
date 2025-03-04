import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../../firebase'; // Adjust the import path as needed
import { doc, getDoc } from 'firebase/firestore';

const Navbar = () => {
  // State for authentication and user data
  const [user, loading] = useAuthState(auth);
  const [firstName, setFirstName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Fetch user data from Firestore when user is authenticated
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
    <div className="fixed top-0 left-0 right-0 z-50 p-4">
      <div className="w-full flex justify-between md:w-[80vw] mx-auto bg-white-500/50 backdrop-blur-md text-white rounded-lg shadow-lg p-4">
        {/* Top row with logo and hamburger button */}
        <div className="flex items-center justify-between">
          <div className="font-bold text-xl transform hover:scale-105 transition-transform duration-300">
            <Link to="/">4D Leader</Link>
          </div>
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

        {/* Navigation links */}
        <div
          className={`${
            isOpen ? 'block opacity-100 translate-y-0' : 'hidden opacity-0 -translate-y-4'
          } md:flex md:items-center md:space-x-4 backdrop-blur-md mt-2 p-4 md:p-0 transition-all duration-300 ease-in-out md:opacity-100 md:translate-y-0 md:bg-transparent`}
        >
          
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
                className="flex justify-center items-center justify-items-center py-2 md:py-0  rounded transition-colors duration-200"
              >
              {/* <div className="flex items-center py-2 md:py-0"> */}
                
                <p>Hello, {firstName || user.email}</p>{photoURL && (
                  <img src={photoURL} alt="Avatar" className="w-8 h-8 rounded-full ml-2" />
                )}
              {/* </div> */}
              
              </Link>
              
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block md:inline-block py-2 md:py-0  text-white px-2 rounded  transition-colors duration-200"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="block md:inline-block py-2 md:py-0  text-white px-2 rounded transition-colors duration-200"
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