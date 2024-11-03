import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
export default function Booking() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user } = useAuth();
  const trainDetails = params.traindetails ? JSON.parse(params.traindetails) : null;
  const [loading, setLoading] = useState(false);
  
  const updateSeatCount = async () => {
    setLoading(true);
    try {
      console.log('Route ID being sent:', trainDetails.route_id);
      

      const { data, error } = await supabase.rpc('no_of_seats', { 
        routeid: trainDetails.route_id
      });

      console.log('Response from no_of_seats:', { data, error });

      if (error) {
        console.error('Error details:', error);
        throw error;
      }

      if (data === false) {
        Alert.alert('Error', 'No seats available for this route');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Caught error:', error);
      Alert.alert('Error', 'Failed to update seat availability: ' + error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!user || !trainDetails) {
      Alert.alert('Error', 'Please login to book tickets');
      return;
    }

    try {
      // First update the seat count
      const seatUpdated = await updateSeatCount();
      if (!seatUpdated) return;

      // Then proceed with booking
      const bookingDate = new Date().toISOString().split('T')[0];
      const bookingId = uuidv4();
      const { error } = await supabase.rpc('create_booking', {
        p_user_email: user.email,
        p_booking_id: bookingId,
        p_train_id: trainDetails.train_id,
        p_route_id: trainDetails.route_id,
        p_destination: trainDetails.destination,
        p_booking_date: bookingDate,
        p_status: 'confirmed',
        p_origin: trainDetails.origin

      });

      if (error) throw error;

      Alert.alert(
        'Success',
        'Booking confirmed successfully!',
        [
          {
            text: 'OK',
            onPress: () => router.push('/screens/homeScreen')
          }
        ]
      );

    } catch (error) {
      Alert.alert('Error', error.message);
      console.log(error.message);
    }
  };

  if (!trainDetails) {
    return (
      <View style={styles.container}>
        <Text>No train details available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Booking Details</Text>
      
      <View style={styles.userInfo}>
        <Text style={styles.label}>Booking for:</Text>
        <Text style={styles.value}>{user?.email}</Text>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.row}>
          <Text style={styles.label}>Train ID:</Text>
          <Text style={styles.value}>{trainDetails.train_id}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>From:</Text>
          <Text style={styles.value}>{trainDetails.origin}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>To:</Text>
          <Text style={styles.value}>{trainDetails.destination}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Duration:</Text>
          <Text style={styles.value}>{trainDetails.route_duration} hrs</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Distance:</Text>
          <Text style={styles.value}>{trainDetails.distance} km</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Arrival:</Text>
          <Text style={styles.value}>{trainDetails.arrival_time} </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Departure:</Text>
          <Text style={styles.value}>{trainDetails.departure_time} </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Amount:</Text>
          <Text style={styles.value}>{trainDetails.fare} rs</Text>
        </View>


        <TouchableOpacity 
          style={styles.confirmButton}
          onPress={handleBooking}
        >
          <Text style={styles.confirmButtonText}>Confirm Booking</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  detailsContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  userInfo: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  confirmButton: {
    backgroundColor: '#4caf50',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  }
});