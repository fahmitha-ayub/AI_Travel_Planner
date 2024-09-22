import React, { Component, useEffect,useState } from 'react'
import { Text, View,TextInput,StyleSheet,TouchableOpacity, ToastAndroid } from 'react-native'
import { useNavigation,useRouter } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons';
import{auth} from '../../../configs/FirebaseConfig';
import { getAuth,createUserWithEmailAndPassword } from 'firebase/auth';

export default function SignUP() {
  const navigation=useNavigation();
  const router=useRouter();

  const[email,setEmail]=useState('');
  const[password,setPassword]=useState(''); 
  const[fullName,setFullname]=useState('');

  useEffect(() => {
    navigation.setOptions({
      headerShown:false
    })
  })
  const onCreateAccount=()=>{

    if(!email && !password &&!fullName)
    {
      ToastAndroid.show('Please fill all the fields',ToastAndroid.BOTTOM);
      return;
    }

  createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed up 
    const user = userCredential.user;
    console.log(user);
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorMessage,errorCode);
    // ..
  });
}
    return (
      <View style={{
        marginTop:30, 
        padding:20,
      }}>
        <TouchableOpacity onPress={()=>router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={{
          fontSize:30,
          fontFamily:'outfit-bold',
          marginTop:20,
          paddingBottom:10,
        }}> Create New Account </Text>
        <View>
        <Text style={styles.text}> Full Name </Text>
        <TextInput 
          style={styles.textbox}
          placeholder="Enter your full name"
          onChange={(value)=>setFullname(value)} />  
        <Text style={styles.text}>Email</Text>
        <TextInput 
          style={styles.textbox}
          placeholder="Enter your email"
          onChange={(value)=>setEmail(value)} />  
        <Text style={styles.text}>Password</Text>
        <TextInput 
          style={styles.textbox}
           secureTextEntry={true} 
           onChange={(value)=>setPassword(value)}/>
        </View>
        <TouchableOpacity style={styles.button}
        onPress={onCreateAccount}
        >
          <Text style={{
            color:'#fff',
            textAlign:'center',
            fontSize:20,
          }}>Create Account</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}
          onPress={()=>router.replace('auth/sign-in')}
        >
          <Text style={{
            color:'#fff',
            textAlign:'center',
            fontSize:20,
          }}>Sign In</Text>
        </TouchableOpacity>
      </View>
    )
}
const styles=StyleSheet.create({
  textbox:
  {
    borderWidth:1,
    borderColor:'black',
    padding:10,
    margin:10,
    width:300,
    borderRadius:10,
    padding:10,
  },
  text:
  {
    fontSize:15,
    fontFamily:'outfit',
    padding:5,
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
