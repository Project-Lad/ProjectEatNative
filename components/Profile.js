import React, {useEffect, useState} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import firebase from "../firebase";
import "firebase/firestore";
import {useIsFocused, useNavigation} from '@react-navigation/native'
import {InputStyles,IconStyles,ProfileStyles} from "./InputStyles";
import { Ionicons } from '@expo/vector-icons';


export default function Dashboard(){
    const user = firebase.auth().currentUser.uid
    const [newProfileUsername, setNewProfileUsername] = useState()
    const [newProfilePicture, setNewProfilePicture] = useState()
    const navigation = useNavigation()
    const isFocused = useIsFocused();

    function userInformation(){
        firebase.firestore().collection('users').doc(user).get().then((doc)=>{
            setNewProfileUsername(doc.data().username)
            setNewProfilePicture(doc.data().photoURL)
        })
    }
       useEffect(()=>{
           userInformation()
        },[isFocused])

    /*console.log(user.displayName)*/
    //console.log(user)
    //console.log(newProfilePicture)

    async function signOut(){
        await firebase.auth().signOut()
    }
    async function deleteAccount(){
        await firebase.auth().currentUser.delete()
        await firebase.firestore().collection('users').doc(user).delete()
    }
    return(
        <View style={ProfileStyles.container}>
            {/*Profile Card View*/}
            <View style = {ProfileStyles.card}>
                <View>
                   {newProfilePicture && <Image source={{ uri: newProfilePicture }}  style={IconStyles.profilePicture} />}
                </View>
                <View style={{paddingTop:10}}>
                    <Text style={InputStyles.buttonText}>
                        {newProfileUsername}
                    </Text>
                </View>
                <TouchableOpacity
                    style={ProfileStyles.editButton}
                    onPress={() => navigation.navigate('Edit Account')}>
                    <Ionicons style={IconStyles.iconLeft} name="create-outline"/>
                </TouchableOpacity>
            </View>

            {/*Button View*/}
            <View styles={InputStyles.container}>
                <TouchableOpacity onPress={() => navigation.navigate('HostSession')} style = {InputStyles.buttons}>
                    <Ionicons style={IconStyles.iconLeft} name="fast-food-outline"/>
                    <Text style={InputStyles.buttonText}>Create Lobby</Text>
                    <Ionicons style={IconStyles.arrowRight} name="chevron-forward-outline"/>
                </TouchableOpacity>

{/*                <TouchableOpacity
                    onPress={() => navigation.navigate('Friends List')}
                    style = {styles.buttonStyle}
                >
                    <Text style={styles.textButton}>Friends List</Text>
                </TouchableOpacity>*/}

                <TouchableOpacity style={InputStyles.buttons} onPress={() => navigation.navigate('Connect')}>
                    <Ionicons style={IconStyles.iconLeft} name="people"/>
                    <Text style={InputStyles.buttonText}>Join Lobby</Text>
                    <Ionicons style={IconStyles.arrowRight} name="chevron-forward-outline"/>
                </TouchableOpacity>

                <TouchableOpacity onPress={signOut} style = {InputStyles.buttons}>
                    <Ionicons style={IconStyles.iconLeft} name="log-out-outline"/>
                    <Text style={InputStyles.buttonText}>Logout</Text>
                    <Ionicons style={IconStyles.arrowRight} name="chevron-forward-outline"/>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={deleteAccount}
                    style = {InputStyles.buttons}
                >
                    <Text style={InputStyles.buttonText}>delete</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}
