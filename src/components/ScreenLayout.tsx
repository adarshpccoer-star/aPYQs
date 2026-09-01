import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from './Header';
import { View } from 'react-native';

interface ScreenLayoutProps {
  children: React.ReactNode;
  title?: string;
  showBack?: boolean;
}

export const ScreenLayout = ({
  children,
  title,
  showBack = true,
}: ScreenLayoutProps) => {
  return (
    <SafeAreaView
      style={{ flex: 1, marginHorizontal: 8 }}
      className="bg-surface px-2"
    >
      <Header title={title} />
      <View className="mx-2 flex-1">{children}</View>
    </SafeAreaView>
  );
};
