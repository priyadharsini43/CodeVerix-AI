import { create } from 'zustand';
import { User } from '../types';
import { apiClient } from '../lib/api-client';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: Boolean(user),
      isLoading: false,
    }),

  checkAuth: async () => {
    try {
      set({ isLoading: true });
      const user = await apiClient<User>('/users/me');
      set({ user, isAuthenticated: Boolean(user), isLoading: false });
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  logout: async () => {
    try {
      await apiClient('/auth/logout', { method: 'POST', body: JSON.stringify({}) });
    } catch {
      // Ignore logout API errors
    } finally {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
