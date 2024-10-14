// TrainSquare.jsx

import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const Square = ({ imageUrl, label,destination }) => {
    const router=useRouter();
    return (
        <View>
        <TouchableOpacity
            style={styles.square} 
            onPress={()=>router.push({
                pathname:"/screens/[id]",
                params:{id:destination}
            })}
            activeOpacity={0.7} 
        >
            <Image 
                style={styles.image}
                source={imageUrl}
            />
        </TouchableOpacity>
        <Text style={styles.text}>{label}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    square: {
        width: 100,
        height: 100,
        backgroundColor: '#4CAF50', // Change to your preferred color
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10, // Optional for rounded corners
        elevation: 3, // Optional for shadow effect on Android
        margin: 10,
    },
    image: {
        width: "100%", // Width of the image
        height:"100%", // Height of the image
        marginBottom: 0, // Space between image and text
    },
    text: {
        color: 'black', // Text color
        fontWeight: 'bold',
    },
});

export default Square;