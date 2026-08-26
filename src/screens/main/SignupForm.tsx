import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const SignupForm = ({ route, navigation }: any) => {
  // Pass githubUser via navigation parameters after login
  const githubUser = route?.params?.user || {};

  const [formData, setFormData] = useState({
    name: githubUser.name || '',
    username: githubUser.login || '',
    email: githubUser.email || '',
    role: 'developer',
  });

  const handleSubmit = () => {
    console.log('Submitted Data:', formData);
    // Add post-registration logic here
  };

  return (
    <ScrollView contentContainerClassName="flex-1 bg-[var(--color-background)] p-6 justify-center">
      <View className="bg-[var(--color-surface-container-lowest)] p-6 rounded-2xl shadow-sm border border-[var(--color-outline-variant)]">
        <Text className="text-2xl font-bold text-[var(--color-on-surface)] mb-6 text-center">
          Complete Your Profile
        </Text>

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

        {/* Dropdown Select Option */}
        <View className="mb-6">
          <Text className="text-xs font-semibold text-[var(--color-on-surface-variant)] mb-1">
            Primary Role
          </Text>
          <View className="border border-[var(--color-outline)] rounded-lg bg-[var(--color-surface-container-low)] overflow-hidden">
            <Picker
              selectedValue={formData.role}
              onValueChange={(itemValue: any) =>
                setFormData({ ...formData, role: itemValue })
              }
              dropdownIconColor="#006e2f"
              style={{ color: '#1b1c1b' }}
            >
              <Picker.Item label="Developer" value="developer" />
              <Picker.Item label="Designer" value="designer" />
              <Picker.Item label="Product Manager" value="product_manager" />
              <Picker.Item label="Other" value="other" />
            </Picker>
          </View>
        </View>

        {/* Submit Button */}
        <Pressable
          onPress={handleSubmit}
          className="bg-[var(--color-primary)] active:bg-[var(--color-on-primary-fixed-variant)] py-3.5 rounded-lg items-center shadow-md"
        >
          <Text className="text-[var(--color-on-primary)] font-bold text-base">
            Complete Signup
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default SignupForm;
