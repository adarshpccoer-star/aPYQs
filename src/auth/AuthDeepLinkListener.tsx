import { useEffect } from 'react';
import { Linking } from 'react-native';
import * as Keychain from 'react-native-keychain';

import { useAuthStore } from '../store/useAuthStore';
import { API_BASE_URL, KEYCHAIN_SERVICE } from '../config/env';

export function AuthDeepLinkListener() {
  const setAuth = useAuthStore(state => state.setAuth);

  useEffect(() => {
    let processing = false;

    const handleUrl = async (url: string) => {
      console.log('AUTH: DEEP LINK RECEIVED:', url);

      if (!url.startsWith('apyqs://auth/callback')) {
        return;
      }

      if (processing) {
        console.log('AUTH: Already processing callback');
        return;
      }

      processing = true;

      try {
        const parsedUrl = new URL(url);
        const code = parsedUrl.searchParams.get('code');

        console.log('AUTH: CALLBACK CODE:', code);

        if (!code) {
          throw new Error('No mobile authentication code in callback');
        }

        console.log('AUTH: Exchanging mobile code...');

        const response = await fetch(`${API_BASE_URL}/api/mobile/exchange`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
        });

        console.log('AUTH: EXCHANGE STATUS:', response.status);

        const responseText = await response.text();

        console.log('AUTH: EXCHANGE RESPONSE:', responseText);

        if (!response.ok) {
          throw new Error(`Exchange failed: ${response.status}`);
        }

        const data = JSON.parse(responseText);

        const { sessionToken, user } = data;

        if (!sessionToken || !user) {
          throw new Error('Exchange response missing sessionToken or user');
        }

        console.log('AUTH: USER RECEIVED:', user.email);

        await Keychain.setGenericPassword('apyqs', sessionToken, {
          service: KEYCHAIN_SERVICE,
        });

        console.log('AUTH: TOKEN SAVED TO KEYCHAIN');

        setAuth(user);

        console.log('AUTH: ZUSTAND UPDATED SUCCESSFULLY');
      } catch (error) {
        console.error('AUTH: CALLBACK ERROR:', error);
      } finally {
        processing = false;
      }
    };

    // Cold start
    const initialize = async () => {
      try {
        const initialUrl = await Linking.getInitialURL();

        console.log('AUTH: INITIAL URL:', initialUrl);

        if (initialUrl) {
          await handleUrl(initialUrl);
        }
      } catch (error) {
        console.error('AUTH: INITIAL URL ERROR:', error);
      }
    };

    void initialize();

    // App already running/backgrounded
    const subscription = Linking.addEventListener('url', ({ url }) => {
      console.log('AUTH: LINKING EVENT:', url);

      void handleUrl(url);
    });

    return () => {
      subscription.remove();
    };
  }, [setAuth]);

  return null;
}
