import React, { Component,useState } from 'react';
import { StyleSheet, Text, View, Button, FlatList} from 'react-native';
import firebase from "../firebase";
import "firebase/firestore";

export let getCode = undefined;


let TAG = "Console: ";
/*let code = 0;*/

export default class Session extends Component {

    state = {
        isLoading: true,
        users: [],
        code:0
    }

    constructor(props) {
        super(props);

        let counter = 0

        while (counter === 0) {
            this.state.code = this.createCode()

            counter = this.checkForDocument(this.state.code)
        }

        let displayName = firebase.auth().currentUser.displayName

        console.log(displayName)


        firebase.firestore().collection('sessions').doc(this.state.code).collection('users')
            .doc(firebase.auth().currentUser.uid).set({
            displayName: displayName
        }).then(() => {
            console.log(TAG, "User successfully written!");
        })
            .catch((error) => {
                console.error(TAG, "Error writing user: ", error);
            });

        this.checkForUsers()

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
                    console.log('That session currently exists')
                    return 0
                } else {
                    return 1
                }
            })
    }

    checkForUsers = () => {
        const usersRef = firebase.firestore().collection('sessions').doc(this.state.code).collection('users')
        let usersLocal = [];

        usersRef.onSnapshot(querySnapshot => {
            console.log('Total users: ', querySnapshot.size)
            querySnapshot.forEach(documentSnapshot => {
                console.log('UserID: ', documentSnapshot.id, documentSnapshot.data())
                usersLocal.push({
                    displayName: documentSnapshot.data().displayName,
                    id: documentSnapshot.id
                })
            })

            this.setState({users: usersLocal})

            usersLocal = []
            console.log(this.state.users)
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    data={this.state.users}
                    renderItem={({item}) => <Text>{item.displayName}</Text>}
                    keyExtractor={item => item.id}
                />
                {
                    console.log(this.state.users)
                }
                <Text>{this.state.code}</Text>

                <Button
                    color="#e98477"
                    title="Start"
                    onPress={() => this.props.navigation.navigate('Swipe Feature',{code:this.state.code})}
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
