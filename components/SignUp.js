import React, { useState, useEffect } from 'react';
import {
    Text,
    View,
    TextInput,
    Alert,
    ActivityIndicator,
    Platform,
    Image, TouchableOpacity,
} from 'react-native';
import firebase from "../firebase";
import "firebase/firestore";
import { useNavigation} from '@react-navigation/native'
import * as ImagePicker from 'expo-image-picker';
import {InputStyles,IconStyles} from "./InputStyles";
import { Ionicons } from '@expo/vector-icons';
import userPhoto from '../assets/user-placeholder.png'

export default function Signup(){
    const navigation = useNavigation()
    const [userDisplayName, setUserDisplayName] = useState()
    const [userEmail, setUserEmail] = useState({email:''})
    const [userPassword, setUserPassword] = useState({password:''})
    const [isLoading, setLoading] = useState(false)

    const DEFAULT_IMAGE = Image.resolveAssetSource(userPhoto).uri;
    const [image, setImage] = useState({photoURL:DEFAULT_IMAGE});

    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    alert('Sorry, we need camera roll permissions to make this work!');
                }
            }
        })();
    }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        console.log(result);

        if (!result.cancelled) {
            setImage({photoURL:result.uri});
        }
    };

    const uploadImage = async (uri, imageName) => {
        const response = await fetch(uri);
        const blob = await response.blob();

        let ref = firebase.storage().ref().child(`${firebase.auth().currentUser.uid}/`+ imageName);
        return ref.put(blob)
    }

    async function registerUser(){
        if (userEmail.email === '' || userPassword.password === '' || userDisplayName === '') {
            Alert.alert('Fill in all fields', 'One of the fields have been left empty')
        }else if(userPassword.password.length < 8){
            alert('Password not long enough')
        }else{
            setLoading({
                isLoading: true,
            })
            await firebase.auth().createUserWithEmailAndPassword(userEmail.email, userPassword.password)
                .then((cred) => {
                    //then callback with user info
                    cred.user.updateProfile({
                        displayName: userDisplayName,
                        photoURL:image.photoURL
                    }).then(()=>{
                        //then store user info in firestore
                        firebase.firestore().collection('users').doc(cred.user.uid).set({
                            username: userDisplayName,
                            email: userEmail.email,
                            photoURL:image.photoURL
                        }).then(() => {
                            //upload image to firebase storage
                            uploadImage(image.photoURL, "profilePicture")
                                .then(() => {
                                    console.log("Success")
                                })
                                .catch((error) => {
                                    console.log("Error: ", error)
                                })
                        }).then(()=>{
                            navigation.navigate('Profile')
                        })
                    })
                }).catch(error => {
                    if(error.message === 'The email address is already in use by another account.'){
                        Alert.alert('Email Exists', 'This email already exists',
                            [{text: 'Try Again', onPress:() => navigation.navigate('Login')}]
                        )
                    }else{
                        Alert.alert('Email Invalid', 'Your email is invalid please enter it again',
                            [{text: 'Try Again', onPress:() => navigation.goBack()}]
                        )
                    }
                    console.log(error.message)
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
        <View style={InputStyles.container}>
            <View style={{  alignItems: 'center', justifyContent: 'center' }}>
                <TouchableOpacity style={IconStyles.iconContainer} onPress={pickImage}>
                    {image.photoURL === '../assets/user-placeholder.png' ?
                        <Image source={ require('../assets/user-placeholder.png') }
                               style={IconStyles.profilePicture}
                               resizeMode='contain'/>
                        :
                        <Image source={{ uri: image.photoURL }} style={IconStyles.profilePicture} />}
                    <Ionicons style={IconStyles.addProfilePic} name="person-add-outline"/>
                </TouchableOpacity>
            </View>
            <TextInput
                style={InputStyles.inputStyle}
                placeholder="Username"
                onChangeText={(username)=>setUserDisplayName(username.trim())}
                value={userDisplayName}
            />
            <TextInput
                style={InputStyles.inputStyle}
                placeholder="Email"
                keyboardType={'email-address'}
                onChangeText={email => setUserEmail({email:email.trim()})}
                value={userEmail.email.trim()}
            />
            <TextInput
                style={InputStyles.inputStyle}
                placeholder="Password"
                onChangeText={password => setUserPassword({password:password})}
                maxLength={15}
                secureTextEntry={true}
                value={userPassword.password}
            />
            <TouchableOpacity style={InputStyles.buttons} onPress={registerUser}>
                <Text style={InputStyles.buttonText}>Sign Up</Text>
                <Ionicons style={IconStyles.arrowRight} name="chevron-forward-outline"/>
            </TouchableOpacity>
            <Text
                style={InputStyles.loginText}
                onPress={() => navigation.navigate('Login')}>
                Already Registered? Login
            </Text>
        </View>
    )
}
