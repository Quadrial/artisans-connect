// Message Service
const API_BASE_URL = import.meta.env.VITE_API_URL;

class MessageService {
  private getAuthHeader() {
    const token = localStorage.getItem('craft_connect_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  async getConversations() {
    try {
      const response = await fetch(`${API_BASE_URL}/messages/conversations`, {
        method: 'GET',
        headers: this.getAuthHeader(),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to fetch conversations');
      }

      return result.conversations;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error. Please check your connection.');
    }
  }

  async getMessages(userId: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/messages/conversation/${userId}`, {
        method: 'GET',
        headers: this.getAuthHeader(),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to fetch messages');
      }

      return result;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error. Please check your connection.');
    }
  }

  async sendMessage(receiverId: string, content: string, type = 'text', attachments = []) {
    try {
      const response = await fetch(`${API_BASE_URL}/messages/send`, {
        method: 'POST',
        headers: this.getAuthHeader(),
        body: JSON.stringify({ receiverId, content, type, attachments }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to send message');
      }

      return result.message;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error. Please check your connection.');
    }
  }

  async markAsRead(conversationId: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/messages/read/${conversationId}`, {
        method: 'PUT',
        headers: this.getAuthHeader(),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to mark as read');
      }

      return result;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error. Please check your connection.');
    }
  }

  async getUnreadCount() {
    try {
      const response = await fetch(`${API_BASE_URL}/messages/unread-count`, {
        method: 'GET',
        headers: this.getAuthHeader(),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to get unread count');
      }

      return result.count;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error. Please check your connection.');
    }
  }
}

export const messageService = new MessageService();
