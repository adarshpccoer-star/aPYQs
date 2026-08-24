import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

interface Step {
  id: number;
  text: string;
}

const EXPLANATION_STEPS: Step[] = [
  {
    id: 1,
    text: 'Great Britain had vast, easily accessible deposits of coal and iron ore, which were essential raw materials for early industrial machinery.',
  },
  {
    id: 2,
    text: 'The invention of the steam engine (notably by James Watt) allowed for more efficient extraction of these resources and powered new factories.',
  },
  {
    id: 3,
    text: 'Simultaneously, the textile industry saw rapid mechanization (e.g., spinning jenny, power loom), creating a self-sustaining cycle of economic growth fueled by these resources.',
  },
];

const SolutionDetail = () => {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-background">
      {/* HEADER */}
      <View className="bg-surface border-b border-surface-variant flex-row justify-between items-center w-full px-4 py-4">
        <Text className="font-mono text-[12px] leading-[16px] tracking-widest text-on-surface font-extrabold uppercase">
          PYQ MASTER
        </Text>
        <Pressable
          onPress={() => navigation.goBack()}
          className="p-2 rounded-full active:bg-surface-container-low"
        >
          <Text className="text-on-surface text-lg font-bold">✕</Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 90 }}
        className="flex-1 px-4 md:px-6 py-6 max-w-[720px] mx-auto w-full"
        showsVerticalScrollIndicator={false}
      >
        {/* STATUS HEADER */}
        <View className="items-center justify-center text-center py-4 mb-2">
          <View className="w-20 h-20 rounded-full bg-primary-container/20 items-center justify-center mb-3">
            <Text className="text-4xl text-primary font-bold">✓</Text>
          </View>
          <Text className="font-inter text-[32px] leading-[40px] font-extrabold text-on-surface mb-1">
            Correct!
          </Text>
          <Text className="font-inter text-[18px] leading-[28px] text-secondary text-center">
            You accurately identified the primary cause of the historical event.
          </Text>
        </View>

        {/* QUESTION SUMMARY CARD */}
        <View className="bg-surface-container-lowest border border-outline-variant p-6 rounded-lg mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <View className="border border-outline-variant px-2 py-1 rounded">
              <Text className="font-mono text-[12px] leading-[16px] text-on-surface uppercase font-medium">
                History 2018
              </Text>
            </View>
            <View className="border border-outline-variant bg-surface-container-low px-2 py-1 rounded">
              <Text className="font-mono text-[12px] leading-[16px] text-on-surface-variant uppercase font-medium">
                Q. 42
              </Text>
            </View>
          </View>

          <Text className="font-inter font-semibold text-[20px] leading-[28px] text-on-surface mb-4">
            What was the primary economic catalyst for the Industrial Revolution
            in Great Britain?
          </Text>

          <View className="border-l-4 border-primary bg-surface-container-low p-4 rounded-r">
            <View className="flex-row items-start gap-2">
              <Text className="text-primary font-bold text-base mt-0.5">✓</Text>
              <Text className="font-inter text-[16px] leading-[24px] text-on-surface flex-1">
                <Text className="font-bold">Your Answer: </Text>
                The availability of coal and iron resources combined with
                technological innovations in textile manufacturing.
              </Text>
            </View>
          </View>
        </View>

        {/* STEP-BY-STEP EXPLANATION */}
        <View className="mb-6">
          <Text className="font-inter font-semibold text-[20px] leading-[28px] text-on-surface border-b border-surface-variant pb-2 mb-4">
            Explanation
          </Text>

          <View className="relative">
            {/* Vertical connector line */}
            <View className="absolute left-4 top-4 bottom-6 w-[1px] bg-surface-variant" />

            {EXPLANATION_STEPS.map(step => (
              <View
                key={step.id}
                className="flex-row gap-4 items-start mb-6 relative"
              >
                <View className="w-8 h-8 rounded-full bg-on-surface items-center justify-center shrink-0 z-10">
                  <Text className="font-bold text-on-primary text-sm">
                    {step.id}
                  </Text>
                </View>
                <View className="pt-1 flex-1">
                  <Text className="font-inter text-[16px] leading-[24px] text-on-surface">
                    {step.text}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* KEY CONCEPT HIGHLIGHT BOX */}
        <View className="bg-on-surface p-6 rounded-lg mb-8 relative overflow-hidden">
          {/* Accent light highlight effect */}
          <View className="absolute -right-8 -top-8 w-32 h-32 bg-primary rounded-full opacity-25 blur-xl" />

          <View className="flex-row items-center gap-2 mb-3 z-10">
            <Text className="text-xl">💡</Text>
            <Text className="font-inter font-bold text-[20px] leading-[28px] text-on-primary">
              Key Concept: Resource Determinism
            </Text>
          </View>

          <Text className="font-inter text-[16px] leading-[24px] text-surface-container-low z-10">
            Resource determinism in economic history suggests that the initial
            availability of key natural resources (like coal in Britain)
            dictates the pace and nature of industrial development in a specific
            region, giving them a structural advantage over resource-poor
            nations.
          </Text>
        </View>

        {/* ACTIONS */}
        <View className="flex-col sm:flex-row gap-4 pt-6 border-t border-surface-variant">
          <Pressable className="bg-surface border border-on-surface py-3 px-6 rounded-none flex-row justify-center items-center gap-2 active:bg-surface-container-low">
            <Text className="text-on-surface font-semibold text-[14px] leading-[20px]">
              📌 Save for Review
            </Text>
          </Pressable>

          <Pressable className="bg-on-surface py-3 px-6 rounded-none flex-row justify-center items-center gap-2 active:opacity-90 shadow-sm">
            <Text className="text-on-primary font-semibold text-[14px] leading-[20px]">
              Next Question →
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* FIXED BOTTOM NAVIGATION */}
      <View className="absolute bottom-0 left-0 right-0 h-16 bg-surface border-t border-surface-variant flex-row justify-around items-center px-4">
        <Pressable
          className="items-center"
          onPress={() => navigation.navigate('Home')}
        >
          <Text className="text-lg">🏠</Text>
          <Text className="font-mono text-[12px] text-on-surface mt-0.5">
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
          <Text className="font-mono text-[12px] font-bold text-primary mt-0.5">
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

export default SolutionDetail;
