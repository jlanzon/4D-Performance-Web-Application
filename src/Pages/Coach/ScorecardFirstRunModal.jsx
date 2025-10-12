import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { FiX } from "react-icons/fi";
import { scorecardData } from "../ScoreCard/scorecardData";
import { saveFullScorecard } from "../../lib/scorecard";

/**
 * Shows the FULL 4D Scorecard (all questions) the first time a user enters Coach,
 * if they don't already have a scorecard in Firestore.
 *
 * Saves to scorecards/{uid} with category averages + raw answers.
 */
export default function ScorecardFirstRunModal() {
  const user = auth.currentUser;
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Build initial answers/skip maps from scorecardData
  const { initialAnswers, initialSkipped, allKeys } = useMemo(() => {
    const answers = {};
    const skipped = {};
    Object.entries(scorecardData).forEach(([category, data]) => {
      data.questions.forEach((_, idx) => {
        const key = `${category}${idx + 1}`;
        answers[key] = 5; // sensible mid default
        skipped[key] = false; // default not skipped
      });
    });
    return {
      initialAnswers: answers,
      initialSkipped: skipped,
      allKeys: Object.keys(answers),
    };
  }, []);

  const [answers, setAnswers] = useState(initialAnswers);
  const [skipped, setSkipped] = useState(initialSkipped);

  // Check if a scorecard exists; if not, open modal
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

  // Progress for header
  const progress = useMemo(() => {
    const total = allKeys.length;
    const completed = allKeys.filter(
      (k) => skipped[k] || answers[k] !== null
    ).length;
    return Math.round((completed / total) * 100);
  }, [allKeys, answers, skipped]);

  const handleChange = (key) => (e) => {
    setAnswers((prev) => ({ ...prev, [key]: Number(e.target.value) }));
  };

  const toggleSkip = (key) => {
    setSkipped((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const computeCategoryAverage = (category) => {
    const qs = scorecardData[category].questions;
    const vals = qs
      .map((_, idx) => {
        const k = `${category}${idx + 1}`;
        return skipped[k] ? null : Number(answers[k]);
      })
      .filter((v) => v !== null && !Number.isNaN(v));
    if (vals.length === 0) return 0;
    return Number((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1));
  };

  const onSubmit = async () => {
    if (!user) return;
    setSaving(true);
    setError("");

    // Build nested answers/skipped by category for storage
    const answersByCategory = {};
    const skippedByCategory = {};
    Object.keys(scorecardData).forEach((category) => {
      answersByCategory[category] = {};
      skippedByCategory[category] = {};
      scorecardData[category].questions.forEach((_, idx) => {
        const k = `${category}${idx + 1}`;
        answersByCategory[category][k] = Number(answers[k]);
        skippedByCategory[category][k] = !!skipped[k];
      });
    });

    const cognitive = computeCategoryAverage("cognitive");
    const physical = computeCategoryAverage("physical");
    const emotional = computeCategoryAverage("emotional");
    const spiritual = computeCategoryAverage("spiritual");
    const overall = Number(
      ((cognitive + physical + emotional + spiritual) / 4).toFixed(1)
    );

    try {
      await saveFullScorecard(db, user.uid, {
        cognitive,
        physical,
        emotional,
        spiritual,
        overall,
        answers: answersByCategory,
        skipped: skippedByCategory,
        version: "v1",
      });
      setOpen(false);
    } catch (e) {
      console.error(e);
      setError("Sorry, we couldn't save your scorecard. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[1000] flex items-start md:items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ y: 20, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-4xl rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
              <div>
                <h2 className="text-lg md:text-xl font-semibold text-slate-900 dark:text-slate-100">
                  4D Leadership Intelligence – First-time Setup
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Answer each statement from 0–10. You can skip any that don’t
                  apply.
                </p>
              </div>
              <button
                className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                onClick={() => setOpen(false)}
                aria-label="Close"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Progress */}
            <div className="px-6 pt-4">
              <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-2 bg-indigo-600 dark:bg-indigo-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="mt-2 text-xs text-slate-600 dark:text-slate-300">
                {progress}% complete
              </div>
            </div>

            {/* Form body */}
            <div className="px-6 pb-6 pt-2 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(scorecardData).map(([category, data]) => (
                  <section
                    key={category}
                    className="rounded-xl p-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700"
                  >
                    <h3 className="text-base font-semibold mb-3 capitalize text-slate-900 dark:text-slate-100">
                      {category} Intelligence
                    </h3>
                    <div className="space-y-5">
                      {data.questions.map((q, idx) => {
                        const key = `${category}${idx + 1}`;
                        const isSkipped = skipped[key];
                        return (
                          <div key={key}>
                            <div className="mb-1 text-sm text-slate-800 dark:text-slate-200">
                              {q}
                            </div>
                            <div className="flex items-center gap-3">
                              {isSkipped ? (
                                <div className="flex-1 italic text-slate-500 dark:text-slate-400">
                                  Skipped
                                </div>
                              ) : (
                                <>
                                  <input
                                    type="range"
                                    min="0"
                                    max="10"
                                    step="1"
                                    value={answers[key]}
                                    onChange={handleChange(key)}
                                    className="flex-1 h-2 rounded-lg appearance-none bg-slate-200 dark:bg-slate-700 cursor-pointer"
                                  />
                                  <span className="w-10 text-right text-sm font-medium text-slate-800 dark:text-slate-200">
                                    {answers[key]}
                                  </span>
                                </>
                              )}
                              <button
                                type="button"
                                onClick={() => toggleSkip(key)}
                                className={`px-2 py-1 rounded text-xs font-semibold border ${
                                  isSkipped
                                    ? "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700"
                                    : "bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-600"
                                }`}
                              >
                                {isSkipped ? "Unskip" : "Skip"}
                              </button>
                            </div>
                            <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                              <span>Strongly Disagree</span>
                              <span>Strongly Agree</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                ))}
              </div>

              {error && (
                <div className="mt-5 rounded-md bg-red-600/10 text-red-700 dark:text-red-300 border border-red-600/30 px-3 py-2 text-sm">
                  {error}
                </div>
              )}

              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  className="rounded-md px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                  onClick={() => setOpen(false)}
                  disabled={saving}
                >
                  Do it later
                </button>
                <button
                  onClick={onSubmit}
                  disabled={saving}
                  className="rounded-md bg-indigo-600 text-white px-4 py-2 text-sm font-semibold hover:bg-indigo-700 disabled:opacity-60"
                >
                  {saving ? "Saving…" : "Save my scorecard"}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
