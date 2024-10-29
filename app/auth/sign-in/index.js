import React, { useState, useEffect } from 'react';
import { Text, View, TextInput, StyleSheet, TouchableOpacity, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../configs/FirebaseConfig';
import { useAuth } from '../../context/AuthContext';

const { width } = Dimensions.get('window');

export default function SignIn() {
  const navigation = useNavigation();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { updateUser } = useAuth();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);

  const onSignIn = () => {
    if (!email || !password) {
      // Show error message
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        updateUser({
          id: user.uid,
          email: user.email,
          displayName: user.displayName,
        });
        router.replace('/screens/homeScreen');
      })
      .catch((error) => {
        console.log(error.message, error.code);
      });
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>
      
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            onChangeText={setEmail}
            value={email}
            placeholder="Email"
            placeholderTextColor="#aaa"
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            onChangeText={setPassword}
            value={password}
            secureTextEntry
            placeholder="Password"
            placeholderTextColor="#aaa"
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={onSignIn}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.createAccountButton}
          onPress={() => router.replace('/auth/sign-up')}
        >
          <Text style={styles.createAccountText}>
            Don't have an account? <Text style={styles.createAccountTextBold}>Create one</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#aaa',
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#2a2a2a',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#fff',
  },
  button: {
    backgroundColor: '#4a90e2',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  createAccountButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  createAccountText: {
    color: '#aaa',
    fontSize: 16,
  },
  createAccountTextBold: {
    fontWeight: 'bold',
    color: '#4a90e2',
  },
});