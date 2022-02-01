import React, {useEffect, useState} from 'react';
import {Image, Text, TouchableOpacity, TouchableOpacityComponent, View} from 'react-native';
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


       useEffect(()=>{
           firebase.firestore().collection('users').doc(user).get().then((doc)=>{
               setNewProfileUsername(doc.data().username)
               setNewProfilePicture(doc.data().photoURL)
           })
        },[isFocused])


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
            <TouchableOpacity style = {ProfileStyles.card} onPress={() => navigation.navigate('Edit Account')}>
                <View>
                   {newProfilePicture && <Image source={{ uri: newProfilePicture }}  style={IconStyles.profilePicture} />}
                </View>
                <View>
                    <Text style={InputStyles.userNameText}>
                        {newProfileUsername}
                    </Text>
                </View>
                <View style={ProfileStyles.editButton}>
                    <Ionicons style={IconStyles.editIcon} name="chevron-forward-outline"/>
                </View>
            </TouchableOpacity>
            {/*Button View*/}
            <View>
                    <TouchableOpacity onPress={() => navigation.navigate('HostSession')} style = {ProfileStyles.buttons}>
                        <Ionicons style={IconStyles.iconLeft} name="fast-food-outline"/>
                        <Text style={InputStyles.buttonText}>Create Lobby</Text>
                        <Ionicons style={IconStyles.arrowRight} name="chevron-forward-outline"/>
                    </TouchableOpacity>

                    <TouchableOpacity style={ProfileStyles.buttons} onPress={() => navigation.navigate('Connect')}>
                        <Ionicons style={IconStyles.iconLeft} name="people"/>
                        <Text style={InputStyles.buttonText}>Join Lobby</Text>
                        <Ionicons style={IconStyles.arrowRight} name="chevron-forward-outline"/>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={signOut} style = {ProfileStyles.buttons}>
                        <Ionicons style={IconStyles.iconLeft} name="log-out-outline"/>
                        <Text style={InputStyles.buttonText}>Logout</Text>
                        <Ionicons style={IconStyles.arrowRight} name="chevron-forward-outline"/>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={deleteAccount} style = {ProfileStyles.buttons}>
                        <Text style={InputStyles.buttonText}>delete</Text>
                    </TouchableOpacity>
                </View>
        </View>
    )
}
