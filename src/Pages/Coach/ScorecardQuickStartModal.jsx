import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { FiX } from "react-icons/fi";
import { upsertLatestScorecard } from "../../lib/scorecard";

const initialScores = { cognitive: 5, physical: 5, emotional: 5, spiritual: 5 };

export default function ScorecardQuickStartModal() {
  const user = auth.currentUser;
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [scores, setScores] = useState(initialScores);
  const [error, setError] = useState("");

  // Check if the user already has a scorecard; if not, open the modal
  useEffect(() => {
    let cancelled = false;
    async function check() {
      if (!user) return;
      try {
        const snap = await getDoc(doc(db, "scorecards", user.uid));
        if (!cancelled) setOpen(!snap.exists());
      } catch {
        if (!cancelled) setOpen(true);
      }
    }
    check();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const onChange = (key) => (e) => {
    setScores((s) => ({ ...s, [key]: Number(e.target.value) }));
  };

  const onSave = async () => {
    if (!user) return;
    setSaving(true);
    setError("");
    try {
      await upsertLatestScorecard(db, user.uid, scores);
      setOpen(false);
    } catch (e) {
      setError("Could not save your baseline. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ y: 20, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-xl rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-2xl border border-slate-200 dark:border-slate-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Set your 4D baseline
              </h2>
              <button
                className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                onClick={() => setOpen(false)}
                aria-label="Close"
              >
                <FiX size={20} />
              </button>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
              Quick one-minute baseline so we can personalise your dashboard.
              You can take the full scorecard later for deeper insights.
            </p>

            <div className="space-y-5">
              <SliderRow
                label="Cognitive"
                value={scores.cognitive}
                onChange={onChange("cognitive")}
              />
              <SliderRow
                label="Physical"
                value={scores.physical}
                onChange={onChange("physical")}
              />
              <SliderRow
                label="Emotional"
                value={scores.emotional}
                onChange={onChange("emotional")}
              />
              <SliderRow
                label="Spiritual"
                value={scores.spiritual}
                onChange={onChange("spiritual")}
              />
            </div>

            {error && (
              <div className="mt-4 rounded-md bg-red-600/10 text-red-700 dark:text-red-300 border border-red-600/30 px-3 py-2 text-sm">
                {error}
              </div>
            )}

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                className="rounded-md px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                onClick={() => setOpen(false)}
                disabled={saving}
              >
                Not now
              </button>
              <button
                onClick={onSave}
                disabled={saving}
                className="rounded-md bg-indigo-600 text-white px-4 py-2 text-sm font-semibold hover:bg-indigo-700 disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save baseline"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SliderRow({ label, value, onChange }) {
  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="font-medium text-slate-900 dark:text-slate-100">
          {label}
        </span>
        <span className="text-slate-600 dark:text-slate-300">{value} / 10</span>
      </div>
      <input
        type="range"
        min="0"
        max="10"
        step="1"
        value={value}
        onChange={onChange}
        className="w-full h-2 rounded-lg appearance-none bg-slate-200 dark:bg-slate-700 cursor-pointer"
      />
      <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
        <span>Low</span>
        <span>High</span>
      </div>
    </div>
  );
}
