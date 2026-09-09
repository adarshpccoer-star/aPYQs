import React, { useCallback, useMemo, useState } from 'react';

import { View, Text, FlatList, Pressable, Image } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';

import { fetchQuestions, fetchSubjects, Question } from '../../api/question';

import { QuestionCard } from '../../components/question/questionCard';
import ListHeaderComponent from '../../components/question/listHeader';

import { useAuthStore } from '../../store/useAuthStore';

QuestionCard.displayName = 'QuestionCard';

const BrowseScreen = () => {
  const navigation = useNavigation<any>();

  const user = useAuthStore(state => state.user);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const userBranchCode = user?.branchCode ?? '';

  const userBranchName = user?.branchName ?? '';

  const {
    data: subjectsData,
    isLoading: isSubjectsLoading,
    isError: isSubjectsError,
    error: subjectsError,
  } = useQuery({
    queryKey: ['subjects', userBranchCode],
    queryFn: () => fetchSubjects(userBranchCode),
    enabled: !!userBranchCode,
  });

  const subjectsList = useMemo(
    () => ['All', ...(subjectsData?.subjects || [])],
    [subjectsData?.subjects],
  );

  const {
    data: questionsData,
    isLoading: isQuestionsLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['questions', userBranchCode, selectedSubject],
    queryFn: () => fetchQuestions(userBranchCode, selectedSubject, 1, 20),
    enabled: !!userBranchCode,
  });

  const filteredQuestions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return questionsData?.data || [];
    }

    return (questionsData?.data || []).filter((q: Question) => {
      return (
        q.questionLatex?.toLowerCase().includes(query) ||
        q.mainTopic?.toLowerCase().includes(query)
      );
    });
  }, [questionsData?.data, searchQuery]);

  const handleQuestionPress = useCallback(
    (item: Question) => {
      // Extract the raw string ID whether it's a plain string or MongoDB $oid object
      const questionId =
        typeof item._id === 'object' ? item._id.$oid : item._id;

      navigation.navigate('Practice', {
        branch: userBranchCode,
        subject: item.mainTopic || selectedSubject,
        initialQuestionId: questionId, // <-- Pass the selected question ID
      });
    },
    [navigation, userBranchCode, selectedSubject],
  );

  const keyExtractor = useCallback((item: Question) => {
    return typeof item._id === 'object' ? item._id.$oid : item._id;
  }, []);

  const renderQuestion = useCallback(
    ({ item }: { item: Question }) => (
      <View className="mb-4">
        <QuestionCard item={item} onPress={handleQuestionPress} />
      </View>
    ),
    [handleQuestionPress],
  );

  /*
   * If the user somehow reaches this screen before
   * profile completion, don't query anything.
   */
  if (!userBranchCode || !userBranchName) {
    return (
      <SafeAreaView
        style={{ flex: 1 }}
        className="bg-background items-center justify-center"
      >
        <Text className="text-on-surface text-lg font-semibold">
          Completing your profile...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-white dark:bg-slate-950 px-3 py-6 flex-1">
      <FlatList
        data={filteredQuestions}
        renderItem={renderQuestion}
        keyExtractor={keyExtractor}
        ListHeaderComponent={
          <ListHeaderComponent
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedBranch={userBranchCode}
            selectedSubject={selectedSubject}
            setSelectedSubject={setSelectedSubject}
            subjectsList={subjectsList}
            isSubjectsLoading={isSubjectsLoading}
            isSubjectsError={isSubjectsError}
            subjectsError={subjectsError}
            filteredQuestionsCount={filteredQuestions.length}
            isQuestionsLoading={isQuestionsLoading}
            isError={isError}
            error={error}
            refetch={refetch}
            branchName={userBranchName}
          />
        }
      />
    </SafeAreaView>
  );
};

export default BrowseScreen;
