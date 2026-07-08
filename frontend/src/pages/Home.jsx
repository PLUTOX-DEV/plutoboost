import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";
import {
  ArrowRight,
  Users,
  Zap,
  DollarSign,
  Youtube,
  Instagram,
  Twitter,
  BarChart3,
  Linkedin,
  Play,
  Shield,
  Star,
  CheckCircle,
  TrendingUp,
  Sparkles,
  Globe,
  Clock,
  Award,
} from "lucide-react";
import Navbar from "../components/Navbar";
import HeroImage from "/images/rock2.png";

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

/* ===================== HERO ===================== */
const Hero = () => {
  const [showImage, setShowImage] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(min-width: 1025px)');
    const update = () => setShowImage(mql.matches);
    update();
    mql.addEventListener?.('change', update);
    return () => mql.removeEventListener?.('change', update);
  }, []);

  return (
    <section className="relative min-h-[90vh] lg:min-h-screen overflow-hidden text-white bg-[#0B0E2A]">
      {/* Base Gradient */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_20%_20%,rgba(168,85,247,0.30),transparent_55%),radial-gradient(circle_at_80%_40%,rgba(236,72,153,0.20),transparent_60%),linear-gradient(180deg,#0B0E2A,#0A0D26)]" />

      {/* Animated Particles */}
      <div className="absolute inset-0 z-[1]">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Hero Image */}
      {showImage && (
        <div className="absolute inset-0 z-[2]">
          <img
            src={HeroImage}
            alt="Hero Background"
            className="w-full h-full object-cover scale-105 md:scale-110"
            loading="lazy"
          />
        </div>
      )}

      {/* Overlay */}
      <div className="absolute inset-0 z-[3] bg-gradient-to-b from-[#0B0E2A]/90 via-[#0B0E2A]/70 to-[#0B0E2A]" />

      {/* Floating Icons */}
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ repeat: Infinity, duration: 4 }}
        whileHover={{ scale: 1.1, y: -15 }}
        className="hidden lg:block absolute z-[4] left-[55%] top-24"
      >
        <Youtube className="hidden lg:block absolute z-[4] left-[55%] top-24 text-red-500 drop-shadow-glow" size={40} />
      </motion.div>
      <motion.div
        animate={{ y: [0, 14, 0] }}
        transition={{ repeat: Infinity, duration: 5 }}
        whileHover={{ scale: 1.1, y: 18 }}
        className="hidden lg:block absolute z-[4] left-[48%] top-60"
      >
        <Instagram className="hidden lg:block absolute z-[4] left-[48%] top-60 text-pink-500 drop-shadow-glow" size={38} />
      </motion.div>
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 4.5 }}
        whileHover={{ scale: 1.1, y: -13 }}
        className="hidden lg:block absolute z-[4] right-48 top-36"
      >
        <Twitter className="hidden lg:block absolute z-[4] right-48 top-36 text-blue-400 drop-shadow-glow" size={36} />
      </motion.div>
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 3 }}
        whileHover={{ scale: 1.2 }}
        className="hidden lg:block absolute z-[4] right-72 bottom-40"
      >
        <BarChart3 className="hidden lg:block absolute z-[4] right-72 bottom-40 text-indigo-400" size={42} />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 pt-28 pb-36 flex items-center min-h-[90vh]">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full lg:w-1/2 text-center lg:text-left"
        >
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30 mb-6"
          >
            <Sparkles size={14} className="text-purple-400" />
            <span className="text-sm text-purple-300">#1 Social Growth Platform</span>
          </motion.div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-extrabold leading-tight mb-6">
            Skyrocket Your <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-400 animate-gradient bg-[length:200%_auto]">
              Social Media Presence
            </span>
          </h1>

          <p className="text-gray-300 text-sm sm:text-base md:text-lg mb-8 max-w-xl mx-auto lg:mx-0">
            Boost your followers and engagement instantly with intelligent,
            scalable growth solutions built for creators and brands.
          </p>

          {/* Stats */}
          <div className="flex justify-center lg:justify-start gap-6 mb-10">
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-white">50K+</p>
              <p className="text-xs text-gray-400">Happy Users</p>
            </div>
            <div className="w-px bg-white/20" />
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-white">10M+</p>
              <p className="text-xs text-gray-400">Followers Delivered</p>
            </div>
            <div className="w-px bg-white/20" />
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-white">4.9</p>
              <p className="text-xs text-gray-400">Rating</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link 
              to="/login"
              className="bg-gradient-to-r from-purple-500 to-indigo-500 px-7 sm:px-10 py-4 rounded-full font-semibold shadow-glow hover:scale-105 hover:shadow-glow-lg transition-all duration-300 flex items-center justify-center gap-2"
            >
              Get Started Free
              <ArrowRight size={18} />
            </Link>

            <button className="group flex items-center justify-center gap-3 px-7 sm:px-10 py-4 rounded-full border border-white/30 backdrop-blur hover:bg-white/10 hover:border-white/50 transition-all duration-300">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play size={14} fill="white" />
              </div>
              Watch Demo
            </button>
          </div>
        </motion.div>
      </div>

      {/* Bottom Wave */}
      <svg
        className="absolute bottom-0 left-0 w-full h-[90px] sm:h-[110px] z-10"
        viewBox="0 0 1440 110"
        preserveAspectRatio="none"
      >
        <path
          fill="#ffffff"
          d="M0,70 C240,110 480,40 720,40 960,40 1200,110 1440,70 L1440,110 L0,110 Z"
        />
      </svg>
    </section>
  );
};

