import React, {useEffect, useState} from 'react';
import {Image, Text, TouchableOpacity, LogBox, View} from 'react-native';
import firebase from "../firebase";
import "firebase/firestore";
import {useIsFocused, useNavigation} from '@react-navigation/native'
import {InputStyles,IconStyles,ProfileStyles} from "./InputStyles";
import { Ionicons } from '@expo/vector-icons';
import SVGComponent from "./SVGLogo";
import * as Sentry from "sentry-expo";
import { AnimatedSVGPaths } from "react-native-svg-animations";
import preloaderLines from "./AnimatedSVG";
import userPhoto from "../assets/user-placeholder.png";
LogBox.ignoreLogs(['Setting a timer']);

export default function Dashboard(){
    const user = firebase.auth().currentUser.uid
    const [newProfileUsername, setNewProfileUsername] = useState()
    const [newProfilePicture, setNewProfilePicture] = useState()
    const [isLoading, setIsLoading] = useState(true);
    const navigation = useNavigation()
    const isFocused = useIsFocused();
    try {
        useEffect(() => {
            firebase.firestore().collection('users').doc(user).get().then((doc) => {
                setNewProfileUsername(doc.data().username)

                if(doc.data().photoURL !== "assets_userplaceholder") {
                    firebase.storage().ref().child(`${firebase.auth().currentUser.uid}/profilePicture`).getDownloadURL().then((url)=>{
                        setNewProfilePicture(url)
                    })
                } else {
                    setNewProfilePicture(Image.resolveAssetSource(userPhoto).uri)
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
                    <AnimatedSVGPaths
                        strokeColor={"black"}
                        duration={1500}
                        strokeWidth={3}
                        strokeDashArray={[42.76482137044271, 42.76482137044271]}
                        height={400}
                        width={400}
                        scale={1}
                        delay={0}
                        rewind={false}
                        ds={preloaderLines}
                        loop={false}
                    />
                </View>
                :
                <View style={ProfileStyles.container}>
                    {/*Profile Card View*/}
                    <View style={ProfileStyles.card}>
                        <View style={{flexDirection: "row", alignItems: "center", justifyContent:'space-between', position:"absolute", width:'100%'}}>
                            <TouchableOpacity onPress={() => navigation.navigate('Edit Account')}>
                                {newProfilePicture && <Image source={{ uri: newProfilePicture }}  style={IconStyles.profilePicture} />}
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
