import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { Montserrat_400Regular, Montserrat_500Medium, Montserrat_600SemiBold } from '@expo-google-fonts/montserrat';
import { Raleway_400Regular, Raleway_500Medium, Raleway_600SemiBold, Raleway_700Bold } from '@expo-google-fonts/raleway';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const ArticleDetailPage = () => { // Removed route prop since we're not using it
  // Hardcoded budget article that will always be displayed
  const article = {
    id: 1,
    title: "City Council Approves 2024 Budget with Focus on Infrastructure",
    category: "Budget",
    date: "May 15, 2024",
    content: [
      {"type": "header", "order": 0, "content": "City Council Approves 2024 Budget"},
      {"type": "subheader", "order": 1, "content": "Major investments in infrastructure and public services"},
      {"type": "image", "src": "https://www.freshbooks.com/wp-content/uploads/2022/12/What-Is-Budgeting.jpg", "order": 2, "caption": "City Council members voting on the budget"},
      {"type": "paragraph", "order": 3, "content": "The City Council voted 8-2 yesterday to approve the $3.2 billion budget for fiscal year 2024. The spending plan represents a 4.5% increase over last year's budget, with the largest allocations going to transportation infrastructure and public safety."},
      {"type": "paragraph", "order": 4, "content": "Key highlights of the budget include:"},
      {"type": "list", "order": 5, "items": [
        "Rs.450 million for road and bridge repairs",
        "Rs.380 million for public transportation improvements",
        "Rs.320 million for police and fire department upgrades",
        "Rs.275 million for parks and recreation facilities"
      ]},
      {"type": "quote", "order": 6, "content": "This budget reflects our commitment to rebuilding our city's infrastructure while maintaining fiscal responsibility", "author": "Mayor Johnson"},
      {"type": "paragraph", "order": 7, "content": "The budget will take effect July 1, with most capital projects beginning in the fall."}
    ]
  };

  let [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Raleway_400Regular,
    Raleway_500Medium,
    Raleway_600SemiBold,
    Raleway_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1a73e8" />
      </View>
    );
  }

  const sortedContent = article.content.sort((a, b) => a.order - b.order);

  const renderContentItem = (item) => {
    switch (item.type) {
      case 'header':
        return (
          <Text key={item.order} style={styles.articleHeader}>
            {item.content}
          </Text>
        );
      case 'subheader':
        return (
          <Text key={item.order} style={styles.articleSubheader}>
            {item.content}
          </Text>
        );
      case 'paragraph':
        return (
          <Text key={item.order} style={styles.paragraph}>
            {item.content}
          </Text>
        );
      case 'image':
        if (!item.src) return null;
        return (
          <View key={item.order} style={styles.imageContainer}>
            <Image
              source={{ uri: item.src }}
              style={styles.contentImage}
              resizeMode="cover"
              onError={() => console.log("Image failed to load")}
            />
            {item.caption && (
              <Text style={styles.imageCaption}>{item.caption}</Text>
            )}
          </View>
        );
      case 'list':
        if (!item.items) return null;
        return (
          <View key={item.order} style={styles.listContainer}>
            {item.items.map((listItem, index) => (
              <View key={index} style={styles.listItem}>
                <View style={styles.bulletPoint} />
                <Text style={styles.listText}>{listItem}</Text>
              </View>
            ))}
          </View>
        );
      case 'quote':
        return (
          <View key={item.order} style={styles.quoteContainer}>
            <Ionicons name="md-quote" size={24} color="#e0e0e0" style={styles.quoteIcon} />
            <Text style={styles.quoteText}>{item.content}</Text>
            {item.author && (
              <Text style={styles.quoteAuthor}>— {item.author}</Text>
            )}
          </View>
        );
      case 'divider':
        return (
          <View key={item.order} style={styles.divider} />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.outerContainer}>
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.articleContainer}>
          <View style={styles.articleMeta}>
            <Text style={styles.categoryTag}>{article.category}</Text>
            <Text style={styles.articleDate}>{article.date}</Text>
          </View>
          
          {sortedContent.map((item) => renderContentItem(item))}

          <View style={styles.articleFooter}>
            <Text style={styles.footerText}>Published by CivicConnect</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f7fa',
  },
  outerContainer: {
    flex: 1,
    backgroundColor: '#f5f7fa',
    padding: 16,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  articleContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
  articleMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  categoryTag: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 12,
    color: '#1a73e8',
    textTransform: 'uppercase',
    letterSpacing: 1,
    backgroundColor: '#f0f6ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    overflow: 'hidden',
  },
  articleDate: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: '#70757a',
    letterSpacing: 0.25,
  },
  articleHeader: {
    fontSize: 28,
    fontFamily: 'Raleway_700Bold',
    margin: 24,
    marginBottom: 16,
    color: '#202124',
    lineHeight: 34,
    letterSpacing: -0.5,
  },
  articleSubheader: {
    fontSize: 18,
    fontFamily: 'Raleway_500Medium',
    marginHorizontal: 24,
    marginBottom: 24,
    color: '#5f6368',
    lineHeight: 26,
    letterSpacing: 0.15,
  },
  paragraph: {
    fontSize: 16,
    fontFamily: 'Montserrat_400Regular',
    marginHorizontal: 24,
    marginBottom: 24,
    color: '#3c4043',
    lineHeight: 26,
    letterSpacing: 0.25,
  },
  imageContainer: {
    marginVertical: 16,
  },
  contentImage: {
    width: '100%',
    height: width * 0.6,
  },
  imageCaption: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: '#70757a',
    padding: 16,
    paddingTop: 8,
    lineHeight: 20,
    textAlign: 'center',
    backgroundColor: '#f8f9fa',
  },
  listContainer: {
    marginVertical: 16,
    marginHorizontal: 24,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#1a73e8',
    marginRight: 12,
    marginTop: 10,
  },
  listText: {
    fontSize: 16,
    fontFamily: 'Montserrat_400Regular',
    color: '#3c4043',
    lineHeight: 24,
    flex: 1,
  },
  quoteContainer: {
    marginVertical: 24,
    marginHorizontal: 16,
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderLeftWidth: 4,
    borderLeftColor: '#1a73e8',
    borderRadius: 8,
  },
  quoteIcon: {
    position: 'absolute',
    top: 12,
    left: 12,
    opacity: 0.3,
  },
  quoteText: {
    fontSize: 18,
    fontFamily: 'Raleway_500Medium',
    color: '#202124',
    lineHeight: 28,
    letterSpacing: 0.15,
    fontStyle: 'italic',
  },
  quoteAuthor: {
    fontSize: 15,
    fontFamily: 'Montserrat_500Medium',
    color: '#5f6368',
    marginTop: 12,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 24,
    marginHorizontal: 24,
  },
  articleFooter: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    padding: 24,
    paddingBottom: 32,
  },
  footerText: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: '#70757a',
    textAlign: 'center',
  },
});

export default ArticleDetailPage;