import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Feather } from '@expo/vector-icons';

export default function Stations() {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stationCode, setStationCode] = useState('');

  useEffect(() => {
    getAllStations();
  }, []);

  const getAllStations = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('get_all_stations');
      if (error) throw error;
      setStations(data);
    } catch (error) {
      console.error("Error fetching stations:", error.message);
      alert('Failed to fetch stations');
    } finally {
      setLoading(false);
    }
  };

  const searchStation = async () => {
    if (!stationCode.trim()) {
      getAllStations();
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('get_station', {
        p_station_code: stationCode.toUpperCase()
      });
      
      if (error) {
        console.error("Search error:", error);
        throw error;
      }
      
      if (data) {
        console.log("Search results:", data);
        setStations(Array.isArray(data) ? data : [data]);
      } else {
        setStations([]);
      }
    } catch (error) {
      console.error("Error searching station:", error.message);
      Alert.alert('Error', 'Failed to search station');
    } finally {
      setLoading(false);
    }
  };

  const renderStationItem = ({ item }) => (
    <View style={styles.stationCard}>
      <View style={styles.stationHeader}>
        <Text style={styles.stationCode}>{item.station_code}</Text>
        <Text style={styles.stationId}>ID: {item.station_id}</Text>
      </View>
      <View style={styles.stationDetails}>
        <Text style={styles.stationName}>{item.station_name}</Text>
        <Text style={styles.stateText}>{item.state}</Text>
        <Text style={styles.stateText}>{item.zone}</Text>
        <Text style={styles.stationName}>{item.platform}</Text>
        <Text style={styles.stateText}>{item.facilities}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Find Your Station</Text>
      
      <View style={styles.searchContainer}>
        <View style={styles.inputContainer}>
          <Feather name="search" size={20} color="#555" style={styles.inputIcon} />
          <TextInput
            placeholder="Enter Station Code"
            style={styles.input}
            
            onChangeText={setStationCode}
            value={stationCode}
            autoCapitalize="characters"
            maxLength={5}
          />
        </View>
        <TouchableOpacity 
          style={styles.searchButton} 
          onPress={searchStation}
        >
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={stations}
        renderItem={renderStationItem}
        keyExtractor={item => item.station_id.toString()}
        ListEmptyComponent={
          <Text style={styles.noStations}>No stations found</Text>
        }
        refreshing={loading}
        onRefresh={getAllStations}
      />
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
  stationCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
  },
  stationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  stationCode: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  stationId: {
    fontSize: 14,
    color: '#666',
  },
  stationDetails: {
    marginTop: 5,
  },
  stateText: {
    fontSize: 14,
    color: '#666',
  },
  noStations: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  }
});