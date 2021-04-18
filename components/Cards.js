import React, {useState} from 'react';
import {Text, View, Button, Linking, Image, Modal, Pressable, StyleSheet, Platform} from "react-native";
import burger from '../assets/burger.jpg';
import androidStar0 from '../assets/android/stars_regular_0.png'
import androidStar1 from '../assets/android/stars_regular_1.png'
import androidStar15 from '../assets/android/stars_regular_1_half.png'
import androidStar2 from '../assets/android/stars_regular_2.png'
import androidStar25 from '../assets/android/stars_regular_2_half.png'
import androidStar3 from '../assets/android/stars_regular_3.png'
import androidStar35 from '../assets/android/stars_regular_3_half.png'
import androidStar4 from '../assets/android/stars_regular_4.png'
import androidStar45 from '../assets/android/stars_regular_4_half.png'
import androidStar5 from '../assets/android/stars_regular_5.png'

import iosStar0 from '../assets/ios/regular_0.png'
import iosStar1 from '../assets/ios/regular_1.png'
import iosStar15 from '../assets/ios/regular_1_half.png'
import iosStar2 from '../assets/ios/regular_2.png'
import iosStar25 from '../assets/ios/regular_2_half.png'
import iosStar3 from '../assets/ios/regular_3.png'
import iosStar35 from '../assets/ios/regular_3_half.png'
import iosStar4 from '../assets/ios/regular_4.png'
import iosStar45 from '../assets/ios/regular_4_half.png'
import iosStar5 from '../assets/ios/regular_5.png'

import SwipeCards from "react-native-swipe-cards-deck";
import firebase from "../firebase";
import "firebase/firestore"


let data = [];

class Card extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.card}>
                <Image source={{uri: `${this.props.imageURL}`}} style={styles.cardImage}/>

                <Text style={styles.cardsText}>{this.props.name}</Text>

                <View style={styles.yelpStars}>
                    <Text style={styles.yelpText}>{(this.props.distance / 1609.3).toFixed(2)} mi.</Text>
                    <Text style={styles.yelpText}>{this.props.address}</Text>

                    <Image source={this.props.rating} />
                    <Text style={styles.yelpText}>Based on {this.props.review_count} Reviews</Text>
                </View>

                <Text style={styles.cardsText}>{this.props.is_closed}</Text>
            </View>
        )
    }
}

