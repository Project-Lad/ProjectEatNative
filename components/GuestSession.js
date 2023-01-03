import React, { Component } from 'react';
import {
    Text,
    View,
    Image,
    Alert,
    TouchableOpacity,
    LogBox, ScrollView, Share, BackHandler, ActivityIndicator
} from 'react-native';
import firebase from "../firebase";
import "firebase/firestore";
import {IconStyles, InputStyles, LobbyStyles, ProfileStyles} from "./InputStyles";
import {Ionicons} from "@expo/vector-icons";
import * as Sentry from "sentry-expo";
import preloaderLines from "./AnimatedSVG";
import {AnimatedSVGPaths} from "react-native-svg-animations";
let unsubscribe;
LogBox.ignoreLogs(['Setting a timer']);
export default class GuestSession extends Component {
    state = {
        areUsersLoading: true,
        isExiting: false,
        users: [],
        code: 0,
        photoURL: "",
        photoFound: 0,
        categories: [],
        isFocused:false,
        start: false,
        zip: "0",
        distance: 1,
        latitude: 0,
        longitude: 0
    }
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    handleBackButton() {
        return true;
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
                         }, {merge: true}).then(() => {})
                             .catch(() => {});

                         this.checkForUsers()
                         this.checkForSessionStart()
                     } else {
                         alert("Session could not be found, please re-enter code")
                         this.props.navigation.navigate('Connect')
                     }
                 }).catch((error) => {
                     Sentry.Native.captureException(error.message);
                     alert("There was an issue connecting to the Session, please re-enter code")
                     this.props.navigation.navigate('Connect')
                 })
             })
             .catch((error) => {
                 Sentry.Native.captureException(error.message);
             })
     }

    checkForUsers = () => {
        const usersRef = firebase.firestore().collection('sessions').doc(this.state.code).collection('users')
        let usersLocal = [];

        usersRef.onSnapshot(querySnapshot => {
            this.setState({areUsersLoading: true})
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
            this.setState({users: usersLocal, areUsersLoading: false})

            //reset the usersLocal array to avoid duplicates
            usersLocal = []
        })
    }

    checkForSessionStart = () => {
        //document reference to current session created
        const docRef = firebase.firestore().collection('sessions').doc(this.state.code)

        //observer is created that when .start changes to true, it navigates to the swipe feature
        unsubscribe = docRef.onSnapshot((documentSnapshot) => {
            //if document exists
            if (documentSnapshot.exists) {
                //and lobby has not started
                if(documentSnapshot.data().start) {
                    this.setState({
                        categories: [],
                        start: true,
                        distance: documentSnapshot.data().distance,
                        zip: documentSnapshot.data().zip,
                        latitude: documentSnapshot.data().latitude,
                        longitude: documentSnapshot.data().longitude
                    })
                    //set start to true and navigate
                    documentSnapshot.data().categories.forEach(category => {
                        this.state.categories.push(category)
                    })

                    this.props.navigation.navigate('Swipe Feature',{
                        code:this.state.code,
                        zip:this.state.zip,
                        distance: this.state.distance,
                        isHost:false,
                        categories: this.state.categories,
                        latitude: this.state.latitude,
                        longitude: this.state.longitude
                    })
                } else {
                    this.setState({start: false})
                }
            } else {
                //if lobby no longer exists, display lobby closed alert and return to main page
                Alert.alert('Lobby Closed', 'The lobby you are in has ended, returning to home')

                this.props.navigation.navigate('Profile')
            }
        }, (error) => {
            Sentry.Native.captureException(error.message);
        })
    }

    leaveLobby = () => {
        Alert.alert("Leaving Lobby",
            "Are you sure you want to leave this lobby?",
            [
                {
                    text:"No",
                    onPress:() => {this.setState({isExiting: false})}
                },
                {
                    text:"Yes",
                    onPress:() => {
                        this.setState({isExiting: true})
                        unsubscribe();
                        //if yes, delete the user and navigate back to connection page
                        firebase.firestore().collection('sessions').doc(this.state.code)
                            .collection('users').doc(firebase.auth().currentUser.uid).delete()
                            .then(setTimeout(() => {this.props.navigation.navigate('Connect')}))
                            .catch((error) => {
                                Sentry.Native.captureException(error.message);
                                //if an error occurs, display console log and navigate back to connect
                                setTimeout(() => {this.props.navigation.navigate('Connect')})}
                            )
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
            Sentry.Native.captureException(error.message);
        }
    };

    render() {
        return(
            <>
                {this.state.isExiting ?
                    <View style={[ProfileStyles.container, {backgroundColor: '#FFF'}]}>
                        <AnimatedSVGPaths
                            strokeColor={"black"}
                            duration={1500}
                            strokeWidth={3}
                            strokeDashArray={[42.76482137044271, 42.76482137044271]}
                            height={400}
                            width={400}
                            scale={1}
                            delay={0}
                            rewind={false}
                            ds={preloaderLines}
                            loop={false}
                        />
                    </View>
                    :
                    <View style={LobbyStyles.container}>
                        {this.state.areUsersLoading ?
                            <View style={{flex: 1, justifyContent: 'center'}}>
                                <ActivityIndicator size="large" color="#f97c4d"/>
                                <Text style={LobbyStyles.userName}>Loading Users...</Text>
                            </View>
                            :
                            <ScrollView>
                                {this.state.users.map(user=>{
                                    return(
                                        <View style={LobbyStyles.listContainer} key={user.id}>
                                            <Image
                                                source={{uri:user.photoURL}}
                                                style={LobbyStyles.image}
                                                loadingIndicatorSource={<ActivityIndicator size="small" color="#f97c4d"/>}
                                            />
                                            <Text style={LobbyStyles.userName}>{user.displayName}</Text>
                                        </View>
                                    )
                                })}
                            </ScrollView>
                        }
                        <View>
                            <Text style={{fontSize:18, color:'#2e344f'}}>Share Code</Text>

                            <View>
                                <TouchableOpacity onPress={this.onShare} style={LobbyStyles.shareCodeContainer}>
                                    <Text style={LobbyStyles.shareCodeText}>{this.state.code}</Text>
                                    <Ionicons style={IconStyles.iconShare} name="share-social-outline"/>
                                </TouchableOpacity>
                            </View>
                            <View style={{flexDirection:"row", justifyContent:"space-between", width:"100%"}}>
                                <TouchableOpacity onPress={()=>{this.setState({isExiting: true}); this.leaveLobby()}} style={LobbyStyles.closeButton}>
                                    <Ionicons style={IconStyles.iconLeft}  name="close-circle-outline"/>
                                    <Text style={InputStyles.buttonText}>Leave</Text>
                                </TouchableOpacity>
                                {this.state.start ?
                                    <TouchableOpacity
                                        onPress={() =>
                                            this.props.navigation.navigate('Swipe Feature',{
                                                code:this.state.code,
                                                zip:this.state.zip,
                                                distance: this.state.distance,
                                                isHost:false,
                                                categories: this.state.categories,
                                                latitude: this.state.latitude,
                                                longitude: this.state.longitude
                                            })
                                        }
                                        style={LobbyStyles.buttons}
                                    >
                                        <Text style={InputStyles.buttonText}>Back 2 Swiping</Text>
                                    </TouchableOpacity>
                                    :
                                    null
                                }
                            </View>
                        </View>
                    </View>
                }
            </>
        );
    }
}
