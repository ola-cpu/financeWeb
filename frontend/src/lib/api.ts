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
  create: (data: any) => api.post('/assets', data),
  update: (id: number, data: any) => api.put(`/assets/${id}`, data),
  delete: (id: number) => api.delete(`/assets/${id}`),
};

export const transactionsApi = {
  getAll: (userId: number) => api.get(`/transactions/user/${userId}`),
  create: (data: any) => api.post('/transactions', data),
  update: (id: number, data: any) => api.put(`/transactions/${id}`, data),
  delete: (id: number) => api.delete(`/transactions/${id}`),
};

export const budgetApi = {
  getAll: (userId: number) => api.get(`/budget?userId=${userId}`),
  getStatus: (userId: number, month: number, year: number) =>
    api.get(`/budget/status?userId=${userId}&month=${month}&year=${year}`),
  create: (data: any) => api.post('/budget', data),
  update: (id: number, data: any) => api.put(`/budget/${id}`, data),
  delete: (id: number) => api.delete(`/budget/${id}`),
};

export const savingsApi = {
  getAll: (userId: number) => api.get(`/savings?userId=${userId}`),
  create: (data: any) => api.post('/savings', data),
  update: (id: number, data: any) => api.put(`/savings/${id}`, data),
  delete: (id: number) => api.delete(`/savings/${id}`),
  deposit: (id: number, amount: number) => api.post(`/savings/${id}/deposit`, { amount }),
};

export const tontinesApi = {
  getAll: (userId: number) => api.get(`/tontines?userId=${userId}`),
  create: (data: any) => api.post('/tontines', data),
  update: (id: number, data: any) => api.put(`/tontines/${id}`, data),
  delete: (id: number) => api.delete(`/tontines/${id}`),
  addMember: (id: number, data: any) => api.post(`/tontines/${id}/members`, data),
  markPayoutDone: (memberId: number) => api.post(`/tontines/members/${memberId}/payout`),
};

export const cryptoApi = {
  getPortfolio: (userId: number) => api.get(`/crypto/portfolio?userId=${userId}`),
  create: (data: any) => api.post('/crypto', data),
  update: (id: number, data: any) => api.put(`/crypto/${id}`, data),
  delete: (id: number) => api.delete(`/crypto/${id}`),
};

export const usersApi = {
  getDashboardSummary: (userId: number) => api.get(`/users/${userId}/dashboard-summary`),
};

export const aiApi = {
  getAdvice: (userData: any, userQuestion: string) => api.post('/ai/advice', { userData, userQuestion }),
  analyzeHabits: (transactions: any[]) => api.post('/ai/analyze-habits', { transactions }),
  analyzeExpenses: (transactions: any[]) => api.post('/ai/analyze-expenses', { transactions }),
  getBudgetAlerts: (budgetStatus: any[]) => api.post('/ai/budget-alerts', { budgetStatus }),
  getPsychologicalAdvice: (userData: any) => api.post('/ai/psychological-advice', { userData }),
};

export const axiosInstance = api;
export default api;
