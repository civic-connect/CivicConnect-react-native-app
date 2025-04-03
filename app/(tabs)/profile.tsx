import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  useColorScheme,
  Alert
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Raleway_600SemiBold, Raleway_700Bold } from '@expo-google-fonts/raleway';
import { Montserrat_400Regular } from '@expo-google-fonts/montserrat';
import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';

const lightColors = {
  primary: '#4361ee',
  secondary: '#3a0ca3',
  background: '#f8f9fa',
  card: '#ffffff',
  text: '#212529',
  subtext: '#6c757d',
  border: '#dee2e6',
  accent: '#f72585',
  error: '#ef233c',
  success: '#4cc9f0',
  gradient: ['#4361ee', '#3a0ca3']
};

const darkColors = {
  primary: '#4895ef',
  secondary: '#560bad',
  background: '#121212',
  card: '#1e1e1e',
  text: '#f8f9fa',
  subtext: '#adb5bd',
  border: '#343a40',
  accent: '#b5179e',
  error: '#f72585',
  success: '#4cc9f0',
  gradient: ['#4895ef', '#3f37c9']
};

type UserProfile = {
  user_id: number;
  aadhar_no: string;
  email: string;
  role: string;
  name: string;
};

const ProfileScreen = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? darkColors : lightColors;
  const router = useRouter();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [usingFallback, setUsingFallback] = useState(false);

  let [fontsLoaded] = useFonts({
    Raleway_600SemiBold,
    Raleway_700Bold,
    Montserrat_400Regular,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('http://192.168.56.1:5000/api/check-auth', {
          credentials: 'include',
        });
        
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        
        if (data.success) {
          setProfile(data.user);
        } else {
          throw new Error(data.message || 'Not authenticated');
        }
      } catch (err) {
        console.warn('Profile fetch error:', err);
        setError('Could not load profile. Please login again.');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('http://192.168.56.1:5000/api/logout', {
        method: 'POST',
        credentials: 'include',
      });
      
      if (response.ok) {
        router.replace('/login');
      } else {
        throw new Error('Logout failed');
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

  if (!fontsLoaded || loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const getInitials = (name: string) => {
    if (!name) return 'US';
    return name.split(' ')
      .filter(part => part.length > 0)
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {error ? (
          <View style={[styles.warningBanner, { backgroundColor: colors.error + '20' }]}>
            <Ionicons name="warning" size={16} color={colors.error} />
            <Text style={[styles.warningText, { color: colors.error }]}>
              {error}
            </Text>
          </View>
        ) : null}

        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={[styles.profilePicContainer, { 
            backgroundColor: colors.primary 
          }]}>
            <Text style={styles.profileInitials}>
              {getInitials(profile?.name || '')}
            </Text>
          </View>
          
          <Text style={[styles.userName, { color: colors.text }]}>
            {profile?.name || 'User'}
          </Text>
          <Text style={[styles.userRole, { color: colors.subtext }]}>
            {profile?.role || 'Public'}
          </Text>
        </View>

        {/* Profile Details */}
        <View style={[styles.detailsContainer, { backgroundColor: colors.card }]}>
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>
              Personal Information
            </Text>
            
            <View style={styles.detailRow}>
              <Ionicons name="mail-outline" size={20} color={colors.subtext} />
              <Text style={[styles.detailLabel, { color: colors.subtext }]}>Email: </Text>
              <Text style={[styles.detailText, { color: colors.text }]}>
                {profile?.email || 'N/A'}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <MaterialCommunityIcons name="credit-card-outline" size={20} color={colors.subtext} />
              <Text style={[styles.detailLabel, { color: colors.subtext }]}>Aadhar: </Text>
              <Text style={[styles.detailText, { color: colors.text }]}>
                {profile?.aadhar_no ? '•••• •••• ' + profile.aadhar_no.slice(-4) : 'N/A'}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <Ionicons name="person-outline" size={20} color={colors.subtext} />
              <Text style={[styles.detailLabel, { color: colors.subtext }]}>User ID: </Text>
              <Text style={[styles.detailText, { color: colors.text }]}>
                {profile?.user_id || 'N/A'}
              </Text>
            </View>
          </View>

          {/* Actions Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>
              Account Actions
            </Text>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('../edit-profile')}
            >
              <Ionicons name="pencil-outline" size={20} color={colors.primary} />
              <Text style={[styles.actionText, { color: colors.primary }]}>Edit Profile</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.primary} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('../change-password')}
            >
              <Ionicons name="lock-closed-outline" size={20} color={colors.primary} />
              <Text style={[styles.actionText, { color: colors.primary }]}>Change Password</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.primary} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleLogout}
            >
              <Ionicons name="log-out-outline" size={20} color={colors.error} />
              <Text style={[styles.actionText, { color: colors.error }]}>Logout</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.error} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    justifyContent: 'center',
    marginBottom: 10,
  },
  warningText: {
    marginLeft: 8,
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  profilePicContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 5,
  },
  profileInitials: {
    fontSize: 48,
    color: 'white',
    fontFamily: 'Raleway_700Bold',
    includeFontPadding: false,
  },
  userName: {
    fontSize: 24,
    fontFamily: 'Raleway_700Bold',
    marginBottom: 6,
  },
  userRole: {
    fontSize: 16,
    fontFamily: 'Montserrat_400Regular',
  },
  detailsContainer: {
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 20,
    elevation: 3,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Raleway_600SemiBold',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 14,
    fontFamily: 'Montserrat_400Regular',
    marginLeft: 12,
    width: 80,
  },
  detailText: {
    fontSize: 16,
    fontFamily: 'Montserrat_400Regular',
    flex: 1,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  actionText: {
    fontSize: 16,
    fontFamily: 'Montserrat_400Regular',
    marginLeft: 12,
    flex: 1,
  },
});

export default ProfileScreen;