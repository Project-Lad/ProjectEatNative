import React, { useState, useEffect } from 'react';
import {
    Text,
    View,
    TextInput,
    Alert,
    ActivityIndicator,
    Platform,
    Image, TouchableOpacity,
    KeyboardAvoidingView, LogBox
} from 'react-native';

import {getAuth, createUserWithEmailAndPassword, updateProfile} from "firebase/auth";
import { useNavigation} from '@react-navigation/native'
import {CheckBox} from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import {InputStyles, IconStyles, ProfileStyles} from "./InputStyles";
import { Ionicons } from '@expo/vector-icons';
import userPhoto from '../assets/user-placeholder.png'
import * as WebBrowser from 'expo-web-browser';
import * as Sentry from "@sentry/react-native";
LogBox.ignoreLogs(['Setting a timer']);
import { getStorage, ref,uploadBytes } from "firebase/storage";
import { collection, doc, setDoc,getFirestore } from "firebase/firestore";
export default function Signup(){
    const navigation = useNavigation()
    const [userDisplayName, setUserDisplayName] = useState()
    const [userEmail, setUserEmail] = useState({email:''})
    const [userPassword, setUserPassword] = useState({password:''})
    const [retypedPassword, setRetypedPassword] = useState({password:''})
    const [isLoading, setLoading] = useState(false)
    const [isFocused, setFocused] = useState({
        username:false,
        email:false,
        password:false,
        retypedPassword:false
    })
    const [toggleCheckbox, setToggleCheckbox] = useState(false);
    const [result, setResult] = useState(null);

    const DEFAULT_IMAGE = Image.resolveAssetSource(userPhoto).uri;
    const [image, setImage] = useState({photoURL:DEFAULT_IMAGE});

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry! We need permission to change your profile picture!');
        } else {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.5,
            });

            if (!result.canceled) {
                setImage({photoURL:result.assets[0].uri});
            }
        }
    };

    const uploadImage = async (uri, imageName) => {
        const response = await fetch(uri);
        const storage = getStorage();
        const auth = getAuth();
        const blob = await response.blob();

        const userProfilePic = ref(storage, `${auth.currentUser.uid}/`+ imageName);
        uploadBytes(userProfilePic, blob).then((snapshot) => {

        });
        return ref.put(blob)
    }

    const handlePrivacyPolicy = async () => {
        let result = await WebBrowser.openBrowserAsync('https://out2eat.app/privacy-policy');
        setResult(result);
    };
    const handleToS = async () => {
        let result = await WebBrowser.openBrowserAsync('https://out2eat.app/terms-of-service');
        setResult(result);
    };

    async function registerUser(){
        if(toggleCheckbox === false) {
            Alert.alert('Terms of Service and Privacy Policy', 'You must accept the Terms of Service and Privacy Policy before registering.')
        }else if (userEmail.email === '' || userPassword.password === '' || userDisplayName === '') {
            Alert.alert('Fill in all fields', 'One of the fields have been left empty')
        }else if(userPassword.password.length < 8) {
            Alert.alert('Password Length', 'Password does not meet minimum required length of 8 characters')
        }else if(userPassword.password !== retypedPassword.password) {
            Alert.alert('Password Mismatch', 'Password entered does not match original password')
        }else if( /^[^!-\/:-@\[-`{-~]+$/.test(userPassword.password)){
            Alert.alert('Password Invalid', 'Password must contain a special characters: ( ^ [ ! \ / : @ \ } ` { - ~ ] + $ )')
        }else {
            setLoading({
                isLoading: true,
            })
            const auth = getAuth();
            const firestore = getFirestore();
            await createUserWithEmailAndPassword(auth, userEmail.email, userPassword.password)
                .then((cred) => {
                    //then callback with user info
                    updateProfile(cred.user, {
                        displayName: userDisplayName,
                        photoURL: image.photoURL
                    }).then(() => {
                        const userDocRef = doc(firestore, "users", cred.user.uid);
                        setDoc(
                            userDocRef,
                            {
                                username: userDisplayName,
                                email: userEmail.email,
                                photoURL: image.photoURL
                            },
                            {merge: true}
                        ).then(() => {
                            //upload image to firebase storage
                            uploadImage(image.photoURL, "profilePicture")
                                .then(() => {
                                })
                                .catch((error) => {
                                    Sentry.captureException(error.message);
                                })
                        }).then(() => {
                            navigation.navigate('Profile')
                        }).catch(error => {
                            if (error.message === 'The email address is already in use by another account.') {
                                Alert.alert('Email Exists', 'This email already exists',
                                    [{text: 'Try Again', onPress: () => navigation.navigate('Login')}]
                                )
                            } else {
                                Sentry.captureException(error.message);
                                Alert.alert('Email Invalid', 'Your email is invalid please enter it again',
                                    [{text: 'Try Again', onPress: () => navigation.goBack()}]
                                )
                            }
                        })
                    })
                })
        }
    }
    if(isLoading){
        return(
            <View style={InputStyles.preloader}>
                <ActivityIndicator size="large" color="#9E9E9E"/>
            </View>
        )
    }
    return(
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={InputStyles.container}>
            <View style={{  alignItems: 'center', justifyContent: 'center' }}>
                <TouchableOpacity style={IconStyles.iconContainer} onPress={pickImage}>
                    {image.photoURL === '../assets/user-placeholder.png' ?
                        <Image source={ require('../assets/user-placeholder.png') }
                               style={IconStyles.profilePicture}
                               resizeMode='contain'/>
                        :
                        <Image source={{ uri: image.photoURL }} style={IconStyles.signUpPicture} />}
                    <View style={ProfileStyles.editCameraContainer}>
                        <Ionicons style={IconStyles.addProfilePic} name="person-add-outline"/>
                    </View>
                </TouchableOpacity>
            </View>
            <TextInput
                style={isFocused.username ? InputStyles.focusInputStyle : InputStyles.inputStyle}
                placeholder="Username"
                onChangeText={(username)=>setUserDisplayName(username.trim())}
                value={userDisplayName}
                onFocus={() => setFocused({username: true, email: false, password: false, retypedPassword: false})}
                onBlur={() => setFocused({username: false, email: false, password: false, retypedPassword: false})}
                placeholderTextColor={"#000"}
                maxLength={15}
            />
            <TextInput
                style={isFocused.email ? InputStyles.focusInputStyle : InputStyles.inputStyle}
                placeholder="Email"
                keyboardType={'email-address'}
                onChangeText={email => setUserEmail({email:email.trim()})}
                value={userEmail.email.trim()}
                autoComplete='email'
                autoCapitalize={'none'}
                onFocus={() => setFocused({username: false, email: true, password: false, retypedPassword: false})}
                onBlur={() => setFocused({username: false, email: false, password: false, retypedPassword: false})}
                placeholderTextColor={"#000"}
            />
            <TextInput
                style={isFocused.password ? InputStyles.focusInputStyle : InputStyles.inputStyle}
                placeholder="Password"
                onChangeText={password => setUserPassword({password:password})}
                maxLength={200}
                secureTextEntry={true}
                value={userPassword.password}
                onFocus={() => setFocused({username: false, email: false, password: true, retypedPassword: false})}
                onBlur={() => setFocused({username: false, email: false, password: false, retypedPassword: false})}
                placeholderTextColor={"#000"}
            />
            <TextInput
                style={isFocused.retypedPassword ? InputStyles.focusInputStyle : InputStyles.inputStyle}
                placeholder="Re-type Password"
                onChangeText={password => setRetypedPassword({password:password})}
                maxLength={200}
                secureTextEntry={true}
                value={retypedPassword.password}
                onFocus={() => setFocused({username: false, email: false, password: false, retypedPassword: true})}
                onBlur={() => setFocused({username: false, email: false, password: false, retypedPassword: false})}
                placeholderTextColor={"#000"}
            />

            <View style={{flexDirection: 'row', alignItems:'center', paddingBottom: '3%'}}>
                <CheckBox
                    containerStyle={{margin: 0, padding: 0}}
                    checked={toggleCheckbox}
                    onPress={() => {
                        setToggleCheckbox(!toggleCheckbox)
                    }}
                />

                <Text style={{fontSize: 12}}>
                    I agree to the <Text style={{color: 'blue'}} onPress={handleToS}>Terms of Service</Text> and the <Text style={{color: 'blue'}} onPress={handlePrivacyPolicy}>Privacy Policy</Text>
                </Text>
            </View>

            <TouchableOpacity style={InputStyles.buttons} onPress={registerUser}>
                <Text style={InputStyles.buttonText}>Sign Up</Text>
                <Ionicons style={IconStyles.arrowRight} name="chevron-forward-outline"/>
            </TouchableOpacity>
            <Text
                style={InputStyles.loginText}
                onPress={() => navigation.navigate('Login')}>
                Already Registered? Login
            </Text>
        </KeyboardAvoidingView>
    )
}
