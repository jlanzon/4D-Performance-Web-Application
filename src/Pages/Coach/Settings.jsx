import React, { useState, useEffect } from "react";
import { auth, db } from "../../firebase";
import { doc, getDoc, setDoc, deleteDoc, collection, query, getDocs } from "firebase/firestore";
import { Check, X, User, Briefcase, Mic, Trash2, Clock } from "react-feather";

const Settings = () => {
  const [coachDetails, setCoachDetails] = useState({
    name: "",
    specialisation: "",
    tone: "friendly", // New: Coach tone (e.g., friendly, professional, casual)
    isAvailable: true, // New: Availability status
  });
  const [originalDetails, setOriginalDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [clearingChat, setClearingChat] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({
    name: "",
    specialisation: "",
  });

  useEffect(() => {
    const fetchDetails = async () => {
      if (!auth.currentUser) {
        setMessage("You must be logged in to access settings.");
        setLoading(false);
        return;
      }
      try {
        const docRef = doc(db, "coachDetails", auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setCoachDetails({ ...coachDetails, ...data });
          setOriginalDetails({ ...coachDetails, ...data });
        }
      } catch (error) {
        console.error("Error fetching coach details", error);
        setMessage("Error fetching settings");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, []);

  const validate = () => {
    let tempErrors = { name: "", specialisation: "" };
    if (!coachDetails.name.trim()) tempErrors.name = "Name is required.";
    else if (coachDetails.name.length < 3) tempErrors.name = "Name must be at least 3 characters.";
    if (!coachDetails.specialisation.trim()) tempErrors.specialisation = "Specialisation is required.";
    setErrors(tempErrors);
    return !Object.values(tempErrors).some((error) => error !== "");
  };

  const handleSave = async () => {
    if (!validate()) return;
    if (!auth.currentUser) {
      setMessage("You must be logged in to save settings.");
      return;
    }
    setSaving(true);
    try {
      const docRef = doc(db, "coachDetails", auth.currentUser.uid);
      await setDoc(docRef, coachDetails, { merge: true });
      setMessage("Settings updated successfully!");
      setOriginalDetails(coachDetails);
    } catch (error) {
      console.error("Error updating coach details", error);
      setMessage("Error updating settings");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setCoachDetails(originalDetails);
    setMessage("");
    setErrors({ name: "", specialisation: "" });
  };

  const handleClearChat = async () => {
    if (!auth.currentUser) {
      setMessage("You must be logged in to clear chat history.");
      return;
    }
    if (!window.confirm("Are you sure you want to clear all chat history? This cannot be undone.")) return;

    setClearingChat(true);
    try {
      const messagesRef = collection(db, `chats/${auth.currentUser.uid}/messages`);
      const q = query(messagesRef);
      const snapshot = await getDocs(q);
      const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      setMessage("Chat history cleared successfully!");
    } catch (error) {
      console.error("Error clearing chat history", error);
      setMessage("Error clearing chat history");
    } finally {
      setClearingChat(false);
    }
  };

  const isModified = () => {
    return JSON.stringify(coachDetails) !== JSON.stringify(originalDetails);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-900">
        <div className="text-white inline-flex items-center">
          <div className="w-5 h-5 mr-3 border-t-2 border-white rounded-full animate-spin"></div>
          Loading settings...
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 text-white bg-slate-900 min-h-screen">
      <h1 className="text-4xl font-bold mb-8">Coach Settings</h1>

      {message && (
        <div
          className={`p-3 mb-6 rounded-lg text-sm ${
            message.includes("successfully") ? "bg-green-700" : "bg-red-700"
          }`}
        >
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Coach Name */}
        <div className="mb-6">
          <label className="block mb-2 font-medium inline-flex items-center">
            <User size={20} className="mr-2" /> Coach Name
          </label>
          <input
            type="text"
            value={coachDetails.name}
            onChange={(e) => setCoachDetails({ ...coachDetails, name: e.target.value })}
            placeholder="Your name"
            className="w-full p-3 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
        </div>

        {/* Specialisation */}
        <div className="mb-6">
          <label className="block mb-2 font-medium inline-flex items-center">
            <Briefcase size={20} className="mr-2" /> Specialisation
          </label>
          <input
            type="text"
            value={coachDetails.specialisation}
            onChange={(e) => setCoachDetails({ ...coachDetails, specialisation: e.target.value })}
            placeholder="Your coaching specialisation"
            className="w-full p-3 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.specialisation && (
            <p className="text-red-400 text-sm mt-1">{errors.specialisation}</p>
          )}
        </div>

        {/* Coach Tone */}
        <div className="mb-6">
          <label className="block mb-2 font-medium inline-flex items-center">
            <Mic size={20} className="mr-2" /> Coach Tone
          </label>
          <select
            value={coachDetails.tone}
            onChange={(e) => setCoachDetails({ ...coachDetails, tone: e.target.value })}
            className="w-full p-3 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="friendly">Friendly</option>
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="motivational">Motivational</option>
          </select>
        </div>

        {/* Availability Status */}
        <div className="mb-6">
          <label className="block mb-2 font-medium inline-flex items-center">
            <Clock size={20} className="mr-2" /> Availability
          </label>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={coachDetails.isAvailable}
              onChange={(e) => setCoachDetails({ ...coachDetails, isAvailable: e.target.checked })}
              className="w-5 h-5 text-blue-600 bg-slate-800 border-slate-700 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-sm">
              {coachDetails.isAvailable ? "Available" : "Unavailable"}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 mt-8">
        <button
          onClick={handleSave}
          disabled={saving || !isModified()}
          className={`w-full sm:w-auto bg-blue-600 p-3 rounded-lg hover:bg-blue-700 inline-flex items-center justify-center transition-colors ${
            saving || !isModified() ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {saving ? (
            <>
              <div className="w-5 h-5 mr-2 border-t-2 border-white rounded-full animate-spin"></div>
              Saving...
            </>
          ) : (
            <>
              <Check size={20} className="mr-2" /> Save Changes
            </>
          )}
        </button>
        <button
          onClick={handleCancel}
          disabled={!isModified()}
          className={`w-full sm:w-auto bg-red-600 p-3 rounded-lg hover:bg-red-700 inline-flex items-center justify-center transition-colors ${
            !isModified() ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <X size={20} className="mr-2" /> Cancel Changes
        </button>
        <button
          onClick={handleClearChat}
          disabled={clearingChat}
          className={`w-full sm:w-auto bg-orange-600 p-3 rounded-lg hover:bg-orange-700 inline-flex items-center justify-center transition-colors ${
            clearingChat ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {clearingChat ? (
            <>
              <div className="w-5 h-5 mr-2 border-t-2 border-white rounded-full animate-spin"></div>
              Clearing...
            </>
          ) : (
            <>
              <Trash2 size={20} className="mr-2" /> Clear Chat History
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Settings;