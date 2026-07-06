import { Instagram, Users, Heart, TrendingUp, Zap, Target, BarChart3 } from "lucide-react";
import FeaturePlatformPage from "../components/FeaturePlatformPage";

const platform = {
  name: "Instagram",
  icon: Instagram,
  tagline: "Supercharge your Instagram presence with targeted follower growth and engagement.",
  checks: ["Real & Active Followers", "Organic Engagement", "Algorithm Friendly"],
  colors: {
    gradient: "bg-gradient-to-br from-pink-500 to-purple-600",
    iconBg: "bg-gradient-to-br from-pink-500/20 to-purple-500/20",
    iconText: "text-pink-400",
    ctaGradient: "bg-gradient-to-r from-pink-600 to-purple-600",
    ctaBorderHover: "hover:border-purple-500/50",
  }
};

const features = [
  {
    icon: Users,
    title: "Real Follower Growth",
    description: "Get genuine followers from active Instagram users who engage with similar content.",
  },
  {
    icon: Heart,
    title: "Organic Engagement",
    description: "Increase likes and comments naturally to boost your post visibility and reach.",
  },
  {
    icon: TrendingUp,
    title: "Algorithm Boost",
    description: "Our strategic delivery helps your content perform better in Instagram's algorithm.",
  },
  {
    icon: Target,
    title: "Precise Targeting",
    description: "Reach followers who are genuinely interested in your niche and content style."
  },
  {
    icon: BarChart3,
    title: "Detailed Analytics",
    description: "Track your growth progress with comprehensive analytics and insights."
  },
  {
    icon: Zap,
    title: "Instant Results",
    description: "See immediate improvements in your follower count and engagement rates.",
  },
];

const benefits = [
  "Increase your Instagram reach and visibility",
  "Build credibility with a larger follower base",
  "Improve engagement rates on your posts",
  "Attract brand partnerships and collaborations",
  "Convert followers into loyal customers",
  "Stand out in your niche with social proof",
];

const howItWorks = {
  tagline: "Our proven 3-step process for Instagram success",
  steps: [
    { title: "Choose Your Package", description: "Select the perfect follower package for your Instagram goals." },
    { title: "Provide Your Link", description: "Simply share your Instagram profile link - we handle the rest." },
    { title: "Watch Growth Happen", description: "See your follower count increase naturally over time." },
  ],
};

const stats = [
  { value: "2.5x", label: "Average engagement increase", color: "text-pink-400" },
  { value: "85%", label: "Client retention rate", color: "text-purple-400" },
  { value: "24hrs", label: "Average delivery time", color: "text-emerald-400" },
];

const cta = {
  title: "Ready to Grow Your Instagram?",
  description: "Join thousands of creators who have transformed their Instagram presence with PlutoBoost.",
  primary: "Start Instagram Growth",
  secondary: "View Pricing",
};

export default function FeaturesInstagram() {
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