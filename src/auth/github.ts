import { authorize } from 'react-native-app-auth';
import Config from 'react-native-config';

export async function loginWithGitHub() {
  const clientId = Config.GITHUB_CLIENT_ID?.trim();
  const clientSecret = Config.GITHUB_CLIENT_SECRET?.trim();

  if (!clientId) {
    throw new Error('GITHUB_CLIENT_ID is missing');
  }

  if (!clientSecret) {
    throw new Error('GITHUB_CLIENT_SECRET is missing');
  }

  const config = {
    clientId,
    clientSecret,

    redirectUrl: 'apyqs://oauth/callback',

    scopes: ['read:user', 'user:email'],

    serviceConfiguration: {
      authorizationEndpoint: 'https://github.com/login/oauth/authorize',
      tokenEndpoint: 'https://github.com/login/oauth/access_token',
    },

    usePKCE: true,
  };

  const oauthResult = await authorize(config);

  const response = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${oauthResult.accessToken}`,
      Accept: 'application/vnd.github+json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get GitHub user: ${response.status}`);
  }

  const user = await response.json();

  return {
    oauth: oauthResult,
    user,
  };
}
