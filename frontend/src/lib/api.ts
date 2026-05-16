import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
});

export const dashboardApi = {
  getOverview: (userId: number) => api.get(`/users/${userId}`),
  getHealth: (userId: number) => api.get(`/users/${userId}/babylonian-health`),
};

export const portfolioApi = {
  getAssets: (userId: number) => api.get(`/assets/user/${userId}`),
  getNetWorth: (userId: number) => api.get(`/assets/user/${userId}/net-worth`),
  simulateDCA: (data: any) => api.post('/assets/simulate-dca', data),
};

export const aiApi = {
  getAdvice: (userData: any, userQuestion: string) => api.post('/ai/advice', { userData, userQuestion }),
  analyzeHabits: (transactions: any[]) => api.post('/ai/analyze-habits', { transactions }),
};

export default api;
