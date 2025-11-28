
export enum View {
  LANDING = 'LANDING',
  BROWSE = 'BROWSE',
  STORY_DETAIL = 'STORY_DETAIL',
  READING = 'READING',
  EDITOR = 'EDITOR',
  AUTH = 'AUTH',
  PROFILE = 'PROFILE',
  LIBRARY = 'LIBRARY',
  ADMIN_LOGIN = 'ADMIN_LOGIN',
  CMS = 'CMS',
  AUTHOR_DASHBOARD = 'AUTHOR_DASHBOARD'
}

export interface Chapter {
  id: string;
  title: string;
  content: string;
}

export interface Story {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  genre: string;
  tags: string[];
  summary: string;
  rating: number;
  views: number;
  chapters: Chapter[];
  completed: boolean;
  isSaved?: boolean; // UI state helper
}

export enum ThemeMode {
  LIGHT = 'light',
  DARK = 'dark',
  SEPIA = 'sepia'
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  isAuthor: boolean;
  isAdmin?: boolean;
}

export interface AIResponse {
  text: string;
  tags?: string[];
  suggestions?: string[];
}

// CMS Content Types
export interface LandingPageContent {
  general: {
    logoText: string;
    primaryColor: string;
    secondaryColor: string;
  };
  hero: {
    backgroundImage: string;
    badgeText: string;
    headlineStart: string;
    headlineHighlight: string;
    subheadline: string;
    buttonRead: string;
    buttonWrite: string;
  };
  stats: {
    label1: string;
    value1: string;
    label2: string;
    value2: string;
    label3: string;
    value3: string;
  };
  trending: {
    title: string;
  };
  features: {
    title: string;
    subtitle: string;
    item1Title: string;
    item1Desc: string;
    item2Title: string;
    item2Desc: string;
    item3Title: string;
    item3Desc: string;
  };
  cta: {
    backgroundImage: string;
    title: string;
    description: string;
    buttonText: string;
  };
}
