import { create } from 'zustand';
import * as Keychain from 'react-native-keychain';

const KEYCHAIN_SERVICE = 'com.apyqs.auth';

export type User = {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;

  // Profile fields stored directly in the user table
  branchName?: string | null;
  branchCode?: string | null;
  yearOfGate?: number | null;

  emailVerified?: boolean;

  createdAt?: string | Date;
  updatedAt?: string | Date;
};

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isRestoring: boolean;

  setAuth: (user: User) => void;
  clearAuth: () => void;
  logout: () => Promise<void>;

  setLoading: (value: boolean) => void;
  setRestoring: (value: boolean) => void;
};

export const useAuthStore = create<AuthState>(set => ({
  user: null,

  isAuthenticated: false,

  isRestoring: true,

  setAuth: user =>
    set({
      user,
      isAuthenticated: true,
      isRestoring: false,
    }),

  clearAuth: () =>
    set({
      user: null,
      isAuthenticated: false,
      isRestoring: false,
    }),

  logout: async () => {
    try {
      await Keychain.resetGenericPassword({
        service: KEYCHAIN_SERVICE,
      });

      console.log('AUTH: Keychain cleared');
    } catch (error) {
      console.error('AUTH: Failed to clear Keychain:', error);
    } finally {
      set({
        user: null,
        isAuthenticated: false,
        isRestoring: false,
      });
    }
  },

  setLoading: value =>
    set({
      isRestoring: value,
    }),

  setRestoring: value =>
    set({
      isRestoring: value,
    }),
}));
