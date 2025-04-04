import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import { 
  View, 
  TouchableOpacity, 
  Image, 
  useColorScheme,
  StatusBar,
  SafeAreaView,
  Text,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import { useFonts } from 'expo-font';
import { Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import { Raleway_700Bold } from '@expo-google-fonts/raleway';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const [darkMode, setDarkMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const colorScheme = useColorScheme();
  const isDark = darkMode || colorScheme === 'dark';
  const insets = useSafeAreaInsets();

  const [fontsLoaded] = useFonts({
    Montserrat_700Bold,
    Raleway_700Bold
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('http://192.168.56.1:5000/api/check-auth', {
          credentials: 'include'
        });
        const data = await response.json();
        setIsAuthenticated(data.authenticated);
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const colors = {
    light: {
      primary: '#1a73e8',
      background: '#f8f9fa',
      text: '#202124',
      border: '#dadce0',
    },
    dark: {
      primary: '#8ab4f8',
      background: '#202124',
      text: '#e8eaed',
      border: '#3c4043',
    }
  };

  const currentColors = isDark ? colors.dark : colors.light;

  if (!fontsLoaded || loading) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: currentColors.background 
      }}>
        <ActivityIndicator size="large" color={currentColors.primary} />
      </View>
    );
  }

  return (
    <View style={{ 
      flex: 1,
      backgroundColor: currentColors.background,
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
    }}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Custom Header */}
      <View style={[styles.header, { 
        borderBottomColor: currentColors.border,
        paddingTop: insets.top > 0 ? 0 : 16 
      }]}>
        <View style={styles.headerLeft}>
          <Image 
            source={require('../../assets/civicconnect-logo.jpg')} 
            style={styles.logo}
          />
          <Text style={[styles.headerTitle, { color: currentColors.text }]}>CivicConnect</Text>
        </View>
      </View>

      <Tabs
        initialRouteName="index"
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: currentColors.primary,
          tabBarInactiveTintColor: '#888',
          tabBarStyle: { 
            backgroundColor: currentColors.background,
            borderTopColor: currentColors.border,
            paddingBottom: insets.bottom > 0 ? 0 : 8,
            height: 60 + (insets.bottom > 0 ? 0 : 8),
          },
          tabBarLabelStyle: {
            paddingBottom: 4,
          },
        }}
      >
        <Tabs.Screen 
          name="index" 
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={24} color={color} />,
          }}
        />
        <Tabs.Screen 
          name="explore" 
          options={{
            title: 'ChatBot',
            tabBarIcon: ({ color }) => <Ionicons name="chatbubble-outline" size={24} color={color} />,
          }}
        />
        <Tabs.Screen 
          name="assistant" 
          options={{
            title: 'Converse',
            tabBarIcon: ({ color }) => <Ionicons name="headset-outline" size={24} color={color} />,
          }}
        />
          <Tabs.Screen 
            name="profile" 
            options={{
              title: 'Profile',
              tabBarIcon: ({ color }) => <Ionicons name="person-outline" size={24} color={color} />,
            }}
          />
<Tabs.Screen 
  name="article" 
  options={{
    title: 'Insights',
    tabBarIcon: ({ color }) => <Ionicons name="analytics-outline" size={24} color={color} />,
  }}
/>
<Tabs.Screen 
  name="post" 
  options={{
    title: 'Updates',
    tabBarIcon: ({ color }) => <Ionicons name="newspaper-outline" size={24} color={color} />,
  }}
/>
          <Tabs.Screen 
            name="login" 
            options={{
              title: 'Login',
              tabBarIcon: ({ color }) => <Ionicons name="log-in-outline" size={24} color={color} />,
            }}
          />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 32,
    height: 32,
    marginRight: 12,
    resizeMode: 'contain',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Raleway_700Bold',
  },
});