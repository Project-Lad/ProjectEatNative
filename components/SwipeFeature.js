import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View} from 'react-native';
import Data from "./YelpAPI.js";

export default function SwipeFeature({route}) {

    return (
        <View style={styles.container}>
            <Data code={route.params.code} offset={0}/>
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 0.9,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    }});
