import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import Navbar from "./Navbar";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function FeaturePlatformPage({ platform, features, benefits, howItWorks, stats, cta }) {
  const { name, icon: PlatformIcon, tagline, checks, colors } = platform;

  return (
    <div className="min-h-screen bg-[#07091F] text-white">
      <Navbar />

      <div className="pt-24 pb-16">
        {/* HEADER */}
        <motion.div {...fadeInUp} className="text-center max-w-4xl mx-auto px-6 mb-16">
          <div className={`w-20 h-20 ${colors.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
            <PlatformIcon size={40} className="text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-6">{name} Growth</h1>
          <p className="text-xl text-gray-400 mb-8">{tagline}</p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
            {checks.map((check, i) => (
              <div key={i} className="flex items-center gap-2">
                <CheckCircle size={16} className="text-emerald-400" />
                <span>{check}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* FEATURES GRID */}
        <div className="max-w-7xl mx-auto px-6 mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                {...fadeInUp}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-2xl p-6 card-hover"
              >
                <div className={`w-12 h-12 ${colors.iconBg} rounded-xl flex items-center justify-center mb-4`}>
                  <feature.icon size={24} className={colors.iconText} />
                </div>
                <h3 className="text-lg font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* HOW IT WORKS */}
        <motion.div {...fadeInUp} transition={{ delay: 0.6 }} className="max-w-6xl mx-auto px-6 mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How {name} Growth Works</h2>
            <p className="text-gray-400">{howItWorks.tagline}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.steps.map((step, i) => (
              <div key={i} className="text-center">
                <div className={`w-16 h-16 ${colors.gradient} rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold`}>
                  {i + 1}
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* BENEFITS */}
        <div className="max-w-6xl mx-auto px-6 mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div {...fadeInUp} transition={{ delay: 0.7 }}>
              <h2 className="text-3xl font-bold mb-6">Why Choose {name} Growth?</h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle size={18} className="text-emerald-400 flex-shrink-0" />
                    <span className="text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div {...fadeInUp} transition={{ delay: 0.8 }}>
              <div className="glass rounded-2xl p-8 space-y-6">
                {stats.map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className={`text-4xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* CTA */}
        <motion.div {...fadeInUp} transition={{ delay: 0.9 }} className="text-center px-6">
          <div className="glass rounded-2xl p-8 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">{cta.title}</h2>
            <p className="text-gray-400 mb-6">{cta.description}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to={`/dashboard?platform=${name.toLowerCase()}`}
                className={`${colors.ctaGradient} hover:opacity-90 px-8 py-4 rounded-xl font-semibold shadow-glow transition-all duration-300`}
              >
                {cta.primary}
              </Link>
              <Link
                to={`/pricing/${name.toLowerCase()}`}
                className={`border border-white/20 ${colors.ctaBorderHover} px-8 py-4 rounded-xl font-semibold transition-all duration-300`}
              >
                {cta.secondary}
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}