import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Alert } from 'react-native';
import Voice, { SpeechResultsEvent, SpeechStartEvent, SpeechEndEvent } from '@react-native-voice/voice';

// Helper polyfill function for getUserMedia using legacy implementations
const getUserMediaPolyfill = (constraints: MediaStreamConstraints): Promise<MediaStream> => {
  const legacyGetUserMedia = (navigator as any).getUserMedia ||
                             (navigator as any).webkitGetUserMedia ||
                             (navigator as any).mozGetUserMedia;
  if (legacyGetUserMedia) {
    return new Promise((resolve, reject) => {
      legacyGetUserMedia.call(navigator, constraints, resolve, reject);
    });
  } else {
    return Promise.reject(new Error("getUserMedia is not implemented in this browser"));
  }
};

const requestMicPermission = async (): Promise<boolean> => {
  // Check for standard getUserMedia first.
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      return true;
    } catch (err) {
      console.error("Mic permission error:", err);
      return false;
    }
  } else {
    // Try legacy polyfill if standard API isn't available.
    try {
      const stream = await getUserMediaPolyfill({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      return true;
    } catch (err) {
      console.warn("getUserMedia not available, proceeding without explicit mic permission request.");
      return true; // Let the SpeechRecognition API handle permission prompts
    }
  }
};

const Assistant: React.FC = () => {
  const [recognizedText, setRecognizedText] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [assistantResponse, setAssistantResponse] = useState<string>('');
  const recognitionRef = useRef<any>(null);
  const manualStopRef = useRef<boolean>(false);

  // Function to call backend /bot-assistant API with the recognized query
  const fetchBotAssistantResponse = async (query: string) => {
    try {
      const response = await fetch('http://192.168.0.109:5000/bot-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ query })
      });
      const data = await response.json();
      if (data.success) {
        setAssistantResponse(data.response);
      } else {
        setAssistantResponse("Error: " + data.message);
      }
    } catch (error: any) {
      console.error("Error fetching bot assistant response:", error);
      setAssistantResponse("Error fetching bot assistant response.");
    }
  };

  useEffect(() => {
    if (Platform.OS === 'web') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        Alert.alert("Error", "Web Speech Recognition API is not supported in this browser.");
        return;
      }
      recognitionRef.current = new SpeechRecognition();
      // Use non-continuous mode to ensure onend fires reliably.
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        console.log('[Web] Speech recognition started');
        setRecognizedText('');
        setAssistantResponse('');
      };

      recognitionRef.current.onresult = (event: any) => {
        console.log('[Web] Speech recognition result event:', event);
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setRecognizedText(transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('[Web] Speech recognition error:', event.error);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          Alert.alert(
            "Error",
            "Microphone permission denied. Make sure you are running the app over HTTPS and have allowed microphone access in your browser."
          );
          stopListening();
        }
      };

      recognitionRef.current.onend = () => {
        console.log('[Web] Speech recognition ended');
        setIsListening(false);
        if (recognizedText.trim() !== '') {
          // Call backend API with the recognized text
          fetchBotAssistantResponse(recognizedText);
        }
      };
    } else {
      // Native: set up event handlers for react-native-voice.
      Voice.onSpeechStart = (e: SpeechStartEvent) => {
        console.log('[Native] Voice recognition started', e);
        setRecognizedText('');
        setAssistantResponse('');
      };
      Voice.onSpeechResults = (e: SpeechResultsEvent) => {
        console.log('[Native] Voice recognition results', e);
        if (e.value && e.value.length > 0) {
          setRecognizedText(e.value[0]);
        }
      };
      Voice.onSpeechEnd = (e: SpeechEndEvent) => {
        console.log('[Native] Voice recognition ended', e);
        setIsListening(false);
        if (recognizedText.trim() !== '') {
          // Call backend API with the recognized text
          fetchBotAssistantResponse(recognizedText);
        }
      };
    }

    return () => {
      if (Platform.OS === 'web') {
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
      } else {
        Voice.destroy().then(Voice.removeAllListeners);
      }
    };
  }, [recognizedText]);

  const startListening = async () => {
    console.log('Start Listening button clicked');
    manualStopRef.current = false;
    setIsListening(true);
    setRecognizedText('');
    setAssistantResponse('');

    if (Platform.OS === 'web') {
      const permission = await requestMicPermission();
      if (!permission) {
        Alert.alert("Error", "Microphone permission not granted.");
        setIsListening(false);
        return;
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          console.log('[Web] Recognition started');
        } catch (err) {
          console.error('Error starting web SpeechRecognition:', err);
        }
      }
    } else {
      if (Voice && typeof Voice.start === 'function') {
        try {
          await Voice.start('en-US');
          console.log('[Native] Voice recognition started');
        } catch (err) {
          console.error('Error starting Voice recognition:', err);
          Alert.alert(
            "Error",
            "Voice recognition is not available in this Expo Go client. Please build a custom dev client with EAS Build."
          );
          setIsListening(false);
        }
      } else {
        Alert.alert(
          "Error",
          "Voice module not available. Please build a custom dev client with EAS Build."
        );
        setIsListening(false);
      }
    }
  };

  const stopListening = async () => {
    console.log('Stop Listening button clicked');
    manualStopRef.current = true;
    if (Platform.OS === 'web') {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    } else {
      try {
        await Voice.stop();
      } catch (err) {
        console.error('Error stopping Voice recognition:', err);
      }
    }
    setIsListening(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Assistant</Text>
      <View style={styles.queryContainer}>
        <Text style={styles.label}>Your Query:</Text>
        <Text style={styles.queryText}>{recognizedText}</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={isListening ? stopListening : startListening}>
        <Text style={styles.buttonText}>{isListening ? 'Stop Listening' : 'Start Listening'}</Text>
      </TouchableOpacity>
      {assistantResponse ? (
        <View style={styles.responseContainer}>
          <Text style={styles.label}>Assistant Response:</Text>
          <View style={styles.responseBox}>
            <Text style={styles.responseText}>{assistantResponse}</Text>
          </View>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  queryContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 20,
    fontWeight: '600',
  },
  queryText: {
    fontSize: 18,
    marginTop: 10,
    color: '#333',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  responseContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  responseBox: {
    marginTop: 10,
    width: '80%',
    height: 100,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  responseText: {
    fontSize: 18,
    textAlign: 'center',
  },
});

export default Assistant;
