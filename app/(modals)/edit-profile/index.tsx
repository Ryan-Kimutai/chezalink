import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function EditProfileModal() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');
  const [position, setPosition] = useState('');
  const [foot, setFoot] = useState('');
  const [bio, setBio] = useState('');

  const handleFinish = () => {
    console.log({
      firstName,
      lastName,
      dob,
      position,
      foot,
      bio,
    });
    // You can add form submission logic here
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>
            ぷ Cheza
            <Text style={{ color: '#000' }}>Link</Text>
          </Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>Tell us more about yourself to complete your profile</Text>

        {/* Full Name */}
        <Text style={styles.label}>Full Names</Text>
        <View style={styles.row}>
          <TextInput
            style={[styles.input, { marginRight: 8 }]}
            placeholder="First name"
            value={firstName}
            onChangeText={setFirstName}
          />
          <TextInput
            style={styles.input}
            placeholder="Last name"
            value={lastName}
            onChangeText={setLastName}
          />
        </View>

        {/* Date of Birth */}
        <Text style={styles.label}>Date of birth</Text>
        <TextInput
          style={styles.fullWidthInput}
          placeholder="YYYY-MM-DD"
          value={dob}
          onChangeText={setDob}
        />

        {/* Position & Foot */}
        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text style={styles.label}>Position</Text>
            <Picker
              selectedValue={position}
              onValueChange={(value) => setPosition(value)}
              style={styles.picker}
            >
              <Picker.Item label="GK/DF/MID/FW" value="" />
              <Picker.Item label="Goalkeeper" value="GK" />
              <Picker.Item label="Defender" value="DF" />
              <Picker.Item label="Midfielder" value="MID" />
              <Picker.Item label="Forward" value="FW" />
            </Picker>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Preferred foot</Text>
            <Picker
              selectedValue={foot}
              onValueChange={(value) => setFoot(value)}
              style={styles.picker}
            >
              <Picker.Item label="Left/Right" value="" />
              <Picker.Item label="Left" value="Left" />
              <Picker.Item label="Right" value="Right" />
              <Picker.Item label="Both" value="Both" />
            </Picker>
          </View>
        </View>

        {/* Bio */}
        <Text style={styles.label}>Bio</Text>
        <TextInput
          style={styles.bioInput}
          multiline
          numberOfLines={4}
          placeholder="Give us a brief description of yourself on the pitch"
          value={bio}
          onChangeText={setBio}
        />

        {/* Finish Button */}
        <LinearGradient
          colors={['#1db954', '#000']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.finishButton}
        >
          <TouchableOpacity onPress={handleFinish}>
            <Text style={styles.finishButtonText}>Finish</Text>
          </TouchableOpacity>
        </LinearGradient>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 24,
  },
  logo: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 0.5,
    color: '#1db954',
    fontFamily: 'sans-serif-condensed',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#111',
  },
  label: {
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 6,
    marginTop: 16,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  input: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f9f9f9',
  },
  fullWidthInput: {
    width: '100%',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f9f9f9',
  },
  picker: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  bioInput: {
    height: 100,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f9f9f9',
    textAlignVertical: 'top',
    marginTop: 6,
  },
  finishButton: {
    marginTop: 30,
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 14,
  },
  finishButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
