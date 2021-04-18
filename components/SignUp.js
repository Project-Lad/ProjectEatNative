import React, { Component,useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Button,
    Alert,
    ActivityIndicator,
    Platform,
    Image,
} from 'react-native';
import firebase from "../firebase";
import "firebase/firestore";
import { useNavigation} from '@react-navigation/native'
import * as ImagePicker from 'expo-image-picker';

export default function Signup(){
    const navigation = useNavigation()
    const [userDisplayName, setUserDisplayName] = useState({displayName:''})
    const [userEmail, setUserEmail] = useState({email:''})
    const [userPassword, setUserPassword] = useState({password:''})
    const [isLoading, setLoading] = useState(false)
    const [isError, setError] = useState('')
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
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        if (!result.cancelled) {
            setImage({photoURL:result.uri});
        }
    };

    async function registerUser(){
        if (userEmail.email === '' && userPassword.password === '') {
            Alert.alert('Enter details to Sign Up!')
        } else {

            setLoading({
                isLoading: true,
            })
            await firebase.auth().createUserWithEmailAndPassword(userEmail.email, userPassword.password)
                .then((cred) => {
                    cred.user.updateProfile({
                        displayName: userDisplayName.displayName,
                        photoURL:image.photoURL
                    })
                    firebase.firestore().collection('users').doc(cred.user.uid).set({
                        username: userDisplayName.displayName,
                        email: userEmail.email
                    }).then(() => {
                       navigation.navigate('Profile')
                    })
                })
                .catch(error => setError({errorMessage: error.message}))
        }
    }
    if(isLoading){
        return(
            <View style={styles.preloader}>
                <ActivityIndicator size="large" color="#9E9E9E"/>
            </View>
        )
    }
    return(
        <View style={styles.container}>
            <View style={{  alignItems: 'center', justifyContent: 'center' }}>
                <Button title="Pick an image from camera roll" onPress={pickImage} />
                {image.photoURL && <Image source={{ uri: image.photoURL }} style={{ width: 200, height: 200 }} />}
            </View>
            <TextInput
                style={styles.inputStyle}
                placeholder="Username"
                onChangeText={(username)=>setUserDisplayName({displayName:username})}
                value={userDisplayName.displayName}
            />
            <TextInput
                style={styles.inputStyle}
                placeholder="Email"
                keyboardType={'email-address'}
                onChangeText={email => setUserEmail({email:email})}
                value={userEmail.email}
            />
            <TextInput
                style={styles.inputStyle}
                placeholder="Password"
                onChangeText={password => setUserPassword({password:password})}
                maxLength={15}
                secureTextEntry={true}
                value={userPassword.password}
            />
            <Button
                color="#e98477"
                title="Sign Up"
                onPress={registerUser}
            />
            <Text
                style={styles.loginText}
                onPress={() => navigation.navigate('Login')}>
                Already Registered? Click here to login
            </Text>
        </View>
    )
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
