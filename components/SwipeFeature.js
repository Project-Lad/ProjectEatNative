import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import {BackHandler, StyleSheet, View, LogBox} from 'react-native';
import firebase from "../firebase";
import {useNavigation} from "@react-navigation/native";
import * as Sentry from "sentry-expo";
LogBox.ignoreLogs(['Setting a timer']);
import Cards from "./Cards";

export default function SwipeFeature({route}) {
    const navigation = useNavigation();
    let currentSession = firebase.firestore().collection('sessions').doc(route.params.code)
    let unsub;
    let unsubs = [];
    let [cardState, setCardState] = useState({
        id: "0",
        name: "name",
        price_range: "price_range",
        address: "address",
        rating: "rating",
        review_count: "0",
        distance: "0",
        phone_numbers: "phone_number",
        imageURL: "imageURL",
        businessURL: ""
    });
    let [modalVisible, setModalVisible] = useState(false);
    let [resCounter, setCounter] = useState(0);

    useEffect(() => {
        unsub = currentSession.onSnapshot(docSnapshot => {
            if(route.params.isHost === false && docSnapshot.data().start === false) {
                unsub();
                navigation.navigate('Guest Session', {code: route.params.code})
            }

            if(docSnapshot === 'undefined' || !!docSnapshot.data().start) {
                unsub();
            }
        }, error => {
            Sentry.Native.captureException(error.message);
        })

        unsubs.push(unsub);
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
                unsubs={unsubs}
                card={cardState}
                setCard={setCardState}
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                resCounter={resCounter}
                setCounter={setCounter}
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
