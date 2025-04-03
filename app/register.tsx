import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Public');
  const [proofDocument, setProofDocument] = useState('');
  const [aadharNo, setAadharNo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password || !role || !proofDocument || !aadharNo) {
      Alert.alert('Error', 'All fields are required!');
      return;
    }

    if (aadharNo.length !== 12 || !/^\d+$/.test(aadharNo)) {
      Alert.alert('Error', 'Aadhar number must be 12 digits');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://192.168.56.1:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          proof_document: proofDocument,
          aadhar_no: aadharNo
        }),
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert('Success', 'Registration successful!');
        router.replace('/');
      } else {
        Alert.alert('Error', data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Error', 'An error occurred while registering. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={require('../assets/civicconnect-logo.jpg')} 
          style={styles.logo}
        />
        <ThemedText style={styles.title}>CivicConnect</ThemedText>
        <ThemedText style={styles.subtitle}>Government Services Portal</ThemedText>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.formContainer}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="account" size={24} color="#1E90FF" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#888"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="email" size={24} color="#1E90FF" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#888"
              value={email}
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="lock" size={24} color="#1E90FF" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#888"
              value={password}
              secureTextEntry={!showPassword}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              <MaterialCommunityIcons 
                name={showPassword ? 'eye-off' : 'eye'} 
                size={24} 
                color="#888" 
              />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="account-tie" size={24} color="#1E90FF" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Role (Public/Official)"
              placeholderTextColor="#888"
              value={role}
              onChangeText={setRole}
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="file-document" size={24} color="#1E90FF" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Proof Document (ID Number)"
              placeholderTextColor="#888"
              value={proofDocument}
              onChangeText={setProofDocument}
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="card-account-details" size={24} color="#1E90FF" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Aadhar Number"
              placeholderTextColor="#888"
              value={aadharNo}
              keyboardType="numeric"
              maxLength={12}
              onChangeText={setAadharNo}
            />
          </View>

          <TouchableOpacity 
            style={styles.registerButton} 
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <ThemedText style={styles.registerButtonText}>Register</ThemedText>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/login')}>
            <ThemedText style={styles.loginText}>
              Already have an account? <ThemedText style={styles.loginLink}>Login</ThemedText>
            </ThemedText>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.footer}>
        <ThemedText style={styles.footerText}>Secure Government Registration</ThemedText>
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
    marginBottom: 30,
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
    flex: 1,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 15,
  },
  scrollContent: {
    paddingBottom: 20,
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
  registerButton: {
    backgroundColor: '#1E90FF',
    borderRadius: 25,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    elevation: 3,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Raleway_600SemiBold',
  },
  loginText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
    fontFamily: 'Montserrat_400Regular',
  },
  loginLink: {
    color: '#1E90FF',
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  footerText: {
    marginRight: 5,
    color: '#666',
    fontFamily: 'Montserrat_400Regular',
  },
});