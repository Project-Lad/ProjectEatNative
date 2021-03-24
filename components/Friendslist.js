import React,{useState} from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, TouchableOpacity, LogBox } from 'react-native';
import firebase from '../firebase'
import "firebase/firestore";

export default function Friendslist(){
    const [friend, setFriend] = useState()
    async function fetchUser(){
        const citiesRef = firebase.firestore().collection('users');
        const snapshot = await citiesRef.where('username', '==', 'BettinaYoung').get();
        if (snapshot.empty) {
            console.log('No matching documents.');
            return;
        }

        snapshot.forEach(doc => {
            setFriend(doc.id, '=>', doc.data().username);
            console.log(doc.data().username);
        });
    }
    return(
        <View>
            <Button title="Get Data" onPress={fetchUser}/>
        </View>
    )
}
