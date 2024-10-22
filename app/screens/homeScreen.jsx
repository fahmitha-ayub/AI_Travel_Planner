import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Square from '../../components/button';

// Import all your image assets here
import trainImage from '../../assets/images/train.jpg';
import busImage from '../../assets/images/bus.jpg';
// import taxiImage from '../../assets/images/pales.jpg';
// import uberImage from '../../assets/images/forest.jpg';
// import metroImage from '../../assets/images/train_land.jpg';

export default function HomeScreen() {
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const navigateTo = (destination) => {
    router.push(destination);
    setMenuVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleMenu} style={styles.menuIcon}>
        <Ionicons name="menu" size={32} color="#333" />
      </TouchableOpacity>

      {menuVisible && (
        <View style={styles.menu}>
          <TouchableOpacity onPress={() => navigateTo('/profile')}>
            <Text style={styles.menuItem}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigateTo('/train')}>
            <Text style={styles.menuItem}>Train</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigateTo('/station')}>
            <Text style={styles.menuItem}>Station</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigateTo('/logout')}>
            <Text style={styles.menuItem}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.title}>Choose your mode of travel</Text>
      
      <ScrollView contentContainerStyle={styles.optionsContainer}>
        <Square imageUrl={trainImage} label="Train" destination="train" />
        <Square imageUrl={busImage} label="Bus" destination="bus" />
        <Square imageUrl={busImage} label="Taxi" destination="taxi" />
        <Square imageUrl={busImage} label="Uber" destination="uber" />
        <Square imageUrl={busImage} label="Metro" destination="metro" />
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
  menu: {
    position: 'absolute',
    top: 80,
    left: 20,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 2,
  },
  menuItem: {
    fontSize: 18,
    paddingVertical: 10,
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
});