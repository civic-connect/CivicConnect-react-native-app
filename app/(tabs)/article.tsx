import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Montserrat_400Regular, Montserrat_500Medium, Montserrat_600SemiBold } from '@expo-google-fonts/montserrat';
import { Raleway_400Regular, Raleway_500Medium, Raleway_600SemiBold } from '@expo-google-fonts/raleway';
import { useFonts } from 'expo-font';

const ArticleListPage = () => {
  const navigation = useNavigation();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  let [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Raleway_400Regular,
    Raleway_500Medium,
    Raleway_600SemiBold,
  });

  useEffect(() => {
    // Simulate API fetch
    const fetchArticles = async () => {
      try {
        // Replace with actual API call
        const mockArticles = [
          {
            id: 1,
            title: "City Council Approves 2024 Budget with Focus on Infrastructure",
            preview: "The $3.2 billion budget includes major investments in roads, bridges, and public transportation.",
            date: "May 15, 2024",
            category: "Budget",
            content: [
              {"type": "header", "order": 0, "content": "City Council Approves 2024 Budget"},
              {"type": "subheader", "order": 1, "content": "Major investments in infrastructure and public services"},
              {"type": "image", "src": "https://www.freshbooks.com/wp-content/uploads/2022/12/What-Is-Budgeting.jpg", "order": 2, "caption": "City Council members voting on the budget"},
              {"type": "paragraph", "order": 3, "content": "The City Council voted 8-2 yesterday to approve the $3.2 billion budget for fiscal year 2024. The spending plan represents a 4.5% increase over last year's budget, with the largest allocations going to transportation infrastructure and public safety."},
              {"type": "paragraph", "order": 4, "content": "Key highlights of the budget include:"},
              {"type": "list", "order": 5, "items": [
                "$450 million for road and bridge repairs",
                "$380 million for public transportation improvements",
                "$320 million for police and fire department upgrades",
                "$275 million for parks and recreation facilities"
              ]},
              {"type": "quote", "order": 6, "content": "This budget reflects our commitment to rebuilding our city's infrastructure while maintaining fiscal responsibility", "author": "Mayor Johnson"},
              {"type": "paragraph", "order": 7, "content": "The budget will take effect July 1, with most capital projects beginning in the fall."}
            ]
          },
          // ... more articles
        ];
        setArticles(mockArticles);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching articles:", error);
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (!fontsLoaded || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1a73e8" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Government News & Updates</Text>
      
      <FlatList
        data={articles}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.articleCard}
            onPress={() => navigation.navigate('ArticleDetail', { article: item })}
          >
            <Text style={styles.categoryTag}>{item.category}</Text>
            <Text style={styles.articleTitle}>{item.title}</Text>
            <Text style={styles.articlePreview}>{item.preview}</Text>
            <Text style={styles.articleDate}>{item.date}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  header: {
    fontSize: 24,
    fontFamily: 'Raleway_600SemiBold',
    marginBottom: 20,
    color: '#2c3e50',
    paddingTop: 10,
  },
  listContainer: {
    paddingBottom: 20,
  },
  articleCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  categoryTag: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 12,
    color: '#1a73e8',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  articleTitle: {
    fontSize: 18,
    fontFamily: 'Raleway_600SemiBold',
    marginBottom: 8,
    color: '#202124',
    lineHeight: 24,
  },
  articlePreview: {
    fontSize: 14,
    fontFamily: 'Montserrat_400Regular',
    color: '#5f6368',
    marginBottom: 8,
    lineHeight: 20,
  },
  articleDate: {
    fontSize: 12,
    fontFamily: 'Montserrat_400Regular',
    color: '#80868b',
  },
});

export default ArticleListPage;