//checks for location
import {YELP_API_KEY} from '@env'
import Cards from "./Cards.js";
import React, {useEffect, useState} from 'react';
import {View, Alert, StyleSheet} from "react-native";
import * as Location from 'expo-location';
import firebase from "../firebase";
const geofire = require('geofire-common')
const zipcodes = require('zipcodes')

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
        if(!props.usedFirebase) {
            queryLocations()
        } else {
            getData()
        }
    }, [])

    const queryLocations = () => {
        if(props.zip !== null){
            let result = zipcodes.lookup(props.zip)
            console.log("Zip: ", props.zip)
            console.log("Result: ",result)
        }

        const center = [latitude, longitude];
        const radiusInM = 1609;

        // Each item in 'bounds' represents a startAt/endAt pair. We have to issue
        // a separate query for each pair. There can be up to 9 pairs of bounds
        // depending on overlap, but in most cases there are 4.
        const bounds = geofire.geohashQueryBounds(center, radiusInM);
        const promises = [];
        for (const b of bounds) {
            const q = firebase.firestore().collection('restaurants')
                .orderBy('geohash')
                .startAt(b[0])
                .endAt(b[1]);

            promises.push(q.get());
        }

        // Collect all the query results together into a single list
        Promise.all(promises).then((snapshots) => {
            const matchingDocs = [];

            for (const snap of snapshots) {
                for (const doc of snap.docs) {
                    const lat = doc.get('latitude');
                    const lng = doc.get('longitude');
                    const name = doc.get('name');
                    const price_range = doc.get('price_range');
                    const location = doc.get('location');
                    const rating = doc.get('rating');
                    const review_count = doc.get('review_count');
                    const phone_numbers = doc.get('phone_numbers')
                    const imageURL = doc.get('imageURL')
                    const businessURL = doc.get('businessURL')
                    const id = doc.id

                    // We have to filter out a few false positives due to GeoHash
                    // accuracy, but most will match
                    const distanceInKm = geofire.distanceBetween([lat, lng], center);
                    const distance = distanceInKm * 1000;
                    if (distance <= radiusInM) {
                        matchingDocs.unshift({
                            id,
                            lat,
                            lng,
                            name,
                            distance,
                            price_range,
                            location,
                            rating,
                            review_count,
                            phone_numbers,
                            imageURL,
                            businessURL
                        });
                    }
                }
            }

            return matchingDocs;
        }).then((matchingDocs) => {
            setRestaurantData(matchingDocs);
        })
    }

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
                <Cards restaurantData={restaurantData} usedFirebase={props.usedFirebase} code={props.code} zip={props.zip} lat={latitude} lon={longitude} offset={props.offset} distance={props.distance} isHost={props.isHost} categories={props.categories}/>
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