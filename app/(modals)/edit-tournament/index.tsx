import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const EditTournamentForm = ({ tournament, onSubmit }: any) => {
  const [name, setName] = useState(tournament?.name || '');
  const [date, setDate] = useState(tournament?.date || '');
  const [location, setLocation] = useState(tournament?.location || '');
  const [type, setType] = useState(tournament?.type || '');
   const [ageGroup, setAgeGroup] = useState(tournament?.ageGroup || '');
    const [teamno, setTeamno] = useState(tournament?.teamno || '');
     const [endDate,setEndDate] = useState(tournament?.endDate || '');

  const handleSave = () => {
    if (!name || !date || !location || !type || !ageGroup || !teamno || !endDate) {
      Alert.alert('Please fill all fields');
      return;
    }

    const updatedTournament = { ...tournament, name, date, location,type,ageGroup,teamno,endDate };
    onSubmit(updatedTournament);
  };

  return (
    <View style={styles.container}>
      {/* Display current tournament name */}
      <Text style={styles.headerText}>Edit Tournament: {tournament?.name}</Text>

      <TextInput
        style={styles.input}
        placeholder="Tournament Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
      />

      <TextInput
        style={styles.input}
        placeholder="Tournament Type"
        value={type}
        onChangeText={setType}
      />
       <TextInput
        style={styles.input}
        placeholder="Age Group"
        value={ageGroup}
        onChangeText={setAgeGroup}
      />
       <TextInput
        style={styles.input}
        placeholder="Number Of Teams"
        value={teamno}
        onChangeText={setTeamno}
      />
       <TextInput
        style={styles.input}
        placeholder="Start Date (e.g. August 1, 2025)"
        value={date}
        onChangeText={setDate}
      />
       <TextInput
        style={styles.input}
        placeholder="End Date"
        value={endDate}
        onChangeText={setEndDate}
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EditTournamentForm;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#06753a',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#06753a',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
