import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const counties = [
  'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo-Marakwet', 'Embu', 'Garissa',
  'Homa Bay', 'Isiolo', 'Kajiado', 'Kakamega', 'Kericho', 'Kiambu', 'Kilifi',
  'Kirinyaga', 'Kisii', 'Kisumu', 'Kitui', 'Kwale', 'Laikipia', 'Lamu', 'Machakos',
  'Makueni', 'Mandera', 'Marsabit', 'Meru', 'Migori', 'Mombasa', 'Murang\'a',
  'Nairobi', 'Nakuru', 'Nandi', 'Narok', 'Nyamira', 'Nyandarua', 'Nyeri', 'Samburu',
  'Siaya', 'Taita-Taveta', 'Tana River', 'Tharaka-Nithi', 'Trans Nzoia', 'Turkana',
  'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot'
];

export default function EditProfileModal() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');
  const [position, setPosition] = useState('');
  const [foot, setFoot] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [search, setSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const filteredCounties = counties.filter((county) =>
    county.toLowerCase().includes(search.toLowerCase())
  );

  const handleDateChange = (_: any, selectedDate: Date | undefined) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const iso = selectedDate.toISOString().split('T')[0];
      setDob(iso);
    }
  };

  const handleFinish = () => {
    console.log({
      firstName,
      lastName,
      dob,
      position,
      foot,
      location,
      bio,
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.logo}>
              ぷ Cheza
              <Text style={{ color: '#000' }}>Link</Text>
            </Text>
          </View>

          <Text style={styles.title}>
            Tell us more about yourself to complete your profile
          </Text>

          {/* Full Name */}
          <Text style={styles.label}>Full Name</Text>
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

          {/* DOB */}
          <Text style={styles.label}>Date of birth</Text>
          <TouchableOpacity
            style={styles.fullWidthInput}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={{ color: dob ? '#000' : '#888' }}>
              {dob || 'Tap to pick your birth date'}
            </Text>
          </TouchableOpacity>

          {/* Position & Foot */}
          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={styles.label}>Position</Text>
              <Picker
                selectedValue={position}
                onValueChange={setPosition}
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
                onValueChange={setFoot}
                style={styles.picker}
              >
                <Picker.Item label="Left/Right" value="" />
                <Picker.Item label="Left" value="Left" />
                <Picker.Item label="Right" value="Right" />
              </Picker>
            </View>
          </View>

          {/* Location */}
          <Text style={styles.label}>Location (County)</Text>
          <TextInput
            style={styles.fullWidthInput}
            placeholder="Start typing to search..."
            value={search}
            onChangeText={(text) => {
              setSearch(text);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
          />

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

        {/* County Dropdown */}
        {showDropdown && (
          <View style={styles.dropdownOverlay}>
            <FlatList
              data={filteredCounties}
              keyExtractor={(item) => item}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <Pressable
                  style={styles.dropdownItem}
                  onPress={() => {
                    setLocation(item);
                    setSearch(item);
                    setShowDropdown(false);
                  }}
                >
                  <Text>{item}</Text>
                </Pressable>
              )}
            />
          </View>
        )}

        {/* Date Picker Modal */}
        {showDatePicker && (
          <DateTimePicker
            value={dob ? new Date(dob) : new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
            maximumDate={new Date()}
          />
        )}
      </View>
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
  dropdownOverlay: {
    position: 'absolute',
    top: 490,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    maxHeight: 160,
    zIndex: 10,
  },
  dropdownItem: {
    padding: 12,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
});
