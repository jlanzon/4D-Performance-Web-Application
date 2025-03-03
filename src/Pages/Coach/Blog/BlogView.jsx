// src/pages/Coach/Blog/BlogView.jsx
import React, { useState, useEffect } from "react";
import { db } from "../../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useParams, Link } from "react-router-dom";

const BlogView = () => {
  const { blogId } = useParams();
  const [blog, setBlog] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const blogDocRef = doc(db, "blogs", blogId);
        const docSnap = await getDoc(blogDocRef);
        if (docSnap.exists()) {
          setBlog({ id: blogId, ...docSnap.data() });
        } else {
          setError("Blog not found.");
        }
      } catch (err) {
        console.error("Error fetching blog:", err);
        setError("Failed to fetch blog.");
      }
    };

    fetchBlog();
  }, [blogId]);

  if (error) {
    return (
      <div className="p-4 text-white">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!blog) {
    return <div className="p-4 text-white">Loading...</div>;
  }

  return (
    <div className="p-4 text-white">
      <Link to="/coach/blog/list" className="text-blue-500 underline mb-4 inline-block">
        Back to Blog List
      </Link>
      <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
      <p className="text-gray-300 mb-2">{blog.content}</p>
      <p className="text-gray-500 text-sm">By {blog.author}</p>
    </div>
  );
};

export default BlogView;
