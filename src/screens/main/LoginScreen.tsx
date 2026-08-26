import React from 'react';
import { Button, View } from 'react-native';
import { loginWithGitHub } from '../../auth/github';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const handleGitHubLogin = async () => {
    try {
      console.log('Logging in...');
      const result = await loginWithGitHub();

      console.log('Logged in:', result);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView>
      <Button title="Continue with GitHub" onPress={handleGitHubLogin} />
    </SafeAreaView>
  );
}
