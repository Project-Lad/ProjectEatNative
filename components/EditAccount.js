import React, { useState } from 'react';
import {Text, View, TextInput, TouchableOpacity, Image} from 'react-native';
import firebase from "../firebase";
import "firebase/firestore";
import {useNavigation} from '@react-navigation/native'
import * as ImagePicker from "expo-image-picker";
import {InputStyles,IconStyles} from "./InputStyles";
import { Ionicons } from '@expo/vector-icons';

export default function EditAccount(){
    const navigation = useNavigation()
    const currentUser = firebase.auth().currentUser
    const [newProfileUsername, setNewProfileUsername] = useState({displayName: currentUser.displayName})
    const [newProfilePicture, setNewProfilePicture] = useState({photoURL: currentUser.photoURL})


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
                .then(() => {
                    setNewProfilePicture({photoURL:result.uri})
                })
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

    return(
        <View style={InputStyles.container}>
            <View style={{ padding:15,alignItems: 'center', justifyContent: 'center' }}>
                <TouchableOpacity style={IconStyles.iconContainer} onPress={pickImage}>
                    <Image source={{ uri: newProfilePicture.photoURL }} style={IconStyles.profilePicture} />
                    <Ionicons style={IconStyles.addProfilePic} name="camera-outline"/>
                </TouchableOpacity>
            </View>
            <TextInput
                style={InputStyles.inputStyle}
                value={newProfileUsername.displayName}
                onChangeText={(text)=>setNewProfileUsername({displayName:text})}
            />
            <TouchableOpacity style={InputStyles.buttons} onPress={userName}>
                <Text style={InputStyles.buttonText}>Update</Text>
                <Ionicons style={IconStyles.arrowRight} name="chevron-forward-outline"/>
            </TouchableOpacity>
        </View>
    )
}
