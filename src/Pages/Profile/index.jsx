import React, { useState, useEffect } from 'react';
import { auth, db, storage } from '../../firebase'; // Adjust the import path based on your project structure
import { signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const [profile, setProfile] = useState({ firstName: '', lastName: '', role: 'user', photoURL: null });
  const [originalProfile, setOriginalProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);

  // Fetch user profile on mount
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    const fetchProfile = async () => {
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setProfile(userDoc.data());
        } else {
          const defaultProfile = { firstName: '', lastName: '', role: 'user', photoURL: null };
          await setDoc(userDocRef, defaultProfile);
          setProfile(defaultProfile);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Error fetching profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, navigate]);

  // Clean up preview URL to prevent memory leaks
  useEffect(() => {
    return () => {
      if (previewURL) {
        URL.revokeObjectURL(previewURL);
      }
    };
  }, [previewURL]);

  // Enter edit mode and store original profile
  const handleEdit = () => {
    setOriginalProfile({ ...profile });
    setEditMode(true);
  };

  // Cancel edit mode and revert changes
  const handleCancel = () => {
    setProfile(originalProfile);
    setEditMode(false);
    setSelectedFile(null);
    if (previewURL) {
      URL.revokeObjectURL(previewURL);
    }
    setPreviewURL(null);
  };

  // Save profile changes to Firestore
  const handleSave = async (e) => {
    e.preventDefault();
    if (!profile.firstName.trim() || !profile.lastName.trim()) {
      setError('First and last name are required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      let photoURL = profile.photoURL;
      if (selectedFile) {
        const storageRef = ref(storage, `profileImages/${user.uid}/profile_pic_${Date.now()}.jpg`);
        await uploadBytes(storageRef, selectedFile);
        photoURL = await getDownloadURL(storageRef);
      } else if (profile.photoURL === null) {
        photoURL = null;
      }
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        firstName: profile.firstName,
        lastName: profile.lastName,
        photoURL: photoURL,
      });
      setProfile({ ...profile, photoURL });
      setSelectedFile(null);
      if (previewURL) {
        URL.revokeObjectURL(previewURL);
      }
      setPreviewURL(null);
      setEditMode(false);
      setSuccessMessage('Profile saved successfully');
      setTimeout(() => setSuccessMessage(''), 2000);
    } catch (err) {
      console.error('Error saving profile:', err);
      setError('Error saving profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Handle profile picture file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (previewURL) {
        URL.revokeObjectURL(previewURL);
      }
      setSelectedFile(file);
      setPreviewURL(URL.createObjectURL(file));
    }
  };

  // Remove profile picture
  const handleRemovePicture = () => {
    setSelectedFile(null);
    if (previewURL) {
      URL.revokeObjectURL(previewURL);
    }
    setPreviewURL(null);
    setProfile({ ...profile, photoURL: null });
  };

  // Handle user logout
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
        {successMessage && <div className="bg-green-500 text-white p-2 rounded mb-4">{successMessage}</div>}
        {error && <div className="bg-red-500 text-white p-2 rounded mb-4">{error}</div>}
        {editMode ? (
          <form onSubmit={handleSave} className="space-y-6">
            <div className="flex flex-col items-center">
              {previewURL ? (
                <img src={previewURL} alt="Preview" className="w-32 h-32 rounded-full object-cover mb-4" />
              ) : profile.photoURL ? (
                <img src={profile.photoURL} alt="Profile" className="w-32 h-32 rounded-full object-cover mb-4" />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-500 flex items-center justify-center text-white text-4xl mb-4">
                  {profile.firstName ? profile.firstName[0].toUpperCase() : '?'}
                </div>
              )}
              <div className="flex space-x-4">
                <input
                  type="file"
                  id="profilePicture"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="profilePicture" className="cursor-pointer bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
                  Upload Picture
                </label>
                {(previewURL || profile.photoURL) && (
                  <button type="button" onClick={handleRemovePicture} className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700">
                    Remove
                  </button>
                )}
              </div>
            </div>
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
                onClick={handleCancel}
                className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-500 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col items-center">
              {profile.photoURL ? (
                <img src={profile.photoURL} alt="Profile" className="w-32 h-32 rounded-full object-cover mb-4" />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-500 flex items-center justify-center text-white text-4xl mb-4">
                  {profile.firstName ? profile.firstName[0].toUpperCase() : '?'}
                </div>
              )}
            </div>
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
                onClick={handleEdit}
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