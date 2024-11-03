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
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

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

  const handleDeleteBooking = async (booking) => {
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

              // First delete the booking
              const { error } = await supabase.rpc('delete_booking', {
                p_booking_id: booking.booking_id,
                p_user_email: currentUser.email
              });

              if (error) throw error;

              // Then increase the seats after successful deletion
              const { data: seatsData, error: seatsError } = await supabase
                .rpc('seat_ondelete', {
                  p_trainid: booking.train_id,
                  p_origin:booking.origin,
                  p_dest:booking.destination
                }); 

              if (seatsError) throw seatsError;

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

  const renderBooking = ({ item }) => {
    const bookingDate = new Date(item.booking_date).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    return (
      <View style={styles.bookingCard}>
        {/* Booking Status Banner */}
        <View style={[styles.statusBanner, { backgroundColor: item.status !== 'Confirmed' ? '#e8f5e9' : '#fff3e0' }]}>
          <Text style={[styles.statusText, { color: item.status !== 'Confirmed' ? '#2e7d32' : '#f57c00' }]}>
            {item.status}
          </Text>
        </View>

        {/* Booking Details Header */}
        <View style={styles.bookingHeader}>
          <Text style={styles.bookingId}>Booking #{item.booking_id}</Text>
        </View>
        <View style={styles.bookingHeader}>
        <Text style={styles.dateText}>{bookingDate}</Text>
        </View>

        {/* Train ID */}
        <View style={styles.trainIdContainer}>
          <Text style={styles.trainIdLabel}>Train ID:</Text>
          <Text style={styles.trainIdValue}>{item.train_id}</Text>
        </View>

        {/* Journey Details */}
        <View style={styles.journeyContainer}>
          <View style={styles.stationContainer}>
            <View style={styles.stationDot} />
            <View style={styles.stationInfo}>
              <Text style={styles.stationLabel}>From</Text>
              <Text style={styles.stationName}>{item.origin}</Text>
              
            </View>
          </View>
          
         {/* <View style={styles.journeyLine} /> */}
          
          <View style={styles.stationContainer}>
            <View style={[styles.stationDot, styles.destinationDot]} />
            <View style={styles.stationInfo}>
              <Text style={styles.stationLabel}>To</Text>
              <Text style={styles.stationName}>{item.destination}</Text>
            </View>
          </View>
        </View>

        {/* Cancel Button */}
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => handleDeleteBooking(item)}
        >
          <Feather name="x-circle" size={16} color="#ff4444" style={styles.cancelIcon} />
          <Text style={styles.cancelButtonText}>Cancel Ticket</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4a90e2" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>My Bookings</Text>
        <Text style={styles.subtitle}>Manage your train tickets</Text>
      </View>

      <FlatList
        data={bookings}
        renderItem={renderBooking}
        keyExtractor={item => item.booking_id.toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Feather name="calendar" size={40} color="#ccc" />
            <Text style={styles.emptyText}>No bookings found</Text>
            <Text style={styles.emptySubtext}>Your booked tickets will appear here</Text>
          </View>
        }
        refreshing={loading}
        onRefresh={fetchBookings}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f9',
  },
  headerContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
  },
  bookingCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
  },
  statusBanner: {
    padding: 6,
    alignItems: 'center',
    borderRadius: 4,
    marginBottom: 10,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  bookingId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  dateText: {
    fontSize: 12,
    color: '#777',
  },
  trainIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e7f3fe',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  trainIdLabel: {
    fontSize: 12,
    color: '#4a90e2',
    marginRight: 4,
  },
  trainIdValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  journeyContainer: {
    paddingVertical: 8,
  },
  stationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  stationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4a90e2',
    marginRight: 10,
  },
  destinationDot: {
    backgroundColor: '#2e7d32',
  },
  journeyLine: {
    width: 2,
    height: 16,
    backgroundColor: '#dcdcdc',
    marginLeft: 15,
  },
  stationInfo: {
    flex: 1,
  },
  stationLabel: {
    fontSize: 12,
    color: '#777',
  },
  stationName: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#ffebeb',
    borderRadius: 4,
    marginTop: 10,
  },
  cancelIcon: {
    marginRight: 6,
  },
  cancelButtonText: {
    color: '#ff4444',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 13,
    color: '#999',
  },
});
