// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        // Header settings for a navigation bar at the top
        headerStyle: { backgroundColor: '#1E90FF' },
        headerTintColor: '#fff',
        headerTitle: 'CivicConnect',
        // Tab bar styling
        tabBarActiveTintColor: '#1E90FF',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: { backgroundColor: '#fff', borderTopColor: '#ddd' },
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
          title: 'Converse',
          tabBarIcon: ({ color }) => <Ionicons name="compass-outline" size={24} color={color} />,
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
  );
}
