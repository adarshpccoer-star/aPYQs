import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const PracticeScreen = () => {
  const navigation = useNavigation<any>();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const options = [
    { id: 'A', text: 'x₀ = F₀ / k' },
    { id: 'B', text: 'x₀ = -F₀ / k' },
    { id: 'C', text: 'x₀ = F₀ / (2k)' },
    { id: 'D', text: 'x₀ = 0' },
  ];

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-background flex-col">
      {/* TOP APP BAR */}
      <View className="bg-surface border-b border-surface-variant flex-row justify-between items-center w-full px-6 py-4 z-10">
        <View className="flex-row items-center gap-4">
          <Pressable
            onPress={() => navigation.goBack()}
            className="p-2 rounded-full active:bg-surface-container-low"
          >
            <Text className="text-on-surface-variant text-xl leading-none">
              ✕
            </Text>
          </Pressable>
          <Text className="font-mono text-[12px] leading-[16px] tracking-widest text-on-surface uppercase font-medium">
            PYQ MASTER
          </Text>
        </View>

        <View className="flex-row items-center gap-4">
          <View className="flex-row items-center gap-2 bg-surface-container px-3 py-1.5 rounded-full border border-surface-variant">
            <Text className="text-primary text-sm">⏱</Text>
            <Text className="font-mono text-[12px] leading-[16px] font-bold text-on-surface">
              14:23
            </Text>
          </View>
          <Pressable className="p-2 rounded-full active:bg-surface-container-low active:scale-95">
            <Text className="text-on-surface-variant text-xl leading-none">
              🔖
            </Text>
          </Pressable>
        </View>
      </View>

      {/* MAIN CONTENT */}
      <ScrollView
        className="flex-1 w-full max-w-[720px] mx-auto"
        contentContainerStyle={{
          paddingTop: 32,
          paddingBottom: 120,
          paddingHorizontal: 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress Indicator */}
        <View className="mb-6">
          <View className="flex-row justify-between items-end mb-2">
            <Text className="font-mono text-[12px] leading-[16px] tracking-wider text-on-surface-variant uppercase font-medium">
              Question 5 of 20
            </Text>
            <Text className="font-mono text-[12px] leading-[16px] tracking-wider text-on-surface-variant font-medium">
              25%
            </Text>
          </View>
          <View className="w-full bg-surface-variant h-2 rounded-full overflow-hidden">
            <View className="bg-primary-container h-2 w-1/4 rounded-full" />
          </View>
        </View>

        {/* Question Context Tags */}
        <View className="flex-row flex-wrap gap-2 mb-4">
          {['2023', 'Advanced', 'Physics'].map(tag => (
            <View
              key={tag}
              className="border border-surface-variant px-2 py-1 rounded"
            >
              <Text className="font-mono text-[12px] leading-[16px] tracking-wider text-on-surface-variant uppercase font-medium">
                {tag}
              </Text>
            </View>
          ))}
        </View>

        {/* Question Text */}
        <View className="mb-10">
          <Text className="font-inter font-bold text-[24px] leading-[32px] md:text-[32px] md:leading-[40px] tracking-tight text-on-surface">
            A particle of mass m moves in a one-dimensional potential V(x) =
            kx²/2. If it is subjected to a constant force F₀, what is the new
            equilibrium position?
          </Text>
        </View>

        {/* Multiple Choice Options */}
        <View className="gap-4">
          {options.map(option => {
            const isSelected = selectedOption === option.id;

            return (
              <Pressable
                key={option.id}
                onPress={() => setSelectedOption(option.id)}
                className={`bg-surface border rounded-lg p-6 transition-all flex-row items-start gap-4 active:border-on-surface-variant
                  ${
                    isSelected
                      ? 'border-[2px] border-on-surface -translate-y-0.5'
                      : 'border-surface-variant'
                  }`}
              >
                <View
                  className={`w-8 h-8 rounded-full border flex items-center justify-center
                    ${
                      isSelected
                        ? 'bg-on-surface border-on-surface'
                        : 'border-surface-variant bg-transparent'
                    }`}
                >
                  <Text
                    className={`font-mono text-[12px] font-medium
                      ${isSelected ? 'text-surface' : 'text-on-surface'}`}
                  >
                    {option.id}
                  </Text>
                </View>
                <View className="pt-1 flex-1">
                  <Text className="font-inter text-[18px] leading-[28px] text-on-surface">
                    {option.text}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      {/* BOTTOM ACTION BAR */}
      <View className="absolute bottom-0 left-0 w-full bg-surface border-t border-surface-variant p-4 z-20 pb-safe">
        <View className="max-w-[720px] w-full mx-auto flex-row justify-between items-center gap-4 px-2">
          <Pressable className="px-6 py-3 border border-on-surface rounded active:bg-surface-container-low transition-colors">
            <Text className="font-inter font-semibold text-[14px] leading-[20px] tracking-wide text-on-surface">
              Previous
            </Text>
          </Pressable>

          <Pressable className="px-8 py-3 bg-primary-container rounded active:scale-95 active:opacity-90 transition-all flex-row items-center gap-2">
            <Text className="font-inter font-semibold text-[14px] leading-[20px] tracking-wide text-on-surface">
              Next Question
            </Text>
            <Text className="text-on-surface text-lg leading-none mt-0.5">
              →
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PracticeScreen;
