import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function LoginScreen() {
  const [aadharNo, setAadharNo] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!aadharNo || !password) {
      Alert.alert('Error', 'Please enter both Aadhar number and password');
      return;
    }

    if (aadharNo.length !== 12 || !/^\d+$/.test(aadharNo)) {
      Alert.alert('Error', 'Aadhar number must be 12 digits');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://192.168.56.1:5000/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for cookies/sessions
        body: JSON.stringify({
            aadhar_no: aadharNo,
            password: password,
        }),
    });

      const data = await response.json();

      if (data.success) {
        router.replace('/profile');
      } else {
        Alert.alert('Error', data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Failed to connect to the server. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={require('../../assets/civicconnect-logo.jpg')} 
          style={styles.logo}
        />
        <ThemedText style={styles.title}>CivicConnect</ThemedText>
        <ThemedText style={styles.subtitle}>Government Services Portal</ThemedText>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.formContainer}
      >
        <View style={styles.inputContainer}>
          <MaterialCommunityIcons name="card-account-details" size={24} color="#1E90FF" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Aadhar Number"
            placeholderTextColor="#888"
            value={aadharNo}
            onChangeText={setAadharNo}
            keyboardType="numeric"
            maxLength={12}
          />
        </View>

        <View style={styles.inputContainer}>
          <MaterialCommunityIcons name="lock" size={24} color="#1E90FF" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#888"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
            <MaterialCommunityIcons 
              name={showPassword ? 'eye-off' : 'eye'} 
              size={24} 
              color="#888" 
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.loginButton} 
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <ThemedText style={styles.loginButtonText}>Login</ThemedText>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/register')}>
          <ThemedText style={styles.registerText}>
            Don't have an account? <ThemedText style={styles.registerLink}>Register</ThemedText>
          </ThemedText>
        </TouchableOpacity>
      </KeyboardAvoidingView>

      <View style={styles.footer}>
        <ThemedText style={styles.footerText}>Secure Government Authentication</ThemedText>
        <MaterialCommunityIcons name="shield-check" size={20} color="#1E90FF" />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#1E90FF',
    fontFamily: 'Raleway_700Bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'Montserrat_400Regular',
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 2,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontFamily: 'Montserrat_400Regular',
    fontSize: 16,
  },
  eyeIcon: {
    padding: 10,
  },
  loginButton: {
    backgroundColor: '#1E90FF',
    borderRadius: 25,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    elevation: 3,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Raleway_600SemiBold',
  },
  registerText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
    fontFamily: 'Montserrat_400Regular',
  },
  registerLink: {
    color: '#1E90FF',
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  footerText: {
    marginRight: 5,
    color: '#666',
    fontFamily: 'Montserrat_400Regular',
  },
});