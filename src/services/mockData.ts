import { User, Store, Rating, DashboardStats } from '../types';

// ============================================================
// MOCK DATA - Replace API calls with real backend calls
// ============================================================

export let mockUsers: User[] = [
  {
    id: 1,
    name: 'System Administrator Account',
    email: 'admin@storerate.com',
    address: '123 Admin Street, New York, NY 10001, United States of America',
    role: 'admin',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    name: 'John Michael Thompson Junior',
    email: 'john.thompson@email.com',
    address: '456 Oak Avenue, Los Angeles, CA 90001, United States of America',
    role: 'user',
    createdAt: '2024-01-15T00:00:00Z',
  },
  {
    id: 3,
    name: 'Sarah Elizabeth Johnson Williams',
    email: 'sarah.johnson@email.com',
    address: '789 Pine Road, Chicago, IL 60601, United States of America',
    role: 'user',
    createdAt: '2024-01-20T00:00:00Z',
  },
  {
    id: 4,
    name: 'Robert James Anderson Store',
    email: 'robert.anderson@techstore.com',
    address: '321 Tech Boulevard, San Francisco, CA 94101, United States',
    role: 'store_owner',
    createdAt: '2024-02-01T00:00:00Z',
  },
  {
    id: 5,
    name: 'Emily Rose Martinez Fashion',
    email: 'emily.martinez@fashionboutique.com',
    address: '654 Fashion Lane, Miami, FL 33101, United States of America',
    role: 'store_owner',
    createdAt: '2024-02-10T00:00:00Z',
  },
  {
    id: 6,
    name: 'Michael David Brown Coffee',
    email: 'michael.brown@coffeehouse.com',
    address: '987 Coffee Street, Seattle, WA 98101, United States of America',
    role: 'store_owner',
    createdAt: '2024-02-15T00:00:00Z',
  },
  {
    id: 7,
    name: 'Amanda Christine Wilson Davis',
    email: 'amanda.wilson@email.com',
    address: '147 Maple Drive, Austin, TX 78701, United States of America',
    role: 'user',
    createdAt: '2024-03-01T00:00:00Z',
  },
  {
    id: 8,
    name: 'Christopher Lee Jackson Admin',
    email: 'chris.jackson@storerate.com',
    address: '258 Admin Boulevard, Boston, MA 02101, United States of America',
    role: 'admin',
    createdAt: '2024-03-05T00:00:00Z',
  },
];

export let mockStores: Store[] = [
  {
    id: 1,
    name: 'Robert Anderson Tech Electronics Store',
    email: 'robert.anderson@techstore.com',
    address: '321 Tech Boulevard, San Francisco, CA 94101, United States',
    ownerId: 4,
    ownerName: 'Robert James Anderson Store',
    averageRating: 4.2,
    totalRatings: 15,
    userRating: null,
  },
  {
    id: 2,
    name: 'Emily Martinez Fashion Boutique Shop',
    email: 'emily.martinez@fashionboutique.com',
    address: '654 Fashion Lane, Miami, FL 33101, United States of America',
    ownerId: 5,
    ownerName: 'Emily Rose Martinez Fashion',
    averageRating: 3.8,
    totalRatings: 22,
    userRating: null,
  },
  {
    id: 3,
    name: 'Michael Brown Premium Coffee House',
    email: 'michael.brown@coffeehouse.com',
    address: '987 Coffee Street, Seattle, WA 98101, United States of America',
    ownerId: 6,
    ownerName: 'Michael David Brown Coffee',
    averageRating: 4.7,
    totalRatings: 38,
    userRating: null,
  },
  {
    id: 4,
    name: 'Downtown Fresh Grocery Market Place',
    email: 'downtown.grocery@market.com',
    address: '555 Market Street, Denver, CO 80201, United States of America',
    averageRating: 4.0,
    totalRatings: 12,
    userRating: null,
  },
  {
    id: 5,
    name: 'Sunrise Organic Health Food Store',
    email: 'sunrise.organic@healthfood.com',
    address: '222 Organic Lane, Portland, OR 97201, United States of America',
    averageRating: 4.5,
    totalRatings: 28,
    userRating: null,
  },
];

