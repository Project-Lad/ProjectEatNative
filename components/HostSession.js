import React, {Component} from 'react';
import {
    Text,
    View,
    Image,
    Alert,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Share,
    Pressable,
    Modal,
    Switch,
    KeyboardAvoidingView,
    Platform,
    BackHandler,
    LogBox, ActivityIndicator
} from 'react-native';
import Slider from '@react-native-community/slider';
import { getAuth } from "firebase/auth";
import {getFirestore, doc, setDoc, deleteDoc, getDoc, collection, onSnapshot, getDocs, updateDoc} from "firebase/firestore";
import {getStorage, ref, getDownloadURL} from "firebase/storage";
import {InputStyles, IconStyles, LobbyStyles, CardStyle, ProfileStyles} from "./InputStyles";
import { Ionicons } from '@expo/vector-icons';
import * as Location from "expo-location";
import * as Sentry from "sentry-expo";
import {StrokeAnimation} from "./AnimatedSVG";
import userPhoto from "../assets/user-placeholder.png";
LogBox.ignoreLogs(['Setting a timer']);

//Declares lat and long vars
let latitude = null;
let longitude = null;

export default class HostSession extends Component {

    state = {
        isLoading: true,
        isExiting: false,
        isFocused: false,
        allowStart:true,
        onFocus: false,
        users: [],
        code:0,
        photoURL: "",
        photoFound: 0,
        zip: null,
        distance: 1,
        copyClipboard:'',
        categories: ['all'],
        modalVisible: false,
        isAll: true,
        isAmerican: false,
        isAfrican: false,
        isItalian: false,
        isCaribbean: false,
        isAsian: false,
        isEuropean: false,
        isMexican: false,
        isMiddleEast: false,
        isSeafood: false,
        isVegan: false,
        isMounted:false
    }
    async componentDidMount() {
        /*
        * back handler event listener to prevent user from swiping between screens
        * added new State isMounted to prevent memory leak warning
        * check users location status. If denied user can not hose a lobby unless they turn on location
        * if location is turned on and the component did mount it will set lat and long vars
        * set isMounted state to false when component unmounts to prevent memory leak
        */
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        this.setState({isMounted:true})
        await this.awaitingLocationData()
    }

