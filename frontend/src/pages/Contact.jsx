import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MessageCircle, MapPin, Phone, Send, CheckCircle, AlertCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import api from "../api";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [status, setStatus] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setStatus({ type: "error", text: "Please fill in all fields." });
      return;
    }
    setLoading(true);
    setStatus({ type: "", text: "" });
    try {
      const res = await api.post("/api/contact", formData);
      setStatus({ type: "success", text: res.data.message });
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setStatus({
        type: "error",
        text: err.response?.data?.error || "Failed to send message.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
            Get In Touch
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Have questions? We're here to help you grow
          </p>
        </motion.div>

        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* CONTACT INFO */}
            <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
              <h2 className="text-2xl font-bold mb-8">Contact Information</h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="text-purple-400" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email Support</h3>
                    <p className="text-gray-400">support@plutoboost.com</p>
                    <p className="text-sm text-gray-500">We respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="text-cyan-400" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Live Chat</h3>
                    <p className="text-gray-400">Available 24/7</p>
                    <p className="text-sm text-gray-500">Instant support for urgent issues</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-emerald-400" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Location</h3>
                    <p className="text-gray-400">Lagos, Nigeria</p>
                    <p className="text-sm text-gray-500">Serving creators worldwide</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="text-amber-400" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Phone</h3>
                    <p className="text-gray-400">+234 (0) 123 456 7890</p>
                    <p className="text-sm text-gray-500">Mon-Fri, 9AM-6PM WAT</p>
                  </div>
                </div>
              </div>

              {/* SOCIAL PROOF */}
              <div className="mt-12 glass rounded-2xl p-6">
                <h3 className="font-semibold mb-4">Why Choose Us?</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-emerald-400" />
                    <span>50K+ Happy Customers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-emerald-400" />
                    <span>99.9% Uptime</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-emerald-400" />
                    <span>24/7 Support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-emerald-400" />
                    <span>Money-back Guarantee</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* CONTACT FORM */}
            <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
              <div className="glass rounded-2xl p-8">
                <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
                {status.text && status.type === 'success' ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <CheckCircle size={48} className="text-emerald-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">{status.text}</h3>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Name</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full input-glass"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full input-glass"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Subject</label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full input-glass"
                        placeholder="How can we help?"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Message</label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="w-full input-glass resize-none"
                        placeholder="Tell us more about your inquiry..."
                      />
                    </div>

                    {status.text && status.type === 'error' && (
                      <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 p-3 rounded-lg">
                        <AlertCircle size={16} />
                        {status.text}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-60"
                    >
                      {loading ? (
                        "Sending..."
                      ) : (
                        <><Send size={18} /> Send Message</>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* FAQ PREVIEW */}
        <motion.div
          {...fadeInUp}
          transition={{ delay: 0.4 }}
          className="max-w-4xl mx-auto px-6 mt-20"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Quick Answers</h2>
            <p className="text-gray-400">Check our help center for instant answers</p>
          </div>

          <div className="glass rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Popular Questions</h3>
                <div className="space-y-3">
                  <div className="border-b border-white/10 pb-3">
                    <p className="font-medium">How long does delivery take?</p>
                    <p className="text-sm text-gray-400">Most orders complete within 1-24 hours</p>
                  </div>
                  <div className="border-b border-white/10 pb-3">
                    <p className="font-medium">Are followers real?</p>
                    <p className="text-sm text-gray-400">Yes, high-quality from real accounts</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Need More Help?</h3>
                <div className="space-y-3">
                  <a href="/help" className="block glass rounded-xl p-4 hover:bg-white/5 transition">
                    <div className="font-medium">Help Center</div>
                    <div className="text-sm text-gray-400">Browse FAQs and guides</div>
                  </a>
                  <a href="/help" className="block glass rounded-xl p-4 hover:bg-white/5 transition">
                    <div className="font-medium">Live Chat</div>
                    <div className="text-sm text-gray-400">Get instant support</div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}