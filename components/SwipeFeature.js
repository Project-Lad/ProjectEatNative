import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View} from 'react-native';
import Data from "./YelpAPI.js";

export default function SwipeFeature({route}) {

    return (
        <View style={styles.container}>
            <Data code={route.params.code} zip={route.params.zip} offset={0} distance={route.params.distance} isHost={route.params.isHost}/>
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    }});
