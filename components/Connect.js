import React, {useState} from 'react';
import { StyleSheet, View, Button, TextInput} from 'react-native';
import "firebase/firestore";
import {useNavigation} from '@react-navigation/native'

export default function Connect() {
    const navigation = useNavigation()
    const [inputCode, setCode] = useState()

    let convertUpper = () => {
        return inputCode.toString().toUpperCase()
    }

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.inputStyle}
                placeholder="Put Your Code Here 4Head"
                value={inputCode}
                onChangeText={setCode}
            />

            <Button
                color="#e98477"
                title="Connect to Friends"
                onPress={() => {
                    navigation.navigate('Guest Session', {code: convertUpper()})
                }}
            />
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
