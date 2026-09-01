import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, Image, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as Keychain from 'react-native-keychain';
import { useAuthStore } from '../../store/useAuthStore';

const API_BASE_URL = 'http://192.168.1.43:3000';
const KEYCHAIN_SERVICE = 'com.apyqs.auth';

const GATE_BRANCHES = [
  { code: 'AE', name: 'Aerospace Engineering' },
  { code: 'AG', name: 'Agricultural Engineering' },
  { code: 'AR', name: 'Architecture and Planning' },
  { code: 'BM', name: 'Biomedical Engineering' },
  { code: 'BT', name: 'Biotechnology' },
  { code: 'CE', name: 'Civil Engineering' },
  { code: 'CH', name: 'Chemical Engineering' },
  { code: 'CS', name: 'Computer Science and Information Technology' },
  { code: 'CY', name: 'Chemistry' },
  { code: 'DA', name: 'Data Science and Artificial Intelligence' },
  { code: 'EC', name: 'Electronics and Communication Engineering' },
  { code: 'EE', name: 'Electrical Engineering' },
  { code: 'ES', name: 'Environmental Science and Engineering' },
  { code: 'EY', name: 'Ecology and Evolution' },
  { code: 'GE', name: 'Geomatics Engineering' },
  { code: 'GG', name: 'Geology and Geophysics' },
  { code: 'IN', name: 'Instrumentation Engineering' },
  { code: 'MA', name: 'Mathematics' },
  { code: 'ME', name: 'Mechanical Engineering' },
  { code: 'MN', name: 'Mining Engineering' },
  { code: 'MT', name: 'Metallurgical Engineering' },
  { code: 'NM', name: 'Naval Architecture and Marine Engineering' },
  { code: 'PE', name: 'Petroleum Engineering' },
  { code: 'PH', name: 'Physics' },
  { code: 'PI', name: 'Production and Industrial Engineering' },
  { code: 'ST', name: 'Statistics' },
  { code: 'TF', name: 'Textile Engineering and Fibre Science' },
  { code: 'XE', name: 'Engineering Sciences' },
  { code: 'XH', name: 'Humanities and Social Sciences' },
  { code: 'XL', name: 'Life Sciences' },
] as const;

const SignupForm = () => {
  const user = useAuthStore(state => state.user);
  const setAuth = useAuthStore(state => state.setAuth);

  const currentYear = new Date().getFullYear();
  const gateYears = Array.from({ length: 5 }, (_, i) => currentYear + i);

  const [formData, setFormData] = useState({
    branchCode: user?.branchCode ?? GATE_BRANCHES[0].code,
    yearOfGate: user?.yearOfGate?.toString() ?? currentYear.toString(),
  });

  const [loading, setLoading] = useState(false);

  // Derive selected branch object from current code in state
  const selectedBranch = GATE_BRANCHES.find(
    branch => branch.code === formData.branchCode,
  );

  const handleSubmit = async () => {
    if (loading) return;

    try {
      setLoading(true);

      const credentials = await Keychain.getGenericPassword({
        service: KEYCHAIN_SERVICE,
      });

      if (!credentials) {
        throw new Error('Authentication session not found');
      }

      const yearOfGate = Number(formData.yearOfGate);
      if (!Number.isInteger(yearOfGate)) {
        Alert.alert('Invalid year', 'Please select a valid GATE year.');
        return;
      }

      if (!selectedBranch) {
        throw new Error('Invalid branch selected');
      }

      const payload = {
        branchCode: selectedBranch.code,
        branchName: selectedBranch.name,
        yearOfGate,
      };

      const response = await fetch(`${API_BASE_URL}/api/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${credentials.password}`,
        },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();

      console.log('PROFILE STATUS:', response.status);
      console.log(
        'PROFILE CONTENT-TYPE:',
        response.headers.get('content-type'),
      );
      console.log('PROFILE RAW RESPONSE:', responseText);

      let data: any;

      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error(
          `Server returned non-JSON response (${
            response.status
          }): ${responseText.slice(0, 300)}`,
        );
      }

      console.log('PROFILE RESPONSE:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Profile submission failed');
      }

      if (!data.user) {
        throw new Error('Server did not return the updated user');
      }

      setAuth(data.user);

      if (!data.user) {
        throw new Error('Server did not return the updated user');
      }

      // Update global auth state to trigger screen navigation
      setAuth(data.user);
    } catch (error) {
      console.error('PROFILE SUBMISSION ERROR:', error);
      const message =
        error instanceof Error ? error.message : 'Failed to complete profile';

      Alert.alert('Profile Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerClassName="flex-grow bg-[var(--color-background)] p-6 justify-center">
      <View className="bg-[var(--color-surface-container-lowest)] p-6 rounded-2xl shadow-sm border border-[var(--color-outline-variant)]">
        <Text className="text-2xl font-bold text-[var(--color-on-surface)] mb-6 text-center">
          Complete Your Profile
        </Text>

        {user?.image ? (
          <View className="h-16 w-16 mx-auto rounded-full mb-4 overflow-hidden">
            <Image
              source={{ uri: user.image }}
              className="w-16 h-16 rounded-full"
            />
          </View>
        ) : null}

        {/* Full Name */}
        <View className="mb-4">
          <Text className="text-xs font-semibold text-[var(--color-on-surface-variant)] mb-1">
            Full Name
          </Text>
          <View className="border border-[var(--color-outline)] rounded-lg p-3 bg-[var(--color-surface-container-low)]">
            <Text className="text-[var(--color-on-surface)]">
              {user?.name || 'GitHub User'}
            </Text>
          </View>
        </View>

        {/* Email Address */}
        <View className="mb-4">
          <Text className="text-xs font-semibold text-[var(--color-on-surface-variant)] mb-1">
            Email Address
          </Text>
          <View className="border border-[var(--color-outline)] rounded-lg p-3 bg-[var(--color-surface-container-low)]">
            <Text className="text-[var(--color-on-surface)]">
              {user?.email || ''}
            </Text>
          </View>
        </View>

        {/* GATE Branch Selector */}
        <View className="mb-4">
          <Text className="text-xs font-semibold text-[var(--color-on-surface-variant)] mb-1">
            GATE Branch
          </Text>
          <View className="border border-[var(--color-outline)] rounded-lg bg-[var(--color-surface-container-low)] overflow-hidden">
            <Picker
              selectedValue={formData.branchCode}
              onValueChange={(itemValue: string) =>
                setFormData(prev => ({
                  ...prev,
                  branchCode: itemValue,
                }))
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
          {selectedBranch ? (
            <Text className="text-xs text-[var(--color-on-surface-variant)] mt-1">
              Selected: {selectedBranch.name}
            </Text>
          ) : null}
        </View>

        {/* GATE Year Selector */}
        <View className="mb-6">
          <Text className="text-xs font-semibold text-[var(--color-on-surface-variant)] mb-1">
            Year of GATE Exam
          </Text>
          <View className="border border-[var(--color-outline)] rounded-lg bg-[var(--color-surface-container-low)] overflow-hidden">
            <Picker
              selectedValue={formData.yearOfGate}
              onValueChange={(itemValue: string) =>
                setFormData(prev => ({
                  ...prev,
                  yearOfGate: itemValue,
                }))
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
          disabled={loading}
          onPress={handleSubmit}
          className="bg-[var(--color-primary)] py-3.5 rounded-lg items-center shadow-md active:opacity-80"
        >
          <Text className="text-[var(--color-on-primary)] font-bold text-base">
            {loading ? 'Saving...' : 'Complete Registration'}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default SignupForm;
