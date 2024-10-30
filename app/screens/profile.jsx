import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth';
import { supabase } from '../supabaseClient';

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    email: '',
    full_name: '',
    phone_number: '',
    address: '',
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        console.log('No user found');
        return;
      }

      console.log('Current user email:', currentUser.email); // Debug log

      // First, set the email from Firebase auth
      setProfile(prev => ({
        ...prev,
        email: currentUser.email
      }));

      // Then fetch additional profile data from Supabase
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('email', currentUser.email)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
        throw error;
      }

      if (data) {
        console.log('Profile data found:', data); // Debug log
        setProfile({
          email: currentUser.email,
          full_name: data.full_name || '',
          phone_number: data.phone_number || '',
          address: data.address || ''
        });
      } else {
        console.log('No profile data found, creating new profile'); // Debug log
        // If no profile exists, create one
        const { error: insertError } = await supabase
          .from('user_profiles')
          .insert([
            {
              email: currentUser.email,
              full_name: currentUser.displayName || '',
              phone_number: '',
              address: ''
            }
          ]);

        if (insertError) throw insertError;
      }
    } catch (error) {
      console.error('Error fetching profile:', error.message);
      Alert.alert('Error', 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          email: profile.email,
          full_name: profile.full_name,
          phone_number: profile.phone_number,
          address: profile.address,
          updated_at: new Date(),
        });

      if (error) throw error;

      Alert.alert('Success', 'Profile updated successfully');
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error.message);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0066cc" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => editing ? handleSave() : setEditing(true)}
        >
          <Text style={styles.editButtonText}>
            {editing ? 'Save' : 'Edit'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {profile.full_name ? profile.full_name[0].toUpperCase() : '?'}
            </Text>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{profile.email}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Full Name</Text>
            {editing ? (
              <TextInput
                style={[styles.value, styles.input]}
                value={profile.full_name}
                onChangeText={(text) => setProfile({...profile, full_name: text})}
                placeholder="Enter your full name"
              />
            ) : (
              <Text style={styles.value}>{profile.full_name || 'Not set'}</Text>
            )}
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Phone</Text>
            {editing ? (
              <TextInput
                style={[styles.value, styles.input]}
                value={profile.phone_number}
                onChangeText={(text) => setProfile({...profile, phone_number: text})}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
              />
            ) : (
              <Text style={styles.value}>{profile.phone_number || 'Not set'}</Text>
            )}
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Address</Text>
            {editing ? (
              <TextInput
                style={[styles.value, styles.input]}
                value={profile.address}
                onChangeText={(text) => setProfile({...profile, address: text})}
                placeholder="Enter your address"
                multiline
              />
            ) : (
              <Text style={styles.value}>{profile.address || 'Not set'}</Text>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  editButton: {
    backgroundColor: '#0066cc',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  profileSection: {
    backgroundColor: 'white',
    marginTop: 20,
    borderRadius: 10,
    margin: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#0066cc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 40,
    color: 'white',
    fontWeight: 'bold',
  },
  infoContainer: {
    marginTop: 20,
  },
  infoRow: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 4,
  },
}); 