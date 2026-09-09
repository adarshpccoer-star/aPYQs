import React, { useMemo } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../store/useAuthStore';
import { Sun, Moon } from 'lucide-react-native';
import { useQuery } from '@tanstack/react-query';
import { fetchProgress, fetchUserStats } from '../../api/question';
import LatexView from '../../components/latex';
import { useThemeStore } from '../../store/useThemeStore';

export const DEFAULT_AVATAR =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAQt7c2v81NrQMpXKaT-xcaJPcGZcbFpMDWGvb4Mqr-dbg1X9PMRzprZXTdkiXBgy5ImMBIl9TGZ_ESvIeNhhptIaXDArgZm2Up7OWPa4-qcalqIQfl10SjZefw3c6ZVoJEozk_keJCGsq2vFcBo1jWqfHVExvgr_m463kCsqw1uClGaL8xh03lRHXxOmyJWsGalLjv0QgwLPr1EBDd2eeiWSV9a8q9FiGSEQNF8ef9B5B_s3GO4GI';

const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const { user } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const isDarkMode = theme === 'dark';

  const {
    data: questionProgress,
    isLoading: isQuestionProgressLoading,
    isError: isQuestionProgressError,
    error: questionProgressError,
  } = useQuery({
    queryKey: ['questionProgress'],
    queryFn: () => fetchProgress(),
  });

  const {
    data: stats,
    isLoading: isStatsLoading,
    isError: isStatsError,
  } = useQuery({
    queryKey: ['userStats'],
    queryFn: () => fetchUserStats(),
  });

  const solvedProgressWidth = useMemo(() => {
    if (!stats?.totalSolved || !stats?.totalTarget) return '0%';
    const pct = Math.min(
      100,
      Math.round((stats.totalSolved / stats.totalTarget) * 100),
    );
    return `${pct}%`;
  }, [stats]);

  return (
    <SafeAreaView className="bg-white dark:bg-slate-950 flex-1">
      {/* TOP APP BAR */}
      <View className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex-row justify-between items-center px-6 py-4">
        <View className="flex-row items-center gap-4">
          <Pressable
            onPress={() => navigation.navigate('Profile')}
            className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0"
          >
            <Image
              source={{
                uri: user?.image || DEFAULT_AVATAR,
              }}
              className="w-full h-full object-cover"
            />
          </Pressable>

          {!user && (
            <Pressable
              className="bg-indigo-600 dark:bg-indigo-500 px-4 py-2 rounded-md justify-center items-center"
              onPress={() => navigation.navigate('Login')}
            >
              <Text className="text-white font-bold text-sm">Login</Text>
            </Pressable>
          )}
        </View>

        {/* DIRECT THEME TOGGLE BUTTON */}
        <Pressable
          className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 active:opacity-80"
          onPress={toggleTheme}
        >
          {isDarkMode ? (
            <Sun size={20} className="text-amber-400" color="#f59e0b" />
          ) : (
            <Moon size={20} className="text-slate-900" color="#0f172a" />
          )}
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        className="px-6 py-8 gap-y-8"
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-2">
          <Text className="font-inter font-extrabold text-[32px] leading-[40px] tracking-tight text-slate-900 dark:text-white">
            Good morning,{'\n'}
            {user?.name || 'Student'}
          </Text>
          <Text className="font-inter text-[18px] leading-[28px] text-slate-600 dark:text-slate-400 max-w-2xl">
            Ready to tackle some previous year questions today? Your daily goal
            is almost complete.
          </Text>
        </View>

        {/* PERFORMANCE STATS BENTO SECTION */}
        <View className="gap-4">
          <View className="flex-row justify-between items-end">
            <Text className="font-inter font-semibold text-[20px] leading-[28px] text-slate-900 dark:text-white">
              Your Performance
            </Text>
            <Pressable onPress={() => navigation.navigate('Profile')}>
              <Text className="font-inter font-semibold text-[14px] text-slate-600 dark:text-slate-400 underline">
                View profile
              </Text>
            </Pressable>
          </View>

          {isStatsLoading ? (
            <View className="p-6 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl items-center justify-center">
              <ActivityIndicator size="small" color="#4f46e5" />
            </View>
          ) : isStatsError || !stats ? (
            <View className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl items-center">
              <Text className="font-inter text-slate-600 dark:text-slate-400 text-[14px]">
                Unable to load performance statistics.
              </Text>
            </View>
          ) : (
            <View className="gap-4">
              {/* STREAK CARD */}
              <View className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex-row items-center justify-between">
                <View className="flex-row items-center gap-3">
                  <Text className="text-3xl">🔥</Text>
                  <View>
                    <Text className="font-inter font-bold text-[20px] text-slate-900 dark:text-white">
                      {stats.streakDays} Day Streak
                    </Text>
                    <Text className="font-inter text-[13px] text-slate-600 dark:text-slate-400 mt-0.5">
                      {stats.streakDays > 0
                        ? 'Consistent focus maintained!'
                        : 'Start a session to build your streak!'}
                    </Text>
                  </View>
                </View>
              </View>

              <View className="flex-row gap-4">
                {/* TOTAL SOLVED CARD */}
                <View className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 justify-between">
                  <View>
                    <Text className="font-mono text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                      Total Solved
                    </Text>
                    <Text className="font-inter font-extrabold text-[32px] leading-[38px] text-slate-900 dark:text-white">
                      {stats.totalSolved}
                    </Text>
                  </View>
                  <View className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mt-3">
                    <View
                      className="h-full bg-indigo-600 dark:bg-indigo-500"
                      style={{ width: solvedProgressWidth }}
                    />
                  </View>
                </View>

                {/* ACCURACY CARD */}
                <View className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 justify-between">
                  <View>
                    <Text className="font-mono text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                      Accuracy
                    </Text>
                    <Text className="font-inter font-extrabold text-[32px] leading-[38px] text-slate-900 dark:text-white">
                      {stats.accuracyPercentage}%
                    </Text>
                  </View>
                  <Text className="font-mono text-[11px] text-indigo-600 dark:text-indigo-400 mt-3">
                    {stats.weeklyChangePercentage >= 0 ? '📈 +' : '📉 '}
                    {stats.weeklyChangePercentage}% this week
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* PROGRESS OVERVIEW CARD */}
        <View className="p-2 bg-slate-50 dark:bg-slate-900 border dark:text-slate-200 text-black border-slate-200 dark:border-slate-800 rounded-xl gap-6">
          {isQuestionProgressLoading && (
            <View className="flex-row justify-center items-center gap-2 py-4">
              <ActivityIndicator size="large" color="#4f46e5" />
              <Text className="font-inter font-semibold text-[16px] text-slate-900 dark:text-white">
                Loading...
              </Text>
            </View>
          )}

          {isQuestionProgressError && (
            <View className="flex-row justify-center items-center gap-2 py-4">
              <Text className="font-inter font-semibold text-[14px] bg-red-500 text-white px-4 py-2 rounded-lg">
                {questionProgressError?.message || 'Failed to load progress'}
              </Text>
            </View>
          )}

          {questionProgress?.data && (
            <View className="gap-4">
              <View className="flex-row justify-between items-center px-2 pt-2">
                <Text className="font-inter font-semibold text-[20px] leading-[28px] text-slate-900 dark:text-white">
                  Recent Activity
                </Text>
                <Pressable>
                  <Text className="font-inter font-semibold text-[14px] text-slate-600 dark:text-slate-400 underline">
                    View all ({questionProgress.data.length})
                  </Text>
                </Pressable>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 12, paddingHorizontal: 8 }}
              >
                {questionProgress.data.map((item: any) => {
                  const isCorrect = item.correct;
                  const questionText = item.question?.questionLatex || '';
                  const truncatedText =
                    questionText.length > 80
                      ? `${questionText.slice(0, 80)}...`
                      : questionText;

                  return (
                    <Pressable
                      key={item.id}
                      className="w-64 p-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg justify-between gap-3 active:opacity-90"
                    >
                      <View className="flex-col gap-1">
                        <View className="flex-row justify-between items-center">
                          <View className="bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded">
                            <Text className="font-mono text-xs text-slate-700 dark:text-slate-300 font-medium">
                              Q{item.question?.number || 'N/A'} •{' '}
                              {item.question?.branch || 'General'}
                            </Text>
                          </View>

                          <View
                            className={`px-2 py-0.5 rounded-full ${
                              isCorrect
                                ? 'bg-emerald-100 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800'
                                : 'bg-rose-100 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-800'
                            }`}
                          >
                            <Text
                              className={`text-[11px] font-semibold ${
                                isCorrect
                                  ? 'text-emerald-700 dark:text-emerald-400'
                                  : 'text-rose-700 dark:text-rose-400'
                              }`}
                            >
                              {isCorrect ? 'Correct' : 'Incorrect'}
                            </Text>
                          </View>
                        </View>

                        {item.question?.mainTopic && (
                          <Text className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 mt-1">
                            {item.question.mainTopic}
                          </Text>
                        )}
                      </View>

                      <LatexView
                        latex={truncatedText}
                        fontSize={14}
                        color={isDarkMode ? '#FFFFFF' : '#0F172A'}
                      />

                      <View className="pt-2 border-t border-slate-100 dark:border-slate-800 flex-row justify-between items-center">
                        <Text className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                          {item.question?.exam?.title || 'Practice'}
                        </Text>
                        <Text className="text-[10px] text-slate-400 dark:text-slate-500">
                          {new Date(item.updatedAt).toLocaleDateString(
                            undefined,
                            {
                              month: 'short',
                              day: 'numeric',
                            },
                          )}
                        </Text>
                      </View>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>
          )}
        </View>

        {/* PROMINENT CTA */}
        <View className="pt-2">
          <Pressable
            className="w-full py-4 bg-green-600 dark:bg-green-500 border-2 border-slate-900 dark:border-green-400 rounded-lg items-center justify-center flex-row gap-2 active:translate-y-1 active:translate-x-1"
            onPress={() => navigation.navigate('Browse')}
          >
            <Text className="font-inter font-semibold text-[16px] text-white uppercase tracking-wider">
              Start Practicing →
            </Text>
          </Pressable>
          <Text className="text-center font-mono text-[12px] text-slate-600 dark:text-slate-400 mt-3">
            Picks up from where you left off
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
