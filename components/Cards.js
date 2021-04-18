import React, {useState} from 'react';
import {Text, View, Button, Linking, Image, Modal, Pressable, StyleSheet} from "react-native";
import burger from '../assets/burger.jpg';
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
                <Text style={styles.cardsText}>{this.props.address}</Text>
                <Button title="Find Place" className="btnMaps" onPress={() => Linking.openURL(this.props.googleURL)} target="_blank"/>
            </View>
        )
    }
}

const Cards = (props) => {
    let [resCounter, setCounter] = useState(0);
    let [modalVisible, setModalVisible] = useState(false);
    let [cardState, setCardState] = useState({
        id: "12345",
        name: "name",
        price_range: "price_range",
        address: "address",
        rating: "rating",
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

        //console.log(props)
        //address = current.restaurant.location.address.split(' ');
        //name = current.restaurant.name.split(' ');
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

        /*const id = current.restaurant.id;
        name = current.restaurant.name;
        const price_range = current.restaurant.price_range;
        const rating = current.restaurant.user_rating.aggregate_rating;
        address = current.restaurant.location.address;
        const phone_numbers = current.restaurant.phone_numbers;*/

        const id = current.id;
        name = current.name;
        const price_range = current.price;
        address = current.location.address1;
        if(current.location.address2 !== '' && current.location.address2 !== 'null') {
            address += ', ';
            address += current.location.address2;
            address += ', ';
        }

        if(current.location.address3 !== '' && current.location.address3 !== 'null') {
            address += ', ';
            address += current.location.address3;
            address += ', ';
        }

        address += '\n';

        address += current.location.city + ', ' + current.location.state;
        const phone_number = current.display_phone;
        const rating = current.rating;
        const imageURL = current.image_url;

        data.push({
            id: id,
            name: name,
            price_range: price_range,
            address: address,
            rating: rating,
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
                    transparent={true}
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
        flex: 0.98,
        backgroundColor: "#bc0402",
        alignItems: "center",
        justifyContent: "center",
        borderRadius:10,
        borderWidth: 2,
        borderColor: '#20232a'
    },
    cardsText: {
        fontSize: 25,
        fontFamily: 'Capriola_400Regular',
        color: '#010001'
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
