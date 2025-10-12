// src/lib/scorecard.js
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase"; // used by addDocOrSetLatestScorecard()

/**
 * Save / update a user's FULL 4D Scorecard into scorecards/{uid}.
 * Expects payload:
 *  {
 *    cognitive, physical, emotional, spiritual, overall,
 *    answers: { cognitive:{cognitive1:n,...}, physical:{...}, emotional:{...}, spiritual:{...} },
 *    skipped: { cognitive:{...}, physical:{...}, emotional:{...}, spiritual:{...} },
 *    version: 'v1'
 *  }
 *
 * Called like: saveFullScorecard(db, uid, payload)
 */
export async function saveFullScorecard(dbArg, uid, payload) {
  const toNumber = (v) => (v == null ? 0 : Number(v));
  await setDoc(
    doc(dbArg, "scorecards", uid),
    {
      cognitive: toNumber(payload.cognitive),
      physical: toNumber(payload.physical),
      emotional: toNumber(payload.emotional),
      spiritual: toNumber(payload.spiritual),
      overall: toNumber(payload.overall),
      answers: payload.answers || {},
      skipped: payload.skipped || {},
      version: payload.version || "v1",
      completed: true,
      updatedAt: serverTimestamp(),
      firstCompletedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

/**
 * Minimal “latest snapshot” writer used by quick baseline & daily check-ins.
 * Called like: upsertLatestScorecard(db, uid, scores)
 */
export async function upsertLatestScorecard(dbArg, uid, scores) {
  const toNumber = (v) => (v == null ? 0 : Number(v));
  const cognitive = toNumber(scores.cognitive);
  const physical = toNumber(scores.physical);
  const emotional = toNumber(scores.emotional);
  const spiritual = toNumber(scores.spiritual);
  const overall = Number(
    ((cognitive + physical + emotional + spiritual) / 4).toFixed(1)
  );

  await setDoc(
    doc(dbArg, "scorecards", uid),
    {
      cognitive,
      physical,
      emotional,
      spiritual,
      overall,
      completed: true,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

/**
 * Convenience alias used by DailyCheckIn.jsx:
 * Called like: addDocOrSetLatestScorecard(user.uid, scores)
 * (uses the app-level db import)
 */
export async function addDocOrSetLatestScorecard(uid, scores) {
  return upsertLatestScorecard(db, uid, scores);
}
