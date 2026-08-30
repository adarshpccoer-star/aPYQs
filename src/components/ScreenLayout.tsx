import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from './Header';

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
    <SafeAreaView style={{ flex: 1 }} className="bg-surface">
      <Header title={title} />
      {children}
    </SafeAreaView>
  );
};
