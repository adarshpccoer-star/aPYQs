import Config from 'react-native-config';

export const API_BASE_URL = Config.API_BASE_URL;
export const KEYCHAIN_SERVICE = Config.KEYCHAIN_SERVICE;

console.log('CONFIG:', {
  API_BASE_URL,
  KEYCHAIN_SERVICE,
  rawConfig: Config,
});
