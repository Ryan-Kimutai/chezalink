import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
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
const router = useRouter();
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
  const [userName, setUserName] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [token, setToken] = useState<string | null>(null);

useEffect(() => {
  const init = async () => {
    const storedToken = await SecureStore.getItemAsync('token');
    const storedUser = await SecureStore.getItemAsync('user');

    if (storedToken) setToken(storedToken);

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);

        console.log('🔍 Stored user in SecureStore:', parsedUser); // ✅ ADD HERE

        setUserName(parsedUser.name || ''); // ✅ pull from user object
      } catch {
        setUserName('');
      }
    }
  };

  init();
}, []);
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

const handleFinish = async () => {
  // Get token & user_name from SecureStore
  const storedToken = await SecureStore.getItemAsync('token');
  const storedUser = await SecureStore.getItemAsync('user');

  if (!storedToken) {
    alert('No token found. Please log in again.');
    return;
  }

  let finalUserName = userName;
  if (storedUser) {
    try {
      const parsedUser = JSON.parse(storedUser);
      finalUserName = parsedUser.user_name || userName;
    } catch {
      console.warn('⚠️ Could not parse stored user');
    }
  }

  if (!finalUserName) {
    alert('No username found. Please log in again.');
    return;
  }

  const payload = {
    user_name: finalUserName,
    account_type: 'player',
    first_name: firstName,
    last_name: lastName,
    bio,
    county: location,
    date_of_birth: dob,
    prefered_foot: foot,
    position,
  };

  console.log('📤 Sending profile payload:', payload);

  try {
    const response = await fetch(`http://192.168.0.106:4001/api/profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${storedToken}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Failed to create profile:', errorText);
      alert(`Failed to create profile: ${errorText}`);
      return;
    }

    const data = await response.json();
    console.log('✅ Profile created:', data);

    // ✅ Navigate to tabs after profile creation
    router.replace('/(tabs)');
  } catch (error: any) {
    console.error('🚨 PROFILE CREATION ERROR:', error);
    alert(
      `An error occurred while creating your profile.\nError: ${
        error?.message || 'Unknown error'
      }`
    );
  }
};



  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.logo}>
              ぷ Cheza<Text style={{ color: '#000' }}>Link</Text>
            </Text>
          </View>

          <Text style={styles.title}>
            Tell us more about yourself to complete your profile
          </Text>

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

          <Text style={styles.label}>Date of birth</Text>
          <TextInput
            style={styles.fullWidthInput}
            placeholder="YYYY-MM-DD"
            value={dob}
            onChangeText={setDob}
          />

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

          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={styles.bioInput}
            multiline
            numberOfLines={4}
            placeholder="Give us a brief description of yourself on the pitch"
            value={bio}
            onChangeText={setBio}
          />

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
