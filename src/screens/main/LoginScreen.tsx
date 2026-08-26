import React from 'react';
import { Alert, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { loginWithGitHub } from '../../auth/github';

export default function LoginScreen() {
  const navigation = useNavigation<any>();

  const handleGitHubLogin = async () => {
    console.log('========== BUTTON PRESSED ==========');

    try {
      console.log('Calling loginWithGitHub...');

      const result = await loginWithGitHub();

      console.log('OAuth result:', result);

      navigation.navigate('signup', {
        user: {
          name: result.user.name,
          login: result.user.login,
          email: result.user.email,
        },
      });
    } catch (error) {
      console.error('GitHub OAuth error:', error);

      Alert.alert(
        'GitHub Login Failed',
        error instanceof Error ? error.message : String(error),
      );
    }
  };

  return (
    <SafeAreaView>
      <Button title="Continue with GitHub" onPress={handleGitHubLogin} />
    </SafeAreaView>
  );
}
