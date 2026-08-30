import React, { memo } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Check, X } from 'lucide-react-native';
import { Question } from '../../api/question';

interface SolutionViewProps {
  isCorrect: boolean;
  question: Question;
  userSelection: string[];
  natAnswer: string;
  targetAnswers: string[];
  onNextQuestion: () => void;
}

const SolutionDetail = memo((props: SolutionViewProps) => {
  const navigation = useNavigation<any>();

  // Helper to format user's answer string cleanly
  const renderUserAnswer = () => {
    if (props.question.type === 'NAT') {
      return props.natAnswer.trim() || 'No answer entered';
    }
    if (props.userSelection && props.userSelection.length > 0) {
      return props.userSelection.join(', ');
    }
    return 'None selected';
  };

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-background">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 90 }}
        className="flex-1 px-4 md:px-6 py-6 max-w-[720px] mx-auto w-full"
        showsVerticalScrollIndicator={false}
      >
        {/* STATUS HEADER */}
        <View className="items-center justify-center text-center py-4 mb-2">
          <View
            className={`w-20 h-20 rounded-full items-center justify-center mb-3 ${
              props.isCorrect ? 'bg-primary-container/20' : 'bg-red-500/20'
            }`}
          >
            {props.isCorrect ? (
              <Check size={36} className="text-primary" />
            ) : (
              <X size={36} className="text-red-600" />
            )}
          </View>

          <Text className="font-inter text-[32px] leading-[40px] font-extrabold text-on-surface mb-1">
            {props.isCorrect ? 'Correct!' : 'Incorrect'}
          </Text>

          <Text className="font-inter text-[18px] leading-[28px] text-secondary text-center">
            {props.isCorrect
              ? 'You accurately identified the correct answer.'
              : `Correct answer: ${props.targetAnswers.join(', ')}`}
          </Text>
        </View>

        {/* QUESTION SUMMARY CARD */}
        <View className="bg-surface-container-lowest border border-outline-variant p-6 rounded-lg mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <View className="border border-outline-variant px-2 py-1 rounded">
              <Text className="font-mono text-[12px] leading-[16px] text-on-surface uppercase font-medium">
                {props.question.type}
              </Text>
            </View>
            <View className="border border-outline-variant m-2 px-2 py-1 rounded">
              <Text className="font-mono text-[12px] leading-[16px] text-on-surface uppercase font-medium">
                {props.question.branch}
              </Text>
            </View>
            <View className="border border-outline-variant bg-surface-container-low px-2 py-1 rounded">
              <Text className="font-mono text-[12px] leading-[16px] text-on-surface-variant uppercase font-medium">
                Q. 42
              </Text>
            </View>
          </View>

          <Text className="font-inter font-semibold text-[20px] leading-[28px] text-on-surface mb-4">
            {props.question.questionLatex}
          </Text>

          <View
            className={`border-l-4 p-4 rounded-r ${
              props.isCorrect
                ? 'border-primary bg-surface-container-low'
                : 'border-red-600 bg-red-500/10'
            }`}
          >
            <View className="flex-row items-start gap-2">
              <Text
                className={`font-bold text-base mt-0.5 ${
                  props.isCorrect ? 'text-primary' : 'text-red-600'
                }`}
              >
                {props.isCorrect ? '✓' : '✕'}
              </Text>
              <Text className="font-inter text-[16px] leading-[24px] text-on-surface flex-1">
                <Text className="font-bold">Your Answer: </Text>
                {renderUserAnswer()}
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
            <View className="absolute left-4 top-4 bottom-6 w-[1px] bg-surface-variant" />

            <View className="flex-row gap-4 items-start mb-6 relative">
              <View className="w-8 h-8 rounded-full bg-on-surface items-center justify-center shrink-0 z-10">
                <Text className="font-bold text-on-primary text-sm">1</Text>
              </View>
              <View className="pt-1 flex-1">
                <Text className="font-inter text-[16px] leading-[24px] text-on-surface">
                  {props.question.explanationLatex ||
                    'No detailed explanation provided for this question.'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* KEY CONCEPT HIGHLIGHT BOX */}
        <View className="bg-on-surface p-6 rounded-lg mb-8 relative overflow-hidden">
          <View className="absolute -right-8 -top-8 w-32 h-32 bg-primary rounded-full opacity-25 blur-xl" />

          <View className="flex-row items-center gap-2 mb-3 z-10">
            <Text className="text-xl">💡</Text>
            <Text className="font-inter font-bold text-[20px] leading-[28px] text-on-primary">
              Key Concept
            </Text>
          </View>

          <Text className="font-inter text-[16px] leading-[24px] text-surface-container-low z-10">
            Make sure to review fundamental principles related to{' '}
            {props.question.branch} to consistently solve similar problems under
            timed conditions.
          </Text>
        </View>

        {/* ACTIONS */}
        <View className="flex-col sm:flex-row gap-4 pt-6 border-t border-surface-variant">
          <Pressable className="bg-surface border border-on-surface py-3 px-6 rounded-none flex-row justify-center items-center gap-2 active:bg-surface-container-low">
            <Text className="text-on-surface font-semibold text-[14px] leading-[20px]">
              📌 Save for Review
            </Text>
          </Pressable>

          <Pressable
            onPress={props.onNextQuestion}
            className="bg-on-surface py-3 px-6 rounded-none flex-row justify-center items-center gap-2 active:opacity-90 shadow-sm"
          >
            <Text className="text-on-primary font-semibold text-[14px] leading-[20px]">
              Next Question →
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
});

SolutionDetail.displayName = 'SolutionDetail';

export default SolutionDetail;
