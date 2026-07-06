import { Twitter, Users, Heart, MessageCircle, TrendingUp, Target, BarChart3 } from "lucide-react";
import FeaturePlatformPage from "../components/FeaturePlatformPage";

const platform = {
  name: "X (Twitter)",
  icon: Twitter,
  tagline: "Amplify your voice on X with targeted followers and engagement that drives real conversations.",
  checks: ["Real X Users", "Organic Engagement", "Conversation Starter"],
  colors: {
    gradient: "bg-gradient-to-br from-sky-500 to-blue-600",
    iconBg: "bg-gradient-to-br from-sky-500/20 to-blue-500/20",
    iconText: "text-sky-400",
    ctaGradient: "bg-gradient-to-r from-sky-600 to-blue-600",
    ctaBorderHover: "hover:border-sky-500/50",
  }
};

const features = [
  {
    icon: Users,
    title: "Follower Growth",
    description: "Gain real followers who engage with content similar to yours and are active on X.",
  },
  {
    icon: Heart,
    title: "Like Boost",
    description: "Increase likes on your tweets to improve visibility and engagement metrics.",
  },
  {
    icon: MessageCircle,
    title: "Retweet Enhancement",
    description: "Boost retweets to expand your reach and amplify your message.",
  },
  {
    icon: TrendingUp,
    title: "Trending Potential",
    description: "Strategic delivery that can help your tweets gain traction and trend potential."
  },
  {
    icon: Target,
    title: "Audience Targeting",
    description: "Reach users interested in your topics, hashtags, and content categories."
  },
  {
    icon: BarChart3,
    title: "Engagement Analytics",
    description: "Track your X growth with detailed metrics and performance insights.",
  },
];

const benefits = [
  "Increase your tweet impressions and reach",
  "Build authority in your niche or industry",
  "Improve engagement rates and interaction",
  "Attract media attention and coverage",
  "Network with influencers and brands",
  "Establish thought leadership on X",
];

const howItWorks = {
  tagline: "Our strategic approach to X platform success",
  steps: [
    { title: "Choose Growth Type", description: "Select followers, likes, or retweets based on your X goals." },
    { title: "Share Profile Link", description: "Provide your X profile URL for targeted follower acquisition." },
    { title: "Build Influence", description: "Watch your X presence grow with engaged, relevant followers." },
  ],
};

const stats = [
  { value: "4.1x", label: "Average engagement boost", color: "text-sky-400" },
  { value: "78%", label: "Tweet visibility increase", color: "text-blue-400" },
  { value: "12hrs", label: "Average delivery time", color: "text-emerald-400" },
];

const cta = {
  title: "Ready to Grow on X?",
  description: "Join influencers and brands who have amplified their voice with PlutoBoost.",
  primary: "Start X Growth",
  secondary: "View Pricing",
};

export default function FeaturesX() {
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