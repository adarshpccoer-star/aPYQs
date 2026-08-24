import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const chartData = [
    { day: 'Mon', height: 'h-[30%]' },
    { day: 'Tue', height: 'h-[50%]' },
    { day: 'Wed', height: 'h-[80%]' },
    { day: 'Thu', height: 'h-[40%]' },
    { day: 'Fri', height: 'h-[95%]' },
    { day: 'Sat', height: 'h-[60%]' },
    { day: 'Sun', height: 'h-[20%]' },
  ];

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-background">
      {/* HEADER */}
      <View className="bg-surface border-b border-surface-variant flex-row justify-between items-center w-full px-6 py-4">
        <View className="flex-row items-center gap-2">
          <Image
            source={{
              uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHtlVTMQdbh3kiQAa4o1ZSUbelvsLa2aiwLR79-N_C0Ss6lmbACB26BbucWklQvfnMZJG77OIbNUH5Wi8FqPfKRolDSXzw9df2bUReKWSorUoC4TJoJDDy-rOeAgqj547vaqNJEUONG0SbwNZ2GwsPs_MXIBPZm7Q6EljLOdS285wmMR2oVcxlj1XG7PGqDNmxzMjBGbpHFcGgaOw6g8RP0LyQ9os4Cc4_kxojZv0Htan9hfiVQpc',
            }}
            className="w-8 h-8 rounded-full border border-surface-variant"
          />
          <Text className="font-mono text-[12px] leading-[16px] tracking-widest text-on-surface font-medium">
            PYQ MASTER
          </Text>
        </View>
        <TouchableOpacity className="p-2 rounded-full bg-surface-container-low">
          <Text className="text-on-surface-variant">🔔</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 80 }}
        className="px-4 py-6 gap-y-6"
      >
        {/* PROFILE HEADER */}
        <View className="items-center py-2">
          <Image
            source={{
              uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBl3dT7gLoG0AqfsS5FwUfh9E6_eGTBZkljmlR7MEwQvVxb4-4dIVBbRdKSThs1gX2RgrfP0oin2RjeNz5PLeBHfGlF1idcawm-yONqfv3zFFQhM7TdCbSMGFP5AYN9LMg2R_wiEZG3t-LtZqRi5Nk65Kw2B79cj6tSt8dWcpmj-OhvbhwjyuLRTA6qxGHOSMTbZHEFa3VcLW-7wZv-Fn40xjbYjEKyKjMeCdYaOUsM5TeEbnj2YD8',
            }}
            className="w-32 h-32 rounded-full border-2 border-surface-variant"
          />
          <View className="items-center mt-3">
            <Text className="font-inter font-bold text-[24px] leading-[32px] text-on-background">
              Alex Mercer
            </Text>
            <Text className="font-inter text-[18px] leading-[28px] text-on-surface-variant mt-1">
              Computer Science Major
            </Text>
            <View className="flex-row gap-2 mt-4">
              <View className="border border-surface-variant px-2 py-1 rounded">
                <Text className="font-mono text-[12px] leading-[16px] text-on-surface">
                  2024 Aspirant
                </Text>
              </View>
              <View className="border border-surface-variant px-2 py-1 rounded">
                <Text className="font-mono text-[12px] leading-[16px] text-on-surface">
                  GATE CS
                </Text>
              </View>
            </View>
          </View>
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

        {/* SAVED QUESTIONS */}
        <View className="gap-3">
          <Text className="font-inter font-semibold text-[20px] text-on-background">
            Saved Questions
          </Text>

          <View className="bg-surface border border-surface-variant p-4 rounded-lg gap-2">
            <View className="flex-row gap-2">
              <View className="border border-surface-variant px-2 py-0.5 rounded">
                <Text className="font-mono text-[12px]">2022</Text>
              </View>
              <View className="border border-surface-variant px-2 py-0.5 rounded">
                <Text className="font-mono text-[12px]">ALGO</Text>
              </View>
              <View className="border border-error px-2 py-0.5 rounded">
                <Text className="font-mono text-[12px] text-error">HARD</Text>
              </View>
            </View>
            <Text
              className="font-inter text-[16px] leading-[24px] text-on-background"
              numberOfLines={2}
            >
              Determine the time complexity of the following recursive function
              using the Master Theorem...
            </Text>
          </View>

          <View className="bg-surface border border-surface-variant p-4 rounded-lg gap-2">
            <View className="flex-row gap-2">
              <View className="border border-surface-variant px-2 py-0.5 rounded">
                <Text className="font-mono text-[12px]">2021</Text>
              </View>
              <View className="border border-surface-variant px-2 py-0.5 rounded">
                <Text className="font-mono text-[12px]">OS</Text>
              </View>
              <View className="border border-surface-variant px-2 py-0.5 rounded">
                <Text className="font-mono text-[12px]">MED</Text>
              </View>
            </View>
            <Text
              className="font-inter text-[16px] leading-[24px] text-on-background"
              numberOfLines={2}
            >
              Consider a system with 4 processes and 3 resource types. Check if
              the current state is safe...
            </Text>
          </View>

          <TouchableOpacity className="border border-surface-variant bg-transparent py-2.5 rounded items-center">
            <Text className="font-inter font-semibold text-[14px] text-on-background">
              View All Saved (42)
            </Text>
          </TouchableOpacity>
        </View>

        {/* RECENT MOCK TESTS */}
        <View className="gap-3">
          <Text className="font-inter font-semibold text-[20px] text-on-background">
            Recent Mock Tests
          </Text>

          <View className="flex-row justify-between items-center bg-surface border border-surface-variant p-4 rounded-lg">
            <View>
              <Text className="font-inter font-bold text-[16px] text-on-background">
                Full Mock Test - 04
              </Text>
              <Text className="font-mono text-[12px] text-on-surface-variant mt-1">
                Oct 12, 2023
              </Text>
            </View>
            <View className="items-end">
              <Text className="font-inter font-semibold text-[20px] text-on-background">
                58/65
              </Text>
              <Text className="font-mono text-[12px] text-primary-container">
                Score
              </Text>
            </View>
          </View>

          <View className="flex-row justify-between items-center bg-surface border border-surface-variant p-4 rounded-lg">
            <View>
              <Text className="font-inter font-bold text-[16px] text-on-background">
                Subject Mock: DBMS
              </Text>
              <Text className="font-mono text-[12px] text-on-surface-variant mt-1">
                Oct 08, 2023
              </Text>
            </View>
            <View className="items-end">
              <Text className="font-inter font-semibold text-[20px] text-on-background">
                22/25
              </Text>
              <Text className="font-mono text-[12px] text-primary-container">
                Score
              </Text>
            </View>
          </View>

          <TouchableOpacity className="bg-black py-2.5 rounded items-center">
            <Text className="font-inter font-semibold text-[14px] text-white">
              Start New Test
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* FIXED BOTTOM NAVIGATION */}
      <View className="absolute bottom-0 left-0 right-0 h-16 bg-surface border-t border-surface-variant flex-row justify-around items-center px-4">
        <TouchableOpacity className="items-center">
          <Text className="text-lg">🏠</Text>
          <Text className="font-inter font-semibold text-[12px] text-on-secondary-container mt-0.5">
            Home
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center">
          <Text className="text-lg">🔍</Text>
          <Text className="font-inter font-semibold text-[12px] text-on-secondary-container mt-0.5">
            Browse
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center">
          <Text className="text-lg">📜</Text>
          <Text className="font-inter font-semibold text-[12px] text-on-secondary-container mt-0.5">
            History
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center">
          <Text className="text-lg">👤</Text>
          <Text className="font-inter font-bold text-[12px] text-primary mt-0.5">
            Profile
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
