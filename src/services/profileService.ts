// Profile Service
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface ProfileData {
  fullName: string;
  phone: string;
  state: string;
  city: string;
  address: string;
  profession: string;
  bio: string;
  hourlyRate: string;
  yearsOfExperience: string;
  skills: string[];
  latitude?: number;
  longitude?: number;
}

class ProfileService {
  private getAuthHeader() {
    const token = localStorage.getItem('craft_connect_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  async getProfile() {
    try {
      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: 'GET',
        headers: this.getAuthHeader(),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to fetch profile');
      }

      return result.profile;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error. Please check your connection.');
    }
  }

  async updateProfile(data: ProfileData) {
    try {
      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: 'PUT',
        headers: this.getAuthHeader(),
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to update profile');
      }

      return result.profile;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error. Please check your connection.');
    }
  }

  async uploadProfilePhoto(photoData: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/profile/upload-photo`, {
        method: 'POST',
        headers: this.getAuthHeader(),
        body: JSON.stringify({ photoData }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to upload photo');
      }

      return result.profilePicture;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error. Please check your connection.');
    }
  }
}

const profileService = new ProfileService();
export default profileService;
