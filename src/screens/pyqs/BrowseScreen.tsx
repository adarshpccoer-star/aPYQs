import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, FlatList, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { Settings } from 'lucide-react-native';
import { fetchQuestions, fetchSubjects, Question } from '../../api/question';
import { QuestionCard } from '../../components/question/questionCard';
import ListHeaderComponent from '../../components/question/listHeader';

const BRANCHES = ['All', 'DA', 'CS', 'EC', 'ME'];

QuestionCard.displayName = 'QuestionCard';

const BrowseScreen = () => {
  const navigation = useNavigation<any>();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('DA');
  const [selectedSubject, setSelectedSubject] = useState('All');

  const {
    data: subjectsData,
    isLoading: isSubjectsLoading,
    isError: isSubjectsError,
    error: subjectsError,
  } = useQuery({
    queryKey: ['subjects', selectedBranch],
    queryFn: () => fetchSubjects(selectedBranch),
    enabled: selectedBranch !== 'All',
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
    queryKey: ['questions', selectedBranch, selectedSubject],
    queryFn: () => fetchQuestions(selectedBranch, selectedSubject, 1, 20),
  });

  const filteredQuestions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return questionsData?.data || [];

    return (questionsData?.data || []).filter((q: Question) => {
      return (
        q.questionLatex?.toLowerCase().includes(query) ||
        q.mainTopic?.toLowerCase().includes(query)
      );
    });
  }, [questionsData?.data, searchQuery]);

  const handleQuestionPress = useCallback(
    (item: Question) => {
      navigation.navigate('Practice', {
        branch: selectedBranch,
        subject: item.mainTopic || selectedSubject,
      });
    },
    [navigation, selectedBranch, selectedSubject],
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

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-background">
      <View className="bg-surface border-b border-surface-variant flex-row justify-between items-center w-full px-6 py-4">
        <View className="w-10 h-10 rounded-full overflow-hidden bg-surface-container border border-surface-variant items-center justify-center">
          <Image
            source={{
              uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-nVAdJgBt3nilE79JsBQQF5KbPeSO7T4yCFWG_RF99evxvE6JLgXrnFiGTRV0pc8e5iaYtzglh4ddA89yNrpKdMeVT-5OBjCpFt7bq9LBQuIIFYm1Fh7ZnelvH2ruAJG5usUPbah04h3KhQdWvQJSWYW62YrgZSrrCWPMz1Xgrb2O3qACBw_u6EtmLPJdj-43wnBMlz7Dl7UDGMyAjuLPzhiN-z3Ph9HB9OF9vMDJqiP960R3JfQ',
            }}
            className="w-full h-full"
          />
        </View>

        <Text className="font-mono text-[12px] leading-[16px] tracking-widest text-on-surface font-extrabold uppercase">
          PYQ MASTER
        </Text>

        <Pressable className="p-2 rounded-full active:bg-surface-container-low active:scale-95">
          <Settings size={22} />
        </Pressable>
      </View>

      <FlatList
        data={isQuestionsLoading || isError ? [] : filteredQuestions}
        renderItem={renderQuestion}
        keyExtractor={keyExtractor}
        ListHeaderComponent={ListHeaderComponent}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 24,
          paddingBottom: 100,
        }}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews
        initialNumToRender={8}
        maxToRenderPerBatch={6}
        windowSize={7}
        updateCellsBatchingPeriod={50}
      />
      <FlatList
        data={filteredQuestions}
        renderItem={renderQuestion}
        ListHeaderComponent={
          <ListHeaderComponent
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedBranch={selectedBranch}
            setSelectedBranch={setSelectedBranch}
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
            BRANCHES={BRANCHES} // Make sure to pass BRANCHES here if it lives in BrowseScreen
          />
        }
      />

      <View className="absolute bottom-0 left-0 right-0 h-16 bg-surface border-t border-surface-variant flex-row justify-around items-center px-4">
        <Pressable
          className="items-center"
          onPress={() => navigation.navigate('Home')}
        >
          <Text className="text-lg">🏠</Text>
          <Text className="font-mono text-[12px] text-on-surface mt-0.5">
            Home
          </Text>
        </Pressable>

        <Pressable className="items-center">
          <Text className="text-lg">🔍</Text>
          <Text className="font-mono text-[12px] font-bold text-primary mt-0.5">
            Browse
          </Text>
        </Pressable>

        <Pressable
          className="items-center"
          onPress={() => navigation.navigate('History')}
        >
          <Text className="text-lg">📜</Text>
          <Text className="font-mono text-[12px] text-on-surface mt-0.5">
            History
          </Text>
        </Pressable>

        <Pressable
          className="items-center"
          onPress={() => navigation.navigate('Profile')}
        >
          <Text className="text-lg">👤</Text>
          <Text className="font-mono text-[12px] text-on-surface mt-0.5">
            Profile
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default BrowseScreen;
