import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Image,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as Keychain from 'react-native-keychain';
import { useAuthStore } from '../../store/useAuthStore';

const GATE_BRANCHES = [
  { code: 'AE', name: 'Aerospace Engineering' },
  { code: 'AG', name: 'Agricultural Engineering' },
  { code: 'AR', name: 'Architecture and Planning' },
  { code: 'BM', name: 'Biomedical Engineering' },
  { code: 'BT', name: 'Biotechnology' },
  { code: 'CE', name: 'Civil Engineering' },
  { code: 'CH', name: 'Chemical Engineering' },
  { code: 'CS', name: 'Computer Science & Information Technology' },
  { code: 'CY', name: 'Chemistry' },
  { code: 'DA', name: 'Data Science & Artificial Intelligence' },
  { code: 'EC', name: 'Electronics & Communication Engineering' },
  { code: 'EE', name: 'Electrical Engineering' },
  { code: 'ES', name: 'Environmental Science & Engineering' },
  { code: 'EY', name: 'Ecology & Evolution' },
  { code: 'GE', name: 'Geomatics Engineering' },
  { code: 'GG', name: 'Geology & Geophysics' },
  { code: 'IN', name: 'Instrumentation Engineering' },
  { code: 'MA', name: 'Mathematics' },
  { code: 'ME', name: 'Mechanical Engineering' },
  { code: 'MN', name: 'Mining Engineering' },
  { code: 'MT', name: 'Metallurgical Engineering' },
  { code: 'NM', name: 'Naval Architecture & Marine Engineering' },
  { code: 'PE', name: 'Petroleum Engineering' },
  { code: 'PH', name: 'Physics' },
  { code: 'PI', name: 'Production & Industrial Engineering' },
  { code: 'ST', name: 'Statistics' },
  { code: 'TF', name: 'Textile Engineering & Fibre Science' },
  { code: 'XE', name: 'Engineering Sciences' },
  { code: 'XH', name: 'Humanities & Social Sciences' },
  { code: 'XL', name: 'Life Sciences' },
];
const API_BASE_URL = 'https://localhost:3000.com/api';

