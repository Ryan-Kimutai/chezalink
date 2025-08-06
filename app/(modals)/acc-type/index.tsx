// (modals)/acc-type/index.tsx

import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const AccType = () => {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);

  const handleContinue = () => {
    if (!selected) {
      Alert.alert('Please select a profile type');
      return;
    }

    switch (selected) {
      case 'Player':
        router.push('../edit-profile/index1');
        break;
      case 'Scout':
        router.push('../edit-profile/index2');
        break;
      case 'Institution':
        router.push('../edit-profile/index3');
        break;
      default:
        break;
    }
  };

  const Option = ({
    value,
    label,
    description,
  }: {
    value: string;
    label: string;
    description?: string;
  }) => (
    <TouchableOpacity
      style={[
        styles.option,
        selected === value && styles.optionSelected,
      ]}
      onPress={() => setSelected(value)}
    >
      <Text style={styles.optionText}>{label}</Text>
      {description && <Text style={styles.description}>{description}</Text>}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>
                    ぷ Cheza<Text style={{ color: '#000' }}>Link</Text>
                  </Text>
      <Text style={styles.heading}>Which of these best describes you:</Text>

      <Option value="Player" label="Player" />
      <Option value="Scout" label="Scout/Coach" />
      <Option
        value="Institution"
        label="Institution"
        description="Includes academies and schools"
      />
<LinearGradient
            colors={['#1db954', '#000']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.continueButton}
          >
      <TouchableOpacity onPress={handleContinue}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity></LinearGradient>
    </View>
  );
};

export default AccType;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2e7d32',
    textAlign: 'center',
    marginBottom: 20,
  },
  heading: {
    fontSize: 20,
    marginBottom: 20,
  },
  option: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
  },
  optionSelected: {
    borderColor: '#00c853',
    backgroundColor: '#e8f5e9',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  description: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  continueButton: {
    marginTop: 30,
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 14,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
