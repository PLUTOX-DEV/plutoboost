import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, TrendingUp, Shield, Zap, Star, Award, Globe, Heart } from "lucide-react";
import Navbar from "../components/Navbar";
import FounderImage from "../../asset/pluto.png";

const stats = [
  { number: "50K+", label: "Happy Customers", icon: Users },
  { number: "2M+", label: "Followers Delivered", icon: TrendingUp },
  { number: "99.9%", label: "Uptime Guarantee", icon: Shield },
  { number: "24/7", label: "Customer Support", icon: Zap },
];

const values = [
  {
    icon: Shield,
    title: "Security First",
    description: "Your data and privacy are our top priorities. We use industry-leading encryption and never store sensitive information."
  },
  {
    icon: Star,
    title: "Quality Guarantee",
    description: "We deliver only high-quality, real followers from active accounts. No bots, no fake profiles."
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Most orders start delivering within minutes. Experience rapid growth for your social media presence."
  },
  {
    icon: Heart,
    title: "Customer Obsessed",
    description: "We're passionate about helping creators succeed. Your satisfaction drives everything we do."
  }
];

const founder = 
  {
    name: "Plutox",
    role: "Founder & Visionary",
    image: FounderImage,
    bio: "A passionate developer and social media strategist, Plutox founded PlutoBoost to provide intelligent, effective, and safe solutions for online success."
  };

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function About() {
  const [showFounderImage, setShowFounderImage] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(min-width: 1025px)');
    const update = () => setShowFounderImage(mql.matches);
    update();
    mql.addEventListener?.('change', update);
    return () => mql.removeEventListener?.('change', update);
  }, []);

  return (
    <div className="min-h-screen bg-[#07091F] text-white">
      <Navbar />

      <div className="pt-24 pb-16">
        {/* HERO */}
        <motion.div
          {...fadeInUp}
          className="text-center max-w-4xl mx-auto px-6 mb-20"
        >
          <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-6">
            About PlutoBoost
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Empowering creators worldwide with authentic social media growth solutions
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-purple-400">
            <Award size={16} />
            <span>Trusted by 50,000+ creators since 2020</span>
          </div>
        </motion.div>

        {/* STATS */}
        <motion.div
          {...fadeInUp}
          transition={{ delay: 0.1 }}
          className="max-w-6xl mx-auto px-6 mb-20"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-2xl p-6 text-center card-hover"
              >
                <stat.icon size={32} className="text-purple-400 mx-auto mb-3" />
                <div className="text-3xl font-bold mb-1">{stat.number}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* STORY */}
        <div className="max-w-6xl mx-auto px-6 mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  Founded in 2020, PlutoBoost started with a simple mission: to help content creators
                  focus on what they do best - creating amazing content - while we handle the growth.
                </p>
                <p>
                  We noticed that many talented creators were struggling to gain visibility on social
                  media platforms. The algorithms were changing, competition was fierce, and organic
                  growth was becoming increasingly difficult.
                </p>
                <p>
                  That's when we decided to build a platform that combines cutting-edge technology
                  with ethical growth strategies to help creators reach their audience faster and
                  more effectively.
                </p>
              </div>
            </motion.div>

            <motion.div {...fadeInUp} transition={{ delay: 0.3 }}>
              <div className="glass rounded-2xl p-8">
                <h3 className="text-xl font-semibold mb-4">Our Mission</h3>
                <p className="text-gray-300 mb-6">
                  To democratize social media success by providing accessible, ethical, and effective
                  growth solutions for creators of all sizes.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Globe size={18} className="text-purple-400" />
                    <span className="text-sm">Serving creators in 50+ countries</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <TrendingUp size={18} className="text-purple-400" />
                    <span className="text-sm">2M+ followers delivered</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Heart size={18} className="text-purple-400" />
                    <span className="text-sm">100% customer satisfaction</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* VALUES */}
        <motion.div
          {...fadeInUp}
          transition={{ delay: 0.4 }}
          className="max-w-6xl mx-auto px-6 mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <p className="text-gray-400">What drives us every day</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-2xl p-6 card-hover"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <value.icon size={24} className="text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">{value.title}</h3>
                    <p className="text-sm text-gray-400">{value.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* TEAM */}
        <motion.div
          {...fadeInUp}
          transition={{ delay: 0.5 }}
          className="max-w-6xl mx-auto px-6 mb-20"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Meet The Founder</h2>
            <p className="text-gray-400">The visionary behind PlutoBoost</p>
          </div>

          <div className="max-w-sm mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass rounded-2xl p-8 text-center card-hover"
            >
              {showFounderImage && (
                <img src={founder.image} alt={founder.name} loading="lazy" className="w-28 h-28 rounded-full mx-auto mb-4 object-cover border-4 border-purple-500/30" />
              )}
              <h3 className="text-2xl font-semibold mb-1">{founder.name}</h3>
              <p className="text-purple-400 text-sm mb-4">{founder.role}</p>
              <p className="text-sm text-gray-400">{founder.bio}</p>
            </motion.div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          {...fadeInUp}
          transition={{ delay: 0.6 }}
          className="text-center px-6"
        >
          <div className="glass rounded-2xl p-8 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Ready to Join Our Community?</h2>
            <p className="text-gray-400 mb-6">
              Start your journey to social media success with PlutoBoost today
            </p>
            <button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 px-8 py-4 rounded-xl font-semibold shadow-glow transition-all duration-300">
              Get Started Free
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}