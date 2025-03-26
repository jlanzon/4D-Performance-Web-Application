import React, { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { auth, db } from "../../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc } from "firebase/firestore";
import { Home, PlusCircle } from "react-feather";

const BlogLayout = () => {
  const [user] = useAuthState(auth);
  const [role, setRole] = useState("user");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRole = async () => {
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            setRole(docSnap.data().role || "user");
          }
        } catch (err) {
          console.error("Error fetching user role:", err);
        }
      }
    };
    fetchRole();
  }, [user]);

  useEffect(() => {
    if (location.pathname === "/blog" || location.pathname === "/blog/") {
      navigate("/blog/list", { replace: true });
    }
  }, [location.pathname, navigate]);

  const allowedForCreate = ["moderator", "super user", "platinum user", "Admin", "admin"];
  const canCreate = allowedForCreate.includes(role.toLowerCase());
  const isActive = (path) => location.pathname.includes(path);

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      <nav className="bg-slate-800 p-6 sticky top-0 z-10 shadow-md">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row gap-6 items-start sm:items-center">
          <Link
            to="list"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isActive("list")
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-slate-700 hover:text-white"
            }`}
          >
            <Home size={20} />
            Blog List
          </Link>
          {canCreate && (
            <Link
              to="create"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isActive("create")
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              <PlusCircle size={20} />
              Create Blog
            </Link>
          )}
          <div className="sm:ml-auto text-sm text-gray-400">
            Logged in as: {user ? `${user.email} (${role})` : "Guest"}
          </div>
        </div>
      </nav>
      <main className="flex-1 max-w-6xl mx-auto w-full p-6">
        <Outlet />
      </main>
      <footer className="bg-slate-800 p-4 text-center text-gray-400 text-sm">
        © {new Date().getFullYear()} Blog Platform. All rights reserved.
      </footer>
    </div>
  );
};

export default BlogLayout;