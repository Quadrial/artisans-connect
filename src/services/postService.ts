// Post Service
const API_BASE_URL = import.meta.env.VITE_API_URL ;

interface PostData {
  title: string;
  description: string;
  images?: string[];
  skills?: string[];
  priceRange?: { min: number; max: number };
  budget?: { min: number; max: number };
  location?: {
    state: string;
    city: string;
    address?: string;
  };
  deadline?: string;
  jobType?: 'one-time' | 'ongoing' | 'contract';
  type: 'work' | 'job';
}

interface QueryParams {
  type?: 'work' | 'job';
  skills?: string;
  state?: string;
  city?: string;
  page?: number;
  limit?: number;
  sort?: string;
}

class PostService {
  private getAuthHeader() {
    const token = localStorage.getItem('craft_connect_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  async createPost(data: PostData) {
    try {
      const response = await fetch(`${API_BASE_URL}/posts`, {
        method: 'POST',
        headers: this.getAuthHeader(),
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to create post');
      }

      return result.post;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error. Please check your connection.');
    }
  }

  async getPosts(params?: QueryParams) {
    try {
      const queryString = new URLSearchParams(params as Record<string, string>).toString();
      const url = `${API_BASE_URL}/posts${queryString ? `?${queryString}` : ''}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeader(),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to fetch posts');
      }

      return result;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error. Please check your connection.');
    }
  }

  async toggleLike(id: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${id}/like`, {
        method: 'POST',
        headers: this.getAuthHeader(),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to toggle like');
      }

      return result;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error. Please check your connection.');
    }
  }

  async addComment(id: string, text: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${id}/comment`, {
        method: 'POST',
        headers: this.getAuthHeader(),
        body: JSON.stringify({ text }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to add comment');
      }

      return result.comments;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error. Please check your connection.');
    }
  }

  async toggleSave(id: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${id}/save`, {
        method: 'POST',
        headers: this.getAuthHeader(),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to toggle save');
      }

      return result;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error. Please check your connection.');
    }
  }

  async toggleShare(id: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${id}/share`, {
        method: 'POST',
        headers: this.getAuthHeader(),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to toggle share');
      }

      return result;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error. Please check your connection.');
    }
  }

  async deletePost(id: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeader(),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to delete post');
      }

      return result;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error. Please check your connection.');
    }
  }
}

export const postService = new PostService();
