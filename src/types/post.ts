
// src/types/post.ts
export interface PostUser {
  _id?: string;
  username: string;
  email?: string;
  role?: string;
  profile?: {
    fullName?: string;
    profilePicture?: string;
    state?: string;
    city?: string;
    phone?: string;
  };
  // Legacy fields for backward compatibility
  profilePicture?: string;
  name?: string;
  location?: string;
  avatar?: string;
  rating?: number;
  verified?: boolean;
}

export interface PostComment {
  _id?: string;
  user: {
    _id?: string;
    username: string;
    profile?: {
      profilePicture?: string;
    };
  };
  text: string;
  createdAt: string;
}

export interface Post {
  id: string;
  _id?: string;
  title: string;
  description: string;
  user: PostUser;
  images: string[];
  skills: string[];
  likes: string[];
  comments: PostComment[];
  saves?: string[];
  views?: number;
  status?: string;
  type?: 'work' | 'job';
  priceRange?: {
    min: number;
    max: number;
  };
  budget?: {
    min: number;
    max: number;
  };
  location?: {
    state?: string;
    city?: string;
    address?: string;
  };
  timeAgo?: string;
  price?: string;
  createdAt: string;
  updatedAt?: string;
}
