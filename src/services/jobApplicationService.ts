// Job Application Service
const API_BASE_URL = import.meta.env.VITE_API_URL;

interface JobApplicationData {
  coverLetter: string;
  proposedPrice: number;
  estimatedDuration: string;
  portfolio?: string[];
}

class JobApplicationService {
  private getAuthHeader() {
    const token = localStorage.getItem('craft_connect_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  async applyForJob(jobId: string, data: JobApplicationData) {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/apply`, {
        method: 'POST',
        headers: this.getAuthHeader(),
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to submit application');
      }

      return result.application;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error. Please check your connection.');
    }
  }

  async getJobApplications(jobId: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/applications`, {
        method: 'GET',
        headers: this.getAuthHeader(),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to fetch applications');
      }

      return result;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error. Please check your connection.');
    }
  }

  async getMyApplications() {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs/my-applications`, {
        method: 'GET',
        headers: this.getAuthHeader(),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to fetch applications');
      }

      return result.applications;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error. Please check your connection.');
    }
  }

  async updateApplicationStatus(applicationId: string, status: 'accepted' | 'rejected') {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs/applications/${applicationId}`, {
        method: 'PUT',
        headers: this.getAuthHeader(),
        body: JSON.stringify({ status }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to update application');
      }

      return result.application;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error. Please check your connection.');
    }
  }

  async withdrawApplication(applicationId: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs/applications/${applicationId}`, {
        method: 'DELETE',
        headers: this.getAuthHeader(),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to withdraw application');
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

export const jobApplicationService = new JobApplicationService();
