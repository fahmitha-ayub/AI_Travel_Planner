import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
 import React from 'react'
 import { useState } from 'react'
 import { useEffect } from 'react'
 //import { useRouter } from 'expo-router';
 import { supabase } from '../supabaseClient';
 import { Feather } from '@expo/vector-icons';
 
 export default function stations() {
    const [stations, setStations] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const[stationId, setStationId]=useState('')
    
    useEffect(() => {
      getallStations();
    }, []);
  
    const getallStations = async () => {
      const { data, error } = await supabase.rpc('get_all_stations');
    if (error) {
      console.log("Error fetching stations:", error.message);
    } else {
      console.log("stations fetched successfully:", data);
      setStations(data);
    }
  };

    const fetchStations = async () => {
        setLoading(true)
        const{data,error}=await supabase.rpc('get_station',{stationCode: stationId});
        if (error) {
            console.error('Error fetching trains:', error.message);
            alert('Failed to fetch stations. Please try again.');
          } else {
            setStations(data);
          }
          setLoading(false);
        }
        const renderStationItem = ({ item }) => (
          <TouchableOpacity style={styles.trainCard} onPress={() => router.push('./booking')}>
            <View style={styles.trainHeader}>
              <Text style={styles.trainId}>{item.station_id}</Text>
              <Text style={styles.trainDuration}>{item.staion_code} </Text>
            </View>
            <View style={styles.trainRoute}>
              
              <Feather name="arrow-right" size={20} color="#555" style={styles.arrow} />
              <Text style={styles.stationName}>{item.station_name}</Text>
            </View>
            <View style={styles.trainFooter}>
              <Text style={styles.trainDistance}>{item.state} </Text>
            </View>
          </TouchableOpacity>
        );
        return (
          <View style={styles.container}>
            <Text style={styles.title}>Find Your Station</Text>
            <View style={styles.searchContainer}>
              <View style={styles.inputContainer}>
                <Feather name="map-pin" size={20} color="#555" style={styles.inputIcon} />
                <TextInput
                  placeholder="Enter your station Code"
                  style={styles.input}
                  onChangeText={setStationId}
                  value={stationId}
                />
              </View>

              <TouchableOpacity style={styles.searchButton} onPress={fetchStations}>
                <Text style={styles.searchButtonText}>Find Stations</Text>
              </TouchableOpacity>
            </View>
            
            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
            ) : (
              <FlatList
                data={stations}
                renderItem={renderStationItem}
                keyExtractor={(item) => item.train_id.toString()}
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
      });