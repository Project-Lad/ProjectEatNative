//checks for location
import {YELP_API_KEY} from '@env'
import Cards from "./Cards.js";
import React, {useEffect, useState} from 'react';
import {View, Alert, StyleSheet} from "react-native";
import * as Location from 'expo-location';

//Declares lat and long vars
let latitude;
let longitude;

(async () => {
    let { status } = await Location.requestPermissionsAsync();
    if (status === 'denied') {
        Alert.alert('Please enable Location Services in your Settings');
    } else {
        await Location.getCurrentPositionAsync()
            .then(location => {
                latitude = location.coords.latitude
                longitude = location.coords.longitude
            })
        console.log(latitude, ", ", longitude)
    }}
)()

const Data = (props) => {
    let [restaurantData, setRestaurantData] = useState([]);

    useEffect(() => {
        getData()
    }, [])

    function getData(){
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${YELP_API_KEY}`);

        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        if (props.zip === null) {
            fetch(`https://api.yelp.com/v3/businesses/search?term=restaurants&latitude=${latitude}&longitude=${longitude}&limit=50&offset=${props.offset}&radius=${props.distance * 1609}&sort_by=distance`, requestOptions)
                .then(response => response.json())
                .then(result => {
                    setRestaurantData(result.businesses);
                    //console.log(result.businesses);

                })
                .catch(error => console.log('error', error));
        } else {
            fetch(`https://api.yelp.com/v3/businesses/search?term=restaurants&location=${props.zip}&limit=50&offset=${props.offset}&radius=${props.distance * 1609}&sort_by=distance`, requestOptions)
                .then(response => response.json())
                .then(result => {
                    setRestaurantData(result.businesses);
                    console.log(result.businesses);
                })
                .catch(error => console.log('error', error));
        }
    }

    return(
            <View style={styles.container}>
                <Cards restaurantData={restaurantData} code={props.code} zip={props.zip} lat={latitude} lon={longitude} offset={props.offset} distance={props.distance} isHost={props.isHost}/>
            </View>
    )
}
const styles = StyleSheet.create({
    container:{
        height:'100%',
        width:'100%',
    },
})
export default Data;
