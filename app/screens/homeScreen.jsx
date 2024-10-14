import { View, Text, } from 'react-native'
import React, { useState } from 'react'
import Square from '../../components/button';
import trainImage from '../../assets/images/train.jpg';
import busImage from '../../assets/images/bus.jpg';
import { router } from 'expo-router';
//import { fetchTrains} from '../supabaseClient' 

export default function HomeScreen() {

  return (
    <View >
      <Text>Choose your mode of travel</Text>
      <View  style={{flexDirection:'row'}}>
        <Square imageUrl={trainImage} label="Train" destination="train" />
        <Square imageUrl={busImage} label="Bus" destination="bus" />
      </View>
      
    </View>
  )
}
