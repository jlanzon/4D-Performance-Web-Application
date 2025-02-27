import React, { useState, useEffect } from 'react';
import { auth, db } from '../../firebase';
import { signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const [profile, setProfile] = useState({ firstName: '', lastName: '' });
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setProfile(userDoc.data());
        } else {
          // Create a default profile if it doesn't exist
          await setDoc(userDocRef, { firstName: '', lastName: '' });
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        firstName: profile.firstName,
        lastName: profile.lastName,
      });
      setEditMode(false);
    } catch (err) {
      console.error('Error saving profile:', err);
      setError('Error saving profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Profile</h1>
      <p className="mb-4">Welcome, {user.email}!</p>
      {editMode ? (
        <form onSubmit={handleSave} className="max-w-md">
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="mb-4">
            <label htmlFor="firstName" className="block mb-1 font-semibold">
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              value={profile.firstName}
              onChange={(e) =>
                setProfile({ ...profile, firstName: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="lastName" className="block mb-1 font-semibold">
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              value={profile.lastName}
              onChange={(e) =>
                setProfile({ ...profile, lastName: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 text-white py-2 px-4 rounded"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              onClick={() => setEditMode(false)}
              className="bg-gray-300 text-black py-2 px-4 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div>
          <div className="mb-4">
            <strong>First Name:</strong> {profile.firstName || 'Not set'}
          </div>
          <div className="mb-4">
            <strong>Last Name:</strong> {profile.lastName || 'Not set'}
          </div>
          <button
            onClick={() => setEditMode(true)}
            className="bg-blue-600 text-white py-2 px-4 rounded mr-4"
          >
            Edit Profile
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white py-2 px-4 rounded"
          >
            Log Out
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
