import React, { memo, useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useInfiniteQuery } from '@tanstack/react-query';
import { MoveLeft, MoveRight } from 'lucide-react-native';

import {
  fetchQuestions,
  Question,
  QuestionOption,
  saveQuestionProgress,
} from '../../api/question';
import SolutionDetail from './SolutionDetail';
import LatexView from '../../components/latex';
import { useThemeStore } from '../../store/useThemeStore';

export type RootStackParamList = {
  MainTabs: undefined;
  Practice: {
    branch: string;
    subject: string;
    initialQuestionId?: string;
  };
};

type PracticeRouteProp = RouteProp<RootStackParamList, 'Practice'>;

type AttemptState = {
  selectedOptions: string[];
  natAnswer: string;
  isSubmitted: boolean;
};

interface AnswerOptionProps {
  option: QuestionOption;
  optionKey: string;
  selected: boolean;
  submitted: boolean;
  target: boolean;
  type: 'MCQ' | 'MSQ';
  isDarkMode: boolean;
  onPress: (key: string) => void;
}

const AnswerOption = memo(
  ({
    option,
    optionKey,
    selected,
    submitted,
    target,
    type,
    isDarkMode,
    onPress,
  }: AnswerOptionProps) => {
    let borderStyle = 'border-slate-200 dark:border-slate-800';
    let bgStyle = 'bg-white dark:bg-slate-900';

    if (submitted) {
      if (target) {
        borderStyle = 'border-2 border-emerald-600 dark:border-emerald-500';
        bgStyle = 'bg-emerald-50 dark:bg-emerald-950/40';
      } else if (selected && !target) {
        borderStyle = 'border-2 border-rose-600 dark:border-rose-500';
        bgStyle = 'bg-rose-50 dark:bg-rose-950/40';
      }
    } else if (selected) {
      borderStyle = 'border-2 border-indigo-600 dark:border-indigo-400';
      bgStyle = 'bg-indigo-50/50 dark:bg-indigo-950/30';
    }

    return (
      <Pressable
        disabled={submitted}
        onPress={() => onPress(optionKey)}
        className={`border rounded-lg p-5 flex-row items-center gap-4 active:opacity-90 ${borderStyle} ${bgStyle}`}
      >
        <View
          className={`w-7 h-7 ${
            type === 'MSQ' ? 'rounded-md' : 'rounded-full'
          } border items-center justify-center ${
            submitted && target
              ? 'bg-emerald-600 border-emerald-600'
              : submitted && selected && !target
              ? 'bg-rose-600 border-rose-600'
              : selected
              ? 'bg-indigo-600 dark:bg-indigo-500 border-indigo-600 dark:border-indigo-500'
              : 'border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800'
          }`}
        >
          <Text
            className={`font-mono text-[12px] font-bold ${
              selected || (submitted && target)
                ? 'text-white'
                : 'text-slate-700 dark:text-slate-300'
            }`}
          >
            {optionKey}
          </Text>
        </View>

        <View className="flex-1">
          <LatexView
            latex={option.latex}
            fontSize={16}
            color={isDarkMode ? '#FFFFFF' : '#0F172A'}
          />
        </View>
      </Pressable>
    );
  },
);

AnswerOption.displayName = 'AnswerOption';

