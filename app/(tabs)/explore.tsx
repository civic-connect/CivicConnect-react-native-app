import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import axios from 'axios';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function ExploreScreen() {
  const [messages, setMessages] = useState([
    { id: '1', text: 'Hello! How can I help you with government services today?', sender: 'bot' },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dotIndex, setDotIndex] = useState(0);

  // Animate the loading dots
  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setDotIndex((prev) => (prev + 1) % 3);
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  const handleSend = async () => {
    if (inputText.trim().length === 0) return;

    const userMessage = { id: Date.now().toString(), text: inputText, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await axios.post(
        'http://192.168.56.1:5001/chat',
        { query: inputText },
        { withCredentials: true }
      );

      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: response.data.response,
        sender: 'bot',
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to connect to the assistant.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = ({ item }) => (
    <View style={[
      styles.messageBubble,
      item.sender === 'user' ? styles.userBubble : styles.botBubble,
    ]}>
      {item.sender === 'bot' && (
        <View style={styles.botIcon}>
          <MaterialCommunityIcons name="robot-happy" size={20} color="#1E90FF" />
        </View>
      )}
      <ThemedText style={[
        styles.messageText,
        item.sender === 'user' ? styles.userMessageText : styles.botMessageText
      ]}>
        {item.text}
      </ThemedText>
      {item.sender === 'user' && (
        <View style={styles.userIcon}>
          <MaterialIcons name="person" size={20} color="#fff" />
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Chat Content */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.chatContent}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          isLoading && (
            <View style={styles.loadingBubble}>
              {[0, 1, 2].map((i) => (
                <View 
                  key={i}
                  style={[
                    styles.loadingDot,
                    i === dotIndex && styles.activeDot
                  ]}
                />
              ))}
            </View>
          )
        }
      />

      {/* Input Area */}
      <KeyboardAvoidingView
        style={styles.inputContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          placeholderTextColor="#888"
          value={inputText}
          onChangeText={setInputText}
          multiline
        />
        <TouchableOpacity 
          style={[
            styles.sendButton,
            (isLoading || !inputText.trim()) && styles.disabledButton
          ]} 
          onPress={handleSend}
          disabled={isLoading || !inputText.trim()}
        >
          <Ionicons name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  chatContent: {
    padding: 16,
    paddingBottom: 80,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
    marginVertical: 6,
    maxWidth: '80%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  userBubble: {
    backgroundColor: '#1E90FF',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: '#f5f5f5',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    flexShrink: 1,
  },
  userMessageText: {
    color: '#fff',
  },
  botMessageText: {
    color: '#333',
  },
  userIcon: {
    marginLeft: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    padding: 3,
  },
  botIcon: {
    marginRight: 8,
    backgroundColor: 'rgba(30, 144, 255, 0.1)',
    borderRadius: 10,
    padding: 3,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  input: {
    flex: 1,
    minHeight: 48,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    fontSize: 15,
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: '#1E90FF',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  loadingBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    padding: 12,
    marginVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 3,
  },
  activeDot: {
    backgroundColor: '#1E90FF',
    transform: [{ scale: 1.2 }],
  },
});