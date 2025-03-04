import React, { useState, useEffect } from "react";
import { auth, db } from "../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Check, X, User, Briefcase } from "react-feather";

const Settings = () => {
  const [coachDetails, setCoachDetails] = useState({
    name: "",
    specialisation: "",
  });
  const [originalDetails, setOriginalDetails] = useState({
    name: "",
    specialisation: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
          setCoachDetails(data);
          setOriginalDetails(data);
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
    let tempErrors = {
      name: "",
      specialisation: "",
    };
    if (!coachDetails.name.trim()) {
      tempErrors.name = "Name is required.";
    } else if (coachDetails.name.length < 3) {
      tempErrors.name = "Name must be at least 3 characters.";
    }
    if (!coachDetails.specialisation.trim()) {
      tempErrors.specialisation = "specialisation is required.";
    }
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

  const isModified = () => {
    return JSON.stringify(coachDetails) !== JSON.stringify(originalDetails);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-900">
        <div className="text-white inline-flex items-center">
          <div className="w-4 h-4 mr-2 border-t-2 border-white rounded-full animate-spin"></div>
          Loading settings...
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 text-white bg-slate-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Coach Settings</h1>
      {message && (
        <div
          className={`p-2 mb-4 rounded ${
            message.includes("successfully") ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {message}
        </div>
      )}
      <div className="mb-4">
        <label className="block mb-2 inline-flex items-center">
          <User size={18} className="mr-2" /> Coach Name
        </label>
        <input
          type="text"
          value={coachDetails.name}
          onChange={(e) =>
            setCoachDetails({ ...coachDetails, name: e.target.value })
          }
          placeholder="Your name"
          className="w-full p-2 rounded bg-slate-700 text-white"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name}</p>
        )}
      </div>
      <div className="mb-4">
        <label className="block mb-2 inline-flex items-center">
          <Briefcase size={18} className="mr-2" /> specialisation
        </label>
        <input
          type="text"
          value={coachDetails.specialisation}
          onChange={(e) =>
            setCoachDetails({ ...coachDetails, specialisation: e.target.value })
          }
          placeholder="Your coaching specialisation"
          className="w-full p-2 rounded bg-slate-700 text-white"
        />
        {errors.specialisation && (
          <p className="text-red-500 text-sm mt-1">{errors.specialisation}</p>
        )}
      </div>
      <div className="flex space-x-4">
        <button
          onClick={handleSave}
          disabled={saving || !isModified()}
          className="bg-blue-600 p-2 rounded hover:bg-blue-700 inline-flex items-center"
        >
          {saving ? (
            <>
              <div className="w-4 h-4 mr-2 border-t-2 border-white rounded-full animate-spin"></div>
              Saving...
            </>
          ) : (
            <>
              <Check size={18} className="mr-2" /> Save Changes
            </>
          )}
        </button>
        <button
          onClick={handleCancel}
          disabled={!isModified()}
          className="bg-red-600 p-2 rounded hover:bg-red-700 inline-flex items-center"
        >
          <X size={18} className="mr-2" /> Cancel Changes
        </button>
      </div>
    </div>
  );
};

export default Settings;