const PracticeScreen = ({ navigation }: any) => {
  const route = useRoute<PracticeRouteProp>();
  const { branch, subject, initialQuestionId } = route.params;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [attempts, setAttempts] = useState<Record<number, AttemptState>>({});

  const { theme } = useThemeStore();
  const isDarkMode = theme === 'dark';

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ['practiceQuestions', branch, subject],
    queryFn: ({ pageParam }) => fetchQuestions(branch, subject, pageParam, 20),
    initialPageParam: 1,
    getNextPageParam: lastPage =>
      lastPage.pagination.hasNextPage
        ? lastPage.pagination.page + 1
        : undefined,
  });

  const questions: Question[] = useMemo(
    () => (data ? data.pages.flatMap(p => p.data) : []),
    [data],
  );

  React.useEffect(() => {
    if (initialQuestionId && questions.length > 0) {
      const targetIndex = questions.findIndex(q => {
        const qId = typeof q._id === 'object' ? q._id.$oid : q._id;
        return qId === initialQuestionId;
      });

      if (targetIndex !== -1) {
        setCurrentIndex(targetIndex);
      }
    }
  }, [initialQuestionId, questions]);

  const currentQuestion = questions[currentIndex];

  const currentAttempt = attempts[currentIndex] || {
    selectedOptions: [],
    natAnswer: '',
    isSubmitted: false,
  };

  const { selectedOptions, natAnswer, isSubmitted } = currentAttempt;

  const updateAttempt = useCallback(
    (updater: (prev: AttemptState) => AttemptState) => {
      setAttempts(prev => ({
        ...prev,
        [currentIndex]: updater(
          prev[currentIndex] || {
            selectedOptions: [],
            natAnswer: '',
            isSubmitted: false,
          },
        ),
      }));
    },
    [currentIndex],
  );

  // Normalized to strings to prevent string vs number comparison bugs
  const targetAnswers: string[] = useMemo(() => {
    if (!currentQuestion) return [];

    if (Array.isArray(currentQuestion.answer)) {
      return currentQuestion.answer.map(String);
    }

    if (
      currentQuestion.answer !== undefined &&
      currentQuestion.answer !== null
    ) {
      return [String(currentQuestion.answer)];
    }

    return (
      currentQuestion.options
        ?.filter(option => option.correct)
        .map(option => String(option.key)) || []
    );
  }, [currentQuestion]);

  // Decoupled from `isSubmitted` state
  const isCorrect = useMemo(() => {
    if (!currentQuestion) return false;

    if (currentQuestion.type === 'MCQ') {
      return (
        selectedOptions.length === 1 &&
        targetAnswers.includes(selectedOptions[0])
      );
    }

    if (currentQuestion.type === 'MSQ') {
      if (selectedOptions.length !== targetAnswers.length) {
        return false;
      }

      const selectedSet = new Set(selectedOptions);
      return targetAnswers.every(answer => selectedSet.has(answer));
    }

    if (currentQuestion.type === 'NAT') {
      const userVal = parseFloat(natAnswer.trim());
      const targetVal = parseFloat(targetAnswers[0]);

      if (Number.isNaN(userVal) || Number.isNaN(targetVal)) {
        return false;
      }

      return Math.abs(userVal - targetVal) < 0.01;
    }

    return false;
  }, [currentQuestion, selectedOptions, targetAnswers, natAnswer]);

  const handleNextQuestion = useCallback(() => {
    const nextIdx = currentIndex + 1;
    if (nextIdx < questions.length) {
      setCurrentIndex(nextIdx);
    } else if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage().then(result => {
        const newQuestions = result.data?.pages.flatMap(p => p.data) || [];
        if (nextIdx < newQuestions.length) {
          setCurrentIndex(nextIdx);
        }
      });
    }
  }, [
    currentIndex,
    questions.length,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  ]);

  const handlePrevQuestion = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  const handleOptionPress = useCallback(
    (optionKey: string) => {
      if (isSubmitted || !currentQuestion) return;

      if (currentQuestion.type === 'MCQ') {
        updateAttempt(() => ({
          selectedOptions: [optionKey],
          natAnswer: '',
          isSubmitted: false,
        }));
      } else if (currentQuestion.type === 'MSQ') {
        updateAttempt(prev => ({
          ...prev,
          selectedOptions: prev.selectedOptions.includes(optionKey)
            ? prev.selectedOptions.filter(k => k !== optionKey)
            : [...prev.selectedOptions, optionKey],
        }));
      }
    },
    [isSubmitted, currentQuestion, updateAttempt],
  );

  const handleSubmit = useCallback(async () => {
    if (isSubmitted || !currentQuestion) return;

    const correct = isCorrect;

    updateAttempt(prev => ({
      ...prev,
      isSubmitted: true,
    }));

    const payload = {
      questionId: currentQuestion._id.toString(),
      solved: true,
      correct,
    };

    try {
      await saveQuestionProgress(payload);
    } catch (error) {
      console.error('Failed to save progress to server:', error);
    }
  }, [isSubmitted, currentQuestion, isCorrect, updateAttempt]);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-slate-950 items-center justify-center">
        <ActivityIndicator size="large" color="#6366f1" />
        <Text className="mt-2 text-slate-500 dark:text-slate-400 font-mono text-xs">
          Loading Practice Queue...
        </Text>
      </SafeAreaView>
    );
  }

  if (isError || !currentQuestion) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-slate-950 items-center justify-center p-6">
        <Text className="text-red-600 dark:text-red-400 font-bold mb-4">
          Failed to load questions.
        </Text>
        <Pressable
          onPress={() => navigation.goBack()}
          className="bg-indigo-600 dark:bg-indigo-500 px-4 py-2 rounded-lg"
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{ flex: 1 }}
      className="bg-white dark:bg-slate-950 flex-col"
    >
      <ScrollView
        key={`question-scroll-${currentIndex}`}
        className="flex-1 w-full max-w-[720px] mx-auto"
        contentContainerStyle={{
          paddingTop: 24,
          paddingBottom: 140,
          paddingHorizontal: 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* METADATA TAGS */}
        <View className="flex-row flex-wrap gap-2 mb-4">
          <View className="border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-2.5 py-1 rounded">
            <Text className="font-mono text-[12px] text-slate-600 dark:text-slate-400 uppercase font-medium">
              {currentQuestion.branch}
            </Text>
          </View>
          <View className="bg-indigo-50 dark:bg-indigo-950/50 px-2.5 py-1 rounded border border-indigo-200 dark:border-indigo-800">
            <Text className="font-mono text-[12px] font-bold text-indigo-600 dark:text-indigo-400 uppercase">
              {currentQuestion.type}
            </Text>
          </View>
        </View>

        {/* QUESTION */}
        <View className="mb-8">
          <LatexView
            latex={currentQuestion.questionLatex}
            fontSize={16}
            color={isDarkMode ? '#FFFFFF' : '#0F172A'}
          />
        </View>

        {/* OPTIONS */}
        {(currentQuestion.type === 'MCQ' || currentQuestion.type === 'MSQ') && (
          <View className="gap-3 mb-6">
            {currentQuestion.options?.map((option, idx) => {
              const optionKey = option.key || String.fromCharCode(65 + idx);
              return (
                <AnswerOption
                  key={`${currentIndex}-${optionKey}`}
                  option={option}
                  optionKey={optionKey}
                  selected={selectedOptions.includes(optionKey)}
                  submitted={isSubmitted}
                  target={targetAnswers.includes(optionKey)}
                  type={currentQuestion.type as 'MCQ' | 'MSQ'}
                  isDarkMode={isDarkMode}
                  onPress={handleOptionPress}
                />
              );
            })}
          </View>
        )}

        {/* NAT NUMERICAL INPUT */}
        {currentQuestion.type === 'NAT' && (
          <View className="mb-6 gap-2">
            <Text className="font-mono text-[14px] text-slate-600 dark:text-slate-400">
              Enter Numerical Answer:
            </Text>
            <TextInput
              keyboardType="numeric"
              editable={!isSubmitted}
              value={natAnswer}
              onChangeText={val =>
                updateAttempt(prev => ({ ...prev, natAnswer: val }))
              }
              placeholder="e.g. 12.5"
              placeholderTextColor="#94a3b8"
              className={`border p-4 rounded-lg font-mono text-[18px] bg-white dark:bg-slate-900 ${
                isSubmitted
                  ? isCorrect
                    ? 'border-emerald-600 dark:border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-slate-900 dark:text-white'
                    : 'border-rose-600 dark:border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-slate-900 dark:text-white'
                  : 'border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white'
              }`}
            />
          </View>
        )}

        {/* SUBMIT BUTTON */}
        {!isSubmitted && (
          <Pressable
            onPress={handleSubmit}
            disabled={
              currentQuestion.type === 'NAT'
                ? !natAnswer.trim()
                : selectedOptions.length === 0
            }
            className={`w-full py-4 rounded-lg items-center mb-6 active:opacity-90 ${
              (
                currentQuestion.type === 'NAT'
                  ? natAnswer.trim()
                  : selectedOptions.length > 0
              )
                ? 'bg-indigo-600 dark:bg-indigo-500'
                : 'bg-slate-200 dark:bg-slate-800 opacity-50'
            }`}
          >
            <Text className="text-white font-semibold text-[16px]">
              Submit Answer
            </Text>
          </Pressable>
        )}

        {/* SOLUTION */}
        {isSubmitted && (
          <SolutionDetail
            key={`solution-detail-${currentIndex}`}
            isCorrect={isCorrect}
            question={currentQuestion}
            userSelection={selectedOptions}
            natAnswer={natAnswer}
            targetAnswers={targetAnswers}
            onNextQuestion={handleNextQuestion}
          />
        )}
      </ScrollView>

      {/* FOOTER NAVIGATION */}
      <View className="absolute bottom-0 left-0 w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4 z-20 pb-safe">
        <View className="max-w-[720px] w-full mx-auto flex-row justify-between items-center gap-4 px-2">
          {/* Previous Button */}
          <Pressable
            onPress={handlePrevQuestion}
            disabled={currentIndex === 0}
            style={[
              styles.navButton,
              currentIndex === 0 ? styles.disabledBtn : styles.activeBtn,
            ]}
            className="bg-slate-100 dark:bg-slate-800"
          >
            <MoveLeft size={18} color={isDarkMode ? '#FFFFFF' : '#0F172A'} />
            <Text className="font-inter font-semibold text-[14px] text-slate-900 dark:text-white">
              Previous
            </Text>
          </Pressable>

          {/* Next Button */}
          <Pressable
            onPress={handleNextQuestion}
            disabled={!hasNextPage && currentIndex >= questions.length - 1}
            style={styles.navButton}
            className="bg-indigo-600 dark:bg-indigo-500"
          >
            <Text className="font-inter font-semibold text-[14px] text-white">
              Next
            </Text>
            <MoveRight size={18} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  navButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  disabledBtn: {
    opacity: 0.3,
  },
  activeBtn: {
    opacity: 1,
  },
});

export default PracticeScreen;