    componentWillUnmount() {
        this.setState({isMounted:false})
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    handleBackButton() {
        return true;
    }

    onFocus() {
        this.setState({
            onFocus: true
        })
    }
    onBlur() {
        this.setState({
            onFocus:false
        })
    }

    constructor(props) {
        super(props);
        let counter = 0

        //counter cycles until it creates a valid code
        while (counter === 0) {
            //updates current code state to current code
            this.state.code = this.createCode();
            counter = this.checkForDocument(this.state.code);
        }
    }

    awaitingLocationData = async () => {
        await this.checkLocationPermissions();

        const storage = getStorage();
        const auth = getAuth();

        const profilePictureRef = ref(storage, `${auth.currentUser.uid}/profilePicture`);

        getDownloadURL(profilePictureRef)
            .then((url) => {
                this.createSession(url);
            })
            .catch((error) => {
                this.createSession("assets_userplaceholder");

                if (!error.message.includes("storage/object-not-found")) {
                    Sentry.Native.captureException(error.message);
                }
            })

        /*//retrieve image
        firebase.storage().ref().child(`${auth.currentUser.uid}/profilePicture`).getDownloadURL()
            .then((url) => {
                this.createSession(url);
            })
            .catch((error) => {
                this.createSession("assets_userplaceholder");

                if (!error.message.includes("storage/object-not-found")) {
                    Sentry.Native.captureException(error.message);
                }
            })*/

        this.checkForUsers()
    }

    createCode = () => {
        let result = '';
        const characters = '123456789ABCDEFGHIJKLMNPQRSTUVWXYZ';
        const charactersLength = characters.length;
        for (let i = 0; i < 5; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        return result;
    }

    createSession = (url) => {
        const firestore = getFirestore();
        const auth = getAuth();
        const sessionsRef = collection(firestore, 'sessions');
        const sessionRef = doc(sessionsRef, this.state.code);
        const usersRef = collection(sessionRef, 'users');
        const usersDocRef = doc(usersRef, auth.currentUser.uid);

        let displayName = auth.currentUser.displayName;

        for(let i = 0; i < 2; i++) {
            //creates session using the newly generated code
            setDoc(sessionRef, {zip: null, start: false, latitude: latitude, longitude: longitude})
                .then(() => {
                    //adds the current host user to the document
                    setDoc(usersDocRef, {
                        displayName: displayName,
                        photoURL: url
                    })
                        .then(() => {
                            this.setState({allowStart: false})
                            i = 3
                        })
                        .catch((error) => {
                            Sentry.Native.captureException(error.message);
                        });
                })
                .catch((error) => {
                    Sentry.Native.captureException("Error creating session retry attempt #" + i + " Error: " + error.message);
                    Alert.alert(
                        "Failed to Create Lobby",
                        "Uh oh, something went wrong! Make sure your connection is stable and please try again!",
                        [
                            {
                                text: "Back to Home",
                                onPress: () => {
                                    this.setState({isExiting: true})
                                    setTimeout(() => { this.props.navigation.navigate('Profile') }, 1650);
                                }
                            }
                        ]
                    )
                });
        }

        /*//creates session using the newly generated code
        firebase.firestore().collection('sessions').doc(this.state.code).set({zip: null, start: false, latitude: latitude, longitude: longitude})
            .then(() => {
                //adds the current host user to the document
                firebase.firestore().collection('sessions').doc(this.state.code)
                    .collection('users').doc(firebase.auth().currentUser.uid).set({
                    displayName: displayName,
                    photoURL: url
                }).then(() => {})
                    .catch((error) => {
                        Sentry.Native.captureException(error.message);
                    })
            }).catch((error) => {
            Sentry.Native.captureException(error.message);
        })*/
    }

    checkForDocument = (code) => {
        const firestore = getFirestore();
        const sessionsRef = doc(firestore, 'sessions', code);
        let result;

        getDoc(sessionsRef).then((docSnapshot) => {
            if (docSnapshot.exists()) {
                result = 0;
            } else {
                result = 1;
            }
        }).catch((error) => {
            Sentry.Native.captureException(error.message);
        });

        return result;
    }

    checkForUsers = () => {
        const firestore = getFirestore();
        const usersRef = collection(doc(firestore, 'sessions', this.state.code), 'users');
        let usersLocal = [];

        //creates an observer to watch for new documents that may appear
        onSnapshot(usersRef, querySnapshot => {
            this.setState({isLoading: true})
            //for each document in the collection, push them onto the usersLocal array
            querySnapshot.forEach(documentSnapshot => {
                usersLocal.push({
                    displayName: documentSnapshot.data().displayName,
                    id: documentSnapshot.id,
                    photoURL: documentSnapshot.data().photoURL
                })
            })

            //resets the users state to the new array when updated
            this.setState({users: usersLocal, isLoading: false})

            //usersLocal is reset so duplicate users are not created in lobby
            usersLocal = []
        });
    }

    checkLocationPermissions = async () => {
        let {status} = await Location.requestForegroundPermissionsAsync();
        if (status === 'denied') {
            Alert.alert('Location Permissions', 'Please enter a Zip Code or enable Location Services in your Device Settings if you wish to use your current location.');
        } else {
            if (this.state.isMounted) {
                let location;
                let locationSuccess = false;
                let count = 0;
                while (!locationSuccess) {
                    try {
                        location = await Location.getCurrentPositionAsync({
                            accuracy: Location.Accuracy.Lowest,
                        });
                        locationSuccess = true;
                    } catch (ex) {
                        count++;
                        if (count === 500) {
                            Alert.alert("Location Unreachable", "Your location cannot be found.", ["Cancel", "OK"])
                            locationSuccess = true;
                        }
                    }
                }
                latitude = location.coords.latitude;
                longitude = location.coords.longitude;
            }
        }
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
                        this.setState({isExiting: true})

                        const firestore = getFirestore();
                        const usersRef = collection(firestore, 'sessions', this.state.code, 'users');

                        getDocs(usersRef).then((querySnapshot) => {
                            querySnapshot.forEach((doc) => {
                                deleteDoc(doc(doc.parent, doc.id)).then(() => {})
                                    .catch((error) => {
                                        Sentry.Native.captureException(error.message);
                                    });
                            });
                        });

                        deleteDoc(doc(firestore, 'sessions', this.state.code)).then(() => {
                            setTimeout(() => { this.props.navigation.navigate('Profile') }, 1650);
                        }).catch((error) => {
                            Sentry.Native.captureException(error.message);
                            setTimeout(() => { this.props.navigation.navigate('Profile') }, 1650);
                        });
                    }
                }
            ]
        )
    }

    changeScreens = async () => {
        const firestore = getFirestore();
        const sessionDocRef = doc(firestore, 'sessions', this.state.code);

        if (this.state.zip !== null && this.state.zip !== "") {
            let zipCodePattern = /^\d{5}$|^\d{5}-\d{4}$/;

            if (zipCodePattern.test(this.state.zip)) {
                //updates the start field in the current session to true to send everyone to the swipe feature
                updateDoc(sessionDocRef, {
                    zip: this.state.zip,
                    start: true,
                    distance: this.state.distance,
                    categories: this.state.categories
                }).catch((error) => {
                    Sentry.Native.captureException(error.message);
                });

                //navigate to the swipe page manually
                this.props.navigation.navigate('Swipe Feature', {
                    code: this.state.code,
                    zip: this.state.zip,
                    distance: this.state.distance,
                    isHost: true,
                    categories: this.state.categories
                })
            } else {
                Alert.alert("Invalid ZipCode")
            }
        } else {
            await this.checkLocationPermissions();
            if (latitude !== null && longitude !== null) {
                //updates the start field in the current session to true to send everyone to the swipe feature
                updateDoc(sessionDocRef, {
                    latitude: latitude,
                    longitude: longitude,
                    start: true,
                    distance: this.state.distance,
                    categories: this.state.categories
                }).catch((error) => {
                    Sentry.Native.captureException(error.message);
                });

                //navigate to the swipe page manually
                this.props.navigation.navigate('Swipe Feature', {
                    code: this.state.code,
                    zip: null,
                    distance: this.state.distance,
                    isHost: true,
                    categories: this.state.categories,
                    latitude: latitude,
                    longitude: longitude
                })
            }
        }
    }

    onShare = async () => {
        try {
            const link = `out2eat://path/screen/Connect/${this.state.code}`;
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
        }
    };

    render() {
        return (
            <>
                {this.state.isExiting ?
                    <View style={[ProfileStyles.container, {backgroundColor: '#FFF'}]}>
                        <StrokeAnimation viewBox="0 75 400 400"/>
                    </View>
                    :
                    <View style={LobbyStyles.container}>
                        <Modal
                            animationType="slide"
                            visible={this.state.modalVisible}
                            transparent={true}
                            onRequestClose={() => {
                                this.setState({modalVisible: !this.state.modalVisible});
                            }}>
                            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={LobbyStyles.modalView}>
                                <Text style={CardStyle.modalText}>Choose your Filter!</Text>

                                <View style={{flexDirection: 'row'}}>
                                    <View style={{flexDirection: 'column', width: '50%'}}>
                                        <View style={LobbyStyles.modalSlider}>
                                            <Text style={{color:'#eee'}}>All Restaurants</Text>
                                            <Switch
                                                trackColor={{ false: '#767577', true: '#f97c4d' }}
                                                thumbColor={this.state.isMexican ? '#2E354E' : '#f4f3f4'}
                                                ios_backgroundColor="#3e3e3e"
                                                onValueChange={() => {
                                                    this.setState({isAfrican: false, isAmerican: false, isAsian: false, isCaribbean: false, isEuropean: false,
                                                        isItalian: false, isMexican: false, isMiddleEast: false, isSeafood: false, isVegan: false, isAll: !this.state.isAll})
                                                }}
                                                value={this.state.isAll}
                                            />
                                        </View>

                                        <View style={LobbyStyles.modalSlider}>
                                            <Text style={{color:'#eee'}}>American: </Text>
                                            <Switch
                                                trackColor={{ false: '#767577', true: '#f97c4d' }}
                                                thumbColor={this.state.isMexican ? '#2E354E' : '#f4f3f4'}
                                                ios_backgroundColor="#3e3e3e"
                                                onValueChange={() => {this.setState({isAmerican: !this.state.isAmerican, isAll: false})}}
                                                value={this.state.isAmerican}
                                            />
                                        </View>

                                        <View style={LobbyStyles.modalSlider}>
                                            <Text style={{color:'#eee'}}>African: </Text>
                                            <Switch
                                                trackColor={{ false: '#767577', true: '#f97c4d' }}
                                                thumbColor={this.state.isMexican ? '#2E354E' : '#f4f3f4'}
                                                ios_backgroundColor="#3e3e3e"
                                                onValueChange={() => {this.setState({isAfrican: !this.state.isAfrican, isAll: false})}}
                                                value={this.state.isAfrican}
                                            />
                                        </View>

                                        <View style={LobbyStyles.modalSlider}>
                                            <Text style={{color:'#eee'}}>Italian: </Text>
                                            <Switch
                                                trackColor={{ false: '#767577', true: '#f97c4d' }}
                                                thumbColor={this.state.isMexican ? '#2E354E' : '#f4f3f4'}
                                                ios_backgroundColor="#3e3e3e"
                                                onValueChange={() => {this.setState({isItalian: !this.state.isItalian, isAll: false})}}
                                                value={this.state.isItalian}
                                            />
                                        </View>

                                        <View style={LobbyStyles.modalSlider}>
                                            <Text style={{color:'#eee'}}>Caribbean: </Text>
                                            <Switch
                                                trackColor={{ false: '#767577', true: '#f97c4d' }}
                                                thumbColor={this.state.isMexican ? '#2E354E' : '#f4f3f4'}
                                                ios_backgroundColor="#3e3e3e"
                                                onValueChange={() => {this.setState({isCaribbean: !this.state.isCaribbean, isAll: false})}}
                                                value={this.state.isCaribbean}
                                            />
                                        </View>
                                    </View>
                                    <View style={{flexDirection: 'column', width: '50%'}}>
                                        <View style={LobbyStyles.modalSlider}>
                                            <Text style={{color:'#eee'}}>Asian: </Text>
                                            <Switch
                                                trackColor={{ false: '#767577', true: '#f97c4d' }}
                                                thumbColor={this.state.isMexican ? '#2E354E' : '#f4f3f4'}
                                                ios_backgroundColor="#3e3e3e"
                                                onValueChange={() => {this.setState({isAsian: !this.state.isAsian, isAll: false})}}
                                                value={this.state.isAsian}
                                            />
                                        </View>

                                        <View style={LobbyStyles.modalSlider}>
                                            <Text style={{color:'#eee'}}>European: </Text>
                                            <Switch
                                                trackColor={{ false: '#767577', true: '#f97c4d' }}
                                                thumbColor={this.state.isMexican ? '#2E354E' : '#f4f3f4'}
                                                ios_backgroundColor="#3e3e3e"
                                                onValueChange={() => {this.setState({isEuropean: !this.state.isEuropean, isAll: false})}}
                                                value={this.state.isEuropean}
                                            />
                                        </View>

                                        <View style={LobbyStyles.modalSlider}>
                                            <Text style={{color:'#eee'}}>Mexican: </Text>
                                            <Switch
                                                trackColor={{ false: '#767577', true: '#f97c4d' }}
                                                thumbColor={this.state.isMexican ? '#2E354E' : '#f4f3f4'}
                                                ios_backgroundColor="#3e3e3e"
                                                onValueChange={() => {this.setState({isMexican: !this.state.isMexican, isAll: false})}}
                                                value={this.state.isMexican}
                                            />
                                        </View>

                                        <View style={LobbyStyles.modalSlider}>
                                            <Text style={{color:'#eee'}}>Middle Eastern: </Text>
                                            <Switch
                                                trackColor={{ false: '#767577', true: '#f97c4d' }}
                                                thumbColor={this.state.isMexican ? '#2E354E' : '#f4f3f4'}
                                                ios_backgroundColor="#3e3e3e"
                                                onValueChange={() => {this.setState({isMiddleEast: !this.state.isMiddleEast, isAll: false})}}
                                                value={this.state.isMiddleEast}
                                            />
                                        </View>

                                        <View style={LobbyStyles.modalSlider}>
                                            <Text style={{color:'#eee'}}>Seafood/Sushi: </Text>
                                            <Switch
                                                trackColor={{ false: '#767577', true: '#f97c4d' }}
                                                thumbColor={this.state.isMexican ? '#2E354E' : '#f4f3f4'}
                                                ios_backgroundColor="#3e3e3e"
                                                onValueChange={() => {this.setState({isSeafood: !this.state.isSeafood, isAll: false})}}
                                                value={this.state.isSeafood}
                                            />
                                        </View>

                                        <View style={LobbyStyles.modalSlider}>
                                            <Text style={{color:'#eee'}}>Vegan: </Text>
                                            <Switch
                                                trackColor={{ false: '#767577', true: '#f97c4d' }}
                                                thumbColor={this.state.isMexican ? '#2E354E' : '#f4f3f4'}
                                                ios_backgroundColor="#3e3e3e"
                                                onValueChange={() => {this.setState({isVegan: !this.state.isVegan, isAll: false})}}
                                                value={this.state.isVegan}
                                            />
                                        </View>
                                    </View>
                                </View>

                                <Pressable style={LobbyStyles.filterButton}
                                           onPress={() => {
                                               if(this.state.isAll === true) {
                                                   this.state.categories = ['all']
                                                   this.setState({modalVisible: !this.state.modalVisible})
                                               } else if(this.state.isAll === false && this.state.isItalian === false && this.state.isAfrican === false &&
                                                   this.state.isAmerican === false && this.state.isAsian === false && this.state.isMiddleEast === false &&
                                                   this.state.isEuropean === false && this.state.isVegan === false && this.state.isCaribbean === false &&
                                                   this.state.isSeafood === false && this.state.isMexican === false) {
                                                   Alert.alert("Whoops!", "Must apply at least one filter!")
                                               } else {
                                                   this.state.categories = [];
                                                   if(this.state.isAmerican === true) {
                                                       this.state.categories.push('newamerican', 'tradamerican', 'bbq', 'breakfast_brunch', 'cafeteria', 'cajun', 'steak', 'newcanadian')
                                                   }

                                                   if(this.state.isAfrican === true) {
                                                       this.state.categories.push('african')
                                                   }

                                                   if(this.state.isAsian === true) {
                                                       this.state.categories.push('chinese', 'japanese', 'korean', 'singaporean', 'thai', 'vietnamese', 'taiwanese')
                                                   }

                                                   if(this.state.isCaribbean === true) {
                                                       this.state.categories.push('caribbean', 'cuban', 'dominican', 'puertorican', 'filipino')
                                                   }

                                                   if(this.state.isEuropean === true) {
                                                       this.state.categories.push('danish', 'french', 'belgian', 'british', 'german', 'greek', 'irish', 'polish')
                                                   }

                                                   if(this.state.isItalian === true) {
                                                       this.state.categories.push('italian', 'pizza', 'mediterranean')
                                                   }

                                                   if(this.state.isMexican === true) {
                                                       this.state.categories.push('mexican', 'newmexican', 'spanish', 'latin')
                                                   }

                                                   if(this.state.isMiddleEast === true) {
                                                       this.state.categories.push('mideastern', 'egyptian', 'pakistani', 'persian', 'afghani', 'indpak')
                                                   }

                                                   if(this.state.isSeafood === true) {
                                                       this.state.categories.push('seafood', 'sushi')
                                                   }

                                                   if(this.state.isVegan === true) {
                                                       this.state.categories.push('vegan', 'vegetarian')
                                                   }
                                                   this.setState({modalVisible: !this.state.modalVisible})
                                               }
                                           }}>
                                    <Text style={InputStyles.buttonText}>Apply Filters</Text>
                                </Pressable>
                                <Pressable style={LobbyStyles.filterButton}
                                           onPress={() => {
                                               this.setState({modalVisible: !this.state.modalVisible})
                                           }}>
                                    <Text style={InputStyles.buttonText}>Close Filters</Text>
                                </Pressable>
                            </KeyboardAvoidingView>
                        </Modal>
                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
                            <TextInput
                                onChangeText={(text) => {this.setState({zip: text})}}
                                value={this.state.zip}
                                placeholder="Enter Zipcode"
                                placeholderTextColor={"#000"}
                                style={this.state.isFocused ? InputStyles.focusZipInputStyle : InputStyles.zipInputStyle}
                                onFocus={()=>{this.setState({isFocused:true})}}
                                onBlur={()=>{this.setState({isFocused:false})}}
                                maxLength={5}
                                keyboardType={"number-pad"}
                            />
                            <TouchableOpacity style={{alignSelf:'flex-start'}} onPress={() => {this.setState({modalVisible: !this.state.modalVisible})}}>
                                <Ionicons name="filter-sharp" size={30} color="#2e344f" />
                            </TouchableOpacity>
                        </View>

                        {this.state.isLoading ?
                            <View style={{flex: 1, justifyContent: 'center'}}>
                                <ActivityIndicator size="large" color="#f97c4d"/>
                                <Text style={LobbyStyles.userName}>Loading...</Text>
                            </View>
                            :
                            <ScrollView>
                                {this.state.users.map(user=>{
                                    return(
                                        <View style={LobbyStyles.listContainer} key={user.id}>
                                            <Image
                                                source={user.photoURL === "assets_userplaceholder" ? {uri: Image.resolveAssetSource(userPhoto).uri} : {uri:user.photoURL}}
                                                style={LobbyStyles.image}
                                                loadingIndicatorSource={<ActivityIndicator size="large" color="#f97c4d"/>}
                                            />
                                            <Text style={LobbyStyles.userName}>{user.displayName}</Text>
                                        </View>
                                    )
                                })}
                            </ScrollView>
                        }
                        <View style={LobbyStyles.sliderContainer}>
                            <Text>Distance: {this.state.distance} mi</Text>
                            <Slider
                                value={this.state.distance}
                                useNativeDriver={true}
                                minimumValue={1}
                                maximumValue={20}
                                step={1}
                                onValueChange={value => this.setState({distance: value})}
                                minimumTrackTintColor='#f97c4d'
                                thumbTintColor='#f97c4d'
                            />
                        </View>

                        <Text style={{color:'#2e344f', fontSize:20, paddingBottom:10}}>Share Code</Text>

                        <View>
                            <TouchableOpacity onPress={this.onShare} style={LobbyStyles.shareCodeContainer}>
                                <Text style={LobbyStyles.shareCodeText}>{this.state.code}</Text>
                                <Ionicons style={IconStyles.iconShare} name="share-social-outline"/>
                            </TouchableOpacity>
                        </View>

                        <View style={{flexDirection:"row", justifyContent:"space-between", width:"100%"}}>
                            <TouchableOpacity onPress={()=>{this.endLobby()}} style={LobbyStyles.closeButton}>
                                <Ionicons style={IconStyles.iconLeft} name="close-circle-outline"/>
                                <Text style={InputStyles.buttonText}> Close</Text>
                            </TouchableOpacity>
                            <TouchableOpacity disabled={this.state.allowStart} onPress={() => {
                                Alert.alert(
                                    "Ready to Play?",
                                    "Is everyone in the lobby and ready to begin?",
                                    [
                                        {
                                            text: "Wait, go back!",
                                            onPress: () => {},
                                            style: "cancel"
                                        },
                                        {
                                            text: "Let's Eat!!",
                                            onPress: () => {
                                                console.log("hitting the start button");
                                                this.changeScreens()
                                            }
                                        }
                                    ],
                                    {cancelable: true}
                                )
                            }} style={LobbyStyles.buttons}>
                                <Ionicons style={IconStyles.iconLeft} name="play-circle-outline"/>
                                <Text style={InputStyles.buttonText}>Start</Text>
                                <Ionicons style={IconStyles.arrowRight} name="chevron-forward-outline"/>
                            </TouchableOpacity>
                        </View>
                    </View>
                }
            </>
        )
    }
}
