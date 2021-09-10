import React, {Component} from 'react';
import {
    Text,
    View,
    Image,
    Alert,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Share
} from 'react-native';
import Slider from 'react-native-smooth-slider';
import firebase from "../firebase";
import "firebase/firestore";
import {InputStyles,IconStyles,LobbyStyles} from "./InputStyles";
import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
let TAG = "Console: ";

export default class HostSession extends Component {

    state = {
        isLoading: true,
        users: [],
        code:0,
        photoURL: "",
        photoFound: 0,
        zip: null,
        distance: 1,
        copyClipboard:''
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
                firebase.firestore().collection('sessions').doc(this.state.code).set({zip: null, start: false})
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

    endLobby = () => {
        Alert.alert("End Lobby",
            "Are you sure you want to end this lobby?",
            [
                {
                    text:"No",
                    onPress:() => {}
                },
                {
                    text:"Yes",
                    onPress:() => {
                        firebase.firestore().collection('sessions').doc(this.state.code).delete()
                            .then(this.props.navigation.navigate('Profile'))
                            .catch((error) => {
                                console.log("End Lobby Error: ", error)
                                this.props.navigation.navigate('Profile')})
                    }
                }
            ]
        )
    }

    changeScreens = () => {
        if(this.state.zip !== null && this.state.zip !== "") {
            let zipCodePattern = /^\d{5}$|^\d{5}-\d{4}$/;

            if(zipCodePattern.test(this.state.zip)) {
                //updates the start field in the current session to true to send everyone to the swipe feature
                firebase.firestore().collection('sessions')
                    .doc(this.state.code).update({zip: this.state.zip, start: true, distance: this.state.distance})
                    .then(() => {
                        console.log("Session start updated to true, zipcode updated")
                    }).catch(error => {
                    console.log(`Encountered Update Error: ${error}`)
                })

                //navigate to the swipe page manually
                this.props.navigation.navigate('Swipe Feature', {code: this.state.code, zip: this.state.zip, distance: this.state.distance, isHost:true})
            } else {
                console.log("Zip Code: ", this.state.zip);
                Alert.alert("Invalid ZipCode")
            }
        } else {
            //updates the start field in the current session to true to send everyone to the swipe feature
            firebase.firestore().collection('sessions')
                .doc(this.state.code).update({start: true, distance: this.state.distance})
                .then(() => {
                    console.log("Session start updated to true")
                }).catch(error => {
                console.log(`Encountered Update Error: ${error}`)
            })

            //navigate to the swipe page manually
            this.props.navigation.navigate('Swipe Feature', {code: this.state.code, zip: null, distance: this.state.distance, isHost:true})
        }
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
        //host changes distance and zipcode (possible change in future for users to change themselves)
        return (
            <View style={LobbyStyles.container}>

                <TextInput
                    onChangeText={(text) => {
                        this.setState({zip: text})
                    }}
                    value={this.state.zip}
                    placeholder="Enter Zipcode or Leave Blank for Current Location"
                    style={InputStyles.zipInputStyle}
                />

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
                    nestedScrollEnabled={true}
                />*/}
                <View style={LobbyStyles.sliderContainer}>
                    <Slider
                        value={this.state.distance}
                        useNativeDriver={true}
                        minimumValue={1}
                        maximumValue={25}
                        step={0.5}
                        onValueChange={value => this.setState({distance: value})}
                        minimumTrackTintColor='#BC0B02'
                        thumbStyle={LobbyStyles.sliderThumb}
                        trackStyle={LobbyStyles.sliderTrack}
                        />
                    <Text>Distance: {this.state.distance} mi</Text>
                </View>


                <Text style={InputStyles.buttonText}>Share Code</Text>

                <View>
                    <TouchableOpacity onPress={this.onShare} style={LobbyStyles.shareCodeContainer}>
                        <Text style={LobbyStyles.shareCodeText}>{this.state.code}</Text>
                        <Ionicons style={IconStyles.iconShare} name="share-social-outline"/>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={this.changeScreens} style={InputStyles.buttons}>
                    <Ionicons style={IconStyles.iconLeft} name="play-circle-outline"/>
                    <Text style={InputStyles.buttonText}>Start</Text>
                    <Ionicons style={IconStyles.arrowRight} name="chevron-forward-outline"/>
                </TouchableOpacity>

                <TouchableOpacity onPress={()=>{this.endLobby()}}>
                    <Text style={{marginTop:15}}>Close Lobby</Text>
                </TouchableOpacity>
            </View>
        )
    }
}
