import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
});

// Add interceptor to add token to requests
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const gamificationApi = {
  getProgress: () => api.get('/gamification/progress'),
  checkBadges: () => api.post('/gamification/check-badges'),
};

export const assetsApi = {
  getNetWorth: (userId: number) => api.get(`/assets/user/${userId}/net-worth`),
  getFIREStatus: (userId: number, annualExpenses: number) => api.post(`/assets/user/${userId}/fire-status`, { annualExpenses }),
  getOptimalAllocation: (userId: number) => api.get(`/assets/user/${userId}/optimal-allocation`),
  getAll: (userId: number) => api.get(`/assets/user/${userId}`),
};

export const transactionsApi = {
  getAll: (userId: number) => api.get(`/transactions/user/${userId}`),
};

export const aiApi = {
  getAdvice: (userData: any, userQuestion: string) => api.post('/ai/advice', { userData, userQuestion }),
  analyzeHabits: (transactions: any[]) => api.post('/ai/analyze-habits', { transactions }),
  getPsychologicalAdvice: (userData: any) => api.post('/ai/psychological-advice', { userData }),
};

export default api;
