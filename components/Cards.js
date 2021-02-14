import React, {useState} from 'react';
import {Text, View, Button, Linking} from "react-native";
import {ScrollView} from "react-native";

const Cards = (props) =>{
    const [isFlipped, setIsFlipped]= useState(false);
    let times = [];
    let address = [];
    let name = [];
    let counter = 0;
    let googleURL = "https://www.google.com/maps/search/?api=1&query=";

    address = props.restaurantData.restaurant.location.address.split(' ');
    name = props.restaurantData.restaurant.name.split(' ');

    while (name[counter] != null) {
        googleURL += name[counter];
        googleURL += "+";
        counter++;
    }

    counter = 0;

    while (address[counter] != null) {
        googleURL += address[counter];
        googleURL += "+";
        counter++;
    }
    console.log(props);

    return(
        <View id={"card-div"}>
            <Text>{props.restaurantData.restaurant.id}</Text>
            <Text className="name">{props.restaurantData.restaurant.name}</Text>
            {console.log(props.name)}
            <Text className="price-range">{props.restaurantData.restaurant.price_range}</Text>
            <Text className="rating">Rating: {props.restaurantData.restaurant.user_rating.aggregate_rating}</Text>
            <Text className="address">{props.restaurantData.restaurant.location.address}</Text>
            <Text className="phone-numbers">{props.restaurantData.restaurant.phone_numbers}</Text>
            {times = props.restaurantData.restaurant.timings.split(',').map(time =>
                    <Text className="times">{time}</Text>
            )}
            <Button title="Find Place" className="btnMaps" onPress={() => Linking.openURL(`${googleURL}`)} target="_blank"/>
        </View>
    )
}

export default Cards;
