import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BookOpen, Calendar, ArrowRight } from "lucide-react";
import api from "../api";
import LoadingSpinner from "./LoadingSpinner";

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await api.get("/api/blog/posts");
        setPosts(res.data);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-[#07091F] text-white pt-32 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto px-4"
      >
        <div className="text-center mb-12">
          <BookOpen className="mx-auto h-12 w-12 text-purple-400 mb-4" />
          <h1 className="text-5xl font-bold gradient-text">PlutoBoost Blog</h1>
          <p className="text-gray-400 mt-4 text-lg max-w-2xl mx-auto">
            Tips, tricks, and updates from the PlutoBoost team.
          </p>
        </div>

        {loading ? (
          <LoadingSpinner text="Fetching latest articles..." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.map((post, index) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/blog/${post.slug}`} className="block glass card-hover rounded-2xl p-6 h-full flex flex-col">
                  <h2 className="text-xl font-semibold mb-2 text-white">
                    {post.title}
                  </h2>
                  <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14} />
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                    <span>by {post.author}</span>
                  </div>
                  <p className="text-gray-400 text-sm flex-grow">
                    {post.content.substring(0, 120)}...
                  </p>
                  <div className="mt-4 flex items-center text-purple-400 font-semibold text-sm">
                    Read More <ArrowRight size={16} className="ml-2" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}