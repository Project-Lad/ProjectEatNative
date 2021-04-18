//checks for location
import APIKEY from "../YelpAPIKey.js";
import Cards from "./Cards.js";
import React, {useState} from 'react';
import {Button, View, Text} from "react-native";

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(getPosition);
}

//Declares lat and long vars
let latitude;
let longitude;

function getPosition(position) {
    console.log(position.coords.latitude, position.coords.longitude);
    //sets lat and long vars
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
}

const Data = (props) => {
    let [restaurantData, setRestaurantData] = useState([]);

    function getData(){
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${APIKEY}`);

        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(`https://api.yelp.com/v3/businesses/search?term=restaurants&latitude=${latitude}&longitude=${longitude}&limit=50&offset=0&radius=2000`, requestOptions)
            .then(response => response.json())
            .then(result => {
                setRestaurantData(result.businesses);
                console.log(result.businesses);
            })
            .catch(error => console.log('error', error));
    }

    return(
        <View className='container'>
            <Cards restaurantData={restaurantData} code={props.code}/>
            <Button title='Get Data' className="btn info" onPress={getData}/>
            <Text>{props.code}</Text>
        </View>
    )
}

export default Data;