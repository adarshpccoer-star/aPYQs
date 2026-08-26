import { authorize } from 'react-native-app-auth';
import Config from 'react-native-config';

const githubConfig = {
  clientId: Config.GITHUB_CLIENT_ID as string,
  clientSecret: Config.GITHUB_CLIENT_SECRET,
  redirectUrl: Config.GITHUB_REDIRECT_URL || 'apyqs://oauth/callback',
  scopes: ['read:user', 'user:email'],
  serviceConfiguration: {
    authorizationEndpoint: 'https://github.com/login/oauth/authorize',
    tokenEndpoint: 'https://github.com/login/oauth/access_token',
  },
  usePKCE: true,
};

export async function loginWithGitHub() {
  try {
    const result = await authorize(githubConfig);
    console.log('GitHub OAuth result:', result);
    return result;
  } catch (error) {
    console.log('GitHub login error:', error);
    throw error;
  }
}
