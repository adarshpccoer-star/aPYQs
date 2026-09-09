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
import { useQuery } from '@tanstack/react-query';
import { fetchUserStats } from '../../api/question';
import { useThemeStore } from '../../store/useThemeStore';

export default function ProfileScreen() {
  const { logout, user } = useAuthStore();
  const { theme } = useThemeStore();
  const isDarkMode = theme === 'dark';
  const navigation = useNavigation<any>();
  const [loggingOut, setLoggingOut] = useState(false);
  const date = new Date();

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

  const solvedProgressWidth = useMemo(() => {
    if (!stats?.totalSolved || !stats?.totalTarget) return '0%';
    const pct = Math.min(
      100,
      Math.round((stats.totalSolved / stats.totalTarget) * 100),
    );
    return `${pct}%`;
  }, [stats]);

  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 80 }}
      className="px-4 py-12 gap-y-6  bg-white dark:bg-slate-950 flex-1"
      showsVerticalScrollIndicator={false}
    >
      {/* PROFILE HEADER */}
      <View className="items-center py-2">
        <Image
          source={{ uri: user?.image || DEFAULT_AVATAR }}
          className="w-32 h-32 rounded-full border-2 border-slate-200 dark:border-slate-800"
        />
        <View className="items-center mt-3">
          <Text className="font-inter font-bold text-[24px] leading-[32px] text-slate-900 dark:text-white">
            {user?.name || 'Gate Aspirant'}
          </Text>
          <Text className="font-inter text-[18px] leading-[28px] text-slate-600 dark:text-slate-400 mt-1">
            {user?.branchName || 'Computer Science'}
          </Text>
          <View className="flex-row gap-2 mt-4">
            <View className="border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-2 py-1 rounded">
              <Text className="font-mono text-[12px] leading-[16px] text-slate-700 dark:text-slate-300">
                {user?.yearOfGate || date.getFullYear() + 1} Aspirant
              </Text>
            </View>
            <View className="border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-2 py-1 rounded">
              <Text className="font-mono text-[12px] leading-[16px] text-slate-700 dark:text-slate-300">
                GATE {user?.branchCode || 'CSE'}
              </Text>
            </View>
          </View>
        </View>
        <Pressable
          className="mt-4"
          onPress={() => navigation.navigate('EditProfile')}
        >
          <Text className="font-inter font-semibold text-[16px] leading-[24px] text-indigo-600 dark:text-indigo-400">
            Edit Profile
          </Text>
        </Pressable>
      </View>

      {isStatsLoading ? (
        <View className="py-12 items-center justify-center">
          <ActivityIndicator
            size="large"
            color={isDarkMode ? '#6366f1' : '#4f46e5'}
          />
        </View>
      ) : isStatsError || !stats ? (
        <View className="py-6 items-center">
          <Text className="font-inter text-slate-600 dark:text-slate-400 text-[14px]">
            Unable to load profile statistics.
          </Text>
        </View>
      ) : (
        <>
          {/* METRICS GRID */}
          <View className="gap-4">
            {/* STREAK */}
            <View className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 h-40 justify-between">
              <View className="flex-row items-center gap-2">
                <Text className="text-2xl">🔥</Text>
                <Text className="font-inter font-semibold text-[20px] text-slate-900 dark:text-white">
                  {stats.streakDays} Day Streak
                </Text>
              </View>
              <Text className="font-inter text-[16px] leading-[24px] text-slate-600 dark:text-slate-400">
                {stats.streakDays > 0
                  ? 'Consistent focus maintained. Keep the momentum going.'
                  : 'Start a practice session today to build your streak!'}
              </Text>
            </View>

            {/* TOTAL SOLVED */}
            <View className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 h-40 justify-between">
              <View>
                <Text className="font-mono text-[12px] leading-[16px] text-slate-500 dark:text-slate-400 mb-1">
                  Total Solved
                </Text>
                <Text className="font-inter font-extrabold text-[48px] leading-[56px] text-slate-900 dark:text-white">
                  {stats.totalSolved}
                </Text>
              </View>
              <View className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <View
                  className="h-full bg-indigo-600 dark:bg-indigo-500"
                  style={{ width: solvedProgressWidth }}
                />
              </View>
            </View>

            {/* ACCURACY */}
            <View className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 h-40 justify-between">
              <View>
                <Text className="font-mono text-[12px] leading-[16px] text-slate-500 dark:text-slate-400 mb-1">
                  Accuracy
                </Text>
                <Text className="font-inter font-extrabold text-[48px] leading-[56px] text-slate-900 dark:text-white">
                  {stats.accuracyPercentage}%
                </Text>
              </View>
              <Text className="font-mono text-[12px] leading-[16px] text-indigo-600 dark:text-indigo-400 mt-2">
                {stats.weeklyChangePercentage >= 0 ? '📈 +' : '📉 '}
                {stats.weeklyChangePercentage}% this week
              </Text>
            </View>
          </View>

          {/* WEEKLY PERFORMANCE CHART */}
          <View className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6">
            <Text className="font-inter font-semibold text-[20px] leading-[28px] text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-4">
              Weekly Performance
            </Text>
            <View className="flex-row items-end justify-between h-48 mt-4 px-2">
              {stats.weeklyActivity.map((item, idx) => (
                <View
                  key={idx}
                  className="items-center gap-2 flex-1 h-full justify-end"
                >
                  <View
                    className="w-full max-w-[28px] bg-indigo-600 dark:bg-indigo-500 rounded-t"
                    style={{
                      height: `${Math.min(100, Math.max(5, item.percentage))}%`,
                    }}
                  />
                  <Text className="font-mono text-[12px] leading-[16px] text-slate-500 dark:text-slate-400">
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
        className="bg-rose-600 dark:bg-rose-700 rounded-lg py-3 items-center justify-center mt-2 active:opacity-90"
      >
        <Text className="text-white font-inter font-semibold text-[16px]">
          {loggingOut ? 'Logging out...' : 'Logout'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
