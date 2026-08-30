import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface HeaderProps {
  title?: string;
}

export const Header = ({ title }: HeaderProps) => {
  const navigation = useNavigation();

  return (
    <View className="bg-surface border-b border-surface-variant flex-row items-center px-4 py-3 gap-3">
      {navigation.canGoBack() && (
        <Pressable
          onPress={() => navigation.goBack()}
          className="p-2 rounded-full bg-surface-container-low active:opacity-70 justify-center items-center"
          hitSlop={10}
        >
          <Text className="text-on-surface text-lg font-bold">←</Text>
        </Pressable>
      )}

      {title && (
        <Text className="text-on-surface font-inter font-bold text-lg">
          {title}
        </Text>
      )}
    </View>
  );
};
