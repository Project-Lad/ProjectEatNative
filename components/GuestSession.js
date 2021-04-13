import React, { Component } from 'react';
import { StyleSheet, Text, View, FlatList} from 'react-native';
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

         //obtain a doc reference to the session that was input on the Connect screen
         const docRef = firebase.firestore().collection('sessions').doc(this.state.code)

         docRef.get().then((docSnapshot) => {
             //if this document exists
             if (docSnapshot.exists) {
                 //add the user to the document, merge so that way everyone's lobby updates properly
                 docRef.collection('users').doc(firebase.auth().currentUser.uid).set({
                     displayName: displayName
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
                    id: documentSnapshot.id
                })
            })

            //add the user to usersLocal array
            this.setState({users: usersLocal})

            //reset the usersLocal array to avoid duplicates
            usersLocal = []
        })
    }

    checkForSessionStart = () => {
        //document reference to current session created
        const docRef = firebase.firestore().collection('sessions').doc(this.state.code)

        //observer is created that when .start changes to true, it navigates to the swipe feature
        docRef.onSnapshot((documentSnapshot) => {
            if(documentSnapshot.data().start) {
                //navigate
                this.props.navigation.navigate('Swipe Feature',{code:this.state.code})
            }
        }, error => {
            console.log(`Encountered Error: ${error}`)
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
