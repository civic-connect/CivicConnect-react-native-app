import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Pressable,
  LayoutAnimation,
  Platform,
  UIManager
} from 'react-native';
import { MaterialIcons, FontAwesome, Ionicons, Entypo } from '@expo/vector-icons';
import { Video, ResizeMode } from 'expo-av';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { ScrollView } from 'react-native';
import Swiper from 'react-native-swiper';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type Post = {
  post_id: number;
  user_id: string;
  title: string;
  content: string;
  category: string;
  post_type: 'Government' | 'Community' | 'News' | 'LocalIssue';
  location: string;
  created_at: string;
  media: Media[];
  like_count: string;
  comment_count: string;
  bookmark_count: string;
  liked: boolean;
  bookmarked: boolean;
  distance_km?: number | null;
  user_district?: string;
  expanded?: boolean;
};

type Media = {
  media_id: number;
  media_type: 'image' | 'video';
  media_url: string;
};

const PostScreen = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'All' | 'Government' | 'Community' | 'News' | 'LocalIssue'>('All');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [sessionError, setSessionError] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();
  const videoRefs = useRef<{[key: number]: Video}>({});
  const router = useRouter();

  // Axios interceptor for session handling
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      async (config) => {
        config.withCredentials = true;
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          setSessionError(true);
          await SecureStore.deleteItemAsync('userId');
          await SecureStore.deleteItemAsync('userRole');
          router.replace('/login');
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  const fetchPosts = async (pageNum = 1, refresh = false) => {
    if (sessionError) return;

    try {
      if (pageNum === 1) setLoading(true);
      
      const response = await axios.get('http://192.168.56.1:5002/posts', {
        params: { limit: 10, offset: (pageNum - 1) * 10 },
        withCredentials: true
      });

      const postsWithExpanded = response.data.posts.map((post: Post) => ({
        ...post,
        expanded: false
      }));

      if (refresh) {
        setPosts(postsWithExpanded);
      } else {
        setPosts(prev => [...prev, ...postsWithExpanded]);
      }

      setHasMore(response.data.posts.length === 10);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          setSessionError(true);
          router.replace('/login');
        } else {
          Alert.alert('Error', 'Failed to fetch posts. Please try again.');
        }
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setPage(1);
    fetchPosts(1, true);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (page > 1) {
      fetchPosts(page);
    }
  }, [page]);

  const filteredPosts = posts.filter(post => {
    if (activeTab === 'All') return true;
    return post.post_type === activeTab;
  });

  const toggleExpand = (postId: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setPosts(prev => prev.map(post => 
      post.post_id === postId 
        ? { ...post, expanded: !post.expanded } 
        : post
    ));
  };

  const handleLike = async (postId: number) => {
    try {
      await axios.post(
        'http://192.168.56.1:5002/like',
        { post_id: postId },
        { withCredentials: true }
      );
      
      setPosts(prev => prev.map(post => {
        if (post.post_id === postId) {
          return {
            ...post,
            liked: !post.liked,
            like_count: post.liked 
              ? (parseInt(post.like_count) - 1).toString() 
              : (parseInt(post.like_count) + 1).toString()
          };
        }
        return post;
      }));
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        setSessionError(true);
        router.replace('/login');
      } else {
        Alert.alert('Error', 'Failed to like post. Please try again.');
      }
    }
  };

  const handleBookmark = async (postId: number) => {
    try {
      await axios.post(
        'http://192.168.56.1:5002/bookmark',
        { post_id: postId },
        { withCredentials: true }
      );
      
      setPosts(prev => prev.map(post => {
        if (post.post_id === postId) {
          return {
            ...post,
            bookmarked: !post.bookmarked,
            bookmark_count: post.bookmarked
              ? (parseInt(post.bookmark_count) - 1).toString()
              : (parseInt(post.bookmark_count) + 1).toString()
          };
        }
        return post;
      }));
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        setSessionError(true);
        router.replace('/login');
      } else {
        Alert.alert('Error', 'Failed to bookmark post. Please try again.');
      }
    }
  };

  const renderPostTypeTag = (type: string) => {
    const typeColors = {
      Government: '#1E90FF',
      Community: '#34a853',
      News: '#FF6B6B',
      LocalIssue: '#FFA500'
    };
    
    const typeIcons = {
      Government: 'account-balance',
      Community: 'people',
      News: 'newspaper',
      LocalIssue: 'warning'
    };
    
    const displayText = type === 'LocalIssue' ? 'Local Issue' : type;
    
    return (
      <View style={[styles.typeTag, { backgroundColor: typeColors[type as keyof typeof typeColors] }]}>
        <MaterialIcons name={typeIcons[type as keyof typeof typeIcons]} size={14} color="white" />
        <Text style={styles.typeTagText}>
          {displayText}
        </Text>
      </View>
    );
  };

  const renderMediaItem = (item: Media, postId: number) => {
    if (item.media_type === 'video') {
      return (
        <Video
          ref={ref => videoRefs.current[postId] = ref as Video}
          source={{ uri: item.media_url }}
          style={styles.media}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          isLooping
          shouldPlay={false}
        />
      );
    }
    
    return (
      <Image 
        source={{ uri: item.media_url }} 
        style={styles.media}
        resizeMode="cover"
      />
    );
  };

  const renderMedia = (media: Media[], postId: number) => {
    if (media.length === 0) return null;
    
    if (media.length === 1) {
      return (
        <View style={styles.mediaContainer}>
          {renderMediaItem(media[0], postId)}
        </View>
      );
    }

    return (
      <View style={styles.mediaContainer}>
        <Swiper
          showsPagination={true}
          dotColor="rgba(255,255,255,0.4)"
          activeDotColor="#1E90FF"
          paginationStyle={styles.swiperPagination}
        >
          {media.map((item, index) => (
            <View key={index} style={styles.mediaWrapper}>
              {renderMediaItem(item, postId)}
            </View>
          ))}
        </Swiper>
      </View>
    );
  };

  const renderLocation = (post: Post) => {
    if (!post.location && !post.user_district) return null;
    
    const location = post.location || post.user_district;
    let distanceText = '';
    
    if (post.distance_km !== null && post.distance_km !== undefined) {
      distanceText = post.distance_km < 1 
        ? `${Math.round(post.distance_km * 1000)}m away` 
        : `${post.distance_km.toFixed(1)}km away`;
    }
    
    return (
      <View style={styles.locationContainer}>
        <Ionicons name="location-sharp" size={14} color="#666" />
        <Text style={styles.locationText}>
          {location} {distanceText && `• ${distanceText}`}
        </Text>
      </View>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const renderItem = ({ item }: { item: Post }) => (
    <Pressable 
      onPress={() => toggleExpand(item.post_id)}
      style={({ pressed }) => [
        styles.postContainer,
        pressed && styles.pressedPost
      ]}
    >
      <View style={styles.postHeader}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <MaterialIcons 
              name="account-circle" 
              size={36} 
              color={item.post_type === 'Government' ? '#1E90FF' : 
                    item.post_type === 'Community' ? '#34a853' :
                    item.post_type === 'News' ? '#FF6B6B' : '#FFA500'} 
            />
          </View>
          <View style={styles.userMeta}>
            <Text style={styles.username}>
              {item.post_type === 'Government' ? 'Government' : 
               item.post_type === 'Community' ? 'Community User' :
               item.post_type === 'News' ? 'News' : 'Local Issue'}
            </Text>
            {renderLocation(item)}
          </View>
        </View>
        {renderPostTypeTag(item.post_type)}
      </View>
      
      <Text style={styles.postTitle}>{item.title}</Text>
      
      <Text 
        style={styles.postContent}
        numberOfLines={item.expanded ? undefined : 3}
      >
        {item.content}
      </Text>
      
      {renderMedia(item.media, item.post_id)}
      
      <View style={styles.postFooter}>
        <View style={styles.actionGroup}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={(e) => {
              e.stopPropagation();
              handleLike(item.post_id);
            }}
          >
            <Animated.View style={item.liked ? styles.likedAnimation : null}>
              <FontAwesome 
                name={item.liked ? "heart" : "heart-o"} 
                size={24} 
                color={item.liked ? "#ef4444" : "#666"} 
              />
            </Animated.View>
            <Text style={styles.actionText}>{item.like_count}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={(e) => {
              e.stopPropagation();
              (navigation as any).navigate('Comments', { postId: item.post_id });
            }}
          >
            <FontAwesome name="comment-o" size={22} color="#666" />
            <Text style={styles.actionText}>{item.comment_count}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={(e) => {
              e.stopPropagation();
              handleBookmark(item.post_id);
            }}
          >
            <FontAwesome 
              name={item.bookmarked ? "bookmark" : "bookmark-o"} 
              size={22} 
              color={item.bookmarked ? "#1E90FF" : "#666"} 
            />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={styles.shareButton}
          onPress={(e) => e.stopPropagation()}
        >
          <Entypo name="share" size={20} color="#666" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.postMeta}>
        <Text style={styles.postDate}>{formatDate(item.created_at)}</Text>
        {!item.expanded && item.content.length > 120 && (
          <TouchableOpacity 
            onPress={(e) => {
              e.stopPropagation();
              toggleExpand(item.post_id);
            }}
          >
            <Text style={styles.readMore}>Read more</Text>
          </TouchableOpacity>
        )}
      </View>
    </Pressable>
  );

  const renderTabs = () => {
    const tabs = [
      { id: 'All', label: 'All Posts' },
      { id: 'Government', label: 'Government' },
      { id: 'Community', label: 'Community' },
      { id: 'News', label: 'News' },
      { id: 'LocalIssue', label: 'Local Issues' }
    ];
    
    return (
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabContainer}
      >
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tabButton,
              activeTab === tab.id && styles.activeTabButton
            ]}
            onPress={() => setActiveTab(tab.id as any)}
          >
            <Text style={[
              styles.tabText,
              activeTab === tab.id && styles.activeTabText
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  if (sessionError) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Your session has expired. Please login again.</Text>
        <TouchableOpacity 
          style={styles.loginButton}
          onPress={() => router.replace('/login')}
        >
          <Text style={styles.loginButtonText}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading && posts.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E90FF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.FlatList
        data={filteredPosts}
        renderItem={renderItem}
        keyExtractor={item => item.post_id.toString()}
        ListHeaderComponent={renderTabs}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#1E90FF']}
            tintColor={'#1E90FF'}
            progressViewOffset={50}
          />
        }
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } }}],
          { useNativeDriver: true }
        )}
        ListFooterComponent={
          loading && posts.length > 0 ? (
            <ActivityIndicator size="small" color="#1E90FF" style={styles.footerLoading} />
          ) : null
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fafafa',
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Montserrat_600SemiBold',
  },
  loginButton: {
    backgroundColor: '#1E90FF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    elevation: 2,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Raleway_600SemiBold',
  },
  listContent: {
    paddingBottom: 20,
  },
  tabContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 0.5,
    borderBottomColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  tabButton: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 18,
    marginRight: 8,
    backgroundColor: '#f5f5f5',
  },
  activeTabButton: {
    backgroundColor: '#1E90FF',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Montserrat_600SemiBold',
  },
  activeTabText: {
    color: '#fff',
  },
  postContainer: {
    backgroundColor: '#fff',
    marginBottom: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e0e0e0',
  },
  pressedPost: {
    backgroundColor: '#f9f9f9',
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    paddingBottom: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    marginRight: 10,
  },
  userMeta: {
    flex: 1,
    justifyContent: 'center',
  },
  username: {
    fontSize: 14,
    fontWeight: '600',
    color: '#202124',
    fontFamily: 'Montserrat_600SemiBold',
  },
  typeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeTagText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
    fontFamily: 'Montserrat_600SemiBold',
    textTransform: 'capitalize',
  },
  postTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#202124',
    paddingHorizontal: 16,
    paddingBottom: 6,
    fontFamily: 'Raleway_600SemiBold',
  },
  postContent: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
    paddingHorizontal: 16,
    paddingBottom: 12,
    fontFamily: 'Montserrat_400Regular',
  },
  mediaContainer: {
    height: SCREEN_WIDTH,
    marginBottom: 8,
  },
  mediaWrapper: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
    backgroundColor: '#f5f5f5',
  },
  media: {
    width: '100%',
    height: '100%',
  },
  swiperPagination: {
    bottom: 10,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  actionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    paddingVertical: 4,
  },
  actionText: {
    marginLeft: 6,
    fontSize: 13,
    color: '#666',
    fontFamily: 'Montserrat_500Medium',
  },
  shareButton: {
    padding: 4,
  },
  postMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  postDate: {
    fontSize: 12,
    color: '#9aa0a6',
    fontFamily: 'Montserrat_400Regular',
  },
  readMore: {
    fontSize: 12,
    color: '#1E90FF',
    fontFamily: 'Montserrat_500Medium',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  locationText: {
    fontSize: 12,
    color: '#5f6368',
    marginLeft: 4,
    fontFamily: 'Montserrat_400Regular',
  },
  footerLoading: {
    marginVertical: 16,
  },
  likedAnimation: {
    transform: [{ scale: 1.2 }],
  },
});

export default PostScreen;