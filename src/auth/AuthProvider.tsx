import React, { useEffect } from 'react';
import * as Keychain from 'react-native-keychain';

import { useAuthStore } from '../store/useAuthStore';

const API_BASE_URL = 'http://192.168.1.43:3000';
const KEYCHAIN_SERVICE = 'com.apyqs.auth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setAuth = useAuthStore(state => state.setAuth);
  const clearAuth = useAuthStore(state => state.clearAuth);
  const setRestoring = useAuthStore(state => state.setRestoring);

  useEffect(() => {
    const restoreAuth = async () => {
      try {
        console.log('AUTH: Restoring session...');

        setRestoring(true);

        const credentials = await Keychain.getGenericPassword({
          service: KEYCHAIN_SERVICE,
        });

        if (!credentials) {
          console.log('AUTH: No saved session');

          clearAuth();
          return;
        }

        const sessionToken = credentials.password;

        console.log('AUTH: Found saved session token');

        const response = await fetch(`${API_BASE_URL}/api/mobile/session`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${sessionToken}`,
          },
        });

        console.log('AUTH: Session validation:', response.status);

        if (!response.ok) {
          console.log('AUTH: Saved session is invalid/expired');

          await Keychain.resetGenericPassword({
            service: KEYCHAIN_SERVICE,
          });

          clearAuth();
          return;
        }

        const data = await response.json();

        if (!data.user) {
          throw new Error('Invalid session response');
        }

        console.log('AUTH: Session restored:', data.user.email);

        setAuth(data.user);
      } catch (error) {
        console.error('AUTH: Restore failed:', error);

        await Keychain.resetGenericPassword({
          service: KEYCHAIN_SERVICE,
        }).catch(() => {});

        clearAuth();
      } finally {
        setRestoring(false);
      }
    };

    void restoreAuth();
  }, [setAuth, clearAuth, setRestoring]);

  return <>{children}</>;
}