export let mockRatings: Rating[] = [
  {
    id: 1,
    userId: 2,
    userName: 'John Michael Thompson Junior',
    userEmail: 'john.thompson@email.com',
    storeId: 1,
    storeName: 'Robert Anderson Tech Electronics Store',
    rating: 4,
    createdAt: '2024-03-10T10:00:00Z',
  },
  {
    id: 2,
    userId: 3,
    userName: 'Sarah Elizabeth Johnson Williams',
    userEmail: 'sarah.johnson@email.com',
    storeId: 1,
    storeName: 'Robert Anderson Tech Electronics Store',
    rating: 5,
    createdAt: '2024-03-11T11:00:00Z',
  },
  {
    id: 3,
    userId: 7,
    userName: 'Amanda Christine Wilson Davis',
    userEmail: 'amanda.wilson@email.com',
    storeId: 1,
    storeName: 'Robert Anderson Tech Electronics Store',
    rating: 4,
    createdAt: '2024-03-12T09:00:00Z',
  },
  {
    id: 4,
    userId: 2,
    userName: 'John Michael Thompson Junior',
    userEmail: 'john.thompson@email.com',
    storeId: 3,
    storeName: 'Michael Brown Premium Coffee House',
    rating: 5,
    createdAt: '2024-03-13T14:00:00Z',
  },
  {
    id: 5,
    userId: 3,
    userName: 'Sarah Elizabeth Johnson Williams',
    userEmail: 'sarah.johnson@email.com',
    storeId: 2,
    storeName: 'Emily Martinez Fashion Boutique Shop',
    rating: 3,
    createdAt: '2024-03-14T16:00:00Z',
  },
];

// Password store (for mock auth)
export const mockPasswords: Record<number, string> = {
  1: 'Admin@123456',
  2: 'User@123456',
  3: 'User@123456',
  4: 'Owner@123456',
  5: 'Owner@123456',
  6: 'Owner@123456',
  7: 'User@123456',
  8: 'Admin@123456',
};

let nextUserId = 9;
let nextStoreId = 6;
let nextRatingId = 6;

