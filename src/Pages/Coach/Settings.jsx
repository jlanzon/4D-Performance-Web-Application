import React, { useState, useEffect } from "react";
import { auth, db } from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const Settings = () => {
  const [coachDetails, setCoachDetails] = useState({ name: "", bio: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const docRef = doc(db, "coachDetails", auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCoachDetails(docSnap.data());
        }
      } catch (error) {
        console.error("Error fetching coach details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const docRef = doc(db, "coachDetails", auth.currentUser.uid);
      await updateDoc(docRef, coachDetails);
      setMessage("Settings updated successfully!");
    } catch (error) {
      console.error("Error updating coach details", error);
      setMessage("Error updating settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-4 text-white">Loading settings...</div>;

  return (
    <div className="p-4 text-white bg-slate-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Coach Settings</h1>
      {message && <p className="mb-4">{message}</p>}
      <div className="mb-4">
        <label className="block mb-2">Coach Name</label>
        <input
          type="text"
          value={coachDetails.name}
          onChange={(e) => setCoachDetails({ ...coachDetails, name: e.target.value })}
          className="w-full p-2 rounded bg-slate-700 text-white"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Bio</label>
        <textarea
          value={coachDetails.bio}
          onChange={(e) => setCoachDetails({ ...coachDetails, bio: e.target.value })}
          className="w-full p-2 rounded bg-slate-700 text-white"
        />
      </div>
      <button onClick={handleSave} disabled={saving} className="bg-blue-600 p-2 rounded hover:bg-blue-700">
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
};

export default Settings;
