
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
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
  const [instName, setInstName] = useState('');
  const [insttype, setInsttype] = useState('');
  const [dob, setDob] = useState('');
  const [position, setPosition] = useState('');
  const [foot, setFoot] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [search, setSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [userName, setUserName] = useState('');


 useEffect(() => {
  const getToken = async () => {
    const storedToken = await SecureStore.getItemAsync('token');
    console.log('📛 TOKEN:', storedToken);
    setToken(storedToken);
  };

  const init = async () => {
    const storedUser = await SecureStore.getItemAsync('user');
    let name = '';
    if (storedUser) {
      try {
        name = JSON.parse(storedUser).name || '';
      } catch {
        name = '';
      }
    }
    setUserName(name);
  };

  getToken();
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
    if (!token) {
      alert('No token found. Please log in again.');
      return;
    }
    const payload = {
        user_name:userName,
      institution_name:instName,
      bio:bio,
      county:location,
      institution_type:insttype,
      founded_year:dob,
      account_type: 'institution',
     
    };

    try {
      const response = await fetch(`http://10.236.120.120:4001/api/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to create profile:', errorText);
        alert('Failed to create profile');
        return;
      }

      const data = await response.json();
      console.log('Profile created:', data);
      alert('Profile successfully created!');
    } catch (error) {
      console.error('Network error:', error);
      alert('An error occurred while creating your profile.');
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
            Tell us more to complete your institution's profile
          </Text>

          <Text style={styles.label}>Name of institution</Text>
          <View style={styles.row}>
            <TextInput
              style={styles.fullWidthInput}
              placeholder="e.g ChezaFootball sc"
              value={instName}
              onChangeText={setInstName}
            />
          </View>

          <Text style={styles.label}>Founding Year</Text>
          <TextInput
            style={styles.fullWidthInput}
            placeholder="YYYY-MM-DD"
            value={dob}
            onChangeText={setDob}
          />
             <Text style={styles.label}>Type of institution</Text>
          <TextInput
            style={styles.fullWidthInput}
            placeholder="e.g academy"
            value={insttype}
            onChangeText={setInsttype}
          />

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
            placeholder="A brief description of the Institution"
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
