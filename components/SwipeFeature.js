import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View,Text} from 'react-native';
import Data from "./API.js";

export default function SwipeFeature({route}) {
    return (
        <View style={styles.container}>
            <Data code={route.params.code}/>
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 0.78,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    card: {
        justifyContent: "center",
        alignItems: "center",
        width: 300,
        height: 300,
    },
    cardsText: {
        fontSize: 40,
    },
});
