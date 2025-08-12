import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function RegisterScreen() {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
  if (!userName || !email || !password || !confirmPassword) {
    Alert.alert('Missing Fields', 'Please fill all fields.');
    return;
  }

  if (password !== confirmPassword) {
    Alert.alert('Password Mismatch', 'Passwords do not match.');
    return;
  }

  setLoading(true);
  try {
    const res = await fetch('http://192.168.0.106:5000/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_name: userName,
        email,
        password,
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');

    Alert.alert('Success', 'Account created! Please log in.');

    // ⬅ Instead of going to profile setup, send them to login
    router.replace('/(auth)/login');

  } catch (err) {
    const message = err instanceof Error ? err.message : 'Something went wrong';
    Alert.alert('Error', message);
  } finally {
    setLoading(false);
  }
};
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.logo}>
            ぷ Cheza
            <Text style={{ color: '#000' }}>Link</Text>
          </Text>
        </View>

        <Text style={styles.title}>Create an Account</Text>

        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          placeholder="johndoe"
          value={userName}
          onChangeText={setUserName}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter a secure password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Re-enter password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <LinearGradient
          colors={['#1db954', '#000']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.registerButton}
        >
          <TouchableOpacity onPress={handleRegister} disabled={loading}>
            <Text style={styles.registerButtonText}>
              {loading ? 'Registering...' : 'Register'}
            </Text>
          </TouchableOpacity>
        </LinearGradient>

        <TouchableOpacity onPress={() => router.push('/login')}>
          <Text style={styles.linkText}>
            Already have an account?{' '}
            <Text style={styles.linkBold}>Login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flex: 1, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 40 },
  logo: { fontSize: 26, fontWeight: '900', color: '#1db954', fontFamily: 'sans-serif-condensed' },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 24, textAlign: 'center', color: '#111' },
  label: { fontWeight: '600', fontSize: 14, marginBottom: 6, marginTop: 16, color: '#333' },
  input: { width: '100%', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#ccc', backgroundColor: '#f9f9f9' },
  registerButton: { marginTop: 30, borderRadius: 12, alignItems: 'center', paddingVertical: 14 },
  registerButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  linkText: { marginTop: 20, textAlign: 'center', fontSize: 14, color: '#333' },
  linkBold: { color: '#1db954', fontWeight: 'bold' },
});
