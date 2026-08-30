import React from 'react';
import { View, Text, Image, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../store/useAuthStore';
import { Settings } from 'lucide-react-native';

export const DEFAULT_AVATAR =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAQt7c2v81NrQMpXKaT-xcaJPcGZcbFpMDWGvb4Mqr-dbg1X9PMRzprZXTdkiXBgy5ImMBIl9TGZ_ESvIeNhhptIaXDArgZm2Up7OWPa4-qcalqIQfl10SjZefw3c6ZVoJEozk_keJCGsq2vFcBo1jWqfHVExvgr_m463kCsqw1uClGaL8xh03lRHXxOmyJWsGalLjv0QgwLPr1EBDd2eeiWSV9a8q9FiGSEQNF8ef9B5B_s3GO4GI';

const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const { user } = useAuthStore();

  return (
    <SafeAreaView className="bg-white dark:bg-slate-950 flex-1">
      {/* TOP APP BAR */}
      <View className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex-row justify-between items-center w-full px-6 py-4">
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

        <Pressable
          className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 active:opacity-80"
          onPress={() => navigation.navigate('Setting')}
        >
          <Text className="text-lg">
            <Settings />
          </Text>
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

        {/* SELECT EXAM TRACK BENTO */}
        <View className="gap-4">
          <View className="flex-row justify-between items-end">
            <Text className="font-inter font-semibold text-[20px] leading-[28px] text-slate-900 dark:text-white">
              Select Exam Track
            </Text>
            <Pressable>
              <Text className="font-inter font-semibold text-[14px] text-slate-600 dark:text-slate-400 underline">
                View all
              </Text>
            </Pressable>
          </View>

          <View className="gap-4">
            <Pressable className="flex-col justify-between h-48 p-6 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 active:border-slate-900 dark:active:border-white rounded-lg">
              <View className="flex-row justify-between items-start">
                <View className="border border-slate-300 dark:border-slate-700 px-2 py-1 rounded">
                  <Text className="font-mono text-[12px] leading-[16px] text-slate-600 dark:text-slate-400">
                    ENGINEERING
                  </Text>
                </View>
                <Text className="text-slate-600 dark:text-slate-400 text-base">
                  ↗
                </Text>
              </View>
              <View>
                <Text className="font-inter font-semibold text-[20px] leading-[28px] text-slate-900 dark:text-white mb-1">
                  JEE Mains
                </Text>
                <Text className="font-inter text-[14px] leading-[20px] text-slate-600 dark:text-slate-400">
                  2,450 Questions
                </Text>
              </View>
            </Pressable>

            <Pressable className="flex-col justify-between h-48 p-6 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 active:border-slate-900 dark:active:border-white rounded-lg">
              <View className="flex-row justify-between items-start">
                <View className="border border-slate-300 dark:border-slate-700 px-2 py-1 rounded">
                  <Text className="font-mono text-[12px] leading-[16px] text-slate-600 dark:text-slate-400">
                    MEDICAL
                  </Text>
                </View>
                <Text className="text-slate-600 dark:text-slate-400 text-base">
                  ↗
                </Text>
              </View>
              <View>
                <Text className="font-inter font-semibold text-[20px] leading-[28px] text-slate-900 dark:text-white mb-1">
                  NEET UG
                </Text>
                <Text className="font-inter text-[14px] leading-[20px] text-slate-600 dark:text-slate-400">
                  3,120 Questions
                </Text>
              </View>
            </Pressable>
          </View>
        </View>

        {/* PROGRESS OVERVIEW CARD */}
        <View className="p-8 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl gap-6">
          <View>
            <Text className="font-inter font-semibold text-[20px] text-slate-900 dark:text-white mb-1">
              Daily Goal
            </Text>
            <Text className="font-inter text-[16px] text-slate-600 dark:text-slate-400">
              Stay consistent to master topics faster.
            </Text>
          </View>

          <View className="items-center justify-center py-4">
            <View className="w-36 h-36 rounded-full border-[6px] border-slate-200 dark:border-slate-800 border-t-green-600 dark:border-t-green-500 items-center justify-center">
              <Text className="font-inter font-bold text-3xl text-slate-900 dark:text-white">
                75%
              </Text>
              <Text className="font-mono text-[12px] text-slate-600 dark:text-slate-400 mt-1">
                30/40 Qs
              </Text>
            </View>
          </View>

          <View className="gap-2">
            <View className="flex-row justify-between items-center">
              <Text className="font-inter text-[16px] text-black dark:text-white">
                Current Streak
              </Text>
              <Text className="font-inter font-bold text-[20px] text-black dark:text-white">
                12 🔥
              </Text>
            </View>
            <View className="w-full h-1.5 bg-slate-200 dark:bg-black rounded-full overflow-hidden">
              <View className="h-full bg-green-600 dark:bg-green-500 w-[75%]" />
            </View>
          </View>
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
