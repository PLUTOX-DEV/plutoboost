import { Youtube, Eye, ThumbsUp, Users, TrendingUp, Target, BarChart3 } from "lucide-react";
import FeaturePlatformPage from "../components/FeaturePlatformPage";

const platform = {
  name: "YouTube",
  icon: Youtube,
  tagline: "Accelerate your YouTube channel growth with targeted views, subscribers, and engagement.",
  checks: ["Real YouTube Views", "Active Subscribers", "Algorithm Friendly"],
  colors: {
    gradient: "bg-gradient-to-br from-red-500 to-red-600",
    iconBg: "bg-gradient-to-br from-red-500/20 to-red-600/20",
    iconText: "text-red-400",
    ctaGradient: "bg-gradient-to-r from-red-600 to-red-700",
    ctaBorderHover: "hover:border-red-500/50",
  }
};

const features = [
  {
    icon: Users,
    title: "Subscriber Growth",
    description: "Gain real subscribers who are genuinely interested in your content and niche.",
  },
  {
    icon: Eye,
    title: "View Boost",
    description: "Increase video views to improve your channel's visibility in YouTube search and recommendations.",
  },
  {
    icon: ThumbsUp,
    title: "Like Enhancement",
    description: "Boost likes to improve your video's engagement rate and algorithm performance.",
  },
  {
    icon: TrendingUp,
    title: "Algorithm Optimization",
    description: "Our delivery methods are designed to work with YouTube's algorithm for maximum impact."
  },
  {
    icon: Target,
    title: "Niche Targeting",
    description: "Reach viewers who are most likely to engage with your content type and topic."
  },
  {
    icon: BarChart3,
    title: "Performance Tracking",
    description: "Monitor your growth with detailed analytics and progress reports.",
  },
];

const benefits = [
  "Improve your YouTube search rankings",
  "Increase video visibility in recommendations",
  "Build credibility with subscriber growth",
  "Attract brand deals and sponsorships",
  "Expand your audience reach globally",
  "Boost overall channel engagement metrics",
];

const howItWorks = {
  tagline: "Our proven process for YouTube channel success",
  steps: [
    { title: "Select Your Service", description: "Choose from subscribers, views, or likes based on your goals." },
    { title: "Share Video Link", description: "Provide your YouTube video or channel URL for targeted growth." },
    { title: "Watch Metrics Rise", description: "See your views, subscribers, and engagement grow organically." },
  ],
};

const stats = [
  { value: "3.2x", label: "Average view increase", color: "text-red-400" },
  { value: "92%", label: "Algorithm improvement", color: "text-red-400" },
  { value: "48hrs", label: "Average delivery time", color: "text-emerald-400" },
];

const cta = {
  title: "Ready to Grow Your YouTube Channel?",
  description: "Join successful YouTubers who have transformed their channels with PlutoBoost.",
  primary: "Start YouTube Growth",
  secondary: "View Pricing",
};

export default function FeaturesYoutube() {
  return (
    <FeaturePlatformPage
      platform={platform}
      features={features}
      benefits={benefits}
      howItWorks={howItWorks}
      stats={stats}
      cta={cta}
    />
  );
}