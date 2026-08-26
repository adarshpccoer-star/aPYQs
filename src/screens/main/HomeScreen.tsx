import React from 'react';
import { View, Text, Image, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-surface">
      {/* TOP APP BAR */}

      <Pressable
        className="w-full bg-on-secondary-container text-red-500"
        onPress={() => navigation.navigate('Login')}
      >
        login
      </Pressable>
      <View className="bg-surface border-b border-surface-variant flex-row justify-between items-center w-full px-6 py-4">
        <View className="flex-row items-center gap-4">
          <View className="w-10 h-10 rounded-full overflow-hidden bg-surface-container border border-surface-variant flex-row items-center justify-center shrink-0">
            <Image
              source={{
                uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQt7c2v81NrQMpXKaT-xcaJPcGZcbFpMDWGvb4Mqr-dbg1X9PMRzprZXTdkiXBgy5ImMBIl9TGZ_ESvIeNhhptIaXDArgZm2Up7OWPa4-qcalqIQfl10SjZefw3c6ZVoJEozk_keJCGsq2vFcBo1jWqfHVExvgr_m463kCsqw1uClGaL8xh03lRHXxOmyJWsGalLjv0QgwLPr1EBDd2eeiWSV9a8q9FiGSEQNF8ef9B5B_s3GO4GI',
              }}
              className="w-full h-full object-cover"
            />
          </View>
          {/* <Text className="font-mono text-[12px] leading-[16px] tracking-widest text-on-surface font-extrabold uppercase">
            PYQ MASTER
          </Text> */}
          <Pressable
            className="w-full bg-red-500 px-6 py-4 items-center justify-center"
            onPress={() => navigation.navigate('Login')}
          >
            <Text className="text-white text-lg font-bold">Login</Text>
          </Pressable>
        </View>
        <Pressable className="text-primary p-2 rounded-full bg-surface-container-low active:opacity-80">
          <Text className="text-lg">🔔</Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 90 }}
        className="px-6 py-8 gap-y-8"
        showsVerticalScrollIndicator={false}
      >
        {/* GREETING SECTION */}
        <View className="gap-2">
          <Text className="font-inter font-extrabold text-[32px] leading-[40px] tracking-tight text-on-surface">
            Good morning,{'\n'}Rahul
          </Text>
          <Text className="font-inter text-[18px] leading-[28px] text-on-surface-variant max-w-2xl">
            Ready to tackle some previous year questions today? Your daily goal
            is almost complete.
          </Text>
        </View>

        {/* SELECT EXAM TRACK BENTO */}
        <View className="gap-4">
          <View className="flex-row justify-between items-end">
            <Text className="font-inter font-semibold text-[20px] leading-[28px] text-on-surface">
              Select Exam Track
            </Text>
            <Pressable>
              <Text className="font-inter font-semibold text-[14px] text-on-surface-variant underline">
                View all
              </Text>
            </Pressable>
          </View>

          <View className="gap-4">
            {/* JEE Mains Card */}
            <Pressable className="flex-col justify-between h-48 p-6 bg-surface border border-surface-variant active:border-on-surface rounded-none">
              <View className="flex-row justify-between items-start">
                <View className="border border-surface-variant px-2 py-1">
                  <Text className="font-mono text-[12px] leading-[16px] text-on-surface-variant">
                    ENGINEERING
                  </Text>
                </View>
                <Text className="text-on-surface-variant text-base">↗</Text>
              </View>
              <View>
                <Text className="font-inter font-semibold text-[20px] leading-[28px] text-on-surface mb-1">
                  JEE Mains
                </Text>
                <Text className="font-inter text-[14px] leading-[20px] text-on-surface-variant">
                  2,450 Questions
                </Text>
              </View>
            </Pressable>

            {/* NEET UG Card */}
            <Pressable className="flex-col justify-between h-48 p-6 bg-surface border border-surface-variant active:border-on-surface rounded-none">
              <View className="flex-row justify-between items-start">
                <View className="border border-surface-variant px-2 py-1">
                  <Text className="font-mono text-[12px] leading-[16px] text-on-surface-variant">
                    MEDICAL
                  </Text>
                </View>
                <Text className="text-on-surface-variant text-base">↗</Text>
              </View>
              <View>
                <Text className="font-inter font-semibold text-[20px] leading-[28px] text-on-surface mb-1">
                  NEET UG
                </Text>
                <Text className="font-inter text-[14px] leading-[20px] text-on-surface-variant">
                  3,120 Questions
                </Text>
              </View>
            </Pressable>

            {/* UPSC Prelims Card */}
            <Pressable className="flex-col justify-between h-48 p-6 bg-surface border border-surface-variant active:border-on-surface rounded-none">
              <View className="flex-row justify-between items-start">
                <View className="border border-surface-variant px-2 py-1">
                  <Text className="font-mono text-[12px] leading-[16px] text-on-surface-variant">
                    CIVIL SERVICES
                  </Text>
                </View>
                <Text className="text-on-surface-variant text-base">↗</Text>
              </View>
              <View>
                <Text className="font-inter font-semibold text-[20px] leading-[28px] text-on-surface mb-1">
                  UPSC Prelims
                </Text>
                <Text className="font-inter text-[14px] leading-[20px] text-on-surface-variant">
                  1,890 Questions
                </Text>
              </View>
            </Pressable>
          </View>
        </View>

        {/* RECENT ACTIVITY */}
        <View className="gap-4">
          <Text className="font-inter font-semibold text-[20px] leading-[28px] text-on-surface">
            Recent Activity
          </Text>

          <View className="flex-col gap-4">
            {/* Activity Card 1 */}
            <View className="p-6 bg-surface border border-surface-variant gap-4">
              <View className="flex-row items-center gap-2">
                <View className="border border-surface-variant px-2 py-0.5">
                  <Text className="font-mono text-[12px] text-on-surface-variant">
                    PHYSICS
                  </Text>
                </View>
                <View className="border-l border-surface-variant pl-2">
                  <Text className="font-mono text-[12px] text-on-surface-variant">
                    HARD
                  </Text>
                </View>
              </View>
              <Text className="font-inter font-semibold text-[20px] text-on-surface">
                Rotational Dynamics - Advanced
              </Text>
              <Text className="font-inter text-[14px] text-on-surface-variant">
                Attempted yesterday • Score: 8/10
              </Text>
              <Pressable className="px-6 py-2.5 bg-on-surface items-center rounded-none active:opacity-90 mt-2">
                <Text className="font-inter font-semibold text-[14px] text-surface">
                  Review
                </Text>
              </Pressable>
            </View>

            {/* Activity Card 2 */}
            <View className="p-6 bg-surface border border-surface-variant gap-4">
              <View className="flex-row items-center gap-2">
                <View className="border border-surface-variant px-2 py-0.5">
                  <Text className="font-mono text-[12px] text-on-surface-variant">
                    CHEMISTRY
                  </Text>
                </View>
                <View className="border-l border-surface-variant pl-2">
                  <Text className="font-mono text-[12px] text-on-surface-variant">
                    MEDIUM
                  </Text>
                </View>
              </View>
              <Text className="font-inter font-semibold text-[20px] text-on-surface">
                Organic Synthesis - Set B
              </Text>
              <Text className="font-inter text-[14px] text-on-surface-variant">
                Paused 2 days ago • 15/30 Questions
              </Text>
              <Pressable className="px-6 py-2.5 bg-transparent border border-on-surface items-center rounded-none active:bg-surface-container-low mt-2">
                <Text className="font-inter font-semibold text-[14px] text-on-surface">
                  Resume
                </Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* PROGRESS OVERVIEW CARD */}
        <View className="p-8 bg-surface border border-surface-variant gap-6">
          <View>
            <Text className="font-inter font-semibold text-[20px] text-on-surface mb-1">
              Daily Goal
            </Text>
            <Text className="font-inter text-[16px] text-on-surface-variant">
              Stay consistent to master topics faster.
            </Text>
          </View>

          {/* Minimal Ring Stat representation */}
          <View className="items-center justify-center py-4">
            <View className="w-36 h-36 rounded-full border-[6px] border-surface-variant border-t-primary-container items-center justify-center">
              <Text className="font-inter font-bold text-3xl text-on-surface">
                75%
              </Text>
              <Text className="font-mono text-[12px] text-on-surface-variant mt-1">
                30/40 Qs
              </Text>
            </View>
          </View>

          <View className="gap-2">
            <View className="flex-row justify-between items-center">
              <Text className="font-inter text-[16px] text-on-surface">
                Current Streak
              </Text>
              <Text className="font-inter font-bold text-[20px] text-on-surface">
                12 🔥
              </Text>
            </View>
            <View className="w-full h-1 bg-surface-variant rounded-full overflow-hidden">
              <View className="h-full bg-primary-container w-[100%]" />
            </View>
          </View>
        </View>

        {/* PROMINENT CTA */}
        <View className="pt-2">
          <Pressable className="w-full py-4 bg-primary-container border-2 border-on-surface items-center justify-center flex-row gap-2 active:translate-y-1 active:translate-x-1">
            <Text className="font-inter font-semibold text-[16px] text-on-surface uppercase tracking-wider">
              Start Practicing →
            </Text>
          </Pressable>
          <Text className="text-center font-mono text-[12px] text-on-surface-variant mt-3">
            Picks up from where you left off
          </Text>
        </View>
      </ScrollView>

      {/* FIXED BOTTOM NAVIGATION */}
      <View className="absolute bottom-0 left-0 right-0 h-16 bg-surface border-t border-surface-variant flex-row justify-around items-center px-4">
        <Pressable className="items-center">
          <Text className="text-lg">🏠</Text>
          <Text className="font-mono text-[12px] font-bold text-on-surface mt-0.5">
            Home
          </Text>
        </Pressable>
        <Pressable
          className="items-center"
          onPress={() => navigation.navigate('Browse')}
        >
          <Text className="text-lg">🔍</Text>
          <Text className="font-mono text-[12px] text-on-surface mt-0.5">
            Browse
          </Text>
        </Pressable>
        <Pressable
          className="items-center"
          onPress={() => navigation.navigate('History')}
        >
          <Text className="text-lg">📜</Text>
          <Text className="font-mono text-[12px] text-on-surface mt-0.5">
            History
          </Text>
        </Pressable>
        <Pressable
          className="items-center"
          onPress={() => navigation.navigate('Profile')}
        >
          <Text className="text-lg">👤</Text>
          <Text className="font-mono text-[12px] text-on-surface mt-0.5">
            Profile
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
