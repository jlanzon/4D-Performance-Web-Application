import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';

const Navbar = () => {
  const [user, loading] = useAuthState(auth);
  const [firstName, setFirstName] = useState('');

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
    <nav className="bg-gray-800 p-4 text-white flex justify-between items-center">
      <div className="font-bold">
        <Link to="/">4D Leader</Link>
      </div>
      <div className="space-x-4 flex items-center">
        <Link to="/">Home</Link>
        {loading ? (
          <span>Loading...</span>
        ) : user ? (
          <>
            <span className="ml-4">
              Hello, {firstName ? firstName : user.email}
            </span>
            <Link to="/profile" className="ml-4">
              Profile
            </Link>
            <Link to="/coach" className="ml-4">
              My Coach
            </Link>
          </>
        ) : (
          <>
            <Link to="/login" className="ml-4">
              Login
            </Link>
            <Link to="/signup" className="ml-4">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
