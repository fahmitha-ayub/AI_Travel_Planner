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
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Square from '../../components/button';
import { supabase } from '../supabaseClient';
import { getAuth, signOut } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import all your image assets here
import trainImage from '../../assets/images/train.jpg';
import busImage from '../../assets/images/bus.jpg';
// import taxiImage from '../../assets/images/pales.jpg';
// import uberImage from '../../assets/images/forest.jpg';
// import metroImage from '../../assets/images/train_land.jpg';

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.7;

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
    //setMenuVisible(false);
  };

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      
      // Clear any local storage/state if needed
      // await AsyncStorage.clear();  // If you're using AsyncStorage

      // Navigate to login screen
      router.replace('/');
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Hamburger Menu Icon */}
      <TouchableOpacity onPress={toggleDrawer} style={styles.menuIcon}>
        <Ionicons name="menu" size={32} color="#333" />
      </TouchableOpacity>

      {/* Overlay */}
      {isDrawerOpen && (
        <TouchableWithoutFeedback onPress={toggleDrawer}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}

      {/* Side Drawer */}
      <Animated.View 
        style={[
          styles.drawer,
          {
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        <View style={styles.drawerHeader}>
          <Text style={styles.drawerTitle}>Menu</Text>
          <TouchableOpacity onPress={toggleDrawer}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.drawerItem} 
          onPress={() => navigateTo('/screens/profile')}
        >
          <Ionicons name="person-outline" size={24} color="#333" />
          <Text style={styles.drawerItemText}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.drawerItem} 
          onPress={() => navigateTo('/screens/train')}
        >
          <Ionicons name="train-outline" size={24} color="#333" />
          <Text style={styles.drawerItemText}>Train</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.drawerItem} 
          onPress={() => navigateTo('/screens/station')}
        >
          <Ionicons name="business-outline" size={24} color="#333" />
          <Text style={styles.drawerItemText}>Station</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.drawerItem} 
          onPress={() => navigateTo('/screens/mybooking')}
        >
          <Ionicons name="book-outline" size={24} color="#333" />
          <Text style={styles.drawerItemText}>My Bookings</Text>
        </TouchableOpacity>

        {/* Spacer to push logout to bottom */}
        <View style={styles.drawerSpacer} />

        <TouchableOpacity 
          style={[styles.drawerItem, styles.logoutItem]} 
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={24} color="#ff4444" />
          <Text style={[styles.drawerItemText, styles.logoutText]}>Logout</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Main Content */}
      <Text style={styles.title}>Choose your mode of travel</Text>
      
      <ScrollView contentContainerStyle={styles.optionsContainer}>
      <Square imageUrl={trainImage} label="Train" destination="train" />
      <Square imageUrl={busImage} label="Bus" destination="bus" />
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  menuIcon: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 2,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: DRAWER_WIDTH,
    backgroundColor: 'white',
    zIndex: 3,
    paddingTop: 40,
    elevation: 5,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  drawerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  drawerItemText: {
    fontSize: 16,
    marginLeft: 15,
    color: '#333',
  },
  logoutItem: {
    marginTop: 'auto',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    borderBottomWidth: 0, // Remove bottom border for last item
  },
  logoutText: {
    color: '#ff4444',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 60,
    marginBottom: 20,
    textAlign: 'center',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  drawerSpacer: {
    flex: 1, // This pushes the logout button to the bottom
  },
});