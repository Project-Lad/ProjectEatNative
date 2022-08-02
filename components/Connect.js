import React, {useState, useEffect} from 'react';
import {Alert, TextInput, TouchableOpacity, Text, BackHandler, Platform, KeyboardAvoidingView,LogBox} from 'react-native';
import "firebase/firestore";
import {useNavigation} from '@react-navigation/native'
import {IconStyles, InputStyles} from "./InputStyles";
import {Ionicons} from "@expo/vector-icons";
LogBox.ignoreLogs(['Setting a timer']);
export default function Connect() {
    const navigation = useNavigation()
    const [inputCode, setCode] = useState()
    const [isFocused, setFocus] = useState(false)

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true)
        return () => backHandler.remove()
    }, [])

    let convertUpper = () => {
        return inputCode.toString().toUpperCase()
    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={InputStyles.container}>
            <TextInput
                style={isFocused ? InputStyles.focusInputStyle : InputStyles.inputStyle}
                placeholder="Enter Lobby Code"
                placeholderTextColor={"#000"}
                value={inputCode}
                onChangeText={setCode}
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)}
            />
            <TouchableOpacity
                onPress={() => {
                    if(!!inputCode && inputCode !== "") {
                        navigation.navigate('Guest Session', {code: convertUpper()});
                    } else {
                        Alert.alert("Empty Session Code", "Cannot Leave the Session Code Blank");
                    }
                }}
                style = {InputStyles.buttons}>
                <Text style={InputStyles.buttonText}>Connect to Lobby</Text>
                <Ionicons style={IconStyles.arrowRight} name="chevron-forward-outline"/>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
}