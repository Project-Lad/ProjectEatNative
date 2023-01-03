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
import firebase from "../firebase";
import "firebase/firestore";
import {InputStyles, IconStyles, LobbyStyles, CardStyle, ProfileStyles} from "./InputStyles";
import { Ionicons } from '@expo/vector-icons';
import * as Location from "expo-location";
import * as Sentry from "sentry-expo";
import preloaderLines from "./AnimatedSVG";
import {AnimatedSVGPaths} from "react-native-svg-animations";
LogBox.ignoreLogs(['Setting a timer']);

//Declares lat and long vars
let latitude;
let longitude;

(async () => {
    let location;
    let locationSuccess = false;
    let count = 0;
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status === 'denied') {
        Alert.alert('Please enable Location Services in your Settings');
    } else {
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
    }

    latitude = location.coords.latitude;
    longitude = location.coords.longitude;
})();

export default class HostSession extends Component {
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    handleBackButton() {
        return true;
    }

    state = {
        isLoading: true,
        isExiting: false,
        isFocused: false,
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
        isVegan: false
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

        let displayName = firebase.auth().currentUser.displayName

        //retrieve image
        firebase.storage().ref().child(`${firebase.auth().currentUser.uid}/profilePicture`).getDownloadURL()
            .then((url) => {
                //creates session using the newly generated code
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
                })
            })
            .catch((error) => {
                Sentry.Native.captureException(error.message);
            })

        this.checkForUsers()
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
        let result;

        sessionsRef.get()
            .then((docSnapshot) => {
                if (docSnapshot.exists) {
                    result = 0
                } else {
                    result = 1
                }
            })

        return result;
    }

    checkForUsers = () => {
        const usersRef = firebase.firestore().collection('sessions').doc(this.state.code).collection('users')
        let usersLocal = [];

        //creates an observer to watch for new documents that may appear
        usersRef.onSnapshot(querySnapshot => {
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
                        this.setState({isExiting: true})

                        firebase.firestore()
                            .collection('sessions').doc(this.state.code)
                            .collection('users').get().then(snapshot => {
                                snapshot.forEach(doc => {
                                    firebase.firestore()
                                        .collection('sessions').doc(this.state.code)
                                        .collection('users').doc(doc.id).delete().then(() => {})
                                        .catch((error) => {
                                            Sentry.Native.captureException(error.message);
                                        })
                                })
                        })

                        //delete the firebase document
                        firebase.firestore().collection('sessions').doc(this.state.code).delete()
                            .then(() => {setTimeout(() => {this.props.navigation.navigate('Profile')}, 1650)})
                            .catch((error) => {
                                Sentry.Native.captureException(error.message);
                                setTimeout(() => {this.props.navigation.navigate('Profile')}, 1650)
                            })
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
                    .doc(this.state.code).update({zip: this.state.zip, start: true, distance: this.state.distance, categories: this.state.categories})
                    .then(() => {})
                    .catch((error) => {
                        Sentry.Native.captureException(error.message);
                })

                //navigate to the swipe page manually
                this.props.navigation.navigate('Swipe Feature', {code: this.state.code, zip: this.state.zip, distance: this.state.distance, isHost:true, categories: this.state.categories})
            } else {
                Alert.alert("Invalid ZipCode")
            }
        } else {
            //updates the start field in the current session to true to send everyone to the swipe feature
            firebase.firestore().collection('sessions')
                .doc(this.state.code).update({start: true, distance: this.state.distance, categories: this.state.categories})
                .then(() => {})
                .catch((error) => {
                    Sentry.Native.captureException(error.message);
                })

            //navigate to the swipe page manually
            this.props.navigation.navigate('Swipe Feature', {code: this.state.code, zip: null, distance: this.state.distance, isHost:true, categories: this.state.categories, latitude: latitude, longitude: longitude})
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
        return (
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
                                                source={{uri:user.photoURL}}
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
                            <TouchableOpacity onPress={() => {
                                Alert.alert(
                                    "Ready to Play?",
                                    "Is everyone in the lobby and ready to begin?",
                                    [
                                        {
                                            text: "Wait, go back!",
                                            onPress: () => {},
                                            style: "cancel"
                                        },
                                        { text: "Let's Eat!!", onPress: () => {this.changeScreens()} }
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
