// app/(tabs)/index.tsx
import { Image, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  const router = useRouter();

  const handleLogout = () => {
    // For demonstration, you could implement logout logic here.
    // For now, you might navigate to a login screen if available.
    router.replace('/login');
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#000' }}
      headerImage={
        <Image
          source={require('@/assets/images/people-connect.jpg')}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.headerContainer}>
        <ThemedText type="title">Welcome to CivicConnect!</ThemedText>
        
      </ThemedView>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <ThemedText type="defaultSemiBold" style={styles.logoutButtonText}>
            Logout
          </ThemedText>
        </TouchableOpacity>
      
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Interact</ThemedText>
        <ThemedText>
          Have conversations with <ThemedText type="defaultSemiBold">our friendly assistant</ThemedText> to learn about government schemes, etc.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Connect</ThemedText>
        <ThemedText>
          Share your thoughts about local issues and view others'.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Stay informed</ThemedText>
        <ThemedText>
          Get updates on the latest happenings and gossips.
        </ThemedText>
      </ThemedView>
      
      <ThemedView style={styles.footer}>
        <HelloWave />
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: '#FF4500',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  reactLogo: {
    height: 250,
    width: 360,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
  },
});
