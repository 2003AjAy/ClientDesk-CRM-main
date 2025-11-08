import axios from 'axios';
import { SentimentRequest, ProjectSentiment } from '../types/Sentiment';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const sentimentApi = {
  // Analyze project sentiment
  analyzeSentiment: async (data: SentimentRequest): Promise<ProjectSentiment> => {
    const response = await axios.post(`${API_BASE_URL}/api/ai/sentiment`, data);
    return response.data;
  },

  // Get project sentiment data
  getProjectSentiment: async (projectId: string): Promise<ProjectSentiment | null> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/ai/sentiment/${projectId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  // Update project sentiment (trigger analysis)
  updateProjectSentiment: async (projectId: string, clientName: string, messages: Array<{ text: string; date: string }>): Promise<ProjectSentiment> => {
    const response = await axios.post(`${API_BASE_URL}/api/ai/sentiment`, {
      projectId,
      clientName,
      messages
    });
    return response.data;
  }
};
