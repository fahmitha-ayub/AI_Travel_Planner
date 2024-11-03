import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../supabaseClient';
import { Feather } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

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
      <View style={styles.trainHeader}>
        <Text style={styles.trainId}>{item.train_id}</Text>
        <Text style={styles.trainId}>{item.no_seats}</Text>

        <Text style={styles.trainDuration}>{item.route_duration} hrs</Text>
      </View>
      <View style={styles.trainRoute}>
        <Text style={styles.stationName}>{item.origin}</Text>
        <Feather name="arrow-right" size={20} color="#555" style={styles.arrow} />
        <Text style={styles.stationName}>{item.destination}</Text>
      </View>
      <View style={styles.trainFooter}>
        <Text style={styles.trainDistance}>{item.distance} km</Text>
        <Text style={styles.trainDistance}>{item.fare} rs</Text>
        <TouchableOpacity style={styles.bookButton}>
          <Text style={styles.bookButtonText} onPress={() => bookNow(item)} >Book Now</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Your Train</Text>
      <View style={styles.searchContainer}>
        <View style={styles.inputContainer}>
          <Feather name="map-pin" size={20} color="#555" style={styles.inputIcon} />
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
    key={`${location.origin}-${index}`} // Combine origin with index for uniqueness
    label={location.origin} 
    value={location.origin} 
  />
))}
            </Picker>
          </View>
        )}

        <View style={styles.inputContainer}>
          <Feather name="flag" size={20} color="#555" style={styles.inputIcon} />
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

        <TouchableOpacity style={styles.searchButton} onPress={fetchTrains}>
          <Text style={styles.searchButtonText}>Find Trains</Text>
        </TouchableOpacity>
      </View>
      
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      ) : (
        <FlatList
        data={trains}
        renderItem={renderTrainItem}
        keyExtractor={(item) => `${item.train_id}-${item.origin}`} // Combine train_id with origin for uniqueness
        ListEmptyComponent={<Text style={styles.noTrains}>No trains found.</Text>}
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
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  searchContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 3,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
  },
  inputIcon: {
    padding: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: '#4a90e2',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loader: {
    marginTop: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  trainCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  trainHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  trainId: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  trainDuration: {
    fontSize: 16,
    color: '#666',
  },
  trainRoute: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  stationName: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  arrow: {
    marginHorizontal: 10,
  },
  trainFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trainDistance: {
    fontSize: 14,
    color: '#666',
  },
  bookButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  bookButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  noTrains: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
  pickerTouchable: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  pickerText: {
    fontSize: 16,
    color: '#333',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
});