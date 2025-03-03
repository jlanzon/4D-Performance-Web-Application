// src/pages/Coach/Blog/BlogLayout.jsx
import React, { useState, useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import { auth, db } from "../../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc } from "firebase/firestore";

const BlogLayout = () => {
  const [user] = useAuthState(auth);
  const [role, setRole] = useState("user");

  useEffect(() => {
    const fetchRole = async () => {
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setRole(data.role || "user");
          }
        } catch (err) {
          console.error("Error fetching user role:", err);
        }
      }
    };
    fetchRole();
  }, [user]);
  console.log("User role:", role);

  // Only allow blog creation if the user's role is one of these
  const allowedForCreate = ["moderator", "super user", "platinum user", "Admin", "admin"];
  const canCreate = allowedForCreate.includes(role.toLowerCase());

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4">
      <nav className="bg-slate-800 p-4 flex gap-6">
        <Link to="list" className="hover:underline">
          Blog List
        </Link>
        {canCreate && (
          <Link to="create" className="hover:underline">
            Create Blog
          </Link>
        )}
      </nav>
      <div className="mt-4">
        <Outlet />
      </div>
    </div>
  );
};

export default BlogLayout;
