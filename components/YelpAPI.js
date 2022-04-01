//checks for location
import {YELP_API_KEY} from '@env'
import Cards from "./Cards.js";
import React, {useEffect, useState} from 'react';
import {View, Alert, StyleSheet, BackHandler} from "react-native";
import * as Location from 'expo-location';

//Declares lat and long vars
let latitude;
let longitude;

(async () => {
    let location;
    let locationSuccess = false;
    let count = 0;
    let { status } = await Location.requestForegroundPermissionsAsync();
    console.log(status)

    if (status === 'denied') {
        Alert.alert('Please enable Location Services in your Settings');
    } else {
        while (!locationSuccess) {
            try {
                location = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.Lowest,
                });
                locationSuccess = true;
            } catch (ex) {
                //console.log(ex)
                count++;
                console.log(count);
                console.log("retrying....");

                if (count === 500) {
                    Alert.alert("Location Unreachable", "Your location cannot be found.", ["Cancel", "OK"])
                    locationSuccess = true;
                }
            }
        }
    }

    latitude = location.coords.latitude;
    longitude = location.coords.longitude;

    console.log(latitude + ", " + longitude)
})();

const Data = (props) => {
    let [restaurantData, setRestaurantData] = useState([]);
    let apicategories = "";
    let counter = 0;

    while (props.categories[counter] != null) {
        //add to the api categories
        apicategories += props.categories[counter];
        apicategories += ",";
        counter++;
    }

    apicategories = apicategories.slice(0, -1)

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
            fetch(`https://api.yelp.com/v3/businesses/search?term=restaurants&latitude=${latitude}&longitude=${longitude}&limit=50&offset=${props.offset}&radius=${parseInt(props.distance * 1609)}&sort_by=distance&categories=${apicategories}`, requestOptions)
                .then(response => response.json())
                .then(result => {
                    //console.log("Latitude: " + latitude)
                    //console.log("Longitude: " + longitude)
                    //console.log("Offset: " + props.offset)
                    //console.log("Distance: " + parseInt((props.distance * 1609)))
                    console.log("Categories: " + apicategories)
                    setRestaurantData(result.businesses);
                    //console.log(result.businesses);
                })
                .catch(error => console.log('error', error));
        } else {
            fetch(`https://api.yelp.com/v3/businesses/search?term=restaurants&location=${props.zip}&limit=50&offset=${props.offset}&radius=${parseInt(props.distance * 1609)}&sort_by=distance&categories=${apicategories}`, requestOptions)
                .then(response => response.json())
                .then(result => {
                    setRestaurantData(result.businesses);
                    //console.log(result.businesses);
                })
                .catch(error => console.log('error', error));
        }
    }

    return(
            <View style={styles.container}>
                <Cards restaurantData={restaurantData} code={props.code} zip={props.zip} lat={latitude} lon={longitude} offset={props.offset} distance={props.distance} isHost={props.isHost} categories={props.categories}/>
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