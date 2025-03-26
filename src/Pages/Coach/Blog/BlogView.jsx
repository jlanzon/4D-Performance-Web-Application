import React, { useState, useEffect } from "react";
import { db } from "../../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "react-feather";

const BlogView = () => {
  const { blogId } = useParams();
  const [blog, setBlog] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [blogId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white p-6 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-t-2 border-white rounded-full animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 text-white p-6 flex items-center justify-center">
        <div className="bg-red-700 p-4 rounded-lg">
          <p>{error}</p>
          <Link
            to="/coach/blog/list"
            className="mt-4 inline-flex items-center gap-2 text-blue-400 hover:underline"
          >
            <ArrowLeft size={20} />
            Back to Blog List
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-3xl mx-auto">
        <Link
          to="/coach/blog/list"
          className="inline-flex items-center gap-2 text-blue-400 hover:underline mb-6"
        >
          <ArrowLeft size={20} />
          Back to Blog List
        </Link>
        <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
        <div className="prose prose-invert max-w-none">
          <p className="text-gray-200 whitespace-pre-wrap">{blog.content}</p>
        </div>
        <div className="mt-6 text-sm text-gray-400">
          <p>By {blog.author}</p>
          <p>{new Date(blog.timestamp).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default BlogView;