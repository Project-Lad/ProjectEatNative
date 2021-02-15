import React, {useState} from 'react';
import { Button, View, Text} from 'react-native';
import Cards from "./Cards";

//checks for location
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
//Get Zomato Api data
const Data = () =>{
    let [restaurantData, setRestaurantData]= useState([]);
    let count = 20;
    let start = 0;

    function getData(e){
        e.preventDefault(); //need to put api key (below) into .env file
        fetch(`https://developers.zomato.com/api/v2.1/search?&start=${start}&count=${count}&lat=${latitude}&lon=${longitude}&sort=real_distance&order=asc&apikey=54dd7ea36253c6415fe32b8f3b30b29c`,{
            "method": "GET"
        })
            .then(response => response.json())
            .then (response =>{
                setRestaurantData(response.restaurants);
            })
            .catch(err =>{
                console.log(err)
            })


    }
    function refreshData(e){
        e.preventDefault();
        start += 20;

        getData(e);
    }

    return(
        <View className='container'>
            <Text>{restaurantData.length}</Text>
            <View>
                <Cards restaurantData={restaurantData} />
            </View>
            <View>
                <Button title="Get Data" className="btn info" onPress={getData}/>
            </View>
            <View onSubmit={refreshData}>
                <Button title="Get Next 20 Restaurants" className="btn" type='submit'/>
            </View>
        </View>
    )
}

export default Data;
