/**
 * ============================================================
 * API SERVICE - CONNECT TO REAL BACKEND HERE
 * ============================================================
 *
 * HOW TO CONNECT BACKEND WITH FRONTEND:
 *
 * 1. Install axios: npm install axios
 * 2. Set your backend URL in .env file:
 *    VITE_API_URL=http://localhost:3000/api
 * 3. Replace the mock functions below with real axios calls
 *
 * EXAMPLE:
 *   // Instead of: return mockApi.login(email, password)
 *   // Use:        return axios.post('/auth/login', { email, password }).then(r => r.data)
 *
 * The backend should expose these REST endpoints:
 *
 * POST   /api/auth/login          - Login
 * POST   /api/auth/register       - Register (normal user)
 * PUT    /api/auth/password        - Update password (authenticated)
 *
 * GET    /api/admin/stats          - Dashboard stats (admin only)
 * GET    /api/users                - List all users (admin only)
 * GET    /api/users/:id            - Get user by ID (admin only)
 * POST   /api/users                - Create user (admin only)
 *
 * GET    /api/stores               - List all stores
 * POST   /api/stores               - Create store (admin only)
 * GET    /api/stores/:id           - Get store by ID
 *
 * GET    /api/ratings/store/:id    - Get ratings for a store
 * POST   /api/ratings              - Submit/update rating (user)
 *
 * GET    /api/store-owner/dashboard - Store owner dashboard
 *
 * ============================================================
 */

import axios from 'axios';
import { mockApi } from './mockData';

// ─── Configuration ───────────────────────────────────────────
const API_URL = import.meta.env.VITE_API_URL || '';
const USE_MOCK = !API_URL; // Use mock data when no backend URL is set

// ─── Axios Instance ──────────────────────────────────────────
const apiClient = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Add auth token to every request
apiClient.interceptors.request.use((config) => {
  const userData = localStorage.getItem('auth_user');
  if (userData) {
    const { token } = JSON.parse(userData);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors globally
apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('auth_user');
      window.location.href = '/login';
    }
    return Promise.reject(err.response?.data?.message || err.message);
  }
);

// ─── Auth Services ───────────────────────────────────────────
export const authService = {
  login: async (email: string, password: string) => {
    if (USE_MOCK) return mockApi.login(email, password);
    const { data } = await apiClient.post('/auth/login', { email, password });
    return data;
  },

  register: async (payload: {
    name: string;
    email: string;
    address: string;
    password: string;
  }) => {
    if (USE_MOCK) return mockApi.register(payload);
    const { data } = await apiClient.post('/auth/register', payload);
    return data;
  },

  updatePassword: async (userId: number, currentPassword: string, newPassword: string) => {
    if (USE_MOCK) return mockApi.updatePassword(userId, currentPassword, newPassword);
    const { data } = await apiClient.put('/auth/password', { currentPassword, newPassword });
    return data;
  },
};

// ─── Admin Services ──────────────────────────────────────────
export const adminService = {
  getDashboardStats: async () => {
    if (USE_MOCK) return mockApi.getDashboardStats();
    const { data } = await apiClient.get('/admin/stats');
    return data;
  },
};

// ─── User Services ───────────────────────────────────────────
export const userService = {
  getUsers: async () => {
    if (USE_MOCK) return mockApi.getUsers();
    const { data } = await apiClient.get('/users');
    return data;
  },

  getUserById: async (id: number) => {
    if (USE_MOCK) return mockApi.getUserById(id);
    const { data } = await apiClient.get(`/users/${id}`);
    return data;
  },

  createUser: async (payload: {
    name: string;
    email: string;
    address: string;
    password: string;
    role: string;
  }) => {
    if (USE_MOCK) return mockApi.createUser(payload);
    const { data } = await apiClient.post('/users', payload);
    return data;
  },
};

// ─── Store Services ──────────────────────────────────────────
export const storeService = {
  getStores: async (userId?: number) => {
    if (USE_MOCK) return mockApi.getStores(userId);
    const { data } = await apiClient.get('/stores', { params: { userId } });
    return data;
  },

  getStoreById: async (id: number) => {
    if (USE_MOCK) return mockApi.getStoreById(id);
    const { data } = await apiClient.get(`/stores/${id}`);
    return data;
  },

  createStore: async (payload: {
    name: string;
    email: string;
    address: string;
    ownerId?: number;
  }) => {
    if (USE_MOCK) return mockApi.createStore(payload);
    const { data } = await apiClient.post('/stores', payload);
    return data;
  },
};

// ─── Rating Services ─────────────────────────────────────────
export const ratingService = {
  getRatingsByStore: async (storeId: number) => {
    if (USE_MOCK) return mockApi.getRatingsByStore(storeId);
    const { data } = await apiClient.get(`/ratings/store/${storeId}`);
    return data;
  },

  submitRating: async (userId: number, storeId: number, rating: number) => {
    if (USE_MOCK) return mockApi.submitRating(userId, storeId, rating);
    const { data } = await apiClient.post('/ratings', { userId, storeId, rating });
    return data;
  },
};

// ─── Store Owner Services ────────────────────────────────────
export const storeOwnerService = {
  getDashboard: async (ownerId: number) => {
    if (USE_MOCK) return mockApi.getStoreOwnerDashboard(ownerId);
    const { data } = await apiClient.get('/store-owner/dashboard');
    return data;
  },
};
