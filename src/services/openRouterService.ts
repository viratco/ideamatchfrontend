import axios from 'axios';

import { API_URL } from '../config';

const API_BASE_URL = `${API_URL}/api`;

interface IdeaGenerationParams {
  userType: string;
  industries: string[];
  technicalSkills: string[];
  timeCommitment: string;
  riskLevel: string;
  challenges: string[];
  businessModel: string;
  budget: number[];
  suggestTrending: boolean;
  focusNiche?: string;
  suggestCompetitors: boolean;
  additionalContext?: string;
}

export const generateBusinessIdea = async (params: IdeaGenerationParams): Promise<string> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/generate-idea`, params);
    
    console.log("API Response:", response.data);
    
    if (!response.data) {
      throw new Error('Empty response from server');
    }
    
    if (typeof response.data === 'string') {
      return response.data;
    }
    
    if (response.data.error) {
      throw new Error(response.data.error);
    }
    
    throw new Error('Invalid response format - expected string data');
  } catch (error: any) {
    console.error('Error generating idea:', error);
    throw new Error(error.response?.data?.message || error.message || 'Failed to generate idea');
  }
};
