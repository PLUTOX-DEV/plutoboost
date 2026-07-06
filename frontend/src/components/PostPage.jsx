import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Calendar, User, ArrowLeft } from "lucide-react";
import api from "../api";
import LoadingSpinner from "./LoadingSpinner";

export default function PostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/blog/posts/${slug}`);
        setPost(res.data);
      } catch (err) {
        console.error("Failed to fetch post:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07091F] flex items-center justify-center">
        <LoadingSpinner text="Loading article..." />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#07091F] text-white text-center flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">Post not found</h1>
        <Link to="/blog" className="mt-4 btn-primary">Back to Blog</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07091F] text-white pt-32 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto px-4"
      >
        <Link to="/blog" className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition mb-8">
          <ArrowLeft size={16} /> Back to all articles
        </Link>

        <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">{post.title}</h1>
        <div className="flex items-center gap-6 text-sm text-gray-400 mb-8">
          <span className="flex items-center gap-2">
            <Calendar size={14} />
            {new Date(post.createdAt).toLocaleDateString()}
          </span>
          <span className="flex items-center gap-2">
            <User size={14} />
            By {post.author}
          </span>
        </div>

        <div className="prose prose-invert prose-lg max-w-none">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      </motion.div>
    </div>
  );
}