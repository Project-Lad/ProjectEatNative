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
    LogBox
} from 'react-native';
import firebase from "../firebase";
import "firebase/firestore";
import {useNavigation} from '@react-navigation/native'
import * as ImagePicker from "expo-image-picker";
import * as Sentry from "sentry-expo";
import {InputStyles, IconStyles, ProfileStyles} from "./InputStyles";
import { Ionicons } from '@expo/vector-icons';
LogBox.ignoreLogs(['Setting a timer']);
import * as WebBrowser from 'expo-web-browser';
export default function EditAccount(){
    const navigation = useNavigation()
    const currentUser = firebase.auth().currentUser
    const [newProfileUsername, setNewProfileUsername] = useState({displayName: currentUser.displayName})
    const [newProfilePicture, setNewProfilePicture] = useState({photoURL:null})
    const [result, setResult] = useState(null);
    const [updateDisable, setUpdateDisable] = useState(true)

    useEffect(() => {
        firebase.storage().ref().child(`${firebase.auth().currentUser.uid}/profilePicture`).getDownloadURL().then((url)=>{
            setNewProfilePicture({photoURL:url})
        })
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
            alert(error)
            Sentry.Native.captureException(error.message);
        })
    }
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

            if (!result.cancelled) {
                //uploads the image to firebase storage
                uploadImage(result.uri, "profilePicture")
                    .then(setTimeout(() => {
                        setNewProfilePicture({photoURL:result.uri})
                        setUpdateDisable(false)
                    },100))
                    .catch((error) => {
                        Alert.alert("Error: ", error)
                        Sentry.Native.captureException(error.message);
                    })
            }
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
    async function signOut(){
        await firebase.auth().signOut()
    }
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
                        <View style={ProfileStyles.editCameraContainer}>
                            <Ionicons style={IconStyles.addProfilePic} name="camera-outline"/>
                        </View>
                    </TouchableOpacity>
                </View>
                <TextInput
                    style={isFocused ? InputStyles.focusInputStyle : InputStyles.inputStyle}
                    onFocus={() => handleInputFocus(true)}
                    onBlur={() => handleInputBlur(false)}
                    value={newProfileUsername.displayName}
                    onChangeText={(text)=>{
                        setNewProfileUsername({displayName:text})
                        if(currentUser.displayName !== text){
                            setUpdateDisable(false)
                        }else{
                            setUpdateDisable(true)
                        }
                    }}
                />
                <TouchableOpacity style={updateDisable ? InputStyles.disabledUpdateButtons: InputStyles.updateButtons} disabled={updateDisable} onPress={userName} >
                    <Text style={updateDisable ? InputStyles.disabledButtonText: InputStyles.buttonText}>Update</Text>
                    <Ionicons style={updateDisable ? IconStyles.disabledEditArrowRight: IconStyles.editArrowRight} name="chevron-forward-outline"/>
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
                    <TouchableOpacity onPress={handlePrivacyPolicy} style = {{flexDirection:"row",paddingTop:'4%', justifyContent:"flex-start"}}>
                        <Ionicons style={{fontSize:20, alignContent:"center"}} name="document-text-outline"/>
                        <Text style={{fontSize:18, paddingLeft:"2%", paddingRight:"2%"}}>Privacy Policy </Text>
                        <Ionicons style={{fontSize:16, alignSelf:"center"}} name="chevron-forward-outline"/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleToS} style = {{flexDirection:"row",paddingTop:'4%', justifyContent:"flex-start"}}>
                        <Ionicons style={{fontSize:20, alignContent:"center"}} name="document-text-outline"/>
                        <Text style={{fontSize:18, paddingLeft:"2%", paddingRight:"2%"}}>Terms of Service </Text>
                        <Ionicons style={{fontSize:16, alignSelf:"center"}} name="chevron-forward-outline"/>
                    </TouchableOpacity>
                </View>
                <View style={ProfileStyles.container}>
                    <TouchableOpacity onPress={signOut} style = {ProfileStyles.buttons}>
                        <Ionicons style={IconStyles.iconLeft} name="log-out-outline"/>
                        <Text style={InputStyles.buttonText}>Logout</Text>
                        <Ionicons style={IconStyles.arrowRight} name="chevron-forward-outline"/>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}
