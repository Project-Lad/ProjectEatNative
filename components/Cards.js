import React, {useState} from 'react';
import {Text, View, Button, Linking, Image} from "react-native";
import styles from '../App';
import burger from '../assets/burger.jpg';
import SwipeCards from "react-native-swipe-cards-deck";

let data = [];


class Card extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.card}>
                <Image source={burger} />
                <Text style={styles.cardsText}>{this.props.name}</Text>
                <Button title="Find Place" className="btnMaps" onPress={() => Linking.openURL(this.props.googleURL)} target="_blank"/>
            </View>
        )
    }
}

const Cards = (props) => {
    let times = [];
    let address = [];
    let name = [];
    let counter = 0;
    let googleURL = "https://www.google.com/maps/search/?api=1&query=";

    for (var i = 0; i < props.restaurantData.length; i++) {
        const current = props.restaurantData[i];
        address = current.restaurant.location.address.split(' ');
        name = current.restaurant.name.split(' ');

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

        const id = current.restaurant.id;
        name = current.restaurant.name;
        const price_range = current.restaurant.price_range;
        const rating = current.restaurant.user_rating.aggregate_rating;
        address = current.restaurant.location.address;
        const phone_numbers = current.restaurant.phone_numbers;

        data.push({
            id: id,
            name: name,
            price_range: price_range,
            rating: rating,
            address: address,
            phone_numbers: phone_numbers,
            googleURL: googleURL
        })

        counter = 0;
        console.log(googleURL);
        googleURL = "https://www.google.com/maps/search/?api=1&query=";
    }

    console.log(data)

    if (data.length === 0) {
        return (
            <View/>
        )
    } else {
        return (
            <View style={styles.container}>
                <SwipeCards
                    cards={data}
                    renderCard={(cardData) => <Card {...cardData} />}
                    keyExtractor={(cardData) => String(cardData.id)}
                    renderNoMoreCards={() => <NoMoreCards />}

                    // If you want a stack of cards instead of one-per-one view, activate stack mode
                    //stack={true}
                    //stackDepth={3}
                />
            </View>
        )
    }
}

export default Cards;
