import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, ActivityIndicator, FlatList } from 'react-native';
import firebase from "../firebase";
import "firebase/firestore";

let code = 0
let users = []
let TAG = "Console: "

export default class Session extends Component {
    constructor() {
        super();
        this.state = {
            isLoading: true
        }

        let counter = 0

        while (counter === 0) {
            code = this.createCode()

            counter = this.checkForDocument(code)
        }

        let displayName = firebase.auth().currentUser.displayName

        console.log(displayName)


        firebase.firestore().collection('sessions').doc(code).collection('users')
            .doc(firebase.auth().currentUser.uid).set({
            displayName: displayName
        }).then(() => {
            console.log(TAG, "User successfully written!");
        })
            .catch((error) => {
                console.error(TAG, "Error writing user: ", error);
            });


        this.checkForUsers(code)


        this.state.isLoading = false
    }

    createCode = () => {
        let result = '';
        const characters = '0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < 10; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        return result;
    }

    checkForDocument = (code) => {
        const sessionsRef = firebase.firestore().collection('sessions').doc(code)

        sessionsRef.get()
            .then((docSnapshot) => {
                if (docSnapshot.exists) {
                    return 0
                } else {
                    return 1
                }
            })
    }

    checkForUsers = async () => {
        const usersRef = firebase.firestore().collection('sessions').doc(code).collection('users')

        const snapshot = await usersRef.get();
        snapshot.forEach(doc => {
            console.log(doc.id, '=>', doc.data());
        });
    }

    render() {
        if(this.state.isLoading){
            return(
                <View style={styles.preloader}>
                    <ActivityIndicator size="large" color="#9E9E9E"/>
                </View>
            )
        }
        return (
            <View style={styles.container}>
                <FlatList
                    data={users}
                />

                <Text>{code}</Text>

                <Button
                    color="#e98477"
                    title="Start"
                    onPress={() => this.props.navigation.navigate('Swipe Feature')}
                />
            </View>
        );
    }
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
    loginText: {
        color: '#000',
        marginTop: 25,
        textAlign: 'center'
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
