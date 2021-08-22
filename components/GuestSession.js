import React, { Component } from 'react';
import {
    Text,
    View,
    Image,
    Alert,
    TouchableOpacity,
    Platform,
    ToastAndroid, ScrollView, Share
} from 'react-native';
import firebase from "../firebase";
import "firebase/firestore";
import {IconStyles, InputStyles, LobbyStyles} from "./InputStyles";
import Clipboard from "expo-clipboard";
import {Ionicons} from "@expo/vector-icons";
let TAG = "Console: ";

export default class GuestSession extends Component {

    state = {
        isLoading: true,
        users: [],
        code: 0,
        photoURL: "",
        photoFound: 0
    }

     constructor(props) {
         super(props);

         let displayName = firebase.auth().currentUser.displayName

         this.state.code = props.route.params.code

         //obtain a doc reference to the session that was input on the Connect screen
         const docRef = firebase.firestore().collection('sessions').doc(this.state.code)

         //retrieve image
         firebase.storage().ref().child(`${firebase.auth().currentUser.uid}/profilePicture`).getDownloadURL()
             .then((url) => {
                 docRef.get().then((docSnapshot) => {
                     //if this document exists
                     if (docSnapshot.exists) {
                         //add the user to the document, merge so that way everyone's lobby updates properly
                         docRef.collection('users').doc(firebase.auth().currentUser.uid).set({
                             displayName: displayName,
                             photoURL: url
                         }, {merge: true}).then(() => {
                             console.log(TAG, "User successfully written!");
                         }).catch((error) => {
                             console.error(TAG, "Error writing user: ", error);
                         });

                         this.checkForUsers()
                         this.checkForSessionStart()
                     } else {
                         alert("Error: Session could not be found, please re-enter code")
                         this.props.navigation.navigate('Connect')
                     }
                 })
             })
             .catch((error) => {
                 console.log("Error on photo retrieval: ", error)
             })
         this.state.isLoading = false
     }

    checkForUsers = () => {
        const usersRef = firebase.firestore().collection('sessions').doc(this.state.code).collection('users')
        let usersLocal = [];

        usersRef.onSnapshot(querySnapshot => {
            //check the entire query, for each document push them onto local array
            querySnapshot.forEach(documentSnapshot => {
                //push their id and displayName onto the array
                usersLocal.push({
                    displayName: documentSnapshot.data().displayName,
                    id: documentSnapshot.id,
                    photoURL: documentSnapshot.data().photoURL
                })
            })

            //add the user to usersLocal array
            this.setState({users: usersLocal})

            //reset the usersLocal array to avoid duplicates
            usersLocal = []
        })
    }

    checkForSessionStart = () => {
        let start = false
        //document reference to current session created
        const docRef = firebase.firestore().collection('sessions').doc(this.state.code)

        //observer is created that when .start changes to true, it navigates to the swipe feature
        docRef.onSnapshot((documentSnapshot) => {
            //if document exists
            if (documentSnapshot.exists) {
                //and lobby has not started
                if (start === false) {
                    //if start is true on firebase, then
                    if(documentSnapshot.data().start) {
                        //set start to true and navigate
                        start = true
                        this.props.navigation.navigate('Swipe Feature',{code:this.state.code, zip:documentSnapshot.data().zip, distance: documentSnapshot.data().distance})
                    }
                }
            } else {
                //if lobby no longer exists, display lobby closed alert and return to main page
                Alert.alert('Lobby Closed', 'The lobby you are in has ended, returning to home')
                this.props.navigation.navigate('Profile')
            }
        }, (error) => {
            console.log(`Encountered Error: ${error}`)
        })
    }

    leaveLobby = () => {
        Alert.alert("Leaving Lobby",
            "Are you sure you want to leave this lobby?",
            [
                {
                    text:"No",
                    onPress:() => {}
                },
                {
                    text:"Yes",
                    onPress:() => {
                        //if yes, delete the user and navigate back to connection page
                        firebase.firestore().collection('sessions').doc(this.state.code)
                            .collection('users').doc(firebase.auth().currentUser.uid).delete()
                            .then(this.props.navigation.navigate('Connect'))
                            .catch((error) => {
                                //if an error occurs, display console log and navigate back to connect
                                console.log("User Delete Error: ", error)
                                this.props.navigation.navigate('Connect')})
                    }
                }
            ]
        )
    }

    onShare = async () => {
        try {
            const result = await Share.share({
                message: `Your Lobby Code is: ${this.state.code}`
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            alert(error.message);
        }
    };
    render() {
        return (
            <View style={LobbyStyles.container}>
                <ScrollView>
                    {this.state.users.map(user=>{
                        return(
                            <View style={LobbyStyles.listContainer} key={user.id}>
                                <Image source={{uri:user.photoURL}} style={LobbyStyles.image}/>
                                <Text style={LobbyStyles.userName}>{user.displayName}</Text>
                            </View>
                        )
                    })}
                </ScrollView>
{/*                <FlatList
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
                    nestedScrollEnabled
                />*/}
                <View style={LobbyStyles.bottomContainer}>
                    <Text style={InputStyles.buttonText}>Share Code</Text>

                    <View>
                        <TouchableOpacity onPress={this.onShare} style={LobbyStyles.shareCodeContainer}>
                            <Text style={LobbyStyles.shareCodeText}>{this.state.code}</Text>
                            <Ionicons style={IconStyles.iconShare} name="share-social-outline"/>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity onPress={()=>{this.leaveLobby()}}>
                        <Text style={{marginTop:15}}>Leave Lobby</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}
