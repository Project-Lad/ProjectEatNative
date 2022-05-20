import { StatusBar } from 'expo-status-bar';
import React, {useEffect} from 'react';
import {BackHandler, StyleSheet, View, LogBox} from 'react-native';
import Data from "./YelpAPI.js";
import firebase from "../firebase";
import {useNavigation} from "@react-navigation/native";
LogBox.ignoreLogs(['Setting a timer']);
import Cards from "./Cards";

export default function SwipeFeature({route}) {
    const navigation = useNavigation();
    let currentSession = firebase.firestore().collection('sessions').doc(route.params.code)
    let unsub;

    useEffect(() => {
        unsub = currentSession.onSnapshot(docSnapshot => {
            if(docSnapshot.data().start === false && route.params.isHost === false) {
                unsub();
                navigation.navigate('Guest Session', {code: route.params.code})
            }
        })
        console.log(route.params.code, route.params.zip, route.params.distance, route.params.isHost, route.params.categories)
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true)
        return () => backHandler.remove()
    }, [])

    return (
        <View style={styles.container}>
            <Cards
                code={route.params.code}
                zip={route.params.zip}
                offset={0}
                distance={route.params.distance}
                isHost={route.params.isHost}
                categories={route.params.categories}
                latitude={route.params.latitude}
                longitude={route.params.longitude}
            />
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
