import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  ActivityIndicator,
  TouchableOpacity,
  Alert
} from 'react-native';
import { supabase } from '../supabaseClient';
import { getAuth } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      // Get current user
      const auth = getAuth();
      const currentUser = auth.currentUser;


      const { data, error } = await supabase.rpc('get_user_bookings', {
        p_user_email: currentUser.email
      });

       console.log("user.email",currentUser.email);
      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error:', error.message);
      alert('Error fetching bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking?',
      [
        {
          text: 'No',
          style: 'cancel'
        },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              const auth = getAuth();
              const currentUser = auth.currentUser;

              const { error } = await supabase.rpc('delete_booking', {
                p_booking_id: bookingId,
                p_user_email: currentUser.email
              });

              if (error) throw error;

              // Refresh the bookings list
              fetchBookings();
              Alert.alert('Success', 'Booking cancelled successfully');
              
            } catch (error) {
              console.error('Delete error:', error);
              Alert.alert('Error', 'Failed to cancel booking');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const renderBooking = ({ item }) => (
    <View style={styles.bookingCard}>
      <View style={styles.bookingHeader}>
        <Text style={styles.bookingId}>Booking ID: {item.booking_id}</Text>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteBooking(item.booking_id)}
        >
          <Ionicons name="trash-outline" size={24} color="#ff4444" />
        </TouchableOpacity>
      </View>

      <View style={styles.routeContainer}>
        <View style={styles.routeInfo}>
          <Text style={styles.label}>From</Text>
          <Text style={styles.value}>{item.origin}</Text>
        </View>
        <View style={styles.routeInfo}>
          <Text style={styles.label}>To</Text>
          <Text style={styles.value}>{item.destination}</Text>
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailItem}>
          <Text style={styles.label}>Train ID</Text>
          <Text style={styles.value}>{item.train_id}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.label}>Date</Text>
          <Text style={styles.value}>
            {new Date(item.booking_date).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0066cc" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Bookings</Text>
      <FlatList
        data={bookings}
        renderItem={renderBooking}
        keyExtractor={item => item.booking_id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No bookings found</Text>
        }
        refreshing={loading}
        onRefresh={fetchBookings}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 40,
  },
  listContainer: {
    paddingBottom: 20,
  },
  bookingCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  bookingId: {
    fontSize: 14,
    color: '#666',
  },
  status: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  routeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  routeInfo: {
    flex: 1,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginTop: 20,
  },
  deleteButton: {
    marginLeft: 10,
  },
}); 