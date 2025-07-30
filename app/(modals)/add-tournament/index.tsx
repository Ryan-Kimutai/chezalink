import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function BasicForm() {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [age, setAge] = useState('');
  const [number, setNumber] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  

  const handleSubmit = () => {
    if (!name || !email) {
      Alert.alert('Please fill in all fields');
      return;
    }

    // Submit logic here (e.g., send to backend or console.log)
    Alert.alert('Form Submitted', `Name: ${name}\nEmail: ${email}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Tournament</Text>

      <TextInput
        placeholder="Tournament Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TextInput
        placeholder="Tournament Type"
        value={type}
        onChangeText={setType}
        style={styles.input}
        
      />
      <TextInput
        placeholder="Age group"
        value={age}
        onChangeText={setAge}
        style={styles.input}
      />
      <TextInput
        placeholder="Number of teams"
        value={number}
        onChangeText={setNumber}
        style={styles.input}
      />
      <TextInput
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
        style={styles.input}
      /><TextInput
        placeholder="Start Date"
        value={startDate}
        onChangeText={setStartDate}
        style={styles.input}
      /><TextInput
        placeholder="End Date"
        value={endDate}
        onChangeText={setEndDate}
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
         <LinearGradient
          colors={['#1db954', '#012c10ff']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <Text style={styles.buttonText}>Save Tournament</Text>
        </LinearGradient>
        
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'left',
  },
  input: {
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  buttonContainer: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  gradient: {
    padding: 14,
    alignItems: 'center',
    borderRadius: 8,
  },
});
