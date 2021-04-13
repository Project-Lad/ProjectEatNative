import React, {useState} from 'react';
import {Button, View, Text} from 'react-native';
import Cards from "./Cards";
//import Documenu from 'documenu'

//checks for location
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(getPosition);
}

const yelp = require('yelp-fusion')
const client = yelp.client('uZwwv8nodZZ_HkNk9SKAN2mAyjJ3ZPtReRNCJOcKwThunVOj6fQ4CzQWFsUpsVaDelo233paUi_LEJ_gLU3pT65HHskO23DpM94jX6KUfqcRCumJxFdCeS4V7t9wYHYx')

//Declares lat and long vars
let latitude;
let longitude;

function getPosition(position) {
    console.log(position.coords.latitude, position.coords.longitude);
    //sets lat and long vars
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
}

const Data = (props) =>{

    //need to put api key (below) into .env file
    //Documenu.configure('5f47fcd33b2c457af0b7963593044ce8') hydrafirestorm api key

    let [restaurantData, setRestaurantData]= useState([]);

    function getData(e){
        e.preventDefault();


        /*const params = {
            "lat": latitude,
            "distance": "3",
            "lon": longitude,
            "size": "50"
        }

        Documenu.Restaurants.searchGeo(params)
            .then(result => {
                setRestaurantData(result.data)
            })
            .catch(err => {
                console.log(err)
            })*/
    }

    return(
        <View className='container'>
            <Cards restaurantData={restaurantData} code={props.code}/>

            <Button title="Get Data" onPress={getData}/>
        </View>
    )
}


export default Data;
