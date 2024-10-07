import { useRouter } from 'expo-router';
import { useNavigation } from 'expo-router'
import React, { Component, useEffect,useState} from 'react'
import { Text, View,TextInput,StyleSheet,TouchableOpacity } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../configs/FirebaseConfig';

export default function SignIn() {
  const navigation=useNavigation();
  const router=useRouter();

  const[email,setEmail]=useState('');
  const[password,setPassword]=useState('');
  
  useEffect(() => {
    navigation.setOptions({
      headerShown:false
    })
  })
    const onSignIn=()=>{  

      if(!email && !password)
        {
          ToastAndroid.show('Please fill all the fields',ToastAndroid.SHORT);
          return;
        }
    
      signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.log(user);
        user && router.replace('/screens/homeScreen');
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage,errorCode);
      }
    
    )
    // .finally(()=>{if user})
    ;} 
    
    return (
      <View style={{
        marginTop:30, 
        padding:10,
      }}>
        <TouchableOpacity onPress={()=>router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={{
          fontSize:30,
          //textAlign:'center',
          fontFamily:'outfit-bold',
          paddingBottom:15,
          paddingLeft:10,
        }}> Let's Sign You In </Text>
        <Text style={{
          fontSize:30,
          //textAlign:'center',
          fontFamily:'outfit-bold',
          paddingLeft:10,
          color:'grey',
        }}> Welcome Back </Text>
        <View style={{
          padding:20,

        }}>
          <Text style={styles.text}>
            Email</Text>
          <TextInput placeholder="Enter your email" 
            style={styles.textbox}
            onChangeText={(value)=>setEmail(value)}/>
          <Text style={styles.text}>Password</Text>
          <TextInput 
            secureTextEntry={true}
            placeholder="Password" 
            style={styles.textbox}
            onChangeText={(value)=>setPassword(value)}
            />
        </View>
        <TouchableOpacity 
          
        style={styles.button}
        onPress={onSignIn}>
          <Text style={{
            color:'#fff',
            textAlign:'center',
            fontSize:20,
          }}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={()=>router.replace('/auth/sign-up')}
          style={styles.button}>
          <Text style={{
            color:'#fff',
            textAlign:'center',
            fontSize:20,
          }}>Create Account</Text>
        </TouchableOpacity>
      </View>
      
    )
  }
  const styles=StyleSheet.create({  
    textbox:{
      padding:10,
      borderWidth:1,
      width:350,
      borderColor:'black',
      borderRadius:5,
      marginBottom:10,
    },
    text:{
      fontSize:15,
      fontFamily:'outfit',
      padding:10,
    },
    button:
    {
      borderRadius:99,
      padding:15,
      backgroundColor:'black',
      width:300,
      marginBottom:20,
      marginTop:30,
      marginLeft:'auto',
      marginRight:'auto',
    }
  })
