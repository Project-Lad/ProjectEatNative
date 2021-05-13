import React, {useState} from 'react';
import {StyleSheet, View, Button, TextInput, TouchableOpacity, Text} from 'react-native';
import "firebase/firestore";
import {useNavigation} from '@react-navigation/native'
import {IconStyles, InputStyles} from "./InputStyles";
import {Ionicons} from "@expo/vector-icons";

export default function Connect() {
    const navigation = useNavigation()
    const [inputCode, setCode] = useState()

    let convertUpper = () => {
        return inputCode.toString().toUpperCase()
    }

    return (
        <View style={InputStyles.container}>
            <TextInput
                style={InputStyles.inputStyle}
                placeholder="Enter Lobby Code"
                value={inputCode}
                onChangeText={setCode}
            />
            <TouchableOpacity
                onPress={() => {
                navigation.navigate('Guest Session', {code: convertUpper()})
                }}
                style = {InputStyles.buttons}>
                <Text style={InputStyles.buttonText}>Connect to Lobby</Text>
                <Ionicons style={IconStyles.arrowRight} name="chevron-forward-outline"/>
            </TouchableOpacity>
        </View>
    );
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
