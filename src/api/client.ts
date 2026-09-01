import * as Keychain from 'react-native-keychain';

const API_BASE_URL = 'http://192.168.1.43:3000';
const KEYCHAIN_SERVICE = 'com.apyqs.auth';

export async function apiFetch(path: string, options: RequestInit = {}) {
  const credentials = await Keychain.getGenericPassword({
    service: KEYCHAIN_SERVICE,
  });

  if (!credentials) {
    throw new Error('No authenticated session found');
  }

  const sessionToken = credentials.password;

  const headers = new Headers(options.headers);

  headers.set('Authorization', `Bearer ${sessionToken}`);

  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const text = await response.text();

    throw new Error(`API request failed: ${response.status} ${text}`);
  }

  return response;
}
