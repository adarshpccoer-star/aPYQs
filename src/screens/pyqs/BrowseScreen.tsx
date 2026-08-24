import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

interface QuestionSet {
  id: string;
  year: string;
  subject: string;
  title: string;
  questionsCount: number;
  duration: string;
}

const QUESTION_SETS: QuestionSet[] = [
  {
    id: '1',
    year: '2023',
    subject: 'Physics',
    title: 'Kinematics & Dynamics',
    questionsCount: 24,
    duration: '~45 mins',
  },
  {
    id: '2',
    year: '2023',
    subject: 'Chemistry',
    title: 'Organic Reactions',
    questionsCount: 30,
    duration: '~60 mins',
  },
  {
    id: '3',
    year: '2022',
    subject: 'Physics',
    title: 'Electromagnetism',
    questionsCount: 18,
    duration: '~35 mins',
  },
];

const BrowseScreen = () => {
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState('2023');
  const [selectedSubject, setSelectedSubject] = useState('Physics');

  const years = ['All', '2023', '2022', '2021'];
  const subjects = ['All', 'Physics', 'Chemistry', 'Math'];

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-background">
      {/* TOP APP BAR */}
      <View className="bg-surface border-b border-surface-variant flex-row justify-between items-center w-full px-6 py-4">
        <View className="w-10 h-10 rounded-full overflow-hidden bg-surface-container border border-surface-variant flex-row items-center justify-center shrink-0">
          <Image
            source={{
              uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-nVAdJgBt3nilE79JsBQQF5KbPeSO7T4yCFWG_RF99evxvE6JLgXrnFiGTRV0pc8e5iaYtzglh4ddA89yNrpKdMeVT-5OBjCpFt7bq9LBQuIIFYm1Fh7ZnelvH2ruAJG5usUPbah04h3KhQdWvQJSWYW62YrgZSrrCWPMz1Xgrb2O3qACBw_u6EtmLPJdj-43wnBMlz7Dl7UDGMyAjuLPzhiN-z3Ph9HB9OF9vMDJqiP960R3JfQ',
            }}
            className="w-full h-full object-cover"
          />
        </View>

        <Text className="font-mono text-[12px] leading-[16px] tracking-widest text-on-surface font-extrabold uppercase">
          PYQ MASTER
        </Text>

        <Pressable className="text-primary p-2 rounded-full active:bg-surface-container-low active:scale-95">
          <Text className="text-lg">🔔</Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 80 }}
        className="flex-1 px-4 md:px-6 py-6"
        showsVerticalScrollIndicator={false}
      >
        {/* SEARCH BAR SECTION */}
        <View className="mb-6">
          <View className="relative flex-row items-center bg-surface-container-lowest border-b border-surface-variant focus:border-on-surface">
            <Text className="absolute left-4 text-tertiary text-lg">🔍</Text>
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search questions, topics, or years..."
              placeholderTextColor="#acacaa"
              className="w-full pl-12 pr-4 py-4 font-inter text-[18px] leading-[28px] text-on-surface"
            />
          </View>
        </View>

        {/* FILTERS SECTION */}
        <View className="mb-8 gap-4">
          {/* Year Filter Row */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row"
          >
            <View className="flex-row items-center gap-2 pr-4">
              <Text className="font-mono text-[12px] leading-[16px] text-tertiary w-16 uppercase font-medium">
                Year
              </Text>
              {years.map(year => {
                const isSelected = selectedYear === year;
                return (
                  <Pressable
                    key={year}
                    onPress={() => setSelectedYear(year)}
                    className={`px-3 py-1 rounded border uppercase ${
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
                      {year}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>

          {/* Subject Filter Row */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row"
          >
            <View className="flex-row items-center gap-2 pr-4">
              <Text className="font-mono text-[12px] leading-[16px] text-tertiary w-16 uppercase font-medium">
                Subject
              </Text>
              {subjects.map(subject => {
                const isSelected = selectedSubject === subject;
                return (
                  <Pressable
                    key={subject}
                    onPress={() => setSelectedSubject(subject)}
                    className={`px-3 py-1 rounded border uppercase ${
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
              })}
            </View>
          </ScrollView>
        </View>

        {/* QUESTION SETS LIST */}
        <View className="gap-4">
          <Text className="font-inter font-semibold text-[20px] leading-[28px] text-on-surface mb-2">
            Available Sets
          </Text>

          {QUESTION_SETS.map(item => (
            <Pressable
              key={item.id}
              onPress={() => navigation.navigate('Practice')}
              className="bg-surface-container-lowest border border-surface-variant rounded-lg p-6 flex-col sm:flex-row sm:items-center justify-between gap-4 active:border-on-surface active:border-2 transition-all"
            >
              <View className="gap-2">
                <View className="flex-row items-center gap-2">
                  <View className="bg-surface-container-high px-2 py-1 rounded">
                    <Text className="font-mono text-[12px] leading-[16px] text-tertiary uppercase">
                      {item.year}
                    </Text>
                  </View>
                  <View className="bg-surface-container-high px-2 py-1 rounded">
                    <Text className="font-mono text-[12px] leading-[16px] text-tertiary uppercase">
                      {item.subject}
                    </Text>
                  </View>
                </View>

                <Text className="font-inter font-semibold text-[20px] leading-[28px] text-on-surface">
                  {item.title}
                </Text>
              </View>

              <View className="flex-row items-center justify-between sm:justify-end gap-6">
                <View className="items-start sm:items-end">
                  <Text className="font-inter font-semibold text-[14px] leading-[20px] text-on-surface">
                    {item.questionsCount} Qs
                  </Text>
                  <Text className="font-inter text-[14px] leading-[20px] text-tertiary">
                    {item.duration}
                  </Text>
                </View>

                <View className="w-10 h-10 rounded-full bg-on-surface flex items-center justify-center">
                  <Text className="text-surface-container-lowest text-lg font-bold">
                    →
                  </Text>
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* FIXED BOTTOM NAVIGATION */}
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
