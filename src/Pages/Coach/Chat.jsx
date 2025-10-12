import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { auth, db, functions } from "../../firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  serverTimestamp,
  limit,
  getDocs,
  startAfter,
  onSnapshot,
} from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { ModelNameContext } from "../../context/ModelName";
import { Paperclip, Send, Loader, Zap } from "react-feather";

const Chat = () => {
  const user = auth.currentUser;
  const chatId = user ? user.uid : null;
  const { modelName } = useContext(ModelNameContext);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [lastDocSnap, setLastDocSnap] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const endRef = useRef(null);

  // Live feed (most recent 20)
  useEffect(() => {
    if (!chatId) return;
    const base = collection(db, `chats/${chatId}/messages`);
    const q = query(base, orderBy("timestamp", "desc"), limit(20));
    const unsub = onSnapshot(q, (snap) => {
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setMessages(items.reverse());
      setLastDocSnap(snap.docs[snap.docs.length - 1] || null);
      setHasMore(snap.size === 20);
    });
    return () => unsub();
  }, [chatId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const fetchMore = async () => {
    if (!chatId || !lastDocSnap || isFetchingMore || !hasMore) return;
    setIsFetchingMore(true);
    const base = collection(db, `chats/${chatId}/messages`);
    const qMore = query(
      base,
      orderBy("timestamp", "desc"),
      startAfter(lastDocSnap),
      limit(20)
    );
    const snap = await getDocs(qMore);
    const older = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    setMessages((prev) => [...older.reverse(), ...prev]);
    setLastDocSnap(snap.docs[snap.docs.length - 1] || null);
    setHasMore(snap.size === 20);
    setIsFetchingMore(false);
  };

  const send = async (text) => {
    if (!text?.trim() || !chatId) return;
    setIsLoading(true);
    const base = collection(db, `chats/${chatId}/messages`);
    try {
      // user message
      await addDoc(base, {
        text,
        sender: "user",
        timestamp: serverTimestamp(),
      });

      // AI reply via Cloud Function (fallback if not deployed)
      let reply = "";
      try {
        const fn = httpsCallable(functions, "generateAIResponse");
        const { data } = await fn({ userMessage: text });
        reply = data?.response || "";
      } catch {
        reply =
          "Thanks — I’m here and listening. What’s the outcome you want from this?";
      }

      await addDoc(base, {
        text: reply,
        sender: "coach",
        timestamp: serverTimestamp(),
      });
    } catch (e) {
      console.error(e);
      await addDoc(base, {
        text: "Hmm, that didn’t go through — try again?",
        sender: "coach",
        timestamp: serverTimestamp(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = useMemo(
    () => [
      "Help me prioritise today",
      "I’m stuck on a decision",
      "Give me a 3-step plan",
      "Coach me for a tough chat",
    ],
    []
  );

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const t = newMessage;
      setNewMessage("");
      send(t);
    }
  };

  if (!user) {
    return (
      <div className="min-h-[60vh] grid place-items-center text-slate-300">
        Please sign in to start chatting.
      </div>
    );
  }

  return (
    <div className="grid h-[calc(100vh-8rem)] grid-rows-[auto_1fr_auto] rounded-2xl border border-slate-800 bg-slate-900">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
        <div className="flex items-center gap-2">
          <Zap className="text-indigo-400" size={18} />
          <p className="text-sm font-semibold">
            {modelName || "Your AI Coach"}
          </p>
        </div>
        <div className="hidden text-xs text-slate-400 md:block">
          Enter to send • Shift+Enter for newline
        </div>
      </header>

      {/* Messages */}
      <div
        onScroll={(e) => {
          if (e.currentTarget.scrollTop === 0) fetchMore();
        }}
        className="flex flex-col overflow-y-auto p-4 gap-3"
      >
        {isFetchingMore && (
          <div className="mx-auto my-2 text-xs text-slate-400">
            Loading earlier messages…
          </div>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${
              m.sender === "coach" ? "justify-start" : "justify-end"
            }`}
          >
            <div
              className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm shadow ${
                m.sender === "coach"
                  ? "bg-slate-800 text-slate-100"
                  : "bg-indigo-600 text-white"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* Composer */}
      <footer className="space-y-2 border-t border-slate-800 p-3">
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((q) => (
            <button
              key={q}
              onClick={() => send(q)}
              className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300 hover:bg-slate-800"
            >
              {q}
            </button>
          ))}
        </div>
        <div className="flex items-end gap-2">
          <button
            className="grid h-10 w-10 place-items-center rounded-xl border border-slate-700 text-slate-400 hover:bg-slate-800"
            title="Attach (coming soon)"
          >
            <Paperclip size={16} />
          </button>
          <div className="flex-1">
            <div className="flex items-end gap-2">
              <textarea
                rows={1}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Type a message…"
                className="min-h-[40px] max-h-32 w-full resize-y rounded-xl border border-slate-700 bg-slate-900 p-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
              <button
                onClick={() => {
                  const t = newMessage;
                  setNewMessage("");
                  send(t);
                }}
                disabled={isLoading || !newMessage.trim()}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-3 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <Loader size={16} className="animate-spin" /> Sending
                  </>
                ) : (
                  <>
                    <Send size={16} /> Send
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Chat;
