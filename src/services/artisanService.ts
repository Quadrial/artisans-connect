// Artisan Service
const API_BASE_URL = import.meta.env.VITE_API_URL;

interface ArtisanFilters {
  search?: string;
  skills?: string;
  state?: string;
  city?: string;
  minRate?: number;
  maxRate?: number;
  minExperience?: number;
  sort?: string;
  page?: number;
  limit?: number;
}

class ArtisanService {
  private getAuthHeader() {
    const token = localStorage.getItem('craft_connect_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  }

  async getArtisans(filters?: ArtisanFilters) {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            queryParams.append(key, value.toString());
          }
        });
      }

      const url = `${API_BASE_URL}/artisans${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeader(),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to fetch artisans');
      }

      return result;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error. Please check your connection.');
    }
  }

  async getArtisanById(id: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/artisans/${id}`, {
        method: 'GET',
        headers: this.getAuthHeader(),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to fetch artisan');
      }

      return result.artisan;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error. Please check your connection.');
    }
  }

  async getSkills() {
    try {
      const response = await fetch(`${API_BASE_URL}/artisans/skills/list`, {
        method: 'GET',
        headers: this.getAuthHeader(),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to fetch skills');
      }

      return result.skills;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error. Please check your connection.');
    }
  }

  async getLocations() {
    try {
      const response = await fetch(`${API_BASE_URL}/artisans/locations/list`, {
        method: 'GET',
        headers: this.getAuthHeader(),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to fetch locations');
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

export const artisanService = new ArtisanService();
