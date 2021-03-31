import React,{useState} from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, TouchableOpacity, LogBox } from 'react-native';
import firebase from '../firebase'
import "firebase/firestore";

export default function FriendsList(){
    const [friend, setFriend] = useState()
    async function fetchUser(){
        const findUser = firebase.firestore().collection('users');
        const snapshot = await findUser.where('username', '==', 'BettinaYoung').get();
        if (snapshot.empty) {
            console.log('No matching documents.');
            return;
        }

        snapshot.forEach(doc => {
            setFriend(doc.data());
            console.log(doc.data());
        });
    }
    return(
        <View>
            <Button title="Get Data" onPress={fetchUser}/>
            <Text>{friend}</Text>
        </View>
    )
}
