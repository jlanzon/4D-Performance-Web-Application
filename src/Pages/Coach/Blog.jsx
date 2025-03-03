import React, { useState, useEffect } from "react";
import { auth, db } from "../../firebase";
import { collection, getDocs, addDoc, doc, getDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

const Blog = () => {
  const [user] = useAuthState(auth);
  const [role, setRole] = useState("user");
  const [blogs, setBlogs] = useState([]);
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
  console.log("User role:", role);

  // Fetch blogs from Firestore
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "blogs"));
        const blogData = [];
        querySnapshot.forEach((doc) => {
          blogData.push({ id: doc.id, ...doc.data() });
        });
        setBlogs(blogData);
      } catch (err) {
        console.error("Error fetching blogs:", err);
      }
    };

    fetchBlogs();
  }, []);

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

  return (
    <div className="p-4 text-white bg-slate-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Coach Blog</h1>
      {error && <p className="text-red-500">{error}</p>}
      {message && <p className="text-green-500">{message}</p>}
      <div className="mb-6">
        {blogs.map((blog) => (
          <div key={blog.id} className="mb-4 p-4 bg-slate-800 rounded">
            <h2 className="text-xl font-bold">{blog.title}</h2>
            <p className="text-gray-300">{blog.content}</p>
            <p className="text-gray-500 text-sm">By {blog.author}</p>
          </div>
        ))}
      </div>
      {canPost ? (
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
      ) : (
        <p className="text-gray-400">You are not authorised to post blogs.</p>
      )}
    </div>
  );
};

export default Blog;
