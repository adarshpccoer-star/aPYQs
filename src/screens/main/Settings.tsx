import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
const Settings = () => {
  const handleLogout = () => {
    console.log('logout');
  };

  return (
    <SafeAreaProvider className="flex-1 p-6 m-2">
      <View className="justify-center">
        <Image
          source={{
            uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR040BnpiwVIAi2QbAT-wg1StQiLhdqIrRthgw25yHfKw&s=10',
          }}
        />
      </View>

      <Text></Text>
      <TouchableOpacity>
        <Text>Toggle Theme</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleLogout}
        className="bg-blue-500 w-[90%] py-2 px-4 rounded items-center mt-4"
      >
        <Text className="text-white font-bold text-center">LogOut</Text>
      </TouchableOpacity>
    </SafeAreaProvider>
  );
};

export default Settings;
