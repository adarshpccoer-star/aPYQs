import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 1. Define theme types
export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

// 2. Create the store with persistence
export const useThemeStore = create<ThemeState>()(
  persist(
    set => ({
      theme: 'light',
      setTheme: theme => set({ theme }),
      toggleTheme: () =>
        set(state => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        })),
    }),
    {
      name: 'app-theme-storage', // Key for AsyncStorage
      storage: createJSONStorage(() => AsyncStorage), // Native storage driver
    },
  ),
);
