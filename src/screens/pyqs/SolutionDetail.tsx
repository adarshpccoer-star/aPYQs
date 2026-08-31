import React, { memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Check, X } from 'lucide-react-native';
import { Question } from '../../api/question';
import LatexView from '../../components/latex';

interface SolutionViewProps {
  isCorrect: boolean;
  question: Question;
  userSelection: string[];
  natAnswer: string;
  targetAnswers: string[];
  onNextQuestion: () => void;
}

/* ... existing imports ... */

const SolutionDetail = memo((props: SolutionViewProps) => {
  const correctAnswerLatex =
    props.question.type === 'NAT'
      ? props.targetAnswers[0]
      : props.question.options
          ?.filter(option => props.targetAnswers.includes(option.key))
          .map(option => option.latex)
          .join(', ');

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
    <View className="flex-1 px-4 md:px-6 py-6 max-w-[720px] mx-auto w-full">
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
              Q. {props.question.number || ''}
            </Text>
          </View>
        </View>

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
      <View className="mb-8 w-full">
        <Text className="font-inter font-semibold text-[20px] leading-[28px] text-on-surface border-b border-surface-variant pb-2 mb-4">
          Explanation
        </Text>

        <View className="relative w-full">
          <View className="absolute left-4 top-4 bottom-6 w-[1px] bg-surface-variant" />

          {/* POINT 1 — CORRECT ANSWER */}
          <View className="flex-row gap-4 items-start mb-6 relative w-full">
            <View className="w-8 h-8 rounded-full bg-on-surface items-center justify-center shrink-0 z-10">
              <Text className="font-bold text-on-primary text-sm">1</Text>
            </View>
            <View className="pt-1 flex-1 min-w-0">
              <Text className="font-inter font-bold text-[16px] leading-[24px] text-on-surface mb-2">
                Correct Answer
              </Text>
              <View className="bg-surface-container-low border border-outline-variant rounded-lg p-4 w-full">
                <LatexView
                  latex={correctAnswerLatex || 'Correct answer not available.'}
                  fontSize={16}
                />
              </View>
            </View>
          </View>

          {/* POINT 2 — EXPLANATION */}
          <View className="flex-row gap-4 items-start mb-6 relative w-full">
            <View className="w-8 h-8 rounded-full bg-on-surface items-center justify-center shrink-0 z-10">
              <Text className="font-bold text-on-primary text-sm">2</Text>
            </View>
            <View className="pt-1 flex-1 min-w-0">
              <Text className="font-inter font-bold text-[16px] leading-[24px] text-on-surface mb-2">
                Explanation Detail
              </Text>
              <View className="w-full">
                <LatexView
                  latex={
                    props.question.explanationLatex ||
                    'No detailed explanation provided for this question.'
                  }
                  fontSize={15}
                />
              </View>
            </View>
          </View>
        </View>
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
    </View>
  );
});

SolutionDetail.displayName = 'SolutionDetail';
export default SolutionDetail;
