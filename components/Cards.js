import React, {useState} from 'react';
import {Text, View, Button, Linking} from "react-native";
import Swiper from 'react-native-deck-swiper';
import styles from '../App';

let data = [];

const Card = ({ card }) => {
    return (
        <View style={styles.card}>
        </View>
    );
};

const CardDetails = ({ index }) => (
    <View key={data[index].id} style={{ alignItems: 'center' }}>
        <Text numberOfLines={2}>
            {data[index].name}
        </Text>
        <Button title="Find Place" className="btnMaps" onPress={() => Linking.openURL(data[index].googleURL)} target="_blank"/>
    </View>
);

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
    const [index, setIndex] = React.useState(0);
    const onSwiped = () => {
        setIndex((index + 1) % data.length);
    };

    if (data.length === 0) {
        return (
            <View/>
        )
    } else {
        return (
            <View>
                <Swiper
                    cards={data}
                    cardIndex={index}
                    renderCard={card => <Card card={card}/>}
                    infinite
                    backgroundColor={'transparent'}
                    onSwiped={onSwiped}
                    cardVerticalMargin={50}
                    stackSize={4}
                    stackScale={10}
                    stackSeparation={14}
                    animateOverlayLabelsOpacity
                    animateCardOpacity
                    disableTopSwipe
                    disableBottomSwipe />
                <CardDetails index={index}/>
            </View>
        )
    }
}

export default Cards;
