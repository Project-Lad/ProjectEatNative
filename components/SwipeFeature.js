import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import {BackHandler, StyleSheet, View, LogBox, Alert} from 'react-native';
import {getFirestore, doc, collection, onSnapshot} from "firebase/firestore";
import {useNavigation} from "@react-navigation/native";
import * as Sentry from "sentry-expo";
LogBox.ignoreLogs(['Setting a timer']);
import Cards from "./Cards";

export default function SwipeFeature({route}) {
    const navigation = useNavigation();
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
    const firestore = getFirestore();
    const currentSessionRef = doc(collection(firestore, 'sessions'), route.params.code);

    useEffect(() => {
        let alertUnsubscriber = onSnapshot(currentSessionRef, (docSnapshot) => {
            if (docSnapshot.exists()) {
                const sessionData = docSnapshot.data();
                if (route.params.isHost === false && sessionData.start === false) {
                    alertUnsubscriber();
                    console.log("isHost is false, start is false");
                    navigation.navigate('Guest Session', {code: route.params.code});
                }
            } else {
                alertUnsubscriber();

                if (!route.params.isHost) {
                    Alert.alert('Lobby Closed', 'The lobby you are in has ended, returning to home');
                    navigation.navigate('Profile');
                }
            }
        }, error => {
            Sentry.Native.captureException(error.message);
        });

        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true)
        return () => {
            alertUnsubscriber();
            backHandler.remove()
        }
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
