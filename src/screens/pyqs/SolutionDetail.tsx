import React, { memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Check, X } from 'lucide-react-native';
import { Question } from '../../api/question';
import LatexView from '../../components/latex';
import { useThemeStore } from '../../store/useThemeStore';

interface SolutionViewProps {
  isCorrect: boolean;
  question: Question;
  userSelection: string[];
  natAnswer: string;
  targetAnswers: string[];
  onNextQuestion: () => void;
}

const SolutionDetail = memo((props: SolutionViewProps) => {
  const { theme } = useThemeStore();
  const isDarkMode = theme === 'dark';
  const latexTextColor = isDarkMode ? '#FFFFFF' : '#0F172A';

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
            props.isCorrect
              ? 'bg-emerald-100 dark:bg-emerald-950/60'
              : 'bg-rose-100 dark:bg-rose-950/60'
          }`}
        >
          {props.isCorrect ? (
            <Check size={36} color={isDarkMode ? '#34d399' : '#16a34a'} />
          ) : (
            <X size={36} color={isDarkMode ? '#f87171' : '#dc2626'} />
          )}
        </View>
        <Text className="font-inter text-[32px] leading-[40px] font-extrabold text-slate-900 dark:text-white mb-1">
          {props.isCorrect ? 'Correct!' : 'Incorrect'}
        </Text>
        <Text className="font-inter text-[18px] leading-[28px] text-slate-600 dark:text-slate-400 text-center">
          {props.isCorrect
            ? 'You accurately identified the correct answer.'
            : `Correct answer: ${props.targetAnswers.join(', ')}`}
        </Text>
      </View>

      {/* QUESTION SUMMARY CARD */}
      <View className="bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-6 rounded-xl mb-6">
        <View className="flex-row justify-between items-center mb-4">
          <View className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1 rounded">
            <Text className="font-mono text-[12px] leading-[16px] text-slate-800 dark:text-slate-200 uppercase font-medium">
              {props.question.type}
            </Text>
          </View>
          <View className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1 rounded">
            <Text className="font-mono text-[12px] leading-[16px] text-slate-800 dark:text-slate-200 uppercase font-medium">
              {props.question.branch}
            </Text>
          </View>
          <View className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1 rounded">
            <Text className="font-mono text-[12px] leading-[16px] text-slate-600 dark:text-slate-400 uppercase font-medium">
              Q. {props.question.number || ''}
            </Text>
          </View>
        </View>

        <View
          className={`border-l-4 p-4 rounded-r ${
            props.isCorrect
              ? 'border-emerald-600 dark:border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40'
              : 'border-rose-600 dark:border-rose-500 bg-rose-50 dark:bg-rose-950/40'
          }`}
        >
          <View className="flex-row items-start gap-2">
            <Text
              className={`font-bold text-base mt-0.5 ${
                props.isCorrect
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {props.isCorrect ? '✓' : '✕'}
            </Text>
            <Text className="font-inter text-[16px] leading-[24px] text-slate-900 dark:text-slate-100 flex-1">
              <Text className="font-bold">Your Answer: </Text>
              {renderUserAnswer()}
            </Text>
          </View>
        </View>
      </View>

      {/* STEP-BY-STEP EXPLANATION */}
      <View className="mb-8 w-full">
        <Text className="font-inter font-semibold text-[20px] leading-[28px] text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2 mb-4">
          Explanation
        </Text>

        <View className="relative w-full">
          <View className="absolute left-4 top-4 bottom-6 w-[1px] bg-slate-200 dark:bg-slate-800" />

          {/* POINT 1 — CORRECT ANSWER */}
          <View className="flex-row gap-4 items-start mb-6 relative w-full">
            <View className="w-8 h-8 rounded-full bg-slate-900 dark:bg-slate-100 items-center justify-center shrink-0 z-10">
              <Text className="font-bold text-white dark:text-slate-900 text-sm">
                1
              </Text>
            </View>
            <View className="pt-1 flex-1 min-w-0">
              <Text className="font-inter font-bold text-[16px] leading-[24px] text-slate-900 dark:text-white mb-2">
                Correct Answer
              </Text>
              <View className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 w-full">
                <LatexView
                  latex={correctAnswerLatex || 'Correct answer not available.'}
                  fontSize={16}
                  color={latexTextColor}
                />
              </View>
            </View>
          </View>

          {/* POINT 2 — EXPLANATION */}
          <View className="flex-row gap-4 items-start mb-6 relative w-full">
            <View className="w-8 h-8 rounded-full bg-slate-900 dark:bg-slate-100 items-center justify-center shrink-0 z-10">
              <Text className="font-bold text-white dark:text-slate-900 text-sm">
                2
              </Text>
            </View>
            <View className="pt-1 flex-1 min-w-0">
              <Text className="font-inter font-bold text-[16px] leading-[24px] text-slate-900 dark:text-white mb-2">
                Explanation Detail
              </Text>
              <View className="w-full">
                <LatexView
                  latex={
                    props.question.explanationLatex ||
                    'No detailed explanation provided for this question.'
                  }
                  fontSize={15}
                  color={latexTextColor}
                />
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* ACTIONS */}
      <View className="flex-col sm:flex-row gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
        <Pressable className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 py-3 px-6 rounded-lg flex-row justify-center items-center gap-2 active:bg-slate-100 dark:active:bg-slate-800">
          <Text className="text-slate-800 dark:text-slate-200 font-semibold text-[14px] leading-[20px]">
            📌 Save for Review
          </Text>
        </Pressable>
        <Pressable
          onPress={props.onNextQuestion}
          className="bg-indigo-600 dark:bg-indigo-500 py-3 px-6 rounded-lg flex-row justify-center items-center gap-2 active:opacity-90"
        >
          <Text className="text-white font-semibold text-[14px] leading-[20px]">
            Next Question →
          </Text>
        </Pressable>
      </View>
    </View>
  );
});

SolutionDetail.displayName = 'SolutionDetail';
export default SolutionDetail;
