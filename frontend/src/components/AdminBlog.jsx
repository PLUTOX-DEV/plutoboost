import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, Plus, Send, Edit, Trash2, X } from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import api from "../api";

export default function AdminBlog() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [editingPostId, setEditingPostId] = useState(null);

  const fetchPosts = async () => {
    try {
      const res = await api.get("/api/blog/posts");
      setPosts(res.data);
    } catch (err) {
      console.error("Failed to fetch posts", err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });
    const postData = { title, content };

    try {
      if (editingPostId) {
        await api.put(`/api/admin/blog/posts/${editingPostId}`, postData);
        setMessage({ type: "success", text: "Post updated successfully!" });
      } else {
        await api.post("/api/admin/blog/posts", postData);
        setMessage({ type: "success", text: "Post created successfully!" });
      }
      setTitle("");
      setContent("");
      setEditingPostId(null);
      fetchPosts(); // Refresh posts list
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.error || "Failed to save post." });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (post) => {
    setEditingPostId(post._id);
    setTitle(post.title);
    setContent(post.content);
    setMessage({ type: "", text: "" });
  };

  const cancelEdit = () => {
    setEditingPostId(null);
    setTitle("");
    setContent("");
    setMessage({ type: "", text: "" });
  };

  const handleDelete = async (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await api.delete(`/api/admin/blog/posts/${postId}`);
        setMessage({ type: "success", text: "Post deleted successfully." });
        fetchPosts();
      } catch (err) {
        setMessage({ type: "error", text: err.response?.data?.error || "Failed to delete post." });
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#07091F] text-white flex">
      <AdminSidebar />
      <main className="flex-1 px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16 py-8 space-y-6 lg:ml-72 xl:ml-80 2xl:ml-96">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold gradient-text">Blog Management</h1>
          <p className="text-gray-400 mt-1">Create and manage blog articles.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Create Post Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1 glass rounded-2xl p-6"
          >
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              {editingPostId ? <Edit /> : <Plus />} {editingPostId ? "Edit Post" : "Create New Post"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Post Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input-glass w-full"
              />
              <textarea
                placeholder="Post content (Markdown is supported)..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows="10"
                className="input-glass w-full"
              ></textarea>
              <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                <Send size={16} /> {loading ? "Saving..." : editingPostId ? "Update Post" : "Publish Post"}
              </button>
              {editingPostId && (
                <button type="button" onClick={cancelEdit} className="btn-secondary w-full flex items-center justify-center gap-2">
                  <X size={16} /> Cancel Edit
                </button>
              )}
              {message.text && (
                <p className={`text-sm text-center ${message.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {message.text}
                </p>
              )}
            </form>
          </motion.div>

          {/* Existing Posts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 glass rounded-2xl p-6"
          >
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BookOpen /> Published Posts
            </h2>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              {posts.map((post) => (
                <div key={post._id} className="bg-black/30 p-4 rounded-xl border border-white/10 flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{post.title}</h3>
                    <p className="text-xs text-gray-400">
                      By {post.author} on {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(post)} className="p-2 hover:bg-blue-500/20 rounded-lg text-blue-400 transition">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDelete(post._id)} className="p-2 hover:bg-red-500/20 rounded-lg text-red-400 transition">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}