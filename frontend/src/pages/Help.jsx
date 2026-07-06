import { useState } from "react";
import { motion } from "framer-motion";
import {
  HelpCircle,
  Search,
  MessageCircle,
  Mail,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Book,
  Zap,
  Shield,
  CreditCard,
  Users,
  Send,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import api from "../api";

const faqs = [
  {
    category: "Getting Started",
    icon: Zap,
    questions: [
      {
        q: "How do I create an account?",
        a: "Simply click 'Get Started' on our homepage and sign up with your email or connect your Google/X account. It takes less than a minute!"
      },
      {
        q: "How do I add funds to my wallet?",
        a: "Go to 'Add Funds' in the sidebar, choose your preferred amount and payment method (Card, Bank Transfer, or Crypto), and complete the payment. Funds are credited instantly."
      },
      {
        q: "Is my account secure?",
        a: "Yes! We use 256-bit encryption and never store your social media passwords. Your account is protected with industry-standard security measures."
      },
    ]
  },
  {
    category: "Orders & Delivery",
    icon: Users,
    questions: [
      {
        q: "How long does delivery take?",
        a: "Most orders start within minutes and complete within 1-24 hours depending on the quantity. You can track progress in real-time from your Orders page."
      },
      {
        q: "Are the followers real?",
        a: "Yes! We provide high-quality followers from real accounts. Our gradual delivery system ensures natural growth that won't trigger platform algorithms."
      },
      {
        q: "What if my order fails?",
        a: "In the rare case of a failed order, you'll receive a full refund to your wallet automatically. You can also contact support for assistance."
      },
    ]
  },
  {
    category: "Payments & Refunds",
    icon: CreditCard,
    questions: [
      {
        q: "What payment methods do you accept?",
        a: "We accept Debit/Credit Cards (Visa, Mastercard), Bank Transfers, and Cryptocurrency (BTC, ETH, USDT)."
      },
      {
        q: "Can I get a refund?",
        a: "Yes, we offer refunds for undelivered orders. Partial refunds are available for partially completed orders. Contact support within 7 days of your order."
      },
      {
        q: "Is there a minimum deposit?",
        a: "The minimum deposit is ₦1,000. We recommend starting with ₦5,000 or more to take advantage of our services."
      },
    ]
  },
  {
    category: "Account & Security",
    icon: Shield,
    questions: [
      {
        q: "Do you need my password?",
        a: "No! We never ask for your social media passwords. We only need your profile/post link to deliver services."
      },
      {
        q: "Can my account get banned?",
        a: "Our gradual delivery system mimics organic growth, making it safe for your account. We've delivered millions of followers without issues."
      },
      {
        q: "How do I change my password?",
        a: "Go to Settings > Change Password. Enter your current password and your new password twice to confirm."
      },
    ]
  },
];

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function Help() {
  const [search, setSearch] = useState("");
  const [openFaq, setOpenFaq] = useState(null);
  const [contactForm, setContactForm] = useState({
    subject: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState({ loading: false, error: '', success: '' });


  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => q.q.toLowerCase().includes(search.toLowerCase()) ||
           q.a.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  const toggleFaq = (categoryIndex, questionIndex) => {
    const key = `${categoryIndex}-${questionIndex}`;
    setOpenFaq(openFaq === key ? null : key);
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setFormStatus({ loading: true, error: '', success: '' });
    try {
      const res = await api.post('/api/help/contact', contactForm);
      setFormStatus({ loading: false, error: '', success: res.data.message });
      setContactForm({ subject: '', message: '' });
      setTimeout(() => setFormStatus({ loading: false, error: '', success: '' }), 5000);
    } catch (err) {
      setFormStatus({
        loading: false,
        error: err.response?.data?.error || 'Failed to send message.',
        success: ''
      });
    }
  };




  return (
    <div className="flex min-h-screen bg-[#07091F] text-white">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 xl:p-10 2xl:p-12 lg:ml-72 xl:ml-80 2xl:ml-96 overflow-x-hidden">
        <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
          {/* HEADER */}
          <motion.div {...fadeInUp} className="text-center">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold gradient-text flex items-center justify-center gap-2">
              <HelpCircle className="text-purple-400" size={24} />
              Help Center
            </h1>
            <p className="text-gray-400 mt-2 text-sm sm:text-base">
              Find answers to common questions or contact our support team
            </p>
          </motion.div>

          {/* SEARCH */}
          <motion.div 
            {...fadeInUp}
            transition={{ delay: 0.1 }}
            className="relative"
          >
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for help..."
              className="input-glass pl-12 py-4 text-base"
            />
          </motion.div>

          {/* QUICK LINKS */}
          <motion.div 
            {...fadeInUp}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3"
          >
            {[
              { icon: Book, label: "Documentation", href: "#" },
              { icon: MessageCircle, label: "Live Chat", href: "#" },
              { icon: Mail, label: "Email Support", href: "#" },
              { icon: ExternalLink, label: "Community", href: "#" },
            ].map((link, i) => (
              <a
                key={i}
                href={link.href}
                className="glass rounded-xl p-4 text-center card-hover group"
              >
                <link.icon size={24} className="mx-auto text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-sm font-medium">{link.label}</p>
              </a>
            ))}
          </motion.div>

          {/* FAQ SECTIONS */}
          <motion.div 
            {...fadeInUp}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <h2 className="text-lg font-semibold">Frequently Asked Questions</h2>
            
            {filteredFaqs.length === 0 ? (
              <div className="glass rounded-xl p-8 text-center">
                <HelpCircle size={48} className="mx-auto text-gray-600 mb-4" />
                <p className="text-gray-400">No results found for "{search}"</p>
                <p className="text-sm text-gray-500 mt-2">Try a different search term</p>
              </div>
            ) : (
              filteredFaqs.map((category, categoryIndex) => (
                <div key={categoryIndex} className="glass rounded-xl overflow-hidden">
                  <div className="flex items-center gap-3 p-4 bg-black/30 border-b border-white/5">
                    <div className="p-2 rounded-lg bg-purple-500/20">
                      <category.icon size={18} className="text-purple-400" />
                    </div>
                    <h3 className="font-semibold">{category.category}</h3>
                  </div>
                  
                  <div className="divide-y divide-white/5">
                    {category.questions.map((faq, questionIndex) => {
                      const isOpen = openFaq === `${categoryIndex}-${questionIndex}`;
                      return (
                        <div key={questionIndex}>
                          <button
                            onClick={() => toggleFaq(categoryIndex, questionIndex)}
                            className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition"
                          >
                            <span className="font-medium text-sm pr-4">{faq.q}</span>
                            {isOpen ? (
                              <ChevronUp size={18} className="text-purple-400 flex-shrink-0" />
                            ) : (
                              <ChevronDown size={18} className="text-gray-400 flex-shrink-0" />
                            )}
                          </button>
                          
                          {isOpen && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              className="px-4 pb-4"
                            >
                              <p className="text-sm text-gray-400 leading-relaxed">
                                {faq.a}
                              </p>
                            </motion.div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </motion.div>

          {/* CONTACT FORM */}
          <motion.div 
            {...fadeInUp}
            transition={{ delay: 0.4 }}
            className="glass rounded-2xl p-4 sm:p-6"
          >
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <MessageCircle size={18} className="text-purple-400" />
              </div>
              Still need help?
            </h2>
            <p className="text-sm text-gray-400 mb-6">
              Can't find what you're looking for? Send us a message and we'll get back to you within 24 hours.
            </p>

            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Subject</label>
                <input
                  type="text"
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                  className="input-glass"
                  placeholder="What do you need help with?"
                  required
                />
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">Message</label>
                <textarea
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  className="input-glass min-h-[120px] resize-none"
                  placeholder="Describe your issue in detail..."
                  required
                />
              </div>

              <button type="submit" disabled={formStatus.loading} className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2 disabled:opacity-50">
                <Send size={18} />
                {formStatus.loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
            {formStatus.success && (
              <p className="text-emerald-400 text-sm mt-4">{formStatus.success}</p>
            )}
            {formStatus.error && (
              <p className="text-red-400 text-sm mt-4">{formStatus.error}</p>
            )}
          </motion.div>

          {/* CONTACT INFO */}
          <motion.div 
            {...fadeInUp}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <div className="glass rounded-xl p-4 flex items-center gap-3">
              <div className="p-3 rounded-xl bg-purple-500/20">
                <Mail size={20} className="text-purple-400" />
              </div>
              <div>
                <p className="font-medium text-sm">Email Support</p>
                <p className="text-xs text-gray-400">support@plutoboost.com</p>
              </div>
            </div>
            <div className="glass rounded-xl p-4 flex items-center gap-3">
              <div className="p-3 rounded-xl bg-purple-500/20">
                <MessageCircle size={20} className="text-purple-400" />
              </div>
              <div>
                <p className="font-medium text-sm">Live Chat</p>
                <p className="text-xs text-gray-400">Available 24/7</p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
