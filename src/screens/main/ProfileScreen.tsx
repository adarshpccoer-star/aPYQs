import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Alert,
} from 'react-native';
import { useAuthStore } from '../../store/useAuthStore';
import { DEFAULT_AVATAR } from './HomeScreen';
import { ScreenLayout } from '../../components/ScreenLayout';
import { useNavigation } from '@react-navigation/native';
import { Button } from 'react-native';

export default function ProfileScreen() {
  const { logout } = useAuthStore();
  const chartData = [
    { day: 'Mon', height: 'h-[30%]' },
    { day: 'Tue', height: 'h-[50%]' },
    { day: 'Wed', height: 'h-[80%]' },
    { day: 'Thu', height: 'h-[40%]' },
    { day: 'Fri', height: 'h-[95%]' },
    { day: 'Sat', height: 'h-[60%]' },
    { day: 'Sun', height: 'h-[20%]' },
  ];
  const [loggingOut, setLoggingOut] = useState(false);
  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          setLoggingOut(true);
          await logout();
        },
      },
    ]);
  };
  const { user } = useAuthStore();
  const date = new Date();
  const navigation = useNavigation<any>();
  /* FIX: Removed redundant inner SafeAreaView since ScreenLayout provides safe area context */
  return (
    <ScreenLayout title="Profile">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 80 }}
        className="px-4 py-6 gap-y-6"
      >
        {/* PROFILE HEADER */}
        <View className="items-center py-2">
          <Image
            source={{ uri: user?.image || DEFAULT_AVATAR }}
            className="w-32 h-32 rounded-full border-2 border-surface-variant"
          />
          <View className="items-center mt-3">
            <Text className="font-inter font-bold text-[24px] leading-[32px] text-on-background">
              {user?.name}
            </Text>
            <Text className="font-inter text-[18px] leading-[28px] text-on-surface-variant mt-1">
              {user?.branchName || 'Computer Science'}
            </Text>
            <View className="flex-row gap-2 mt-4">
              <View className="border border-surface-variant px-2 py-1 rounded">
                <Text className="font-mono text-[12px] leading-[16px] text-on-surface">
                  {user?.yearOfGate || date.getFullYear() + 4} Aspirant
                </Text>
              </View>
              <View className="border border-surface-variant px-2 py-1 rounded">
                <Text className="font-mono text-[12px] leading-[16px] text-on-surface">
                  GATE {user?.branchCode || 'CSE'}
                </Text>
              </View>
            </View>
          </View>
          <Pressable
            className="mt-4"
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Text className="font-inter font-semibold text-[16px] leading-[24px] text-indigo-600">
              Edit Profile
            </Text>
          </Pressable>
        </View>

        {/* METRICS GRID */}
        <View className="gap-4">
          <View className="bg-surface border border-surface-variant rounded-lg p-6 h-40 justify-between">
            <View className="flex-row items-center gap-2">
              <Text className="text-2xl">🔥</Text>
              <Text className="font-inter font-semibold text-[20px] text-on-background">
                15 Day Streak
              </Text>
            </View>
            <Text className="font-inter text-[16px] leading-[24px] text-on-surface-variant">
              Consistent focus maintained. Keep the momentum going.
            </Text>
          </View>

          <View className="bg-surface border border-surface-variant rounded-lg p-6 h-40 justify-between">
            <View>
              <Text className="font-mono text-[12px] leading-[16px] text-on-surface-variant mb-1">
                Total Solved
              </Text>
              <Text className="font-inter font-extrabold text-[48px] leading-[56px] text-on-background">
                342
              </Text>
            </View>
            <View className="w-full h-1 bg-surface-variant rounded-full overflow-hidden">
              <View className="h-full bg-primary-container w-[65%]" />
            </View>
          </View>

          <View className="bg-surface border border-surface-variant rounded-lg p-6 h-40 justify-between">
            <View>
              <Text className="font-mono text-[12px] leading-[16px] text-on-surface-variant mb-1">
                Accuracy
              </Text>
              <Text className="font-inter font-extrabold text-[48px] leading-[56px] text-on-background">
                82%
              </Text>
            </View>
            <Text className="font-mono text-[12px] leading-[16px] text-primary mt-2">
              📈 +4% this week
            </Text>
          </View>
        </View>

        {/* WEEKLY PERFORMANCE CHART */}
        <View className="bg-surface border border-surface-variant rounded-lg p-6">
          <Text className="font-inter font-semibold text-[20px] leading-[28px] text-on-background border-b border-surface-variant pb-4">
            Weekly Performance
          </Text>
          <View className="flex-row items-end justify-between h-48 mt-4 px-2">
            {chartData.map((item, idx) => (
              <View
                key={idx}
                className="items-center gap-2 flex-1 h-full justify-end"
              >
                <View
                  className={`w-full max-w-[28px] bg-primary-container rounded-t ${item.height}`}
                />
                <Text className="font-mono text-[12px] leading-[16px] text-on-surface-variant">
                  {item.day}
                </Text>
              </View>
            ))}
          </View>
        </View>
        <TouchableOpacity>
          <Button onPress={handleLogout} title="Logout" />
        </TouchableOpacity>
      </ScrollView>
    </ScreenLayout>
  );
}
