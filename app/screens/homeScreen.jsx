import { View, Text, } from 'react-native'
import React, { useState } from 'react'
import { TextInput, TouchableOpacity,Button } from 'react-native'
import { supabase } from '../supabaseClient';
import { FlatList, StyleSheet } from 'react-native'
//import { fetchTrains} from '../supabaseClient' 

export default function HomeScreen() {
  
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [trains, setTrains] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchTrains = async () => {
      setLoading(true);
      console.log("Start Location:", start); // Log the start location
      console.log("Destination Location:", end);
      const { data, error } = await supabase
        .rpc('get_trains', { start_loc: start, dest_loc: end });
  
      if (error) {
        console.error('Error fetching trains:', error.message);
        alert('Failed to fetch trains. Please try again.');
      } else {
        setTrains(data);
        console.log("Trains fetched successfully:", data);
      }
      setLoading(false);
    };
  return (
    <View>
      <Text>Welcome! Plan your trip here</Text>
      <View>
        <TouchableOpacity>
            <Text>Start</Text>
            <TextInput placeholder="Enter your Startlocation" 
            style={styles.textbox}
            onChangeText={(value)=>setStart(value)}/>
        </TouchableOpacity>       
        <TouchableOpacity>
            <Text>Destination</Text>
            <TextInput placeholder="Enter your Destination" 
            style={styles.textbox}
            onChangeText={(value)=>setEnd(value)}
             />
        </TouchableOpacity>
        <Button title="submit" onPress={fetchTrains}/>
        
      </View>
      {loading ? (
                <Text>Loading...</Text>
            ) : (
              <FlatList
              data={trains}
              keyExtractor={(item) => item.train_id.toString()}
              renderItem={({ item }) => (
                  <View style={styles.tableRow}>
                      <Text style={styles.cell}>{item.train_id}</Text>
                      <Text style={styles.cell}>{item.origin}</Text>
                      <Text style={styles.cell}>{item.destination}</Text>
                      <Text style={styles.cell}>{item.distance}</Text>
                      <Text style={styles.cell}>{item.route_duration}</Text>
                  </View>
              )}
              ListEmptyComponent={<Text>No trains found.</Text>}
          />
            )}
      {/* <FlatList
        data={trains}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text>{`Train from ${item.start} to ${item.end}`}</Text>
        )}
      /> */}
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