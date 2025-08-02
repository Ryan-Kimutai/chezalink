import AsyncStorage from '@react-native-async-storage/async-storage';
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

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing Fields', 'Please fill all fields.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://192.168.0.100:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');

      await AsyncStorage.setItem('token', data.token);
      await AsyncStorage.setItem('user', JSON.stringify(data.user));

      Alert.alert('Welcome back!', `Hi ${data.user.name}`);
      router.replace('/');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'An unexpected error occurred';
      Alert.alert('Login Failed', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        {/* Logo/Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>
            ぷ Cheza
            <Text style={{ color: '#000' }}>Link</Text>
          </Text>
        </View>

        <Text style={styles.title}>Welcome back!</Text>

        {/* Email */}
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        {/* Password */}
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {/* Login Button */}
        <LinearGradient
          colors={['#1db954', '#000']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.loginButton}
        >
          <TouchableOpacity onPress={handleLogin} disabled={loading}>
            <Text style={styles.loginButtonText}>
              {loading ? 'Logging in...' : 'Login'}
            </Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Navigation to Register */}
        <TouchableOpacity onPress={() => router.push('/register')}>
          <Text style={styles.linkText}>
            Don’t have an account? <Text style={styles.linkBold}>Register</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    fontSize: 26,
    fontWeight: '900',
    color: '#1db954',
    fontFamily: 'sans-serif-condensed',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 24,
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
  input: {
    width: '100%',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f9f9f9',
  },
  loginButton: {
    marginTop: 30,
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 14,
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  linkText: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 14,
    color: '#333',
  },
  linkBold: {
    color: '#1db954',
    fontWeight: 'bold',
  },
});
