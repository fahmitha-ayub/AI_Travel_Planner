import { View, Text, Touchable } from 'react-native'
import React from 'react'
import { TextInput, TouchableOpacity } from 'react-native'
import { StyleSheet } from 'react-native-web'

export default function homeScreen() {
  return (
    <View>
      <Text>Welcome! Plan your trip here</Text>
      <View>
        <TouchableOpacity>
            <Text>Start</Text>
            <TextInput placeholder="Enter your Startlocation" style={styles.textbox}/>
        </TouchableOpacity>       
        <TouchableOpacity>
            <Text>Destination</Text>
            <TextInput placeholder="Enter your Destination" style={styles.textbox}/>
        </TouchableOpacity>
        
      </View>
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
    }
})