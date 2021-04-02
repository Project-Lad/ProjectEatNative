import React, { Component,useState } from 'react';
import { StyleSheet, Text, View, Button, FlatList} from 'react-native';
import firebase from "../firebase";
import "firebase/firestore";

let TAG = "Console: ";

export default class GuestSession extends Component {

    state = {
        isLoading: true,
        users: [],
        code: 0
    }

     constructor(props) {
         super(props);

         let displayName = firebase.auth().currentUser.displayName
         this.state.code = props.route.params.code
         //console.log(this.state.code)

         //this.setState(props.code)

         //console.log(displayName)
         const docRef = firebase.firestore().collection('sessions').doc(this.state.code)

         docRef.get().then((docSnapshot) => {
             if (docSnapshot.exists) {
                 docRef.collection('users').doc(firebase.auth().currentUser.uid).set({
                     displayName: displayName
                 }, {merge: true}).then(() => {
                     console.log(TAG, "User successfully written!");
                 })
                     .catch((error) => {
                         console.error(TAG, "Error writing user: ", error);
                     });

                 this.checkForUsers()
             } else {
                 alert("Error: Session could not be found, please re-enter code")
                 this.props.navigation.navigate('Connect')
             }
         })

         //this.checkForUsers()

         this.state.isLoading = false


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


                <Text>{this.state.code}</Text>
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
