import React, {Component} from 'react';
import { StyleSheet, Text, View, Button, FlatList} from 'react-native';
import firebase from "../firebase";
import "firebase/firestore";

let TAG = "Console: ";

export default class HostSession extends Component {

    state = {
        isLoading: true,
        users: [],
        code:0
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

        //creates session using the newly generated code
        firebase.firestore().collection('sessions').doc(this.state.code).set({match: false, start: false})
            .then(() => {
                //adds the current host user to the document
                firebase.firestore().collection('sessions').doc(this.state.code)
                    .collection('users').doc(firebase.auth().currentUser.uid).set({
                    displayName: displayName
                }).then(() => {
                    console.log(TAG, "User successfully written")
                }).catch((error) => {
                    console.error(TAG, "Error writing user: ", error);
                })
        }).catch((error) => {
            console.log("Error creating session: ", error)
        })

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
                    id: documentSnapshot.id
                })
            })

            //resets the users state to the new array when updated
            this.setState({users: usersLocal})

            //usersLocal is reset so duplicate users are not created in lobby
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

                <Button
                    color="#e98477"
                    title="Start"
                    onPress={() => {
                        //updates the start field in the current session to true to send everyone to the swipe feature
                        firebase.firestore().collection('sessions')
                            .doc(this.state.code).update({start: true})
                            .then(r => {
                                console.log("Session start updated to true")
                            }).catch(error => {
                                console.log(`Encountered Update Error: ${error}`)
                            })

                        //navigate to the swipe page manually
                        this.props.navigation.navigate('Swipe Feature',{code:this.state.code})
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
    }
});
