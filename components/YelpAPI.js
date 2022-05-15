//checks for location
import {YELP_API_KEY} from '@env'
import Cards from "./Cards.js";
import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from "react-native";

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
            fetch(`https://api.yelp.com/v3/businesses/search?term=restaurants&latitude=${props.latitude}&longitude=${props.longitude}&limit=50&offset=${props.offset}&radius=${parseInt(props.distance * 1609)}&sort_by=distance&categories=${apicategories}`, requestOptions)
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
                <Cards restaurantData={restaurantData} code={props.code} zip={props.zip} lat={props.latitude} lon={props.longitude} offset={props.offset} distance={props.distance} isHost={props.isHost} categories={props.categories}/>
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