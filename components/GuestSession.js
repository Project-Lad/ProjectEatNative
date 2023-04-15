import React, { Component } from 'react';
import {
    Text,
    View,
    Image,
    Alert,
    TouchableOpacity,
    LogBox, ScrollView, Share, BackHandler, ActivityIndicator
} from 'react-native';
import { getAuth } from "firebase/auth";
import {getFirestore, doc, setDoc, deleteDoc, getDoc, collection, onSnapshot} from "firebase/firestore";
import {getStorage, ref, getDownloadURL} from "firebase/storage";
import {IconStyles, InputStyles, LobbyStyles, ProfileStyles} from "./InputStyles";
import {Ionicons} from "@expo/vector-icons";
import * as Sentry from "sentry-expo";
import {StrokeAnimation} from "./AnimatedSVG";
import userPhoto from "../assets/user-placeholder.png";

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
        isActive:false,
        start: false,
        zip: "0",
        distance: 1,
        latitude: 0,
        longitude: 0
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        let unsubscribe;

        this.props.navigation.addListener('focus', () => {
            unsubscribe = this.checkForSessionStart()
        })

        this.props.navigation.addListener('blur', () => {
            unsubscribe();
        })
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    handleBackButton() {
        return true;
    }
    constructor(props) {
         super(props);

         this.state.code = props.route.params.code

         //retrieve image
        const storage = getStorage();
        const auth = getAuth();

        const profilePictureRef = ref(storage, `${auth.currentUser.uid}/profilePicture`);

        getDownloadURL(profilePictureRef)
            .then((url) => {
                this.joinSession(url);
            })
            .catch((error) => {
                this.joinSession("assets_userplaceholder");
                Sentry.Native.captureException(error.message);
            });
     }

    joinSession = (url) => {
        const firestore = getFirestore();
        const auth = getAuth();
        const docRef = doc(firestore, "sessions", this.state.code);

        let displayName = auth.currentUser.displayName;

        getDoc(docRef)
            .then((docSnapshot) => {
                if (docSnapshot.exists()) {
                    setDoc(
                        doc(collection(docRef, "users"), auth.currentUser.uid),
                        {
                            displayName: displayName,
                            photoURL: url,
                        },
                        { merge: true }
                    )
                        .then(() => {})
                        .catch(() => {});

                    this.checkForUsers();
                } else {
                    alert("Session could not be found, please re-enter code");
                    this.props.navigation.navigate("Connect");
                }
            })
            .catch((error) => {
                Sentry.Native.captureException(error.message);
                alert(
                    "There was an issue connecting to the Session, please re-enter code"
                );
                this.props.navigation.navigate("Connect");
            });

        /*const firestore = getFirestore();
        const auth = getAuth();
        //obtain a doc reference to the session that was input on the Connect screen
        const docRef = firebase.firestore().collection('sessions').doc(this.state.code)
        let displayName = auth.currentUser.displayName

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
            } else {
                alert("Session could not be found, please re-enter code")
                this.props.navigation.navigate('Connect')
            }
        }).catch((error) => {
            Sentry.Native.captureException(error.message);
            alert("There was an issue connecting to the Session, please re-enter code")
            this.props.navigation.navigate('Connect')
        })*/
    }

    checkForUsers = () => {
        const firestore = getFirestore();
        const usersRef = collection(doc(firestore, "sessions", this.state.code), "users");
        let usersLocal = [];

        onSnapshot(usersRef, (querySnapshot) => {
            this.setState({ areUsersLoading: true });

            querySnapshot.forEach((documentSnapshot) => {
                //push their id and displayName onto the array
                usersLocal.push({
                    displayName: documentSnapshot.data().displayName,
                    id: documentSnapshot.id,
                    photoURL: documentSnapshot.data().photoURL,
                });
            });

            //add the user to usersLocal array
            this.setState({ users: usersLocal, areUsersLoading: false });

            //reset the usersLocal array to avoid duplicates
            usersLocal = [];
        });
        /*const usersRef = firebase.firestore().collection('sessions').doc(this.state.code).collection('users')

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
        })*/
    }

    checkForSessionStart = () => {
        const firestore = getFirestore();
        //document reference to current ion created
        const docRef = doc(collection(firestore, 'sessions'), this.state.code);

        //observer is created that when .start changes to true, it navigates to the swipe feature
        let unsubscribe = onSnapshot(docRef, (documentSnapshot) => {
            //if document exists
            if (documentSnapshot.exists()) {
                //and lobby has not started
                if(documentSnapshot.data().start && !this.state.isActive) {
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

                    unsubscribe();

                    this.setState({isActive: true})

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
                    if(!documentSnapshot.data().start){
                        this.setState({start: false, isActive: false})
                    }
                }
            } else {
                //if lobby no longer exists, display lobby closed alert and return to main page
                Alert.alert('Lobby Closed', 'The lobby you are in has ended, returning to home')

                this.props.navigation.navigate('Profile')
            }
        }, (error) => {
            Sentry.Native.captureException(error.message);
        });

        return unsubscribe;

        /*//document reference to current session created
        const docRef = firebase.firestore().collection('sessions').doc(this.state.code)

        //observer is created that when .start changes to true, it navigates to the swipe feature
        let unsubscribe = docRef.onSnapshot((documentSnapshot) => {
            //if document exists
            if (documentSnapshot.exists) {
                //and lobby has not started
                if(documentSnapshot.data().start && !this.state.isActive) {
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

                    unsubscribe();

                    this.setState({isActive: true})

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
                    if(!documentSnapshot.data().start){
                        this.setState({start: false, isActive: false})
                    }
                }
            } else {
                //if lobby no longer exists, display lobby closed alert and return to main page
                Alert.alert('Lobby Closed', 'The lobby you are in has ended, returning to home')

                this.props.navigation.navigate('Profile')
            }
        }, (error) => {
            Sentry.Native.captureException(error.message);
        })

        return unsubscribe;*/
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
                        const firestore = getFirestore();
                        const auth = getAuth();
                        //if yes, delete the user and navigate back to connection page
                        const usersRef = collection(firestore, "sessions", this.state.code, "users");
                        const userDocRef = doc(usersRef, auth.currentUser.uid);

                        deleteDoc(userDocRef)
                            .then(() => {
                                setTimeout(() => {this.props.navigation.navigate('Connect')})
                            })
                            .catch((error) => {
                                Sentry.Native.captureException(error.message);
                                setTimeout(() => {this.props.navigation.navigate('Connect')})
                            });
                    }
                }
            ]
        )
    }

    onShare = async () => {
        try {
            const link = `out2eat://Connect/${this.state.code}`;
            const result = await Share.share({
                message: `You have been invited to Out2Eat! Open the App and enter code: ${this.state.code} or use this ${link} `
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
                        <StrokeAnimation viewBox="-15 -50 425 475"/>
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
                                                source={user.photoURL === "assets_userplaceholder" ? {uri: Image.resolveAssetSource(userPhoto).uri} : {uri:user.photoURL}}
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
