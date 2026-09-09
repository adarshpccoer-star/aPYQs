import React, { memo } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  ActivityIndicator,
} from 'react-native';

interface ListHeaderComponentProps {
  searchQuery: string;
  setSearchQuery: (text: string) => void;
  selectedBranch: string;
  selectedSubject: string;
  setSelectedSubject: (subject: string) => void;
  subjectsList: string[] | undefined;
  isSubjectsLoading: boolean;
  isSubjectsError: boolean;
  subjectsError: unknown;
  filteredQuestionsCount: number;
  isQuestionsLoading: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => void;
  branchName: string;
}

const ListHeaderComponent = memo(
  ({
    searchQuery,
    setSearchQuery,
    selectedBranch,
    selectedSubject,
    setSelectedSubject,
    subjectsList,
    isSubjectsLoading,
    isSubjectsError,
    subjectsError,
    filteredQuestionsCount,
    isQuestionsLoading,
    isError,
    error,
    refetch,
    branchName,
  }: ListHeaderComponentProps) => {
    return (
      <>
        {/* SEARCH BAR SECTION */}
        <View className="bg-white dark:bg-slate-950 px-2 mb-6">
          <View className="flex-row items-center relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
            <Text className="absolute left-4 text-slate-400 dark:text-slate-500 text-lg z-10">
              🔍
            </Text>
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search questions, topics, or options..."
              placeholderTextColor="#94a3b8"
              className="w-full bg-transparent pl-12 pr-4 py-3.5 font-inter text-[16px] text-slate-900 dark:text-white"
            />
          </View>
        </View>

        {/* SUBJECT HORIZONTAL CHIPS */}
        <View className="mb-8 gap-4">
          {isSubjectsLoading ? (
            <ActivityIndicator size="small" color="#6366f1" />
          ) : isSubjectsError ? (
            <View className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-lg">
              <Text className="text-red-600 dark:text-red-400 text-xs font-mono font-semibold">
                Failed to load subjects
              </Text>
              <Text className="text-red-500 dark:text-red-400/80 text-xs font-mono mt-0.5">
                {(subjectsError as Error)?.message}
              </Text>
            </View>
          ) : (
            <FlatList
              horizontal
              data={subjectsList}
              keyExtractor={item => item}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingRight: 16,
                gap: 8,
                alignItems: 'center',
              }}
              renderItem={({ item: subject }) => {
                const isSelected = selectedSubject === subject;
                return (
                  <Pressable
                    onPress={() => setSelectedSubject(subject)}
                    className={`px-3.5 py-1.5 rounded-lg border active:opacity-80 ${
                      isSelected
                        ? 'border-indigo-600 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-950/50'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900'
                    }`}
                  >
                    <Text
                      className={`font-mono text-[12px] leading-[16px] uppercase ${
                        isSelected
                          ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                          : 'text-slate-600 dark:text-slate-400 font-medium'
                      }`}
                    >
                      {subject}
                    </Text>
                  </Pressable>
                );
              }}
            />
          )}
        </View>

        {/* LOADING STATE */}
        {isQuestionsLoading && (
          <View className="py-10 items-center justify-center">
            <ActivityIndicator size="large" color="#6366f1" />
            <Text className="mt-2 text-slate-500 dark:text-slate-400 font-mono text-xs">
              Loading Questions...
            </Text>
          </View>
        )}

        {/* ERROR STATE */}
        {isError && (
          <View className="p-4 mb-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-lg">
            <Text className="text-red-700 dark:text-red-400 font-semibold">
              Error fetching data
            </Text>
            <Text className="text-red-600 dark:text-red-300 text-sm mt-1">
              {(error as Error)?.message}
            </Text>
            <Pressable
              onPress={refetch}
              className="mt-3 bg-red-600 dark:bg-red-500 px-4 py-2 rounded-md items-center active:opacity-90"
            >
              <Text className="text-white font-bold text-xs uppercase tracking-wider">
                Retry
              </Text>
            </Pressable>
          </View>
        )}

        {/* EMPTY STATE */}
        {!isQuestionsLoading && !isError && filteredQuestionsCount === 0 && (
          <View className="py-10 items-center justify-center">
            <Text className="text-slate-500 dark:text-slate-400 font-inter text-sm">
              No questions found.
            </Text>
          </View>
        )}
      </>
    );
  },
);

ListHeaderComponent.displayName = 'ListHeaderComponent';

export default ListHeaderComponent;
