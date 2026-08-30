import React, { memo } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  ActivityIndicator,
} from 'react-native';

// Define the TypeScript interface for your props
interface ListHeaderComponentProps {
  searchQuery: string;
  setSearchQuery: (text: string) => void;
  selectedBranch: string;
  setSelectedBranch: (branch: string) => void;
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
  BRANCHES: string[];
}

const ListHeaderComponent = memo(
  ({
    searchQuery,
    setSearchQuery,
    selectedBranch,
    setSelectedBranch,
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
    BRANCHES,
  }: ListHeaderComponentProps) => {
    // <-- Typed props here
    return (
      <>
        <View className="mb-6">
          <View className="flex-row items-center bg-surface-container-lowest border-b border-surface-variant">
            <Text className="absolute left-4 text-tertiary text-lg">🔍</Text>
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search questions, topics, or options..."
              placeholderTextColor="#acacaa"
              className="w-full pl-12 pr-4 py-4 font-inter text-[18px] leading-[28px] text-on-surface"
            />
          </View>
        </View>

        <View className="mb-8 gap-4">
          <FlatList
            horizontal
            data={BRANCHES}
            keyExtractor={item => item}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingRight: 16,
              gap: 8,
              alignItems: 'center',
            }}
            renderItem={({ item: branch }) => {
              const isSelected = selectedBranch === branch;
              return (
                <Pressable
                  onPress={() => {
                    setSelectedBranch(branch);
                    setSelectedSubject('All');
                  }}
                  className={`px-3 py-1 rounded border ${
                    isSelected
                      ? 'border-2 border-primary-container bg-primary-container/10'
                      : 'border-surface-variant bg-transparent'
                  }`}
                >
                  <Text
                    className={`font-mono text-[12px] leading-[16px] uppercase ${
                      isSelected ? 'text-on-surface font-bold' : 'text-tertiary'
                    }`}
                  >
                    {branch}
                  </Text>
                </Pressable>
              );
            }}
          />

          {isSubjectsLoading ? (
            <ActivityIndicator size="small" color="#888" />
          ) : isSubjectsError ? (
            <View>
              <Text className="text-red-600 text-xs font-mono">
                Failed to load subjects
              </Text>
              <Text className="text-red-500 text-xs font-mono">
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
                    className={`px-3 py-1 rounded border ${
                      isSelected
                        ? 'border-2 border-primary-container bg-primary-container/10'
                        : 'border-surface-variant bg-transparent'
                    }`}
                  >
                    <Text
                      className={`font-mono text-[12px] leading-[16px] uppercase ${
                        isSelected
                          ? 'text-on-surface font-bold'
                          : 'text-tertiary'
                      }`}
                    >
                      {subject}
                    </Text>
                  </Pressable>
                );
              }}
            />
          )}

          <Text className="font-inter font-semibold text-[20px] leading-[28px] text-on-surface">
            Available Questions ({filteredQuestionsCount})
          </Text>
        </View>

        {isQuestionsLoading && (
          <View className="py-10 items-center justify-center">
            <ActivityIndicator size="large" color="#0000ff" />
            <Text className="mt-2 text-tertiary font-mono">
              Loading Questions...
            </Text>
          </View>
        )}

        {isError && (
          <View className="p-4 mb-4 bg-red-100 border border-red-400 rounded-lg">
            <Text className="text-red-700 font-semibold">
              Error fetching data
            </Text>
            <Text className="text-red-600 text-sm">
              {(error as Error)?.message}
            </Text>
            <Pressable
              onPress={refetch}
              className="mt-2 bg-red-600 px-4 py-2 rounded items-center"
            >
              <Text className="text-white font-bold">Retry</Text>
            </Pressable>
          </View>
        )}

        {!isQuestionsLoading && !isError && filteredQuestionsCount === 0 && (
          <View className="py-10 items-center">
            <Text className="text-tertiary font-inter">
              No questions found.
            </Text>
          </View>
        )}
      </>
    );
  },
);

export default ListHeaderComponent;
