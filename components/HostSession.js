import React, {Component} from 'react';
import {StyleSheet, Text, View, Button, FlatList, Image, TouchableOpacity} from 'react-native';
import burger from '../assets/burger.jpg'
import firebase from "../firebase";
import "firebase/firestore";
import {InputStyles,IconStyles,ProfileStyles,LobbyStyles} from "./InputStyles";
import { Ionicons } from '@expo/vector-icons';
import Clipboard from '@react-native-clipboard/clipboard';
let TAG = "Console: ";

export default class HostSession extends Component {

    state = {
        isLoading: true,
        users: [],
        code:0,
        photoURL: "",
        photoFound: 0
    }

    constructor(props) {
        super(props);

        let counter = 0

        //counter cycles until it creates a valid code
        while (counter === 0) {

            //updates current code state to current code
            this.state.code = this.createCode()

            counter = this.checkForDocument(this.state.code)
        }

        let displayName = firebase.auth().currentUser.displayName

        //retrieve image
        firebase.storage().ref().child(`${firebase.auth().currentUser.uid}/profilePicture`).getDownloadURL()
            .then((url) => {
                //creates session using the newly generated code
                firebase.firestore().collection('sessions').doc(this.state.code).set({match: false, start: false})
                    .then(() => {
                        //adds the current host user to the document
                        firebase.firestore().collection('sessions').doc(this.state.code)
                            .collection('users').doc(firebase.auth().currentUser.uid).set({
                            displayName: displayName,
                            photoURL: url
                        }).then(() => {
                            console.log(TAG, "User successfully written")
                        }).catch((error) => {
                            console.error(TAG, "Error writing user: ", error);
                        })
                    }).catch((error) => {
                    console.log("Error creating session: ", error)
                })
            })
            .catch((error) => {
                console.log("Error on photo retrieval: ", error)
            })

        this.checkForUsers()

        this.state.isLoading = false
    }

    createCode = () => {
        let result = '';
        const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const charactersLength = characters.length;
        for (let i = 0; i < 5; i++ ) {
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
                    console.log('That session slot is open for use')
                    return 1
                }
            })
    }

    checkForUsers = () => {
        const usersRef = firebase.firestore().collection('sessions').doc(this.state.code).collection('users')
        let usersLocal = [];

        //creates an observer to watch for new documents that may appear
        usersRef.onSnapshot(querySnapshot => {
            //for each document in the collection, push them onto the usersLocal array
            querySnapshot.forEach(documentSnapshot => {
                usersLocal.push({
                    displayName: documentSnapshot.data().displayName,
                    id: documentSnapshot.id,
                    photoURL: documentSnapshot.data().photoURL
                })
            })

            //resets the users state to the new array when updated
            this.setState({users: usersLocal})

            //usersLocal is reset so duplicate users are not created in lobby
            usersLocal = []
            console.log(this.state.users)
        })
    }

    startSession = () =>{
        //updates the start field in the current session to true to send everyone to the swipe feature
        firebase.firestore().collection('sessions')
            .doc(this.state.code).update({start: true})
            .then(r => {
                console.log("Session start updated to true")
            }).catch(error => {
            console.log(`Encountered Update Error: ${error}`)
        })

        //navigate to the swipe page manually
        this.props.navigation.navigate('Swipe Feature', {code: this.state.code})
    }

    render() {
        return (
            <View style={LobbyStyles.container}>

                <FlatList
                    data={this.state.users}
                    renderItem={({item}) => {
                        if (item.photoURL === burger) {
                            return (
                                <View style={LobbyStyles.listContainer}>
                                    <Image source={item.photoURL} style={LobbyStyles.image}/>
                                    <Text style={LobbyStyles.userName}>{item.displayName}</Text>
                                </View>
                            )
                        } else {
                            return (
                                <View style={LobbyStyles.listContainer}>
                                    <Image source={{uri: item.photoURL}} style={LobbyStyles.image}/>
                                    <Text style={LobbyStyles.userName}>{item.displayName}</Text>
                                </View>
                            )
                        }
                    }}
                    keyExtractor={item => item.id}
                />
                <Text style={LobbyStyles.shareCodeText}>Share Code</Text>
                <View>
                    <TouchableOpacity style={LobbyStyles.shareCodeContainer}>
                        <Text>{this.state.code}</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={this.startSession} style={InputStyles.buttons}>
                    <Ionicons style={IconStyles.iconLeft} name="play-circle-outline"/>
                    <Text>Start</Text>
                    <Ionicons style={IconStyles.arrowRight} name="chevron-forward-outline"/>
                </TouchableOpacity>
            </View>
        )
    }
}