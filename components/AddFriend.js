import React, {Component, useState} from 'react'
import { Button, StyleSheet, TextInput, View} from 'react-native'
import firebase from "../firebase";

export default function AddFriend() {
    const [friend, setFriend] = useState()

    async function addFriends() {
        const citiesRef = firebase.firestore().collection('users');
        const snapshot = await citiesRef.where('username', '==', friend).get();
        if (snapshot.empty) {
            console.log('No matching documents.');
            return;
        }

        snapshot.forEach(doc => {
            console.log(doc.data().username);
        });
    }

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.inputStyle}
                placeholder="Find a Friend"
                onChangeText={setFriend}
            />
            <Button
                color="#e98477"
                title="Search"
                onPress={addFriends}
            />
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 35,
        backgroundColor: '#fff'
    },
    inputStyle: {
        width: '100%',
        marginBottom: 15,
        paddingBottom: 15,
        alignSelf: "center",
        borderColor: "#ccc",
        borderBottomWidth: 1
    },
    preloader: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff'
    }
});
