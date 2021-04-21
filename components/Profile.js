import React, {useEffect, useState} from 'react';
import {Button, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import firebase from "../firebase";
import "firebase/firestore";
import {useIsFocused, useNavigation} from '@react-navigation/native'


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
    console.log(user)
    //console.log(newProfilePicture)

    async function signOut(){
        await firebase.auth().signOut()
    }
    async function deleteAccount(){
        await firebase.auth().currentUser.delete()
        await firebase.firestore().collection('users').doc(user).delete()
    }
    return(
        <View style={styles.container}>
            <View style = {styles.card}>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                   {newProfilePicture && <Image source={{ uri: newProfilePicture }} style={{ width: 200, height: 200,borderRadius:100 }} />}
                </View>
                <Text style = {styles.textStyle}>
                    Username: {newProfileUsername}
                </Text>

                <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => navigation.navigate('Edit Account')}>
                    <Text>Edit</Text>
                </TouchableOpacity>
            </View>

            <View styles={styles.buttonView}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('HostSession')}
                    style = {styles.buttonStyle}
                >
                    <Text style={styles.textButton}>Generate Code</Text>
                </TouchableOpacity>

{/*                <TouchableOpacity
                    onPress={() => navigation.navigate('Friends List')}
                    style = {styles.buttonStyle}
                >
                    <Text style={styles.textButton}>Friends List</Text>
                </TouchableOpacity>*/}

                <TouchableOpacity
                    style={styles.buttonStyle}
                    onPress={() => navigation.navigate('Connect')}>
                    <Text style={styles.textButton}>Connect to a Session</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={signOut}
                    style = {styles.buttonStyle}
                >
                    <Text style={styles.textButton}>Logout</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={deleteAccount}
                    style = {styles.buttonStyle}
                >
                    <Text style={styles.textButton}>delete</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: "flex",
        padding: 25,
        backgroundColor: '#fff'
    },
    textStyle: {
        fontSize: 15,
        marginBottom: 10,
    },
    card:{
        backgroundColor: '#fff',
        justifyContent:'center',
        alignItems: 'center',
        width:'100%',
        height:'50%',
        borderRadius:10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 6,
        marginBottom:10
    },
    editButton:{
        position:'absolute',
        bottom:20,
        right:10,
    },
    buttonView:{
        flex: 1,
        alignSelf: "center",
    },
    textButton:{
        color:'#fff',
        textAlign:'center'
    },
    buttonStyle:{
        marginBottom: 10,
        width:"100%",
        backgroundColor:"#e98477",
        padding:10,
        borderRadius:5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 4,
    }
});
