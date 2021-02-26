import React from "react";
import {StyleSheet, Text, View, Button} from "react-native";

export default function Login({navigator}){
    return(
        <View style={styles.container}>
            <Text>Login</Text>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    }
});
