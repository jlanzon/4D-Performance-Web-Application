import React, { useState, useEffect } from "react";
import { auth, db } from "../../../firebase";
import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { Send, X } from "react-feather";

const BlogCreate = () => {
  const [user] = useAuthState(auth);
  const [role, setRole] = useState("user");
  const [newBlogTitle, setNewBlogTitle] = useState("");
  const [newBlogContent, setNewBlogContent] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const fetchRole = async () => {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            setRole(docSnap.data().role || "user");
          }
        } catch (err) {
          console.error("Error fetching user role:", err);
        }
      };
      fetchRole();
    }
  }, [user]);

  const allowedRoles = ["admin", "coach", "super user", "platinum user"];
  const canPost = allowedRoles.includes(role.toLowerCase());

  const handlePostBlog = async (e) => {
    e.preventDefault();
    if (!newBlogTitle.trim() || !newBlogContent.trim()) {
      setError("Title and content are required.");
      return;
    }
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "blogs"), {
        title: newBlogTitle,
        content: newBlogContent,
        author: user.email,
        authorId: user.uid,
        timestamp: new Date(),
      });
      setMessage("Blog posted successfully!");
      setNewBlogTitle("");
      setNewBlogContent("");
      setTimeout(() => navigate("/blog/list"), 1500);
    } catch (err) {
      console.error("Error posting blog:", err);
      setError("Failed to post blog.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/blog/list");
  };

  if (!canPost) {
    return (
      <div className="min-h-screen bg-slate-900 text-white p-6 flex items-center justify-center">
        <div className="bg-slate-800 p-6 rounded-lg shadow-lg text-center">
          <p className="text-gray-400 text-lg">You are not authorized to post blogs.</p>
          <button
            onClick={handleCancel}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Blog List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Create a New Blog</h1>
        {error && (
          <p className="bg-red-700 text-white p-3 rounded-lg mb-4">{error}</p>
        )}
        {message && (
          <p className="bg-green-700 text-white p-3 rounded-lg mb-4">{message}</p>
        )}
        <form onSubmit={handlePostBlog} className="space-y-6">
          <div>
            <input
              type="text"
              value={newBlogTitle}
              onChange={(e) => setNewBlogTitle(e.target.value)}
              placeholder="Blog Title"
              className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <textarea
              value={newBlogContent}
              onChange={(e) => setNewBlogContent(e.target.value)}
              placeholder="Write your blog here..."
              className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[200px] resize-y"
              disabled={isSubmitting}
            />
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin" />
              ) : (
                <Send size={20} />
              )}
              Post Blog
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <X size={20} />
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogCreate;