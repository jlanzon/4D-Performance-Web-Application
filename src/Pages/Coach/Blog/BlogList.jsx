// src/pages/Coach/Blog/BlogList.jsx
import React, { useState, useEffect } from "react";
import { db } from "../../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState("");

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
        setError("Failed to fetch blogs.");
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Blog Posts</h1>
      {error && <p className="text-red-500">{error}</p>}
      <div className="space-y-4">
        {blogs.map((blog) => (
          <div key={blog.id} className="p-4 bg-slate-800 rounded">
            <h2 className="text-xl font-bold">{blog.title}</h2>
            <p className="text-gray-300 line-clamp-2">{blog.content}</p>
            <p className="text-gray-500 text-sm">By {blog.author}</p>
            <Link
              to={`/coach/blog/${blog.id}`}
              className="text-blue-500 underline mt-2 inline-block"
            >
              Read More
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogList;
