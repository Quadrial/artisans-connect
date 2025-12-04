
// src/types/post.ts
export interface Post {
  id: string;
  title: string;
  description: string;
  user: {
    username: string;
    profilePicture?: string;
    name?: string;
    role?: string;
    location?: string;
    avatar?: string; // Added avatar property
    rating?: number;
    verified?: boolean;
  };
  images: string[];
  skills: string[];
  likes: string[];
  comments: any[];
  timeAgo?: string;
  price?: string;
  createdAt: string;
}
