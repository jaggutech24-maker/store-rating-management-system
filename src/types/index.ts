export type Role = 'admin' | 'user' | 'store_owner';

export interface User {
  id: number;
  name: string;
  email: string;
  address: string;
  role: Role;
  createdAt?: string;
}

export interface Store {
  id: number;
  name: string;
  email: string;
  address: string;
  ownerId?: number;
  ownerName?: string;
  averageRating: number;
  totalRatings: number;
  userRating?: number | null;
}

export interface Rating {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  storeId: number;
  storeName?: string;
  rating: number;
  createdAt: string;
  updatedAt?: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalStores: number;
  totalRatings: number;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  address: string;
  role: Role;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  address: string;
  password: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  address: string;
  password: string;
  role: Role;
}

export interface CreateStoreData {
  name: string;
  email: string;
  address: string;
  ownerId?: number;
}

export interface UpdatePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

export interface FilterConfig {
  name?: string;
  email?: string;
  address?: string;
  role?: string;
}
