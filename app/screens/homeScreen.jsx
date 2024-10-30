import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  Alert,
  ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Square from '../../components/button';
import { getAuth, signOut } from 'firebase/auth';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.75;

export default function HomeScreen() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const router = useRouter();

  const toggleDrawer = () => {
    const toValue = isDrawerOpen ? -DRAWER_WIDTH : 0;
    Animated.timing(slideAnim, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setIsDrawerOpen(!isDrawerOpen);
  };

  const navigateTo = (destination) => {
    toggleDrawer();
    router.push(destination);
  };

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      router.replace('/');
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

  const TravelOption = ({ icon, title, subtitle, onPress }) => (
    <TouchableOpacity 
      style={styles.travelCard}
      onPress={onPress}
    >
      <LinearGradient
        colors={['#2a2a2a', '#3a3a3a']}
        style={styles.cardGradient}
      >
        <Ionicons name={icon} size={32} color="#4a90e2" />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardSubtitle}>{subtitle}</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#4a90e2" />
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleDrawer} style={styles.menuIcon}>
        <Ionicons name="menu" size={32} color="#fff" />
      </TouchableOpacity>

      <View style={styles.headerSection}>
        <Text style={styles.welcomeText}>Welcome Back</Text>
        <Text style={styles.title}>Enjoy Your Journey</Text>
      </View>

      {isDrawerOpen && (
        <TouchableWithoutFeedback onPress={toggleDrawer}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}

      <Animated.View 
        style={[
          styles.drawer,
          {
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        <LinearGradient
          colors={['#2a2a2a', '#1e1e1e']}
          style={styles.drawerGradient}
        >
          <View style={styles.drawerHeader}>
            <Text style={styles.drawerTitle}>Menu</Text>
            <TouchableOpacity onPress={toggleDrawer}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.drawerItem} 
            onPress={() => navigateTo('/screens/profile')}
          >
            <Ionicons name="person-outline" size={24} color="#4a90e2" />
            <Text style={styles.drawerItemText}>Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.drawerItem} 
            onPress={() => navigateTo('/screens/train')}
          >
            <Ionicons name="train-outline" size={24} color="#4a90e2" />
            <Text style={styles.drawerItemText}>Train</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.drawerItem} 
            onPress={() => navigateTo('/screens/station')}
          >
            <Ionicons name="business-outline" size={24} color="#4a90e2" />
            <Text style={styles.drawerItemText}>Station</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.drawerItem} 
            onPress={() => navigateTo('/screens/mybooking')}
          >
            <Ionicons name="book-outline" size={24} color="#4a90e2" />
            <Text style={styles.drawerItemText}>My Bookings</Text>
          </TouchableOpacity>

          <View style={styles.drawerSpacer} />

          <TouchableOpacity 
            style={[styles.drawerItem, styles.logoutItem]} 
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={24} color="#ff4444" />
            <Text style={[styles.drawerItemText, styles.logoutText]}>Logout</Text>
          </TouchableOpacity>
        </LinearGradient>
      </Animated.View>

      <ScrollView 
        style={styles.mainContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.optionsContainer}>
          <TravelOption 
            icon="train-outline"
            title="Train"
            subtitle="Book train tickets"
            onPress={() => router.push('/screens/train')}
          />
          <TravelOption 
            icon="bus-outline"
            title="Bus"
            subtitle="Book bus tickets"
            onPress={() => router.push('/screens/bus')}
          />
          <TravelOption 
            icon="business-outline"
            title="Stations"
            subtitle="View nearby stations"
            onPress={() => router.push('/screens/station')}
          />
          <TravelOption 
            icon="book-outline"
            title="My Bookings"
            subtitle="View your tickets"
            onPress={() => router.push('/screens/mybooking')}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
  },
  headerSection: {
    paddingTop: 60,
    paddingHorizontal: 30,
    paddingBottom: 20,
  },
  welcomeText: {
    fontSize: 20,
    color: '#4a90e2',
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  menuIcon: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
    backgroundColor: '#2a2a2a',
    padding: 10,
    borderRadius: 12,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    zIndex: 2,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: DRAWER_WIDTH,
    zIndex: 3,
    overflow: 'hidden',
  },
  drawerGradient: {
    flex: 1,
    paddingTop: 40,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  drawerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  drawerItemText: {
    fontSize: 16,
    marginLeft: 15,
    color: '#fff',
  },
  logoutItem: {
    borderTopWidth: 1,
    borderTopColor: '#333',
    borderBottomWidth: 0,
  },
  logoutText: {
    color: '#ff4444',
  },
  drawerSpacer: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  optionsContainer: {
    paddingTop: 20,
    paddingBottom: 40,
  },
  travelCard: {
    marginBottom: 15,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  cardContent: {
    flex: 1,
    marginLeft: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#aaa',
  },
});