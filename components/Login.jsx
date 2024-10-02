import { View, Text, StyleSheet,Image,TouchableOpacity, ImageBackground} from 'react-native'
import Colors from '@/constants/Colors'
import React from 'react'
import { useRouter } from 'expo-router'


export default function Login() {
  const router=useRouter();
  return (
    <View>
      <ImageBackground 
      source={require('../assets/images/forest2.jpg')}
      style={{
        width:'100%',
        height:'100%'
    }} >
      <Text style={styles.title}>Ai Travel Planner</Text>
      <Text style={styles.text}>Wander with ease,</Text>
      <Text style={styles.text}>Discover serenity</Text>
      <Text style={styles.text}>Journey in harmony</Text>
      <TouchableOpacity style={styles.button}
                onPress={()=>router.push('/auth/sign-in')}>
                <Text style={{color:'#fff',
                  textAlign:'center',
                  fontSize:20,
                  fontFamily:'outfit'
                }}>
                Let's Get Started</Text>
              </TouchableOpacity>
    </ImageBackground>
            
        
      
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
    backgroundColor:'green',
    width:300,
    marginBottom:20,
    marginTop:30,
    marginLeft:'auto',
    marginRight:'auto',
  },
  title:{
    fontSize:35,
    color:"white",
    textAlign:'center',
    margin:'auto',
    //marginBottom:20,
  },
  text:{
    color:"white",
    textAlign:'center',
    fontSize:20,
  },
  
})
