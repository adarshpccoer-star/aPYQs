import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as Keychain from 'react-native-keychain';
import { useAuthStore } from '../../store/useAuthStore';
import { API_BASE_URL, KEYCHAIN_SERVICE } from '../../config/env';

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

const EditProfile = ({ navigation }: any) => {
  const user = useAuthStore(state => state.user);
  const setAuth = useAuthStore(state => state.setAuth);

  const currentYear = new Date().getFullYear();
  const gateYears = Array.from(
    { length: 5 },
    (_, index) => currentYear + index,
  );

  const [branchCode, setBranchCode] = useState(
    user?.branchCode ?? GATE_BRANCHES[0].code,
  );
  const [yearOfGate, setYearOfGate] = useState(
    user?.yearOfGate?.toString() ?? currentYear.toString(),
  );
  const [loading, setLoading] = useState(false);

  const selectedBranch = GATE_BRANCHES.find(
    branch => branch.code === branchCode,
  );

  const handleSave = async () => {
    if (loading) return;

    try {
      setLoading(true);

      const credentials = await Keychain.getGenericPassword({
        service: KEYCHAIN_SERVICE,
      });

      if (!credentials) {
        throw new Error('Authentication session not found');
      }

      const parsedYear = Number(yearOfGate);
      if (!Number.isInteger(parsedYear)) {
        Alert.alert('Invalid year', 'Please select a valid GATE year.');
        return;
      }

      if (!selectedBranch) {
        Alert.alert('Invalid branch', 'Please select a valid GATE branch.');
        return;
      }

      const payload = {
        branchCode: selectedBranch.code,
        branchName: selectedBranch.name,
        yearOfGate: parsedYear,
      };

      console.log('EDIT PROFILE PAYLOAD:', payload);

      const response = await fetch(`${API_BASE_URL}/api/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${credentials.password}`,
        },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();
      let data: any;

      try {
        data = JSON.parse(responseText);
      } catch {
        console.error('EDIT PROFILE NON-JSON RESPONSE:', responseText);
        throw new Error(
          `Server returned an invalid response (${response.status})`,
        );
      }

      console.log('EDIT PROFILE RESPONSE:', data);

      if (!response.ok) {
        throw new Error(data?.error || 'Failed to update profile');
      }

      if (!data.user) {
        throw new Error('Server did not return the updated user');
      }

      // Update Zustand state
      setAuth(data.user);

      Alert.alert(
        'Profile Updated',
        'Your profile has been updated successfully.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ],
      );
    } catch (error) {
      console.error('EDIT PROFILE ERROR:', error);
      const message =
        error instanceof Error ? error.message : 'Failed to update profile';
      Alert.alert('Update Failed', message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <Text className="text-on-surface">User not found</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerClassName="flex-grow bg-background p-6"
      keyboardShouldPersistTaps="handled"
    >
      <View className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant">
        <Text className="text-2xl font-bold text-on-surface mb-2 text-center">
          Edit Profile
        </Text>
        <Text className="text-sm text-on-surface-variant text-center mb-6">
          Update your GATE preferences
        </Text>

        {user.image ? (
          <View className="items-center mb-5">
            <View className="h-20 w-20 rounded-full overflow-hidden">
              <Image
                source={{ uri: user.image }}
                className="w-20 h-20 rounded-full"
              />
            </View>
          </View>
        ) : null}

        <View className="mb-4">
          <Text className="text-xs font-semibold text-on-surface-variant mb-1">
            Full Name
          </Text>
          <View className="border border-outline rounded-lg p-3 bg-surface-container-low">
            <Text className="text-on-surface">
              {user.name || 'GitHub User'}
            </Text>
          </View>
        </View>

        <View className="mb-5">
          <Text className="text-xs font-semibold text-on-surface-variant mb-1">
            Email Address
          </Text>
          <View className="border border-outline rounded-lg p-3 bg-surface-container-low">
            <Text className="text-on-surface">{user.email}</Text>
          </View>
        </View>

        <View className="mb-5">
          <Text className="text-xs font-semibold text-on-surface-variant mb-1">
            GATE Branch
          </Text>
          <View className="border border-outline rounded-lg bg-surface-container-low overflow-hidden">
            <Picker
              selectedValue={branchCode}
              onValueChange={(value: string) => setBranchCode(value)}
              enabled={!loading}
              dropdownIconColor="#006e2f"
              style={{ color: '#1b1c1b' }}
            >
              {GATE_BRANCHES.map(branch => (
                <Picker.Item
                  key={branch.code}
                  label={`${branch.name} (${branch.code})`}
                  value={branch.code}
                />
              ))}
            </Picker>
          </View>
          {selectedBranch && (
            <Text className="text-xs text-on-surface-variant mt-1">
              {selectedBranch.name}
            </Text>
          )}
        </View>

        <View className="mb-7">
          <Text className="text-xs font-semibold text-on-surface-variant mb-1">
            Year of GATE Exam
          </Text>
          <View className="border border-outline rounded-lg bg-surface-container-low overflow-hidden">
            <Picker
              selectedValue={yearOfGate}
              onValueChange={(value: string) => setYearOfGate(value)}
              enabled={!loading}
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

        <Pressable
          disabled={loading}
          onPress={handleSave}
          className={`py-3.5 rounded-lg items-center ${
            loading ? 'bg-surface-container' : 'bg-primary'
          }`}
        >
          {loading ? (
            <View className="flex-row items-center gap-2">
              <ActivityIndicator size="small" color="#ffffff" />
              <Text className="text-on-primary font-bold text-base">
                Saving...
              </Text>
            </View>
          ) : (
            <Text className="text-on-primary font-bold text-base">
              Save Changes
            </Text>
          )}
        </Pressable>

        <Pressable
          disabled={loading}
          onPress={() => navigation.goBack()}
          className="mt-3 py-3 items-center"
        >
          <Text className="text-on-surface-variant font-semibold">Cancel</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default EditProfile;
