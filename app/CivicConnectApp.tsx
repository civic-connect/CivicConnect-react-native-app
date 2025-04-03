import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Dimensions
} from 'react-native';
import { Montserrat_400Regular, Montserrat_600SemiBold, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import { Raleway_400Regular, Raleway_600SemiBold, Raleway_700Bold } from '@expo-google-fonts/raleway';
import { useFonts } from 'expo-font';
import { Ionicons, MaterialCommunityIcons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useTheme } from './ThemeContext';

const { width } = Dimensions.get('window');

const CivicConnectApp = () => {
  const { darkMode, toggleTheme, colors } = useTheme();
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
    Raleway_400Regular,
    Raleway_600SemiBold,
    Raleway_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  const services = [
    {
      id: 1,
      title: 'Login/Register',
      icon: 'account-circle',
      color: colors.primary,
      iconLib: MaterialIcons,
      gradient: [colors.primary, colors.secondary]
    },
    {
      id: 2,
      title: 'AI Chat Assistant',
      icon: 'robot',
      color: colors.success,
      iconLib: MaterialCommunityIcons,
      gradient: [colors.success, '#3a86ff']
    },
    {
      id: 3,
      title: 'Human Support',
      icon: 'headset',
      color: colors.accent,
      iconLib: MaterialIcons,
      gradient: [colors.accent, '#f72585']
    },
    {
      id: 4,
      title: 'Govt. News',
      icon: 'newspaper',
      color: colors.error,
      iconLib: MaterialCommunityIcons,
      gradient: [colors.error, '#ef233c']
    },
  ];

  const featuredArticles = [
    {
      id: 1,
      title: 'New Community Center Opening',
      excerpt: 'The city will open a new community center in downtown next month with state-of-the-art facilities.',
      category: 'Announcement',
      icon: 'bullhorn',
      color: colors.primary
    },
    {
      id: 2,
      title: 'Budget Allocation for 2023',
      excerpt: 'See how your tax dollars are being allocated this fiscal year across various departments.',
      category: 'Finance',
      icon: 'finance',
      color: colors.success
    },
    {
      id: 3,
      title: 'Road Repair Schedule',
      excerpt: 'Upcoming road maintenance projects in your neighborhood starting next week.',
      category: 'Infrastructure',
      icon: 'road',
      color: colors.accent
    },
    {
      id: 4,
      title: 'Public Safety Initiative',
      excerpt: 'New community policing program launching to improve neighborhood safety.',
      category: 'Safety',
      icon: 'shield-check',
      color: colors.error
    },
  ];

  const renderIcon = (iconLib: any, iconName: string, size = 24, color = '#fff') => {
    const IconComponent = iconLib || Ionicons;
    return <IconComponent name={iconName} size={size} color={color} />;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.background }]}>
          <View style={styles.headerLeft}>
            <Text style={[styles.headerTitle, { color: colors.text }]}></Text>
          </View>
          <TouchableOpacity onPress={toggleTheme}>
            {renderIcon(Ionicons, darkMode ? 'sunny' : 'moon', 24, colors.text)}
          </TouchableOpacity>
        </View>

        {/* Hero Section */}
        <View style={[styles.hero, { 
          backgroundColor: colors.primary,
          shadowColor: colors.primary,
          elevation: 8
        }]}>
          <View style={styles.heroContent}>
            <Text style={[styles.heroTitle, { color: '#ffffff' }]}>Engage with Your Community</Text>
            <Text style={[styles.heroSubtitle, { color: 'rgba(255,255,255,0.9)' }]}>
              Access government services, stay informed, and make your voice heard
            </Text>
            <View style={styles.heroIcons}>
              {renderIcon(FontAwesome5, 'vote-yea', 28, '#ffffff')}
              {renderIcon(MaterialCommunityIcons, 'account-group', 28, '#ffffff')}
              {renderIcon(MaterialIcons, 'public', 28, '#ffffff')}
            </View>
          </View>
          <View style={styles.heroDecoration}>
            <View style={[styles.decorationCircle, { backgroundColor: 'rgba(255,255,255,0.1)' }]} />
            <View style={[styles.decorationCircle, { backgroundColor: 'rgba(255,255,255,0.1)' }]} />
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Services</Text>
          <TouchableOpacity>
            <Text style={[styles.seeAll, { color: colors.primary }]}>See All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.servicesGrid}>
          {services.map(service => (
            <TouchableOpacity 
              key={service.id}
              style={[
                styles.serviceCard, 
                { 
                  backgroundColor: colors.card,
                  shadowColor: colors.text,
                  elevation: 2
                }
              ]}
              activeOpacity={0.8}
            >
              <View style={[
                styles.serviceIcon, 
                { 
                  backgroundColor: service.color,
                  shadowColor: service.color,
                  elevation: 4
                }
              ]}>
                {renderIcon(service.iconLib, service.icon, 24, '#fff')}
              </View>
              <Text style={[styles.serviceTitle, { color: colors.text }]}>{service.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Featured Articles */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Latest Updates</Text>
          <TouchableOpacity>
            <Text style={[styles.seeAll, { color: colors.primary }]}>See All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.articlesContainer}
        >
          {featuredArticles.map(article => (
            <TouchableOpacity
              key={article.id}
              style={[
                styles.articleCard, 
                { 
                  backgroundColor: colors.card,
                  shadowColor: colors.text,
                  elevation: 4
                }
              ]}
              activeOpacity={0.8}
            >
              <View style={[
                styles.articleIconContainer, 
                { 
                  backgroundColor: article.color + '20',
                  borderColor: article.color
                }
              ]}>
                {renderIcon(MaterialCommunityIcons, article.icon, 28, article.color)}
              </View>
              <View style={styles.articleBadge}>
                <Text style={[
                  styles.articleBadgeText, 
                  { 
                    color: article.color,
                    backgroundColor: article.color + '20'
                  }
                ]}>
                  {article.category}
                </Text>
              </View>
              <View style={styles.articleContent}>
                <Text style={[styles.articleTitle, { color: colors.text }]}>{article.title}</Text>
                <Text style={[styles.articleExcerpt, { color: colors.subtext }]}>{article.excerpt}</Text>
              </View>
              <TouchableOpacity style={styles.articleButton}>
                <Text style={[styles.articleButtonText, { color: colors.primary }]}>Read More</Text>
                <MaterialIcons name="arrow-forward" size={16} color={colors.primary} />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Community Stats */}
        <View style={[
          styles.statsContainer,
          { backgroundColor: colors.card }
        ]}>
          <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 16 }]}>
            Community Stats
          </Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <View style={[
                styles.statIcon, 
                { backgroundColor: colors.primary + '20' }
              ]}>
                {renderIcon(FontAwesome5, 'users', 20, colors.primary)}
              </View>
              <Text style={[styles.statValue, { color: colors.text }]}>24.5K</Text>
              <Text style={[styles.statLabel, { color: colors.subtext }]}>Active Users</Text>
            </View>
            <View style={styles.statItem}>
              <View style={[
                styles.statIcon, 
                { backgroundColor: colors.success + '20' }
              ]}>
                {renderIcon(MaterialIcons, 'question-answer', 20, colors.success)}
              </View>
              <Text style={[styles.statValue, { color: colors.text }]}>8.2K</Text>
              <Text style={[styles.statLabel, { color: colors.subtext }]}>Resolved Queries</Text>
            </View>
            <View style={styles.statItem}>
              <View style={[
                styles.statIcon, 
                { backgroundColor: colors.accent + '20' }
              ]}>
                {renderIcon(MaterialCommunityIcons, 'calendar-check', 20, colors.accent)}
              </View>
              <Text style={[styles.statValue, { color: colors.text }]}>156</Text>
              <Text style={[styles.statLabel, { color: colors.subtext }]}>Upcoming Events</Text>
            </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 12,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  logoText: {
    fontFamily: 'Raleway_700Bold',
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Raleway_700Bold',
  },
  hero: {
    height: 240,
    margin: 20,
    borderRadius: 20,
    justifyContent: 'center',
    padding: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  heroContent: {
    maxWidth: '70%',
    zIndex: 2,
  },
  heroTitle: {
    fontSize: 24,
    fontFamily: 'Raleway_700Bold',
    marginBottom: 8,
    lineHeight: 30,
  },
  heroSubtitle: {
    fontSize: 16,
    fontFamily: 'Montserrat_400Regular',
    marginBottom: 20,
    lineHeight: 22,
  },
  heroIcons: {
    flexDirection: 'row',
    gap: 20,
  },
  heroDecoration: {
    position: 'absolute',
    right: -40,
    top: -40,
    zIndex: 1,
  },
  decorationCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    opacity: 0.8,
    marginBottom: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Raleway_600SemiBold',
  },
  seeAll: {
    fontSize: 14,
    fontFamily: 'Montserrat_600SemiBold',
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  serviceCard: {
    width: '47%',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  serviceIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  serviceTitle: {
    fontSize: 15,
    fontFamily: 'Montserrat_600SemiBold',
    textAlign: 'center',
  },
  articlesContainer: {
    paddingLeft: 20,
    paddingRight: 10,
    paddingBottom: 10,
  },
  articleCard: {
    width: width * 0.8,
    borderRadius: 20,
    marginRight: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  articleIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
  },
  articleBadge: {
    marginBottom: 12,
  },
  articleBadgeText: {
    fontSize: 12,
    fontFamily: 'Montserrat_600SemiBold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  articleTitle: {
    fontSize: 18,
    fontFamily: 'Raleway_600SemiBold',
    marginBottom: 8,
    lineHeight: 24,
  },
  articleExcerpt: {
    fontSize: 14,
    fontFamily: 'Montserrat_400Regular',
    marginBottom: 16,
    lineHeight: 20,
    color: '#6c757d',
  },
  articleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  articleButtonText: {
    fontSize: 14,
    fontFamily: 'Montserrat_600SemiBold',
    marginRight: 6,
  },
  statsContainer: {
    marginHorizontal: 20,
    marginBottom: 30,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    width: '30%',
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Raleway_700Bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Montserrat_400Regular',
    textAlign: 'center',
  },
  articleContent: {
    marginBottom: 16,
  },
});

export default CivicConnectApp;