import { View, Text, StyleSheet,Image} from 'react-native'
import Colors from './../constants/Colors'
import React from 'react'

export default function Login() {
  return (
    <View>
      <Image source={require('../assets/images/login.jpeg')} 
            style={{
                width:'100%',
                height:500
            }}
        />
        <View style={styles.container}>
            <Text style={{
                textAlign:'center',
                padding:20,
                fontSize:28,
                fontFamily:'outfit-bold'
                }}>AI Travel Planner</Text>
              <Text style={{
                textAlign:'center',
                textAlign:'justify',
                padding:15,
                fontSize:20,
                fontFamily:'outfit'
                }}>Welcome to your personal Travel Planner! This app helps you seamlessly organize your trips by providing easy access to schedules, routes, and essential details for your journeys.
                Let’s get started and make travel stress-free!</Text>
              <View style={styles.button}>
                <Text style={{color:'#fff',
                  textAlign:'center',
                  fontSize:20,
                  fontFamily:'outfit'
                }}>
                Sign In With Google</Text>
              </View>
        
        </View>
    </View>
  )
}
const styles = StyleSheet.create({
  container:{
    //backgroundColor:Colors.WHITE,
    backgroundColor:'#fff',
    marginTop:-20,
    borderTopRightRadius:30,
    borderTopLeftRadius:30,
    height:500,
  },
  button:{
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
