import React, { memo, useCallback, useMemo, useState } from 'react';

import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  ActivityIndicator,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useInfiniteQuery } from '@tanstack/react-query';
import { MoveRight } from 'lucide-react-native';

import { fetchQuestions, Question, QuestionOption } from '../../api/question';
import SolutionDetail from './SolutionDetail';
import LatexView from '../../components/latex';

export type RootStackParamList = {
  MainTabs: undefined;
  Practice: {
    branch: string;
    subject: string;
  };
};

type PracticeRouteProp = RouteProp<RootStackParamList, 'Practice'>;

interface AnswerOptionProps {
  option: QuestionOption;
  optionKey: string;
  selected: boolean;
  submitted: boolean;
  target: boolean;
  type: 'MCQ' | 'MSQ';
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
    onPress,
  }: AnswerOptionProps) => {
    let borderStyle = 'border-surface-variant';
    let bgStyle = 'bg-surface';

    if (submitted) {
      if (target) {
        borderStyle = 'border-2 border-green-600';
        bgStyle = 'bg-green-500/10';
      } else if (selected && !target) {
        borderStyle = 'border-2 border-red-600';
        bgStyle = 'bg-red-500/10';
      }
    } else if (selected) {
      borderStyle = 'border-2 border-on-surface';
    }

    return (
      <Pressable
        disabled={submitted}
        onPress={() => onPress(optionKey)}
        className={`border rounded-lg p-5 flex-row items-center gap-4 ${borderStyle} ${bgStyle}`}
      >
        <View
          className={`w-7 h-7 ${
            type === 'MSQ' ? 'rounded-md' : 'rounded-full'
          } border items-center justify-center ${
            submitted && target
              ? 'bg-green-600 border-green-600'
              : submitted && selected && !target
              ? 'bg-red-600 border-red-600'
              : selected
              ? 'bg-on-surface border-on-surface'
              : 'border-surface-variant'
          }`}
        >
          <Text
            className={`font-mono text-[12px] ${
              selected || (submitted && target)
                ? 'text-white'
                : 'text-on-surface'
            }`}
          >
            {optionKey}
          </Text>
        </View>

        <View className="flex-1">
          <LatexView latex={option.latex} fontSize={16} />
        </View>
      </Pressable>
    );
  },
);

AnswerOption.displayName = 'AnswerOption';

const PracticeScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<PracticeRouteProp>();

  const { branch, subject } = route.params;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [natAnswer, setNatAnswer] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState(false);

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

    getNextPageParam: lastPage => {
      if (!lastPage.pagination.hasNextPage) {
        return undefined;
      }

      return lastPage.pagination.page + 1;
    },
  });

  const questions: Question[] = useMemo(
    () => (data ? data.pages.flatMap(p => p.data) : []),
    [data],
  );

  const currentQuestion = questions[currentIndex];

  const targetAnswers: string[] = useMemo(() => {
    if (!currentQuestion) return [];

    if (Array.isArray(currentQuestion.answer)) {
      return currentQuestion.answer;
    }

    if (currentQuestion.answer) {
      return [String(currentQuestion.answer)];
    }

    return (
      currentQuestion.options?.filter(o => o.correct).map(o => o.key) || []
    );
  }, [currentQuestion]);

  const isCorrect = useMemo(() => {
    if (!currentQuestion || !isSubmitted) {
      return false;
    }

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

      return targetAnswers.every(ans => selectedSet.has(ans));
    }

    if (currentQuestion.type === 'NAT') {
      const userVal = parseFloat(natAnswer.trim());

      if (isNaN(userVal)) {
        return false;
      }

      const targetNum = parseFloat(targetAnswers[0]);

      if (!isNaN(targetNum)) {
        return Math.abs(userVal - targetNum) < 0.01;
      }
    }

    return false;
  }, [currentQuestion, isSubmitted, selectedOptions, targetAnswers, natAnswer]);

  const goToQuestion = useCallback((index: number) => {
    setSelectedOptions([]);
    setNatAnswer('');
    setIsSubmitted(false);
    setCurrentIndex(index);
  }, []);

  const handleNextQuestion = useCallback(async () => {
    const nextIdx = currentIndex + 1;

    if (nextIdx < questions.length) {
      goToQuestion(nextIdx);
      return;
    }

    if (hasNextPage && !isFetchingNextPage) {
      const result = await fetchNextPage();

      const newQuestions = result.data?.pages.flatMap(p => p.data) || [];

      if (nextIdx < newQuestions.length) {
        goToQuestion(nextIdx);
      }
    }
  }, [
    currentIndex,
    questions.length,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    goToQuestion,
  ]);

  const handleOptionPress = useCallback(
    (optionKey: string) => {
      if (isSubmitted || !currentQuestion) {
        return;
      }

      if (currentQuestion.type === 'MCQ') {
        setSelectedOptions([optionKey]);
        setIsSubmitted(true);
      } else if (currentQuestion.type === 'MSQ') {
        setSelectedOptions(prev =>
          prev.includes(optionKey)
            ? prev.filter(k => k !== optionKey)
            : [...prev, optionKey],
        );
      }
    },
    [isSubmitted, currentQuestion],
  );

  const handleSubmit = useCallback(() => {
    if (isSubmitted) {
      return;
    }

    setIsSubmitted(true);
  }, [isSubmitted]);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#0000ff" />

        <Text className="mt-2 text-tertiary font-mono">
          Loading Practice Queue...
        </Text>
      </SafeAreaView>
    );
  }

  if (isError || !currentQuestion) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center p-6">
        <Text className="text-red-600 font-bold mb-4">
          Failed to load questions.
        </Text>

        <Pressable
          onPress={() => navigation.goBack()}
          className="bg-primary px-4 py-2 rounded"
        >
          <Text className="text-white">Go Back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-background flex-col">
      <ScrollView
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
          <View className="border border-surface-variant px-2 py-1 rounded">
            <Text className="font-mono text-[12px] text-on-surface-variant uppercase">
              {currentQuestion.branch}
            </Text>
          </View>

          <View className="bg-surface-container px-2 py-1 rounded border border-surface-variant">
            <Text className="font-mono text-[12px] font-bold text-on-surface uppercase">
              {currentQuestion.type}
            </Text>
          </View>
        </View>

        {/* QUESTION */}

        <View className="mb-8">
          <LatexView latex={currentQuestion.questionLatex} fontSize={16} />
        </View>

        {/* MCQ & MSQ OPTIONS */}

        {(currentQuestion.type === 'MCQ' || currentQuestion.type === 'MSQ') && (
          <View className="gap-3 mb-6">
            {currentQuestion.options?.map((option, idx) => {
              const optionKey = option.key || String.fromCharCode(65 + idx);

              return (
                <AnswerOption
                  key={optionKey}
                  option={option}
                  optionKey={optionKey}
                  selected={selectedOptions.includes(optionKey)}
                  submitted={isSubmitted}
                  target={targetAnswers.includes(optionKey)}
                  type={currentQuestion.type as 'MCQ' | 'MSQ'}
                  onPress={handleOptionPress}
                />
              );
            })}
          </View>
        )}

        {/* NAT NUMERICAL INPUT */}

        {currentQuestion.type === 'NAT' && (
          <View className="mb-6 gap-2">
            <Text className="font-mono text-[14px] text-on-surface-variant">
              Enter Numerical Answer:
            </Text>

            <TextInput
              keyboardType="numeric"
              editable={!isSubmitted}
              value={natAnswer}
              onChangeText={setNatAnswer}
              placeholder="e.g. 12.5"
              className={`border p-4 rounded-lg font-mono text-[18px] bg-surface ${
                isSubmitted
                  ? isCorrect
                    ? 'border-green-600 bg-green-500/10'
                    : 'border-red-600 bg-red-500/10'
                  : 'border-surface-variant text-on-surface'
              }`}
            />
          </View>
        )}

        {/* SUBMIT BUTTON */}

        {!isSubmitted &&
          (currentQuestion.type === 'MSQ' ||
            currentQuestion.type === 'NAT') && (
            <Pressable
              onPress={handleSubmit}
              disabled={
                currentQuestion.type === 'MSQ'
                  ? selectedOptions.length === 0
                  : !natAnswer.trim()
              }
              className={`w-full py-4 rounded-lg items-center mb-6 ${
                (currentQuestion.type === 'MSQ' &&
                  selectedOptions.length > 0) ||
                (currentQuestion.type === 'NAT' && natAnswer.trim())
                  ? 'bg-primary'
                  : 'bg-surface-variant opacity-50'
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

      {isSubmitted && (
        <View className="absolute bottom-0 left-0 w-full bg-surface border-t border-surface-variant p-4 z-20 pb-safe">
          <View className="max-w-[720px] w-full mx-auto flex-row justify-end items-center gap-4 px-2">
            <Pressable
              onPress={handleNextQuestion}
              className="px-8 py-3 bg-primary-container rounded active:scale-95 flex-row items-center gap-2"
            >
              <Text className="font-inter font-semibold text-[14px] text-on-surface">
                Next Question
              </Text>

              <MoveRight size={18} color="#111111" />
            </Pressable>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default PracticeScreen;
