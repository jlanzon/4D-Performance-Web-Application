import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import {
  collection,
  doc,
  getDoc,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import {
  Clipboard,
  Settings as SettingsIcon,
  TrendingUp,
  Sun,
  Moon,
  ArrowRight,
  MessageCircle,
  Activity,
} from "react-feather";

// Chart
import { Radar } from "react-chartjs-2";
import {
  Chart,
  LineController,
  PointElement,
  LineElement,
  Filler,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import ScorecardFirstRunModal from "./ScorecardFirstRunModal";
Chart.register(
  LineController,
  PointElement,
  LineElement,
  Filler,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  Tooltip,
  Legend
);

/**
 * Firestore expected structure (you can adjust to your liking):
 *
 * Scorecard (latest snapshot of user's 4D scores)
 *   Collection: scorecards
 *   Document: {uid}
 *   Fields:
 *     cognitive: number (0-10)
 *     physical: number (0-10)
 *     emotional: number (0-10)
 *     spiritual: number (0-10)
 *     updatedAt: Timestamp
 *
 * Daily check-ins (already in your app). We'll extend entries with 4D scores:
 *   Collection: checkins/{uid}/entries
 *   Fields (existing + new):
 *     energy?: number
 *     note?: string
 *     tags?: string[]
 *     createdAt: Timestamp
 *     scores?: {
 *       cognitive: number, physical: number, emotional: number, spiritual: number
 *     }
 */

const CoachDashboard = () => {
  const user = auth.currentUser;
  const navigate = useNavigate();

  // Profile
  const [name, setName] = useState("");
  const [role, setRole] = useState("user");

  // Check-ins
  const [checkins, setCheckins] = useState([]); // last 7
  const [hasTodayCheckin, setHasTodayCheckin] = useState(false);
  const [loadingCheckins, setLoadingCheckins] = useState(true);

  // Chat
  const [chatPreview, setChatPreview] = useState([]); // latest 5
  const [loadingChat, setLoadingChat] = useState(true);

  // Scorecard
  const [scorecard, setScorecard] = useState(null);
  const [loadingScorecard, setLoadingScorecard] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Profile
    (async () => {
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) {
          const data = snap.data();
          const display = [data.firstName, data.lastName]
            .filter(Boolean)
            .join(" ");
          setName(display || "");
          setRole((data.role || "user").toLowerCase());
        }
      } catch {
        // noop
      }
    })();

    // Scorecard subscription (simple single-doc read)
    const scRef = doc(db, "scorecards", user.uid);
    const unsubScorecard = onSnapshot(
      scRef,
      (snap) => {
        setScorecard(snap.exists() ? snap.data() : null);
        setLoadingScorecard(false);
      },
      () => setLoadingScorecard(false)
    );

    // Check-ins: subscribe to last 20 by createdAt desc (we'll slice to 7)
    const cRef = collection(db, `checkins/${user.uid}/entries`);
    const cQuery = query(cRef, orderBy("createdAt", "desc"), limit(20));
    const unsubCheckins = onSnapshot(
      cQuery,
      (snap) => {
        const items = snap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .filter((d) => !!d.createdAt)
          .sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());

        // has-today
        const today = startOfLocalDay(new Date());
        const todayEnd = endOfLocalDay(new Date());
        const todayDone = items.some((ci) => {
          const t = toLocalDate(ci.createdAt);
          return t >= today && t <= todayEnd;
        });

        setHasTodayCheckin(todayDone);
        setCheckins(items.slice(0, 7));
        setLoadingCheckins(false);
      },
      () => setLoadingCheckins(false)
    );

    // Chat: last 5 messages
    const mRef = collection(db, `chats/${user.uid}/messages`);
    const mQuery = query(mRef, orderBy("timestamp", "desc"), limit(5));
    const unsubChat = onSnapshot(
      mQuery,
      (snap) => {
        const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setChatPreview(items.reverse());
        setLoadingChat(false);
      },
      () => setLoadingChat(false)
    );

    return () => {
      unsubScorecard?.();
      unsubCheckins?.();
      unsubChat?.();
    };
  }, [user]);

  const greeting = useMemo(() => {
    const hours = new Date().getHours();
    if (hours < 12) return "Good morning";
    if (hours < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  const displayName = name || user?.email || "Leader";

  // Sparkline data for energy (0–1)
  const sparkValues = useMemo(() => {
    const reversed = [...checkins].reverse();
    return reversed.map((c) => clamp01(Number(c.energy ?? 0) / 10));
  }, [checkins]);

  // Radar data when scorecard exists
  const radarData = useMemo(() => {
    if (!scorecard) return null;
    const labels = ["Cognitive", "Physical", "Emotional", "Spiritual"];
    const values = [
      num(scorecard.cognitive),
      num(scorecard.physical),
      num(scorecard.emotional),
      num(scorecard.spiritual),
    ];
    return {
      labels,
      datasets: [
        {
          label: "Your 4D Score",
          data: values,
          backgroundColor: "rgba(99, 102, 241, 0.2)", // indigo-500/20
          borderColor: "#6366f1",
          borderWidth: 2,
          pointBackgroundColor: "#6366f1",
        },
      ],
    };
  }, [scorecard]);

  const radarOptions = useMemo(
    () => ({
      responsive: true,
      plugins: {
        legend: { position: "top", labels: { color: "#e5e7eb" } },
        tooltip: { enabled: true },
      },
      scales: {
        r: {
          min: 0,
          max: 10,
          ticks: { stepSize: 2, color: "#e5e7eb" },
          grid: { color: "rgba(148,163,184,0.3)" },
          pointLabels: { font: { size: 12 }, color: "#e5e7eb" },
        },
      },
    }),
    []
  );

  // Previous vs latest check-in 4D comparison (for dashboard nudge)
  const latestCI = checkins[0]?.scores;
  const prevCI = checkins[1]?.scores;
  const diff = diffScores(latestCI, prevCI);

  return (
    <div className="min-h-screen bg-slate-900 px-6 py-8 text-white">
      <ScorecardFirstRunModal />
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <section className="flex flex-col gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold">
            {greeting}, {displayName}
          </h1>
          <p className="text-slate-300 text-sm">
            Your role: <span className="uppercase tracking-wide">{role}</span>
          </p>
        </section>

        {/* Today strip */}
        <section className="grid gap-4 md:grid-cols-3">
          <Card className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge tone={hasTodayCheckin ? "success" : "warn"}>
                {hasTodayCheckin ? <Sun size={14} /> : <Moon size={14} />}
                {hasTodayCheckin ? " Check-in done" : " No check-in yet"}
              </Badge>
              <p className="text-sm text-slate-300">
                {hasTodayCheckin
                  ? "Nice work keeping your streak."
                  : "Log your state to keep your streak alive."}
              </p>
            </div>
            {!hasTodayCheckin && (
              <Link
                to="/coach/daily-checkin"
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium hover:bg-indigo-700"
              >
                Do it now <ArrowRight size={16} />
              </Link>
            )}
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <TrendingUp size={16} /> Energy — 7 days
              </h3>
              {loadingCheckins && <Dots />}
            </div>
            <Sparkline values={sparkValues} />
            <div className="mt-2 flex justify-between text-xs text-slate-400">
              <span>Low</span>
              <span>High</span>
            </div>
          </Card>

          <Card className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge>
                <Clipboard size={14} /> Goals
              </Badge>
              <p className="text-sm text-slate-300">
                Keep it tight: 3 priorities max.
              </p>
            </div>
            <Link
              to="/coach/settings"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm hover:bg-slate-800"
            >
              Edit <SettingsIcon size={16} />
            </Link>
          </Card>
        </section>

        {/* Scorecard card */}
        <section className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-200">
                  4D Leadership Intelligence Scorecard
                </h3>
                {loadingScorecard && <Dots />}
              </div>

              {!scorecard && !loadingScorecard ? (
                <EmptyState
                  title="No scorecard on file"
                  description="Complete the 4D Leadership Intelligence Scorecard to get a personalised radar view of your strengths."
                  cta={{ to: "/scorecard", label: "Take Scorecard" }}
                />
              ) : scorecard ? (
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                    <Radar
                      data={radarData}
                      options={radarOptions}
                      height={240}
                    />
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                    <h4 className="font-semibold mb-2 text-slate-200">
                      Your latest scores
                    </h4>
                    <ul className="space-y-2 text-sm">
                      {row("Cognitive", scorecard.cognitive)}
                      {row("Physical", scorecard.physical)}
                      {row("Emotional", scorecard.emotional)}
                      {row("Spiritual", scorecard.spiritual)}
                    </ul>

                    {diff && (
                      <>
                        <h4 className="font-semibold mt-4 mb-2 text-slate-200">
                          vs. previous check-in
                        </h4>
                        <ul className="space-y-1 text-xs text-slate-300">
                          {diffRow("Cognitive", diff.cognitive)}
                          {diffRow("Physical", diff.physical)}
                          {diffRow("Emotional", diff.emotional)}
                          {diffRow("Spiritual", diff.spiritual)}
                        </ul>
                      </>
                    )}

                    <div className="mt-4">
                      <Link
                        to="/coach/daily-checkin"
                        className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium hover:bg-indigo-700"
                      >
                        Update daily check-in <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              ) : null}
            </Card>

            {/* Quick actions + recent chat */}
            <Card>
              <h3 className="mb-4 text-sm font-semibold text-slate-200">
                Quick actions
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Action
                  to="/coach/chat"
                  icon={<MessageCircle size={16} />}
                  label="Open Chat"
                />
                <Action
                  to="/coach/daily-checkin"
                  icon={<Activity size={16} />}
                  label="Daily Check-in"
                />
                <Action
                  to="/coach/blog/list"
                  icon={<TrendingUp size={16} />}
                  label="Coach Blog"
                />
                <Action
                  to="/coach/settings"
                  icon={<SettingsIcon size={16} />}
                  label="Settings"
                />
              </div>
            </Card>

            <RecentChat chatPreview={chatPreview} loadingChat={loadingChat} />
          </div>

          {/* Right column: recent check-ins & nudge */}
          <div className="space-y-6">
            <RecentCheckins checkins={checkins} loading={loadingCheckins} />

            <Card>
              <h3 className="mb-3 text-sm font-semibold text-slate-200">
                Nudge
              </h3>
              <p className="text-sm text-slate-300">
                Pick one outcome for today. Tell the coach and get a 3-step
                plan.
              </p>
              <div className="mt-4">
                <Link
                  to="/coach/chat"
                  className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium hover:bg-indigo-700"
                >
                  Tell the coach <ArrowRight size={16} />
                </Link>
              </div>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
};

/* ----------------------------- subcomponents ----------------------------- */

function RecentChat({ chatPreview, loadingChat }) {
  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-200">Recent chat</h3>
        {loadingChat && <Dots />}
      </div>
      {chatPreview.length === 0 && !loadingChat ? (
        <EmptyState
          title="No messages yet"
          description="Start a conversation with your AI coach."
          cta={{ to: "/coach/chat", label: "Open Chat" }}
        />
      ) : (
        <ul className="space-y-3">
          {chatPreview.map((m) => (
            <li key={m.id} className="flex items-start gap-2">
              <div
                className={`mt-0.5 h-2 w-2 rounded-full ${
                  m.sender === "coach" ? "bg-indigo-400" : "bg-emerald-400"
                }`}
              />
              <div className="flex-1">
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  {m.sender === "coach" ? "Coach" : "You"}
                </p>
                <p className="text-sm text-slate-200 whitespace-pre-wrap">
                  {truncate(m.text, 220)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
      {chatPreview.length > 0 && (
        <div className="mt-4">
          <Link
            to="/coach/chat"
            className="inline-flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300"
          >
            Go to Chat <ArrowRight size={14} />
          </Link>
        </div>
      )}
    </Card>
  );
}

function RecentCheckins({ checkins, loading }) {
  return (
    <Card>
      <h3 className="mb-4 text-sm font-semibold text-slate-200">
        Recent check-ins
      </h3>
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Dots />
        </div>
      ) : checkins.length === 0 ? (
        <EmptyState
          title="No check-ins yet"
          description="Log your first check-in to see trends here."
          cta={{ to: "/coach/daily-checkin", label: "Daily Check-in" }}
        />
      ) : (
        <ul className="space-y-3">
          {checkins.map((ci) => (
            <li
              key={ci.id}
              className="rounded-lg border border-slate-800 bg-slate-900/60 p-3"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-200">
                  {formatDay(toLocalDate(ci.createdAt))}
                </p>
                {typeof ci.energy === "number" && (
                  <Badge
                    tone={
                      ci.energy >= 7
                        ? "success"
                        : ci.energy <= 3
                        ? "warn"
                        : "neutral"
                    }
                  >
                    Energy {ci.energy ?? 0}/10
                  </Badge>
                )}
              </div>
              {ci.scores && (
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-slate-300">
                  {mini(ci.scores.cognitive, "Cognitive")}
                  {mini(ci.scores.physical, "Physical")}
                  {mini(ci.scores.emotional, "Emotional")}
                  {mini(ci.scores.spiritual, "Spiritual")}
                </div>
              )}
              {ci.tags?.length ? (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {ci.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-slate-700 px-2 py-0.5 text-xs text-slate-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              ) : null}
              {ci.note ? (
                <p className="mt-2 text-sm text-slate-300">
                  {truncate(ci.note, 140)}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

function mini(value, label) {
  const v = typeof value === "number" ? value : null;
  return (
    <div className="flex items-center justify-between rounded-md border border-slate-800 bg-slate-900/50 px-2 py-1">
      <span>{label}</span>
      <span className="font-semibold">{v ?? "—"}/10</span>
    </div>
  );
}

function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-2xl border border-slate-800 bg-slate-900/60 p-5 ${className}`}
    >
      {children}
    </div>
  );
}

function Badge({ children, tone = "neutral" }) {
  const tones = {
    neutral: "border-slate-700 text-slate-300",
    success: "border-emerald-600 text-emerald-400",
    warn: "border-amber-600 text-amber-400",
  };
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-0.5 text-xs ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

function Dots() {
  return (
    <span className="inline-flex items-center gap-1 text-slate-400">
      <span className="h-1 w-1 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.2s]" />
      <span className="h-1 w-1 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.1s]" />
      <span className="h-1 w-1 animate-bounce rounded-full bg-slate-400" />
    </span>
  );
}

function Action({ to, icon, label }) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/40 px-3 py-2 text-sm hover:bg-slate-800"
    >
      <span className="text-indigo-400">{icon}</span>
      <span className="text-slate-200">{label}</span>
      <ArrowRight
        size={14}
        className="ml-auto translate-x-0 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100"
      />
    </Link>
  );
}

function EmptyState({ title, description, cta }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/40 p-6 text-center">
      <h4 className="text-slate-200 font-semibold mb-1">{title}</h4>
      <p className="text-slate-400 text-sm mb-3">{description}</p>
      {cta ? (
        <Link
          to={cta.to}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium hover:bg-indigo-700"
        >
          {cta.label} <ArrowRight size={14} />
        </Link>
      ) : null}
    </div>
  );
}

function Sparkline({ values = [] }) {
  const width = 240;
  const height = 54;
  const pad = 6;
  const n = values.length || 1;
  const step = (width - pad * 2) / Math.max(n - 1, 1);

  const points = values.map((v, i) => {
    const x = pad + i * step;
    const y = pad + (1 - v) * (height - pad * 2);
    return `${x},${y}`;
  });

  const baseY = pad + (1 - 0.5) * (height - pad * 2);

  return (
    <svg
      className="mt-2 h-[54px] w-full"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
    >
      <polyline
        points={`${pad},${baseY} ${width - pad},${baseY}`}
        fill="none"
        stroke="rgb(51 65 85)"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke="rgb(129 140 248)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ------------------------------- helpers ------------------------------- */

function row(label, value) {
  return (
    <li className="flex items-center justify-between rounded-md border border-slate-800 bg-slate-900/50 px-3 py-2">
      <span>{label}</span>
      <span className="font-semibold">{num(value)}/10</span>
    </li>
  );
}

function diffRow(label, d) {
  if (d == null) return null;
  const sign = d > 0 ? "+" : "";
  const tone =
    d > 0 ? "text-emerald-400" : d < 0 ? "text-amber-400" : "text-slate-300";
  return (
    <li className="flex items-center justify-between">
      <span>{label}</span>
      <span className={`font-semibold ${tone}`}>
        {sign}
        {d.toFixed(1)}
      </span>
    </li>
  );
}

function diffScores(latest, prev) {
  if (!latest || !prev) return null;
  return {
    cognitive: num(latest.cognitive) - num(prev.cognitive),
    physical: num(latest.physical) - num(prev.physical),
    emotional: num(latest.emotional) - num(prev.emotional),
    spiritual: num(latest.spiritual) - num(prev.spiritual),
  };
}

function num(n, fallback = 0) {
  const v = Number(n);
  return Number.isFinite(v) ? v : fallback;
}
function startOfLocalDay(d) {
  const dt = new Date(d);
  dt.setHours(0, 0, 0, 0);
  return dt;
}
function endOfLocalDay(d) {
  const dt = new Date(d);
  dt.setHours(23, 59, 59, 999);
  return dt;
}
function toLocalDate(ts) {
  if (ts instanceof Timestamp) return ts.toDate();
  if (ts?.seconds) return new Date(ts.seconds * 1000);
  return new Date(ts);
}
function clamp01(n) {
  return Math.max(0, Math.min(1, Number(n) || 0));
}
function formatDay(d) {
  try {
    return d.toLocaleDateString(undefined, {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  } catch {
    return "";
  }
}
function truncate(str = "", n = 140) {
  if (str.length <= n) return str;
  return str.slice(0, n - 1) + "…";
}

export default CoachDashboard;
