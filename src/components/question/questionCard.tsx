import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Question } from '../../api/question';
import LatexView from '../../components/latex';
import { useThemeStore } from '../../store/useThemeStore';

interface QuestionCardProps {
  item: Question;
  onPress: (item: Question) => void;
}

export const QuestionCard = memo(({ item, onPress }: QuestionCardProps) => {
  console.log('QuestionCard', item);

  const { theme } = useThemeStore();
  const isDarkMode = theme === 'dark';

  const progressClass = item.progress
    ? item.progress.correct
      ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800'
      : 'bg-red-500 dark:bg-red-950 border-red-200 dark:border-red-800'
    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800';
  return (
    <Pressable
      onPress={() => onPress(item)}
      className={`${progressClass} border dark:border-slate-400 rounded-lg p-6 gap-4 active:border-on-surface dark:active:border-slate-400 active:border-2`}
    >
      <View className="gap-2">
        {/* Metadata */}
        <View className="flex-row items-center gap-2">
          <View className="bg-surface-container-high dark:bg-slate-800 px-2 py-1 rounded">
            <Text className="font-mono text-[12px] leading-[16px] text-tertiary dark:text-slate-400 uppercase">
              {item.metadata?.yearSet || item.metadata?.year || '2026'}
            </Text>
          </View>

          <View className="bg-surface-container-high dark:bg-slate-800 px-2 py-1 rounded">
            <Text className="font-mono text-[12px] leading-[16px] text-tertiary dark:text-slate-400 uppercase">
              {item.branch}
            </Text>
          </View>

          <View className="bg-surface-container-high dark:bg-slate-800 px-2 py-1 rounded">
            <Text className="font-mono text-[12px] leading-[16px] text-tertiary dark:text-slate-400 uppercase">
              {item.type}
            </Text>
          </View>
        </View>

        {/* Question */}
        <LatexView
          latex={item.questionLatex}
          fontSize={14}
          color={isDarkMode ? '#FFFFFF' : '#0F172A'}
        />
      </View>

      {/* Bottom */}
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="font-inter font-semibold text-[14px] leading-[20px] text-on-surface dark:text-white">
            Q.{item.number}
          </Text>

          <Text
            numberOfLines={1}
            className="font-inter text-[14px] leading-[20px] text-tertiary dark:text-slate-400"
          >
            {item.mainTopic}
          </Text>
        </View>

        <View className="w-10 h-10 rounded-full bg-on-surface dark:bg-white items-center justify-center">
          <Text className="text-surface-container-lowest dark:text-slate-900 text-lg font-bold">
            →
          </Text>
        </View>
      </View>
    </Pressable>
  );
});