const SignupForm = ({ route, navigation }: any) => {
  const setAuth = useAuthStore(state => state.setAuth);
  const githubUser = route?.params?.user || {};
  const currentYear = new Date().getFullYear();

  // Generate GATE target years array (e.g., current year down to current year + 4)
  const gateYears = Array.from({ length: 5 }, (_, i) => currentYear + i);

  const [formData, setFormData] = useState({
    name: githubUser.name || '',
    username: githubUser.login || '',
    email: githubUser.email || '',
    avatar: githubUser.avatar || '',
    branch: GATE_BRANCHES[0].name,
    branchCode: GATE_BRANCHES[0].code,
    yearOfGate: currentYear.toString(),
  });

  const handleBranchChange = (code: string) => {
    const selected = GATE_BRANCHES.find(b => b.code === code);
    if (selected) {
      setFormData(prev => ({
        ...prev,
        branchCode: selected.code,
        branch: selected.name,
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      const credentials = await Keychain.getGenericPassword({
        service: 'com.apyqs.auth',
      });

      if (!credentials) {
        throw new Error('Authentication session not found');
      }

      const payload = {
        username: formData.username,
        branch: formData.branch,
        branchCode: formData.branchCode,
        yearOfGate: Number(formData.yearOfGate),
      };

      const response = await fetch(`${API_BASE_URL}/api/profile`, {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${credentials.password}`,
        },

        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Profile submission failed');
      }

      console.log('PROFILE CREATED:', data.user);

      setAuth(data.user);

      navigation.replace('Home');
    } catch (error) {
      console.error('PROFILE SUBMISSION ERROR:', error);
    }
  };

  return (
    <ScrollView contentContainerClassName="flex-1 bg-[var(--color-background)] p-6 justify-center">
      <View className="bg-[var(--color-surface-container-lowest)] p-6 rounded-2xl shadow-sm border border-[var(--color-outline-variant)]">
        <Text className="text-2xl font-bold text-[var(--color-on-surface)] mb-6 text-center">
          Complete Your Profile
        </Text>

        {formData.avatar ? (
          <View className="h-16 w-16 mx-auto rounded-full mb-4 overflow-hidden">
            <Image
              source={{ uri: formData.avatar }}
              className="w-16 h-16 rounded-full"
            />
          </View>
        ) : null}

        {/* Full Name */}
        <View className="mb-4">
          <Text className="text-xs font-semibold text-[var(--color-on-surface-variant)] mb-1">
            Full Name
          </Text>
          <TextInput
            className="border border-[var(--color-outline)] rounded-lg p-3 text-[var(--color-on-surface)] bg-[var(--color-surface-container-low)]"
            value={formData.name}
            onChangeText={text => setFormData({ ...formData, name: text })}
            placeholder="John Doe"
            placeholderTextColor="#6d7b6c"
          />
        </View>

        {/* GitHub Username */}
        <View className="mb-4">
          <Text className="text-xs font-semibold text-[var(--color-on-surface-variant)] mb-1">
            GitHub Username
          </Text>
          <TextInput
            className="border border-[var(--color-outline)] rounded-lg p-3 text-[var(--color-on-surface)] bg-[var(--color-surface-container-low)]"
            value={formData.username}
            onChangeText={text => setFormData({ ...formData, username: text })}
            placeholder="octocat"
            placeholderTextColor="#6d7b6c"
          />
        </View>

        {/* Email */}
        <View className="mb-4">
          <Text className="text-xs font-semibold text-[var(--color-on-surface-variant)] mb-1">
            Email Address
          </Text>
          <TextInput
            className="border border-[var(--color-outline)] rounded-lg p-3 text-[var(--color-on-surface)] bg-[var(--color-surface-container-low)]"
            value={formData.email}
            onChangeText={text => setFormData({ ...formData, email: text })}
            keyboardType="email-address"
            placeholder="user@example.com"
            placeholderTextColor="#6d7b6c"
          />
        </View>

        {/* Branch Dropdown */}
        <View className="mb-4">
          <Text className="text-xs font-semibold text-[var(--color-on-surface-variant)] mb-1">
            GATE Branch
          </Text>
          <View className="border border-[var(--color-outline)] rounded-lg bg-[var(--color-surface-container-low)] overflow-hidden">
            <Picker
              selectedValue={formData.branchCode}
              onValueChange={(itemValue: string) =>
                handleBranchChange(itemValue)
              }
              dropdownIconColor="#006e2f"
              style={{ color: '#1b1c1b' }}
            >
              {GATE_BRANCHES.map(item => (
                <Picker.Item
                  key={item.code}
                  label={`${item.name} (${item.code})`}
                  value={item.code}
                />
              ))}
            </Picker>
          </View>
        </View>

        {/* Year of GATE Dropdown */}
        <View className="mb-6">
          <Text className="text-xs font-semibold text-[var(--color-on-surface-variant)] mb-1">
            Year of GATE Exam
          </Text>
          <View className="border border-[var(--color-outline)] rounded-lg bg-[var(--color-surface-container-low)] overflow-hidden">
            <Picker
              selectedValue={formData.yearOfGate}
              onValueChange={(itemValue: string) =>
                setFormData({ ...formData, yearOfGate: itemValue })
              }
              dropdownIconColor="#006e2f"
              style={{ color: '#1b1c1b' }}
            >
              {gateYears.map(year => (
                <Picker.Item
                  key={year}
                  label={year.toString()}
                  value={year.toString()}
                />
              ))}
            </Picker>
          </View>
        </View>

        {/* Submit Button */}
        <Pressable
          onPress={handleSubmit}
          className="bg-[var(--color-primary)] active:bg-[var(--color-on-primary-fixed-variant)] py-3.5 rounded-lg items-center shadow-md"
        >
          <Text className="text-[var(--color-on-primary)] font-bold text-base">
            Complete Registration
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default SignupForm;
