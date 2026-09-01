import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Question } from '../../api/question';
import LatexView from '../../components/latex';

interface QuestionCardProps {
  item: Question;
  onPress: (item: Question) => void;
}

export const QuestionCard = memo(({ item, onPress }: QuestionCardProps) => {
  console.log('QuestionCard', item);
  const progressClass = item.progress
    ? item.progress.correct
      ? 'bg-green-50 border-green-200'
      : 'bg-red-50 border-red-500'
    : 'bg-surface-container-lowest border-surface-variant';

  return (
    <Pressable
      onPress={() => onPress(item)}
      className={`${progressClass} border rounded-lg p-6 gap-4 active:border-on-surface active:border-2`}
    >
      <View className="gap-2">
        {/* Metadata */}
        <View className="flex-row items-center gap-2">
          <View className="bg-surface-container-high px-2 py-1 rounded">
            <Text className="font-mono text-[12px] leading-[16px] text-tertiary uppercase">
              {item.metadata?.yearSet || item.metadata?.year || '2026'}
            </Text>
          </View>

          <View className="bg-surface-container-high px-2 py-1 rounded">
            <Text className="font-mono text-[12px] leading-[16px] text-tertiary uppercase">
              {item.branch}
            </Text>
          </View>

          <View className="bg-surface-container-high px-2 py-1 rounded">
            <Text className="font-mono text-[12px] leading-[16px] text-tertiary uppercase">
              {item.type}
            </Text>
          </View>
        </View>

        {/* Question */}
        <LatexView latex={item.questionLatex} fontSize={14} />
      </View>

      {/* Bottom */}
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="font-inter font-semibold text-[14px] leading-[20px] text-on-surface">
            Q.{item.number}
          </Text>

          <Text
            numberOfLines={1}
            className="font-inter text-[14px] leading-[20px] text-tertiary"
          >
            {item.mainTopic}
          </Text>
        </View>

        <View className="w-10 h-10 rounded-full bg-on-surface items-center justify-center">
          <Text className="text-surface-container-lowest text-lg font-bold">
            →
          </Text>
        </View>
      </View>
    </Pressable>
  );
});
