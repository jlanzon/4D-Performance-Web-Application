import React, { useEffect, useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import {
  Home,
  MessageCircle,
  CheckCircle,
  BookOpen,
  Settings,
  LogOut,
} from "react-feather";
import { HomeIcon } from "lucide-react";

const CoachLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [role, setRole] = useState("user");
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;
    (async () => {
      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) {
        const data = snap.data();
        setRole((data.role || "user").toLowerCase());
        const { firstName, lastName } = data;
        setDisplayName([firstName, lastName].filter(Boolean).join(" "));
      }
    })();
  }, []);

  const tabs = [
    { to: "/coach", label: "Dashboard", icon: <Home size={16} /> },
    { to: "/coach/chat", label: "Chat", icon: <MessageCircle size={16} /> },
    {
      to: "/coach/daily-checkin",
      label: "Daily Check-in",
      icon: <CheckCircle size={16} />,
    },
    { to: "/coach/blog/list", label: "Blog", icon: <BookOpen size={16} /> },
    { to: "/coach/settings", label: "Settings", icon: <Settings size={16} /> },
  ];

  const isActive = (to) =>
    location.pathname === to ||
    (to !== "/coach" && location.pathname.startsWith(to));

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-900/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <img src="/logo.png" alt="4D" className="h-8 w-8 rounded" />
            <div>
              <p className="text-sm text-slate-300">Welcome back</p>
              <p className="font-semibold">
                {displayName || auth.currentUser?.email}
              </p>
              <p className="text-xs text-slate-400">Role: {role}</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/")}
            className="inline-flex ml-auto mr-2 items-center gap-2 rounded-lg border border-slate-700 px-3 py-1.5 text-sm hover:bg-slate-800"
          >
            <HomeIcon size={14} />
            Home
          </button>
          <button
            onClick={() => signOut(auth)}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-1.5 text-sm hover:bg-slate-800"
          >
            <LogOut size={14} />
            Sign out
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 py-6 lg:grid-cols-[220px_1fr]">
        {/* Left nav */}
        <nav className="sticky top-16 h-max space-y-1">
          {tabs.map((t) => (
            <Link
              key={t.to}
              to={t.to}
              className={`group flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition ${
                isActive(t.to)
                  ? "bg-indigo-600 text-white"
                  : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              {t.icon}
              {t.label}
            </Link>
          ))}
        </nav>

        {/* Outlet */}
        <main className="min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CoachLayout;
