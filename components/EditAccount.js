import React, {useEffect, useState} from 'react';
import {
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Image,
    Alert,
    KeyboardAvoidingView,
    Platform,
    BackHandler,
    LogBox, Linking
} from 'react-native';
import firebase from "../firebase";
import "firebase/firestore";
import {useNavigation} from '@react-navigation/native'
import * as ImagePicker from "expo-image-picker";
import {InputStyles,IconStyles} from "./InputStyles";
import { Ionicons } from '@expo/vector-icons';
LogBox.ignoreLogs(['Setting a timer']);
import * as WebBrowser from 'expo-web-browser';
export default function EditAccount(){
    const navigation = useNavigation()
    const currentUser = firebase.auth().currentUser
    const [newProfileUsername, setNewProfileUsername] = useState({displayName: currentUser.displayName})
    const [newProfilePicture, setNewProfilePicture] = useState({photoURL: currentUser.photoURL})
    const [result, setResult] = useState(null);

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true)
        return () => backHandler.remove()
    }, [])

    function userName() {
        //updates users displayName
        firebase.auth().currentUser.updateProfile({
            displayName:newProfileUsername.displayName
        }).then(()=>{
            //Then we update user profile picture
            firebase.auth().currentUser.updateProfile({
                photoURL:newProfilePicture.photoURL

            }).then(()=>{
                //then update the users firebase document and fields
                firebase.firestore().collection('users').doc(currentUser.uid).set({
                    username: newProfileUsername.displayName,
                    photoURL:newProfilePicture.photoURL
                },{merge:true})
            }).then(()=>{
                //Then we navigate back to Profile screen
                navigation.navigate('Profile')
            })
        }).catch(function(error) {
            //Catch any errors
            console.log(newProfilePicture.photoURL)
            console.log(error)
            alert(error)
        })
    }
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.cancelled) {
            //uploads the image to firebase storage
            uploadImage(result.uri, "profilePicture")
                .then(setTimeout(() => {
                    setNewProfilePicture({photoURL:result.uri})
                },100))
                .catch((error) => {
                    Alert.alert("Error: ", error)
                })
        }
    };

    const uploadImage = async (uri, imageName) => {
        const response = await fetch(uri);
        const blob = await response.blob();

        let ref = firebase.storage().ref().child(`${firebase.auth().currentUser.uid}/`+ imageName);
        return ref.put(blob)
    }
    const [isFocused, setIsFocused] = useState(false)
// handlers for onPress TextInput style change
    const handleInputFocus = () => {
        setIsFocused(true)
    }
    const handleInputBlur = () => {
        setIsFocused(false)
    }

    const handlePrivacyPolicy = async () => {
        let result = await WebBrowser.openBrowserAsync('https://out2eat.app/privacy-policy');
        setResult(result);
    };
    const handleToS = async () => {
        let result = await WebBrowser.openBrowserAsync('https://out2eat.app/terms-of-service');
        setResult(result);
    };
    return(
        <View  style={{
            flex:1,
            flexDirection: "column",
            justifyContent: "center",
            backgroundColor: '#fff'
        }}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{
                flex:.5,
                flexDirection: "column",
                justifyContent: "center",
                padding: '10%',
                backgroundColor: '#fff'
            }}>
                <View style={{ padding:15,alignItems: 'center', justifyContent: 'center' }}>
                    <TouchableOpacity style={IconStyles.iconContainer} onPress={pickImage}>
                        <Image source={{ uri: newProfilePicture.photoURL }} style={{width:150, height:150, borderRadius:250}} />
                        <Ionicons style={IconStyles.addProfilePic} name="camera-outline"/>
                    </TouchableOpacity>
                </View>
                <TextInput
                    style={isFocused ? InputStyles.focusInputStyle : InputStyles.inputStyle}
                    onFocus={() => handleInputFocus(true)}
                    onBlur={() => handleInputBlur(false)}
                    value={newProfileUsername.displayName}
                    onChangeText={(text)=>setNewProfileUsername({displayName:text})}
                />
                <TouchableOpacity style={InputStyles.updateButtons} onPress={userName}>
                    <Text style={{color:'#e4e6e9', fontSize:20}}>Update</Text>
                    <Ionicons style={IconStyles.editArrowRight} name="chevron-forward-outline"/>
                </TouchableOpacity>
            </KeyboardAvoidingView>
            <View style={{
                backgroundColor:'#fff',
                width:'100%',
                flex:.5,
                flexDirection: "column",
                justifyContent: "flex-start",
                marginTop:'10%'
            }}>
                <View style={{backgroundColor:'#2e344f', padding:'4%'}}>
                    <Text style={{fontSize:18, color:'#e4e6e9'}}>Documents</Text>
                </View>
                <View style={{
                    flexDirection:"column",
                    justifyContent:"space-between",
                    paddingLeft:'4%'
                }}>
                    <TouchableOpacity onPress={handlePrivacyPolicy}>
                        <Text style={{fontSize:18, paddingTop:'4%'}}>Privacy Policy <Ionicons style={{fontSize:16, alignItems:'center'}} name="chevron-forward-outline"/></Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleToS}>
                        <Text style={{fontSize:18, paddingTop:'4%'}}>Terms of Service <Ionicons style={{fontSize:16}} name="chevron-forward-outline"/></Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}