// ============================================================
// MOCK API FUNCTIONS
// These simulate backend API calls. Replace with real API calls.
// ============================================================

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const mockApi = {
  // AUTH
  login: async (email: string, password: string) => {
    await delay(500);
    const user = mockUsers.find((u) => u.email === email);
    if (!user) throw new Error('Invalid email or password');
    if (mockPasswords[user.id] !== password) throw new Error('Invalid email or password');
    return { ...user, token: `mock-token-${user.id}-${Date.now()}` };
  },

  register: async (data: { name: string; email: string; address: string; password: string }) => {
    await delay(500);
    if (mockUsers.find((u) => u.email === data.email)) {
      throw new Error('Email already in use');
    }
    const newUser: User = {
      id: nextUserId++,
      name: data.name,
      email: data.email,
      address: data.address,
      role: 'user',
      createdAt: new Date().toISOString(),
    };
    mockUsers.push(newUser);
    mockPasswords[newUser.id] = data.password;
    return { ...newUser, token: `mock-token-${newUser.id}-${Date.now()}` };
  },

  updatePassword: async (userId: number, currentPassword: string, newPassword: string) => {
    await delay(400);
    if (mockPasswords[userId] !== currentPassword) {
      throw new Error('Current password is incorrect');
    }
    mockPasswords[userId] = newPassword;
    return { success: true };
  },

  // STATS
  getDashboardStats: async (): Promise<DashboardStats> => {
    await delay(300);
    return {
      totalUsers: mockUsers.length,
      totalStores: mockStores.length,
      totalRatings: mockRatings.length,
    };
  },

  // USERS
  getUsers: async () => {
    await delay(300);
    return [...mockUsers];
  },

  getUserById: async (id: number) => {
    await delay(200);
    const user = mockUsers.find((u) => u.id === id);
    if (!user) throw new Error('User not found');
    const store = mockStores.find((s) => s.ownerId === id);
    return { ...user, store };
  },

  createUser: async (data: {
    name: string;
    email: string;
    address: string;
    password: string;
    role: string;
  }) => {
    await delay(500);
    if (mockUsers.find((u) => u.email === data.email)) {
      throw new Error('Email already in use');
    }
    const newUser: User = {
      id: nextUserId++,
      name: data.name,
      email: data.email,
      address: data.address,
      role: data.role as any,
      createdAt: new Date().toISOString(),
    };
    mockUsers.push(newUser);
    mockPasswords[newUser.id] = data.password;
    return newUser;
  },

  // STORES
  getStores: async (userId?: number) => {
    await delay(300);
    return mockStores.map((store) => {
      const userRating = userId
        ? mockRatings.find((r) => r.storeId === store.id && r.userId === userId)
        : null;
      // Recalculate average
      const storeRatings = mockRatings.filter((r) => r.storeId === store.id);
      const avg = storeRatings.length
        ? storeRatings.reduce((sum, r) => sum + r.rating, 0) / storeRatings.length
        : 0;
      return {
        ...store,
        averageRating: Math.round(avg * 10) / 10,
        totalRatings: storeRatings.length,
        userRating: userRating ? userRating.rating : null,
      };
    });
  },

  getStoreById: async (id: number) => {
    await delay(200);
    const store = mockStores.find((s) => s.id === id);
    if (!store) throw new Error('Store not found');
    return store;
  },

  createStore: async (data: { name: string; email: string; address: string; ownerId?: number }) => {
    await delay(500);
    const newStore: Store = {
      id: nextStoreId++,
      name: data.name,
      email: data.email,
      address: data.address,
      ownerId: data.ownerId,
      ownerName: data.ownerId
        ? mockUsers.find((u) => u.id === data.ownerId)?.name
        : undefined,
      averageRating: 0,
      totalRatings: 0,
      userRating: null,
    };
    mockStores.push(newStore);
    return newStore;
  },

  // RATINGS
  getRatingsByStore: async (storeId: number) => {
    await delay(300);
    return mockRatings.filter((r) => r.storeId === storeId);
  },

  submitRating: async (userId: number, storeId: number, rating: number) => {
    await delay(400);
    const user = mockUsers.find((u) => u.id === userId);
    const store = mockStores.find((s) => s.id === storeId);
    const existingIdx = mockRatings.findIndex(
      (r) => r.userId === userId && r.storeId === storeId
    );
    if (existingIdx >= 0) {
      mockRatings[existingIdx] = {
        ...mockRatings[existingIdx],
        rating,
        updatedAt: new Date().toISOString(),
      };
      return mockRatings[existingIdx];
    } else {
      const newRating: Rating = {
        id: nextRatingId++,
        userId,
        userName: user?.name || 'Unknown',
        userEmail: user?.email || 'unknown@email.com',
        storeId,
        storeName: store?.name,
        rating,
        createdAt: new Date().toISOString(),
      };
      mockRatings.push(newRating);
      return newRating;
    }
  },

  getStoreOwnerDashboard: async (ownerId: number) => {
    await delay(400);
    const store = mockStores.find((s) => s.ownerId === ownerId);
    if (!store) throw new Error('No store found for this owner');
    const ratings = mockRatings.filter((r) => r.storeId === store.id);
    const avg = ratings.length
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
      : 0;
    return {
      store: {
        ...store,
        averageRating: Math.round(avg * 10) / 10,
        totalRatings: ratings.length,
      },
      ratings,
    };
  },
};
