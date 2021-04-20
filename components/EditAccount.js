import React, { useState } from 'react';
import {StyleSheet, Text, View, TextInput, Button, Alert, TouchableOpacity, Image} from 'react-native';
import firebase from "../firebase";
import "firebase/firestore";
import {useNavigation} from '@react-navigation/native'
import * as ImagePicker from "expo-image-picker";

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
    };
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });
        /*console.log(result);*/

        if (!result.cancelled) {
            setNewProfilePicture({photoURL:result.uri});
        }
    };
    return(
        <View style={styles.container}>
            <TextInput
                style={styles.inputStyle}
                value={newProfileUsername.displayName}
                onChangeText={(text)=>setNewProfileUsername({displayName:text})}
            />
            <View style={{ padding:15,alignItems: 'center', justifyContent: 'center' }}>
                <Image source={{ uri: newProfilePicture.photoURL }} style={{ width: 125, height: 125 }} />
                <Button title="Pick a new Profile Picture" onPress={pickImage} />
            </View>
            <Button
                color="#e98477"
                title="Update"
                onPress={userName}
            />
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