/* ===================== TRUSTED BY ===================== */
const TrustedBy = () => {
  const platforms = [
    { icon: Youtube, name: "YouTube", color: "text-red-500" },
    { icon: Instagram, name: "Instagram", color: "text-pink-500" },
    { icon: Twitter, name: "Twitter", color: "text-sky-400" },
    { icon: Linkedin, name: "LinkedIn", color: "text-blue-500" },
  ];

  return (
    <section className="py-12 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-center text-gray-500 text-sm mb-8">Trusted by creators on</p>
        <div className="flex justify-center items-center gap-8 sm:gap-16 flex-wrap">
          {platforms.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-2 text-gray-400 hover:text-gray-800 hover:scale-110 transition-all"
            >
              <p.icon size={24} className={p.color} />
              <span className="font-medium hidden sm:block">{p.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ===================== FEATURES ===================== */
const Features = () => {
  const items = [
    {
      icon: Users,
      title: "Real Followers",
      desc: "Authentic engagement from real, niche‑relevant users that boost your credibility.",
      accent: "from-indigo-500 to-purple-500",
    },
    {
      icon: Zap,
      title: "Instant Delivery",
      desc: "Lightning‑fast processing with full automation. Start seeing results in minutes.",
      accent: "from-purple-500 to-pink-500",
    },
    {
      icon: DollarSign,
      title: "Earn & Scale",
      desc: "High‑commission affiliate system that scales with you. Earn up to 30% per referral.",
      accent: "from-emerald-400 to-teal-500",
    },
    {
      icon: Shield,
      title: "100% Safe",
      desc: "No password required. Your account security is our top priority.",
      accent: "from-cyan-500 to-blue-500",
    },
    {
      icon: Clock,
      title: "24/7 Support",
      desc: "Round-the-clock customer support to help you with any questions.",
      accent: "from-amber-500 to-orange-500",
    },
    {
      icon: TrendingUp,
      title: "Analytics",
      desc: "Track your growth with detailed analytics and insights dashboard.",
      accent: "from-rose-500 to-pink-500",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div {...fadeInUp} className="text-center mb-16">
          <span className="inline-block px-4 py-1 rounded-full bg-purple-100 text-purple-600 text-sm font-medium mb-4">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900">
            Built for <span className="text-purple-600">Creators & Brands</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Everything you need to grow your social media presence and build your brand.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              className="relative bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 border border-gray-100 group"
            >
              <div className={`absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r ${f.accent}`} />

              <div className={`w-14 h-14 mb-5 rounded-xl bg-gradient-to-br ${f.accent} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <f.icon size={24} />
              </div>

              <h3 className="text-lg font-semibold mb-2 text-gray-900">{f.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ===================== HOW IT WORKS ===================== */
const HowItWorks = () => {
  const steps = [
    { num: "01", title: "Create Account", desc: "Sign up in seconds with just your email" },
    { num: "02", title: "Choose Service", desc: "Select your platform and desired service" },
    { num: "03", title: "Add Funds", desc: "Fund your wallet securely with multiple options" },
    { num: "04", title: "Watch Growth", desc: "Sit back and watch your followers grow" },
  ];

  return (
    <section className="py-24 bg-[#0B0E2A] text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(168,85,247,0.15),transparent_50%)]" />
      
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.div {...fadeInUp} className="text-center mb-16">
          <span className="inline-block px-4 py-1 rounded-full bg-purple-500/20 text-purple-400 text-sm font-medium mb-4">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Get Started in <span className="text-purple-400">4 Simple Steps</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/30 hover:bg-white/10 hover:scale-105 transition-all duration-300"
            >
              <span className="text-5xl font-bold text-purple-500/20">{step.num}</span>
              <h3 className="text-lg font-semibold mt-2 mb-2">{step.title}</h3>
              <p className="text-gray-400 text-sm">{step.desc}</p>
              
              {i < steps.length - 1 && (
                <ArrowRight className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 text-purple-500/30" size={24} />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ===================== TESTIMONIALS ===================== */
const Testimonials = () => {
  const reviews = [
    { name: "Sarah K.", role: "Content Creator", text: "PlutoBoost helped me reach 100K followers in just 3 months. The quality is amazing!", rating: 5 },
    { name: "Mike T.", role: "Business Owner", text: "Best investment for my brand. Real followers that actually engage with my content.", rating: 5 },
    { name: "Jessica L.", role: "Influencer", text: "Fast delivery and excellent support. I've tried others but PlutoBoost is the best.", rating: 5 },
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div {...fadeInUp} className="text-center mb-16">
          <span className="inline-block px-4 py-1 rounded-full bg-purple-100 text-purple-600 text-sm font-medium mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900">
            Loved by <span className="text-purple-600">50,000+ Users</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((review, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-purple-500/10 transition-all duration-300"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(review.rating)].map((_, j) => (
                  <Star key={j} size={16} className="text-yellow-400" fill="currentColor" />
                ))}
              </div>
              <p className="text-gray-600 mb-4 text-sm leading-relaxed">"{review.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900">{review.name}</p>
                  <p className="text-xs text-gray-500">{review.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ===================== CTA ===================== */
const CTA = () => {
  return (
    <section className="py-24 bg-gradient-to-r from-purple-600 to-indigo-600 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10" />
      
      <motion.div {...fadeInUp} className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
          Ready to Grow Your Audience?
        </h2>
        <p className="text-lg text-purple-100 mb-10 max-w-2xl mx-auto">
          Join 50,000+ creators and brands who trust PlutoBoost for their social media growth.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/login"
            className="bg-white text-purple-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 hover:scale-105 shadow-2xl hover:shadow-white/30 transition-all duration-300 flex items-center justify-center gap-2"
          >
            Start Growing Now
            <ArrowRight size={18} />
          </Link>
          <button className="border-2 border-white/50 px-8 py-4 rounded-full font-semibold hover:bg-white/10 hover:border-white transition-all duration-300">
            View Pricing
          </button>
        </div>
      </motion.div>
    </section>
  );
};

/* ===================== FOOTER ===================== */
export const Footer = () => { // Export the component
  return (
    <footer className="bg-[#070A1F] text-gray-400 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                <Sparkles size={20} className="text-white" />
              </div>
              <h3 className="text-white text-xl font-bold">PlutoBoost</h3>
            </div>
            <p className="text-sm leading-relaxed mb-4">
              Intelligent growth solutions helping creators dominate social media.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center hover:bg-purple-500/20 transition">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center hover:bg-purple-500/20 transition">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center hover:bg-purple-500/20 transition">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Platform</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/features/instagram" className="hover:text-white transition">Instagram</Link></li>
              <li><Link to="/features/youtube" className="hover:text-white transition">YouTube</Link></li>
              <li><Link to="/features/analytics" className="hover:text-white transition">Analytics</Link></li>
              <li><Link to="/affiliate" className="hover:text-white transition">Affiliate Program</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/about" className="hover:text-white transition">About</Link></li>
              <li><Link to="/blog" className="hover:text-white transition">Blog</Link></li>
              <li><Link to="/careers" className="hover:text-white transition">Careers</Link></li>
              <li><Link to="/contact" className="hover:text-white transition">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/privacy-policy" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="hover:text-white transition">Terms of Service</Link></li>
              <li><Link to="/refund-policy" className="hover:text-white transition">Refund Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs">© 2026 PlutoBoost. All rights reserved.</p>
          <div className="flex items-center gap-2 text-xs">
            <Globe size={14} />
            <span>Available Worldwide</span>
            <span className="text-purple-400">🚀</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

/* ===================== APP ===================== */
export default function Home() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const adminToken = localStorage.getItem('adminToken');
    if (token && user) {
      navigate('/dashboard');
    } else if (adminToken) {
      navigate('/admin');
    }
  }, [user, navigate]);

  return (
    <div className="overflow-hidden">
      <Navbar />
      <Hero />
      <TrustedBy />
      <Features />
      <HowItWorks />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
}
