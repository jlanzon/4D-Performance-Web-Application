import React, { useState, useEffect } from "react";
import { db } from "../../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import { BookOpen } from "react-feather";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "blogs"));
        const blogData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBlogs(blogData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError("Failed to fetch blogs.");
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white p-6 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-t-2 border-white rounded-full animate-spin" />
          <span>Loading blogs...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 flex items-center gap-3">
          <BookOpen size={32} />
          Blog Posts
        </h1>
        {error && (
          <p className="bg-red-700 text-white p-3 rounded-lg mb-6">{error}</p>
        )}
        {blogs.length === 0 && !error ? (
          <p className="text-gray-400 text-lg">No blogs available yet.</p>
        ) : (
          <div className="grid gap-6">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                className="p-6 bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <h2 className="text-2xl font-semibold mb-2">{blog.title}</h2>
                <p className="text-gray-300 line-clamp-3 mb-4">{blog.content}</p>
                <div className="flex justify-between items-center text-sm text-gray-400">
                  <span>By {blog.author}</span>
                  <span>{new Date(blog.timestamp).toLocaleDateString()}</span>
                </div>
                <Link
                  to={`/coach/blog/${blog.id}`}
                  className="mt-4 inline-flex items-center gap-2 text-blue-400 hover:underline"
                >
                  Read More
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogList;