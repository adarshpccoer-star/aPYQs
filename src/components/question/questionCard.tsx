import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Question } from '../../api/question';

interface QuestionCardProps {
  item: Question;
  onPress: (item: Question) => void;
}
export const QuestionCard = memo(({ item, onPress }: QuestionCardProps) => {
  return (
    <Pressable
      onPress={() => onPress(item)}
      className="bg-surface-container-lowest border border-surface-variant rounded-lg p-6 gap-4 active:border-on-surface active:border-2"
    >
      <View className="gap-2">
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

        <Text
          numberOfLines={2}
          className="font-inter font-semibold text-[16px] leading-[22px] text-on-surface"
        >
          {item.questionLatex}
        </Text>
      </View>

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
