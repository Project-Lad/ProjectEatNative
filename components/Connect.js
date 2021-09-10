import React, {useState} from 'react';
import { View, TextInput, TouchableOpacity, Text} from 'react-native';
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