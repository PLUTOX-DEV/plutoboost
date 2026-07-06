import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight, User, Tag, Search } from "lucide-react";
import Navbar from "../components/Navbar";

const blogPosts = [
  {
    id: 1,
    title: "10 Instagram Growth Hacks That Actually Work in 2024",
    excerpt: "Discover the latest strategies for growing your Instagram following organically and effectively.",
    author: "Sarah Okon",
    date: "Jan 10, 2026",
    readTime: "5 min read",
    category: "Instagram",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&h=300&fit=crop",
    featured: true
  },
  {
    id: 2,
    title: "YouTube Algorithm Changes: What Creators Need to Know",
    excerpt: "Stay ahead of the curve with our comprehensive guide to the latest YouTube algorithm updates.",
    author: "Michael Eze",
    date: "Jan 8, 2026",
    readTime: "7 min read",
    category: "YouTube",
    image: "https://images.unsplash.com/photo-1611162616305-c69b3037c7bb?w=600&h=300&fit=crop",
    featured: false
  },
  {
    id: 3,
    title: "Building an Authentic Personal Brand on Social Media",
    excerpt: "Learn how to create genuine connections with your audience and build a loyal following.",
    author: "John Adebayo",
    date: "Jan 5, 2026",
    readTime: "6 min read",
    category: "Branding",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=300&fit=crop",
    featured: false
  },
  {
    id: 4,
    title: "The Psychology Behind Viral Content",
    excerpt: "Understanding what makes content go viral and how to create shareable posts.",
    author: "Sarah Okon",
    date: "Jan 3, 2026",
    readTime: "4 min read",
    category: "Content",
    image: "https://images.unsplash.com/photo-1553484771-371a605b060b?w=600&h=300&fit=crop",
    featured: false
  },
  {
    id: 5,
    title: "Monetizing Your Social Media Presence: A Complete Guide",
    excerpt: "From sponsored posts to affiliate marketing, learn how to turn your following into income.",
    author: "Michael Eze",
    date: "Dec 28, 2025",
    readTime: "8 min read",
    category: "Monetization",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=300&fit=crop",
    featured: false
  },
  {
    id: 6,
    title: "Social Media Analytics: Measuring What Matters",
    excerpt: "Learn which metrics to track and how to interpret your social media performance data.",
    author: "John Adebayo",
    date: "Dec 25, 2025",
    readTime: "6 min read",
    category: "Analytics",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=300&fit=crop",
    featured: false
  }
];

const categories = ["All", "Instagram", "YouTube", "Content", "Branding", "Analytics", "Monetization"];

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function Blog() {
  return (
    <div className="min-h-screen bg-[#07091F] text-white">
      <Navbar />

      <div className="pt-24 pb-16">
        {/* HEADER */}
        <motion.div
          {...fadeInUp}
          className="text-center max-w-4xl mx-auto px-6 mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-6">
            PlutoBoost Blog
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Insights, tips, and strategies for social media success
          </p>

          {/* SEARCH */}
          <div className="max-w-md mx-auto relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search articles..."
              className="w-full input-glass pl-12 py-3 text-center"
            />
          </div>
        </motion.div>

        {/* CATEGORIES */}
        <motion.div
          {...fadeInUp}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap justify-center gap-3 mb-12 px-6"
        >
          {categories.map((category) => (
            <button
              key={category}
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-purple-500/20 hover:text-purple-400 transition text-sm font-medium"
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* FEATURED POST */}
        {blogPosts.find(post => post.featured) && (
          <motion.div
            {...fadeInUp}
            transition={{ delay: 0.2 }}
            className="max-w-6xl mx-auto px-6 mb-16"
          >
            <div className="glass rounded-2xl overflow-hidden card-hover">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="p-8 lg:p-12">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs font-medium">
                      Featured
                    </span>
                    <span className="px-3 py-1 bg-white/10 text-gray-400 rounded-full text-xs">
                      {blogPosts.find(post => post.featured).category}
                    </span>
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-bold mb-4">
                    {blogPosts.find(post => post.featured).title}
                  </h2>
                  <p className="text-gray-400 mb-6">
                    {blogPosts.find(post => post.featured).excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-400 mb-6">
                    <div className="flex items-center gap-1">
                      <User size={14} />
                      {blogPosts.find(post => post.featured).author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      {blogPosts.find(post => post.featured).date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      {blogPosts.find(post => post.featured).readTime}
                    </div>
                  </div>
                  <button className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition">
                    Read More
                    <ArrowRight size={16} />
                  </button>
                </div>
                <div className="relative">
                  <img
                    src={blogPosts.find(post => post.featured).image}
                    alt={blogPosts.find(post => post.featured).title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20" />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* BLOG GRID */}
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.filter(post => !post.featured).map((post, index) => (
              <motion.article
                key={post.id}
                {...fadeInUp}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-2xl overflow-hidden card-hover group"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-1 bg-white/10 text-gray-400 rounded-full text-xs">
                      {post.category}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold mb-3 line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <User size={12} />
                        {post.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        {post.readTime}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={12} />
                      {post.date}
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>

        {/* NEWSLETTER */}
        <motion.div
          {...fadeInUp}
          transition={{ delay: 0.8 }}
          className="max-w-4xl mx-auto px-6 mt-20"
        >
          <div className="glass rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
            <p className="text-gray-400 mb-6">
              Get the latest social media tips and growth strategies delivered to your inbox
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 input-glass"
              />
              <button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 px-6 py-3 rounded-xl font-semibold transition-all duration-300">
                Subscribe
              </button>
            </div>
          </div>
        </motion.div>

        {/* POPULAR TAGS */}
        <motion.div
          {...fadeInUp}
          transition={{ delay: 0.9 }}
          className="max-w-4xl mx-auto px-6 mt-12"
        >
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4">Popular Topics</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {["Instagram Growth", "YouTube SEO", "Content Strategy", "Social Analytics", "Influencer Marketing", "TikTok Trends"].map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-2 bg-white/10 hover:bg-purple-500/20 hover:text-purple-400 rounded-full text-sm transition cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}