const Cards = (props) => {
    let [resCounter, setCounter] = useState(0);
    let [modalVisible, setModalVisible] = useState(false);
    let [cardState, setCardState] = useState({
        id: "0",
        name: "name",
        price_range: "price_range",
        address: "address",
        rating: "rating",
        review_count: "0",
        distance: "0",
        is_closed: "",
        phone_numbers: "phone_number",
        googleURL: "googleURL",
        imageURL: "imageURL"
    });
    let address = [];
    let name = [];
    let counter = 0;
    let googleURL = "https://www.google.com/maps/search/?api=1&query=";
    let usersRef = firebase.firestore().collection('sessions').doc(props.code).collection('users')

    for (let i = 0; i < props.restaurantData.length; i++) {
        const current = props.restaurantData[i];

        address = [current.location.address1, current.location.city, current.location.state];
        name = current.name.split(' ');

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

        const id = current.id;
        name = current.name;
        const price_range = current.price;
        address = current.location.address1;
        if(current.location.address2 !== '' && current.location.address2 !== 'null') {
            address += ', ';
            address += current.location.address2;
        }

        if(current.location.address3 !== '' && current.location.address3 !== 'null') {
            address += ', ';
            address += current.location.address3;
        }

        address += '\n';

        address += current.location.city + ', ' + current.location.state;
        const phone_number = current.display_phone;
        let rating = current.rating;
        const imageURL = current.image_url;
        const distance = current.distance;
        const review_count = current.review_count;
        let open_or_closed;

        if(current.is_closed === true) {
            open_or_closed = "Closed"
        } else {
            open_or_closed = "Open Now!"
        }

        if(Platform.OS === 'android') {
            switch(rating) {
                case 0:
                    rating = androidStar0
                    break;
                case 1:
                    rating = androidStar1
                    break;
                case 1.5:
                    rating = androidStar15
                    break;
                case 2:
                    rating = androidStar2
                    break;
                case 2.5:
                    rating = androidStar25
                    break;
                case 3:
                    rating = androidStar3
                    break;
                case 3.5:
                    rating = androidStar35
                    break;
                case 4:
                    rating = androidStar4
                    break;
                case 4.5:
                    rating = androidStar45
                    break;
                case 5:
                    rating = androidStar5
                    break;
            }
        } else {
            switch(rating) {
                case 0:
                    rating = iosStar0
                    break;
                case 1:
                    rating = iosStar1
                    break;
                case 1.5:
                    rating = iosStar15
                    break;
                case 2:
                    rating = iosStar2
                    break;
                case 2.5:
                    rating = iosStar25
                    break;
                case 3:
                    rating = iosStar3
                    break;
                case 3.5:
                    rating = iosStar35
                    break;
                case 4:
                    rating = iosStar4
                    break;
                case 4.5:
                    rating = iosStar45
                    break;
                case 5:
                    rating = iosStar5
                    break;
            }
        }

        data.push({
            id: id,
            name: name,
            price_range: price_range,
            address: address,
            rating: rating,
            review_count: review_count,
            distance: distance,
            is_closed: open_or_closed,
            phone_numbers: phone_number,
            googleURL: googleURL,
            imageURL: imageURL
        })

        counter = 0;
        //console.log(googleURL);
        googleURL = "https://www.google.com/maps/search/?api=1&query=";
    }

    //console.log(data)

    function handleYup(card) {
        let match = false
        let counter = 1
        let restaurantID = card.id

        console.log(props.code)


        usersRef.doc(firebase.auth().currentUser.uid).set({
            [resCounter]: restaurantID
        }, {merge: true}).then(() => {
            console.log("Restaurant successfully written!");
            setCounter(resCounter + 1);
        }).catch((error) => {
            console.error("Error writing restaurant: ", error);
        });

        usersRef.onSnapshot(querySnapshot => {
            console.log(querySnapshot.size)
            querySnapshot.forEach(documentSnapshot => {
                if (querySnapshot.size === 1) {
                    setCardState(card)
                    setModalVisible(true)
                }
                if (documentSnapshot.id !== firebase.auth().currentUser.uid) {
                    for (const restaurant in documentSnapshot.data()) {
                        if(documentSnapshot.data()[restaurant] === restaurantID){
                            counter += 1

                            if(querySnapshot.size === counter) {
                                match = true
                                setCardState(card)
                                setModalVisible(true)
                                console.log("Matched!")
                            }
                        }
                    }
                }
            })
        })
        return true;
    }

    function handleNope (card) {
        console.log(`Nope for ${card.id}`)
        return true;
    }

    if (data.length === 0) {
        return (
            <View/>
        )
    } else {
        return (
            <View style={styles.container}>
                <Modal
                    animationType="slide"
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(!modalVisible);
                    }}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Let's Eat!</Text>
                        <Image source={{uri: `${cardState.imageURL}`}} style={styles.cardImageModal}/>
                        <Text style={styles.modalText}>The group chose {'\n' + cardState.name}</Text>
                        <Pressable style={styles.button}
                                   onPress={() => Linking.openURL(cardState.googleURL)}>
                            <Text style={styles.modalText}>Find on Google Maps</Text>
                        </Pressable>
                        <Pressable style={styles.button}
                                   onPress={() => setModalVisible(!modalVisible)}>
                            <Text style={styles.modalText}>Keep Swiping</Text>
                        </Pressable>
                    </View>
                </Modal>

                <SwipeCards
                    cards={data}
                    renderCard={(cardData) => <Card {...cardData} />}
                    keyExtractor={(cardData) => String(cardData.id)}
                    renderNoMoreCards={() => <NoMoreCards />}

                    // If you want a stack of cards instead of one-per-one view, activate stack mode
                    //stack={true}
                    //stackDepth={3}
                    handleYup={handleYup}
                    handleNope={handleNope}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#2a222d",
        alignItems: "center",
        justifyContent: "center",
        borderRadius:10,
        borderWidth: 2,
    },
    card: {
        flex: 1,
        backgroundColor: "#bc0402",
        borderRadius:10,
        borderWidth: 2,
        borderColor: '#20232a'
    },
    cardsText: {
        fontSize: 20,
        fontWeight: "bold",
        alignSelf: 'center',
        color: '#010001'
    },
    yelpText: {
        fontSize: 15,
        color: '#010001'
    },
    yelpStars: {
        paddingStart: 10,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        flexDirection: 'column',
    },
    cardImage: {
        width: "65%",
        height: "65%",
        aspectRatio: 1,
        borderRadius:10,
        borderWidth: 2,
        borderColor: '#20232a'
    },
    modalView: {
        margin: 20,
        backgroundColor: "#2a222d",
        borderRadius: 20,
        padding: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 20
    },
    button: {
        backgroundColor: '#bc0402',
        borderRadius: 20,
        padding: 5,
        borderColor: '#20232a',
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        color: "#d4cab1",
        fontWeight: "bold",
        fontSize: 20,
    },
    cardImageModal: {
        width: "60%",
        height: "60%",
        aspectRatio: 1,
        borderRadius:10,
        borderWidth: 2,
        borderColor: '#bc0402'
    },
});

export default Cards;
