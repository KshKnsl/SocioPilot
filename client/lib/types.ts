export interface User {
  email: string;
  brand?: Brand;
  providers?: string[];
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  twitterConnected: boolean;
}

export interface Post {
  _id: string;
  content: string;
  platform: string;
  status: string;
  scheduledFor?: string;
  createdAt: string;
  updatedAt?: string;
  topic?: string;
  imageFilename?: string;
  platformPostId?: string;
  publishError?: string;
  brand?: Brand;
  editing?: boolean;
  editingScheduledFor?: string;
}

export interface Brand {
  title: string;
  description: string;
  style: string[];
}

export interface Config {
  topic: string;
  tone: string;
  platforms: string;
  numPosts: number;
  numIdeas: number;
  additionalInstructions: string;
  topicCount: number;
  language: string;
  generateImages: boolean;
  model: string;
  topicsPromptExpansion: string;
  postsPromptExpansion: string;
}


export interface GenerateResponse {
  posts: Post[];
  topics?: string[];
  ideas?: string[];
}

export interface PlatformIconProps {
  platform?: string | null;
  size?: number;
  className?: string;
}

export type AuthAction = 'login' | 'register';

export interface QueueStatsResponse {
  queue: {
    waiting: number;
    active: number;
    delayed: number;
    completed: number;
    failed: number;
  };
  posts: {
    draft: number;
    scheduled: number;
    posted: number;
    failed: number;
  };
}