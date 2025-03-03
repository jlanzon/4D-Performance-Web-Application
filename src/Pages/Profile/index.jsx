import React, { useState, useEffect } from 'react';
import { auth, db } from '../../firebase';
import { signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const [profile, setProfile] = useState({ firstName: '', lastName: '', role: 'user' });
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
          await setDoc(userDocRef, { firstName: '', lastName: '', role: 'user' });
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
    return <div className="p-8 text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-8">
      <div className="w-full max-w-xl bg-slate-800 shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-white">My Profile</h1>
        <p className="text-gray-300 mb-6">Welcome, {user.email}!</p>
        {editMode ? (
          <form onSubmit={handleSave} className="space-y-4">
            {error && <p className="text-red-500">{error}</p>}
            <div>
              <label htmlFor="firstName" className="block mb-1 font-semibold text-gray-200">
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                value={profile.firstName}
                onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                className="w-full p-2 border border-slate-600 rounded bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block mb-1 font-semibold text-gray-200">
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                value={profile.lastName}
                onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                className="w-full p-2 border border-slate-600 rounded bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-500 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <div>
                <span className="font-semibold text-gray-200">First Name:</span>{' '}
                {profile.firstName || <span className="text-gray-500">Not set</span>}
              </div>
              <div>
                <span className="font-semibold text-gray-200">Last Name:</span>{' '}
                {profile.lastName || <span className="text-gray-500">Not set</span>}
              </div>
              <div>
                <span className="font-semibold text-gray-200">Role:</span>{' '}
                <span className="text-gray-300">{profile.role}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setEditMode(true)}
                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
              >
                Edit Profile
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition"
              >
                Log Out
              </button>
              {profile.role === 'admin' && (
                <button
                  onClick={() => navigate('/admin')}
                  className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
                >
                  Admin Panel
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
