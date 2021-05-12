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

export default function Signup(){
    const navigation = useNavigation()
    const [userDisplayName, setUserDisplayName] = useState()
    const [userEmail, setUserEmail] = useState({email:''})
    const [userPassword, setUserPassword] = useState({password:''})
    const [isLoading, setLoading] = useState(false)
    const [image, setImage] = useState({photoURL:null});

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
            Alert.alert('Fill in all fields')
        } else {
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
                {image.photoURL && <Image source={{ uri: image.photoURL }} style={IconStyles.profilePicture} />}
                <TouchableOpacity style={IconStyles.iconContainer} onPress={pickImage}>
                    <Ionicons style={IconStyles.addProfilePic} name="person-add-outline"/>
                </TouchableOpacity>
            </View>
            <TextInput
                style={InputStyles.inputStyle}
                placeholder="Username"
                onChangeText={(username)=>setUserDisplayName(username)}
                value={userDisplayName}
            />
            <TextInput
                style={InputStyles.inputStyle}
                placeholder="Email"
                keyboardType={'email-address'}
                onChangeText={email => setUserEmail({email:email})}
                value={userEmail.email}
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