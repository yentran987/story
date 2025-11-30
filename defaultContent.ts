
import { LandingPageContent } from './types';

export const DEFAULT_LANDING_CONTENT: LandingPageContent = {
  general: {
    logoText: "StoryWeave",
    primaryColor: "indigo", // CSS class suffix reference or hex
    secondaryColor: "purple"
  },
  hero: {
    backgroundImage: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=2070&auto=format&fit=crop",
    badgeText: "The Future of Storytelling is Here",
    headlineStart: "Dream. Write.",
    headlineHighlight: "Inspire.",
    subheadline: "Weave your imagination into reality with AI-powered tools and a community of dreamers.",
    buttonRead: "Start Reading",
    buttonWrite: "Start Writing"
  },
  stats: {
    label1: "Stories",
    value1: "150k+",
    label2: "Readers",
    value2: "2M+",
    label3: "Authors",
    value3: "50k+"
  },
  trending: {
    title: "Trending Dreams"
  },
  features: {
    title: "Why StoryWeave?",
    subtitle: "Tools designed to turn your daydreams into bestsellers.",
    item1Title: "Dreamy Editor",
    item1Desc: "A distraction-free canvas enhanced with AI that understands your creative flow.",
    item2Title: "Community",
    item2Desc: "Connect with souls who share your passion. Feedback that helps you grow.",
    item3Title: "Immersive Reading",
    item3Desc: "Customize your reading experience to match the mood of the story."
  },
  cta: {
    backgroundImage: "https://www.transparenttextures.com/patterns/stardust.png",
    title: "Start Your Journey",
    description: "Join a sanctuary for imagination. Write, read, and dream with us.",
    buttonText: "Join for Free"
  }
};
