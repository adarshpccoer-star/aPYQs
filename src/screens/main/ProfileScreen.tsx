import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAuthStore } from '../../store/useAuthStore';
import { DEFAULT_AVATAR } from './HomeScreen';
import { ScreenLayout } from '../../components/ScreenLayout';
import { useNavigation } from '@react-navigation/native';
import { Button } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { fetchUserStats } from '../../api/question';

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
  const {
    data: stats,
    isLoading: isStatsLoading,
    isError: isStatsError,
  } = useQuery({
    queryKey: ['userStats'],
    queryFn: () => fetchUserStats(),
  });
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
  const solvedProgressWidth = useMemo(() => {
    if (!stats?.totalSolved || !stats?.totalTarget) return '0%';
    const pct = Math.min(
      100,
      Math.round((stats.totalSolved / stats.totalTarget) * 100),
    );
    return `${pct}%`;
  }, [stats]);

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
              {user?.name || 'Gate Aspirant'}
            </Text>
            <Text className="font-inter text-[18px] leading-[28px] text-on-surface-variant mt-1">
              {user?.branchName || 'Computer Science'}
            </Text>
            <View className="flex-row gap-2 mt-4">
              <View className="border border-surface-variant px-2 py-1 rounded">
                <Text className="font-mono text-[12px] leading-[16px] text-on-surface">
                  {user?.yearOfGate || date.getFullYear() + 1} Aspirant
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

        {isStatsLoading ? (
          <View className="py-12 items-center justify-center">
            <ActivityIndicator size="large" color="#4F46E5" />
          </View>
        ) : isStatsError || !stats ? (
          <View className="py-6 items-center">
            <Text className="font-inter text-on-surface-variant text-[14px]">
              Unable to load profile statistics.
            </Text>
          </View>
        ) : (
          <>
            {/* METRICS GRID */}
            <View className="gap-4">
              {/* STREAK */}
              <View className="bg-surface border border-surface-variant rounded-lg p-6 h-40 justify-between">
                <View className="flex-row items-center gap-2">
                  <Text className="text-2xl">🔥</Text>
                  <Text className="font-inter font-semibold text-[20px] text-on-background">
                    {stats.streakDays} Day Streak
                  </Text>
                </View>
                <Text className="font-inter text-[16px] leading-[24px] text-on-surface-variant">
                  {stats.streakDays > 0
                    ? 'Consistent focus maintained. Keep the momentum going.'
                    : 'Start a practice session today to build your streak!'}
                </Text>
              </View>

              {/* TOTAL SOLVED */}
              <View className="bg-surface border border-surface-variant rounded-lg p-6 h-40 justify-between">
                <View>
                  <Text className="font-mono text-[12px] leading-[16px] text-on-surface-variant mb-1">
                    Total Solved
                  </Text>
                  <Text className="font-inter font-extrabold text-[48px] leading-[56px] text-on-background">
                    {stats.totalSolved}
                  </Text>
                </View>
                <View className="w-full h-1 bg-surface-variant rounded-full overflow-hidden">
                  <View
                    className="h-full bg-primary-container"
                    style={{ width: solvedProgressWidth }}
                  />
                </View>
              </View>

              {/* ACCURACY */}
              <View className="bg-surface border border-surface-variant rounded-lg p-6 h-40 justify-between">
                <View>
                  <Text className="font-mono text-[12px] leading-[16px] text-on-surface-variant mb-1">
                    Accuracy
                  </Text>
                  <Text className="font-inter font-extrabold text-[48px] leading-[56px] text-on-background">
                    {stats.accuracyPercentage}%
                  </Text>
                </View>
                <Text className="font-mono text-[12px] leading-[16px] text-primary mt-2">
                  {stats.weeklyChangePercentage >= 0 ? '📈 +' : '📉 '}
                  {stats.weeklyChangePercentage}% this week
                </Text>
              </View>
            </View>

            {/* WEEKLY PERFORMANCE CHART */}
            <View className="bg-surface border border-surface-variant rounded-lg p-6">
              <Text className="font-inter font-semibold text-[20px] leading-[28px] text-on-background border-b border-surface-variant pb-4">
                Weekly Performance
              </Text>
              <View className="flex-row items-end justify-between h-48 mt-4 px-2">
                {stats.weeklyActivity.map((item, idx) => (
                  <View
                    key={idx}
                    className="items-center gap-2 flex-1 h-full justify-end"
                  >
                    <View
                      className="w-full max-w-[28px] bg-primary-container rounded-t"
                      style={{
                        height: `${Math.min(
                          100,
                          Math.max(5, item.percentage),
                        )}%`,
                      }}
                    />
                    <Text className="font-mono text-[12px] leading-[16px] text-on-surface-variant">
                      {item.day}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </>
        )}

        {/* LOGOUT BUTTON */}
        <TouchableOpacity
          onPress={handleLogout}
          disabled={loggingOut}
          className="bg-red-600 rounded-lg py-3 items-center justify-center mt-2"
        >
          <Text className="text-white font-inter font-semibold text-[16px]">
            {loggingOut ? 'Logging out...' : 'Logout'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenLayout>
  );
}
