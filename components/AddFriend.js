import React, { useState} from 'react'
import { Button, StyleSheet, TextInput, View,Text } from 'react-native'
import firebase from "../firebase";

export default function AddFriend() {
    const [friend, setFriend] = useState()
    const [friendUsername, setFriendUsername] = useState({
        username:'',
        userID:''
    })

    async function addFriends() {
        const findUser = firebase.firestore().collection('users');
        const snapshot = await findUser.where('username', '==', friend).get();
        if (snapshot.empty) {
            console.log('No matching documents.');
            alert('No Person Exists.');
            return;
        }

        snapshot.forEach(doc => {
            console.log(doc.data());
            setFriendUsername({
                username:doc.data().username,
                userID:doc.id
            })
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
            <View>
                <Text>{friendUsername.username}</Text>
                <Text>{friendUsername.userID}</Text>
            </View>
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
