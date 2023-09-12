import React, {useEffect, useState} from 'react';
import {Image, Text, TouchableOpacity, LogBox, View, ActivityIndicator} from 'react-native';
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { doc, getDoc } from "firebase/firestore";
import {useIsFocused, useNavigation} from '@react-navigation/native'
import {InputStyles,IconStyles,ProfileStyles} from "./InputStyles";
import { Ionicons } from '@expo/vector-icons';
import SVGComponent from "./SVGLogo";
import * as Sentry from "sentry-expo";
import {StrokeAnimation} from "./AnimatedSVG";
import userPhoto from "../assets/user-placeholder.png";
import {getAuth} from "firebase/auth";
import { getFirestore } from 'firebase/firestore'
LogBox.ignoreLogs(['Setting a timer']);

export default function Dashboard(){
    const [newProfileUsername, setNewProfileUsername] = useState()
    const [newProfilePicture, setNewProfilePicture] = useState(null)
    const [isLoading, setIsLoading] = useState(true);
    const [isPicLoading, setPicLoading] = useState(true);
    const navigation = useNavigation()
    const isFocused = useIsFocused();
    try {
        useEffect(() => {
            const auth = getAuth().currentUser.uid;
            const storage = getStorage();
            getDoc(doc(getFirestore(), "users", auth)).then(doc  =>{
                setNewProfileUsername(doc.data().username)

                if(doc.data().photoURL !== "assets_userplaceholder"){
                    const profilePictureRef = ref(storage, `${auth}/profilePicture`);
                    getDownloadURL(profilePictureRef).then((url) => {
                        setNewProfilePicture(url);
                        setPicLoading(false);
                    }).catch((error) => {
                        Sentry.Native.captureException(error.message);
                        setNewProfilePicture(doc.data().photoURL);
                    });
                }
            })

            setTimeout(() => {setIsLoading(false)}, 1650)
        }, [isFocused])
    } catch (error) {
        Sentry.Native.captureException(error.message);
    }

    return(
        <>
            {isLoading ?
                <View style={[ProfileStyles.container, {backgroundColor: '#FFF'}]}>
                    <StrokeAnimation viewBox="0 0 400 400"/>
                </View>
                :
                <View style={ProfileStyles.container}>
                    {/*Profile Card View*/}
                    <View style={ProfileStyles.card}>
                        <View style={{flexDirection: "row", alignItems: "center", justifyContent:'space-between', position:"absolute", width:'100%'}}>
                            <TouchableOpacity onPress={() => navigation.navigate('EditAccount')}>
                                {isPicLoading ?(
                                    <ActivityIndicator size="large" color="#333"/>
                                ):(
                                    <Image source={{ uri: newProfilePicture }}  style={IconStyles.profilePicture} />
                                )}
                                <View style={ProfileStyles.profilePenContainer}>
                                    <Ionicons style={ProfileStyles.profilePen} name="settings-outline"/>
                                </View>
                            </TouchableOpacity>
                            <Text style={InputStyles.userNameText}>
                                {newProfileUsername}
                            </Text>
                        </View>
                    </View>

                    <View style={{justifyContent:'space-evenly', padding:'10%'}}>
                        <SVGComponent/>
                    </View>
                    {/*Button View*/}
                    <View style={{flexDirection:"column", justifyContent:"space-between", width:"100%"}}>
                        <TouchableOpacity onPress={() => navigation.navigate('HostSession')} style={ProfileStyles.buttons}>
                            <Ionicons style={IconStyles.iconLeft} name="fast-food-outline"/>
                            <Text style={InputStyles.buttonText}>Create Lobby</Text>
                            <Ionicons style={IconStyles.arrowRight} name="chevron-forward-outline"/>
                        </TouchableOpacity>

                        <TouchableOpacity style={ProfileStyles.buttons} onPress={() => navigation.navigate('Connect')}>
                            <Ionicons style={IconStyles.iconLeft} name="people"/>
                            <Text style={InputStyles.buttonText}>Join Lobby</Text>
                            <Ionicons style={IconStyles.arrowRight} name="chevron-forward-outline"/>
                        </TouchableOpacity>
                    </View>
                </View>
            }
        </>
    )
}
