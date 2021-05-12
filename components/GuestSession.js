import React, { Component } from 'react';
import {StyleSheet, Text, View, FlatList, Image, Button, Alert} from 'react-native';
import firebase from "../firebase";
import "firebase/firestore";
import burger from "../assets/burger.jpg";

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

    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    data={this.state.users}
                    renderItem={({item}) => {
                        if (item.photoURL === burger) {
                            return (<View>
                                <Image source={item.photoURL} style={styles.image}/>
                                <Text>{item.displayName}</Text>
                            </View>)
                        } else {
                            return (<View>
                                <Image source={{uri: item.photoURL}} style={styles.image}/>
                                <Text>{item.displayName}</Text>
                            </View>)
                        }
                    }}
                    keyExtractor={item => item.id}
                />

                <Text>{this.state.code}</Text>
                <Button
                    color="#e98477"
                    title="Leave Lobby"
                    onPress={() => {
                        this.leaveLobby()
                    }}
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
    },
    image: {
        width: 75,
        height: 75,
        borderRadius: 50,
    }
});
