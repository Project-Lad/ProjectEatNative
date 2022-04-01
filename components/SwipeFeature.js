import { StatusBar } from 'expo-status-bar';
import React, {useEffect} from 'react';
import {BackHandler, StyleSheet, View} from 'react-native';
import Data from "./YelpAPI.js";

export default function SwipeFeature({route}) {

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true)
        return () => backHandler.remove()
    }, [])

    return (
        <View style={styles.container}>
            <Data code={route.params.code} zip={route.params.zip} offset={0} distance={route.params.distance} isHost={route.params.isHost} categories={route.params.categories}/>
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
