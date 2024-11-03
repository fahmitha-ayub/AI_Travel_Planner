import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../supabaseClient';
import { Feather } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function Train() {
  const router = useRouter();
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState([]);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  useEffect(() => {
    getalltrains();
    fetchLocations();
  }, []);

  const trainDetails = (item) => {
    router.push({
      pathname: '/screens/booking',
      params: { traindetails: JSON.stringify(item) }
    });
  };
  const bookNow = (item) => {
    router.push({
      pathname: '/screens/booking',
      params: { traindetails: JSON.stringify(item) }
    });
  };
  const getalltrains = async () => {
    const { data, error } = await supabase.rpc('get_all_trains');
    if (error) {
      console.log("Error fetching trains:", error.message);
    } else {
      console.log("Trains fetched successfully:", data);
      setTrains(data);
    }
  };

  const fetchTrains = async () => {
    setLoading(true);
    const { data, error } = await supabase.rpc('get_trains', { start_loc: start, dest_loc: end });

    if (error) {
      console.error('Error fetching trains:', error.message);
      alert('Failed to fetch trains. Please try again.');
    } else {
      setTrains(data);
    }
    setLoading(false);
  };

  const fetchLocations = async () => {
    try {
      const { data, error } = await supabase.rpc('get_available_locations');
      if (error) throw error;
      
      setLocations(data || []);
    } catch (error) {
      console.error('Error fetching locations:', error.message);
    }
  };

  const renderTrainItem = ({ item }) => (
    <TouchableOpacity style={styles.trainCard} onPress={() => trainDetails(item)}>
      <LinearGradient
        colors={['#ffffff', '#f8f9fa']}
        style={styles.gradientCard}
      >
        <View style={styles.trainHeader}>
          <View style={styles.trainIdContainer}>
            <Text style={styles.trainIdLabel}>Train</Text>
            <Text style={styles.trainId}>{item.train_id}</Text>
          </View>
          <View style={styles.seatsContainer}>
            <Text style={styles.seatsLabel}>Available Seats</Text>
            <Text style={styles.seatsNumber}>{item.no_seats}</Text>
          </View>
          <View style={styles.durationContainer}>
            <Feather name="clock" size={16} color="#666" />
            <Text style={styles.trainDuration}>{item.route_duration} hrs</Text>
          </View>
        </View>

        <View style={styles.routeContainer}>
          <View style={styles.stationContainer}>
            <Feather name="circle" size={12} color="#4a90e2" />
            <Text style={styles.stationName}>{item.origin}</Text>
          </View>
          <View style={styles.routeLine}>
            <View style={styles.dottedLine} />
            <Feather name="chevron-right" size={20} color="#4a90e2" />
          </View>
          <View style={styles.stationContainer}>
            <Feather name="flag" size={12} color="#4caf50" />
            <Text style={styles.stationName}>{item.destination}</Text>
          </View>
        </View>

        <View style={styles.trainFooter}>
          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <Feather name="map" size={16} color="#666" />
              <Text style={styles.infoText}>{item.distance} km</Text>
            </View>
            <View style={styles.fareContainer}>
              <Text style={styles.fareLabel}>Fare</Text>
              <Text style={styles.fareAmount}>₹{item.fare}</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.bookButton}
            onPress={() => bookNow(item)}
          >
            <LinearGradient
              colors={['#4caf50', '#45a049']}
              style={styles.gradientButton}
            >
              <Text style={styles.bookButtonText}>Book Now</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4a90e2', '#357abd']}
        style={styles.headerGradient}
      >
        <Text style={styles.title}>Find Your Perfect Journey</Text>
      </LinearGradient>

      <View style={styles.searchContainer}>
        <View style={styles.inputContainer}>
          <View style={styles.iconContainer}>
            <Feather name="map-pin" size={20} color="#4a90e2" />
          </View>
          <TouchableOpacity 
            style={styles.pickerTouchable}
            onPress={() => setShowStartPicker(!showStartPicker)}
          >
            <Text style={styles.pickerText}>
              {start || "Select Start Location"}
            </Text>
          </TouchableOpacity>
        </View>

        {showStartPicker && (
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={start}
              onValueChange={(itemValue) => {
                setStart(itemValue);
                setShowStartPicker(false);
              }}
              style={styles.picker}
            >
              <Picker.Item label="Select Start Location" value="" />
              {locations.map((location, index) => (
                <Picker.Item 
                  key={`${location.origin}-${index}`}
                  label={location.origin} 
                  value={location.origin} 
                />
              ))}
            </Picker>
          </View>
        )}

        <View style={styles.inputContainer}>
          <View style={styles.iconContainer}>
            <Feather name="flag" size={20} color="#4caf50" />
          </View>
          <TouchableOpacity 
            style={styles.pickerTouchable}
            onPress={() => setShowEndPicker(!showEndPicker)}
          >
            <Text style={styles.pickerText}>
              {end || "Select Destination"}
            </Text>
          </TouchableOpacity>
        </View>

        {showEndPicker && (
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={end}
              onValueChange={(itemValue) => {
                setEnd(itemValue);
                setShowEndPicker(false);
              }}
              style={styles.picker}
            >
              <Picker.Item label="Select Destination" value="" />
              {locations.map((location) => (
                <Picker.Item 
                  key={location.destination} 
                  label={location.destination} 
                  value={location.destination} 
                />
              ))}
            </Picker>
          </View>
        )}

        <TouchableOpacity 
          style={styles.searchButton} 
          onPress={fetchTrains}
        >
          <LinearGradient
            colors={['#4a90e2', '#357abd']}
            style={styles.gradientButton}
          >
            <Feather name="search" size={20} color="#fff" style={styles.searchIcon} />
            <Text style={styles.searchButtonText}>Find Trains</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
      
      {loading ? (
        <ActivityIndicator size="large" color="#4a90e2" style={styles.loader} />
      ) : (
        <FlatList
          data={trains}
          renderItem={renderTrainItem}
          keyExtractor={(item) => `${item.train_id}-${item.origin}`}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Feather name="info" size={40} color="#666" />
              <Text style={styles.noTrains}>No trains found for this route.</Text>
            </View>
          }
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  headerGradient: {
    padding: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  searchContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    margin: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
  },
  iconContainer: {
    padding: 12,
    //backgroundColor: '#fff',
    borderRadius: 10,
    margin: 4,
  },
  pickerTouchable: {
    flex: 1,
    padding: 12,
  },
  pickerText: {
    fontSize: 16,
    color: '#495057',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e9ecef',
    overflow: 'hidden',
  },
  searchButton: {
    marginTop: 5,
    overflow: 'hidden',
    borderRadius: 10,
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  trainCard: {
    margin: 15,
    marginBottom: 8,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  gradientCard: {
    padding: 15,
  },
  trainHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  trainIdContainer: {
    alignItems: 'flex-start',
  },
  trainIdLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  trainId: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
  },
  seatsContainer: {
    alignItems: 'center',
    //backgroundColor: '#e8f5e9',
    padding: 8,
    borderRadius: 8,
  },
  seatsLabel: {
    fontSize: 12,
    color: '#2e7d32',
    marginBottom: 2,
  },
  seatsNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 8,
    borderRadius: 8,
  },
  trainDuration: {
    marginLeft: 4,
    fontSize: 14,
    color: '#495057',
  },
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 8,
  },
  stationContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeLine: {
    flex: 0.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dottedLine: {
    flex: 1,
    height: 1,
    borderStyle: 'dotted',
    borderWidth: 1,
    borderColor: '#dee2e6',
    marginHorizontal: 4,
  },
  stationName: {
    marginLeft: 8,
    fontSize: 14,
    color: '#495057',
  },
  trainFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  infoText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
  },
  fareContainer: {
    //backgroundColor: '#ffffff',
    padding: 8,
    borderRadius: 8,
  },
  fareLabel: {
    fontSize: 12,
    color: '#f57c00',
    marginBottom: 2,
  },
  fareAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f57c00',
  },
  bookButton: {
    overflow: 'hidden',
    borderRadius: 8,
    marginLeft: 15,
  },
  bookButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  noTrains: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  loader: {
    marginTop: 30,
  },
  listContainer: {
    paddingBottom: 20,
  },
});