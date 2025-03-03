// src/pages/Coach/Blog/BlogCreate.jsx
import React, { useState, useEffect } from "react";
import { auth, db } from "../../../firebase";
import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

const BlogCreate = () => {
  const [user] = useAuthState(auth);
  const [role, setRole] = useState("user");
  const [newBlogTitle, setNewBlogTitle] = useState("");
  const [newBlogContent, setNewBlogContent] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Fetch user role from Firestore
  useEffect(() => {
    if (user) {
      const fetchRole = async () => {
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
      };
      fetchRole();
    }
  }, [user]);

  // Define allowed roles for posting blogs
  const allowedRoles = ["admin", "coach", "super user", "platinum user"];
  const canPost = allowedRoles.includes(role);

  const handlePostBlog = async (e) => {
    e.preventDefault();
    if (!newBlogTitle || !newBlogContent) {
      setError("Please fill in both title and content");
      return;
    }
    try {
      await addDoc(collection(db, "blogs"), {
        title: newBlogTitle,
        content: newBlogContent,
        author: user.email,
        timestamp: new Date(),
      });
      setMessage("Blog posted successfully!");
      setNewBlogTitle("");
      setNewBlogContent("");
    } catch (err) {
      console.error("Error posting blog:", err);
      setError("Failed to post blog.");
    }
  };

  if (!canPost) {
    return (
      <div className="p-4 text-white">
        <p className="text-gray-400">You are not authorised to post blogs.</p>
      </div>
    );
  }

  return (
    <div className="p-4 text-white">
      <h1 className="text-3xl font-bold mb-4">Create a New Blog</h1>
      {error && <p className="text-red-500">{error}</p>}
      {message && <p className="text-green-500">{message}</p>}
      <form onSubmit={handlePostBlog} className="max-w-md">
        <input
          type="text"
          value={newBlogTitle}
          onChange={(e) => setNewBlogTitle(e.target.value)}
          placeholder="Blog Title"
          className="w-full p-2 mb-2 rounded bg-slate-700 text-white"
          required
        />
        <textarea
          value={newBlogContent}
          onChange={(e) => setNewBlogContent(e.target.value)}
          placeholder="Write your blog here..."
          className="w-full p-2 mb-2 rounded bg-slate-700 text-white"
          required
        />
        <button type="submit" className="bg-blue-600 p-2 rounded hover:bg-blue-700">
          Post Blog
        </button>
      </form>
    </div>
  );
};

export default BlogCreate;
