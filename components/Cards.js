import React, {useState} from 'react';
import {Text, View, Image, Linking, Modal, Pressable, StyleSheet, Platform, TouchableOpacity} from "react-native";
import {useNavigation} from '@react-navigation/native'
import burgerGIF from '../assets/burger.gif';
import burgerJPG from '../assets/burger.jpg';
import YelpImage from '../assets/YelpImage.png'
import Data from './YelpAPI.js'
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

class Card extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if(this.props.imageURL === burgerJPG) {
            return (
                <View style={styles.card}>
                    <Image source={this.props.imageURL} style={styles.cardImage}/>

                    <Text style={styles.cardsText}>{this.props.name}</Text>

                    <View style={styles.yelpStars}>
                        <Text style={styles.yelpText}>{(this.props.distance / 1609.3).toFixed(2)} mi.</Text>
                        <Text style={styles.yelpText}>{this.props.address}</Text>

                        <Image source={this.props.rating} />
                        <Text style={styles.yelpText}>Based on {this.props.review_count} Reviews</Text>
                    </View>

                    <TouchableOpacity onPress={() => Linking.openURL(this.props.businessURL)}>
                        <Image style={styles.yelpImage} source={YelpImage} />
                    </TouchableOpacity>
                </View>
            )
        }else {
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

                    <TouchableOpacity onPress={() => Linking.openURL(this.props.businessURL)}>
                        <Image style={styles.yelpImage} source={YelpImage}/>
                    </TouchableOpacity>
                </View>
            )
        }
    }
}

class LoadingCard extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.card}>
                <Image source={burgerGIF} style={styles.cardImage}/>

                <Text style={styles.cardsText}>Finding Local Restaurants...</Text>

                <View style={styles.yelpStars}>
                    <Text style={styles.yelpText}>Please remember, if you are waiting a long time
                        for the restaurants to load, there may be no restaurants nearby or your connection was lost.
                        If this is the case,please increase the distance or establish a connection.</Text>
                </View>
            </View>
        )
    }
}

let data = [];

const Cards = (props) => {
    let [resCounter, setCounter] = useState(0);
    let [modalVisible, setModalVisible] = useState(false);
    const navigation = useNavigation();
    let [cardState, setCardState] = useState({
        id: "0",
        name: "name",
        price_range: "price_range",
        address: "address",
        rating: "rating",
        review_count: "0",
        distance: "0",
        phone_numbers: "phone_number",
        imageURL: "imageURL",
        businessURL: ""
    });
    let address = [];
    let name = [];
    let counter = 0;
    let usersRef = firebase.firestore().collection('sessions').doc(props.code).collection('users')

    setData(props.restaurantData)

    function setData(restaurantData) {
        try{
            for (let i = 0; i < restaurantData.length; i++) {
                const current = restaurantData[i];

                const id = current.id;
                name = current.name;
                const price_range = current.price;
                address = current.location.address1;
                if(current.location.address2 === '' || current.location.address2 === null) {
                    //console.log("Address 2: Null")
                } else {
                    address += ', ';
                    address += current.location.address2;
                }

                if(current.location.address3 === '' || current.location.address3 === null) {
                    //console.log("Address 3: Null")
                } else {
                    address += ', ';
                    address += current.location.address3;
                }

                address += '\n';

                address += current.location.city + ', ' + current.location.state;
                const phone_number = current.display_phone;
                let rating = current.rating;
                const businessURL = current.url;
                let imageURL;

                if(current.image_url === '') {
                    imageURL = burgerJPG;
                } else {
                    imageURL = current.image_url;
                }

                const distance = current.distance;
                const review_count = current.review_count;

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
                    phone_numbers: phone_number,
                    imageURL: imageURL,
                    businessURL: businessURL
                })

                counter = 0;
            }
        } catch (e) {
            console.log("Error: ", e)
        }
    }

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
                    //sets card state and shows modal when solo
                    setCardState(card)
                    setModalVisible(true)
                } else {
                    //if in a group, and match is not true
                    if (match === false) {
                        //compare current user to documentID to reduce redundancies
                        if (documentSnapshot.id !== firebase.auth().currentUser.uid) {
                            //for each restaurant in firebase data
                            for (const restaurant in documentSnapshot.data()) {
                                //check if document data restaurant is equal to this specific restaurant for this card
                                if (documentSnapshot.data()[restaurant] === restaurantID) {
                                    //add counter to amount of people
                                    counter += 1

                                    //if the amount of people in lobby are equal to the counter
                                    if (querySnapshot.size === counter) {
                                        //set match to true, set card state, show modal, and console matched
                                        match = true
                                        setCardState(card)
                                        setModalVisible(true)
                                        console.log("Matched!")
                                    }
                                }
                            }
                        }
                    }
                }
            })

            //reset counter so when snapshot detects changes, it doesn't over count
            counter = 1;
        })
        return true;
    }

    function handleNope (card) {
        console.log(`Nope for ${card.id}`)
        return true;
    }

    function loveIt () {
        const increment = 1;
        let matchedRef = firebase.firestore().collection('sessions').doc(props.code)
            .collection('matched').doc(cardState.id)

        let sessionSize;
        usersRef.onSnapshot(querySnapshot => {
            sessionSize = querySnapshot.size
        })

        //retrieve document
        matchedRef.get().then((doc) => {
            //if the document data isn't null
            if(doc.data() == null) {
                //console log that the document doesn't exist
                console.log("Document Doesn't Exist, Creating Document")
                //set the document counter to 1 for this user
                matchedRef.set({
                    counter: 1
                }).then(() => {
                    //console log that the restaurant is successful
                    console.log("Matched restaurant successfully created!");
                }).catch((error) => {
                    //if there is an issue, console log error
                    console.error("Error creating matched restaurant: ", error);
                });
            }

            //if the data isn't null
            if(doc.data() != null) {
                //update current document
                matchedRef.update({
                    counter: doc.data().counter + increment
                }).then(() => {
                    console.log("Restaurant Counter Updated!");
                }).catch((error) => {
                    console.error("Error Updating restaurant: ", error);
                });
            }

            matchedRef.onSnapshot(docSnapshot => {
                console.log(docSnapshot.data())
                //if majority of the group wants this
                if((docSnapshot.data().counter / sessionSize) > 0.50) {
                    //move screens. read document id, send that to next screen and pull data using the yelp api to
                    //populate the screen with information
                    navigation.navigate('Final Decision', {id: docSnapshot.id, code: props.code})
                    console.log("Majority Rule")
                }
            })
        })
    }

    function hateIt() {
        //basically the same as love it minus some features
        let matchedRef = firebase.firestore().collection('sessions').doc(props.code)
            .collection('matched').doc(cardState.id)

        let sessionSize;
        usersRef.onSnapshot(querySnapshot => {
            sessionSize = querySnapshot.size
        })

        matchedRef.get().then((doc) => {
            if(doc.data() == null) {
                console.log("Document Doesn't Exist, Creating Document")
                matchedRef.set({
                    counter: 0
                }).then(() => {
                    console.log("Matched restaurant successfully created!");
                }).catch((error) => {
                    console.error("Error creating matched restaurant: ", error);
                });
            }

            matchedRef.onSnapshot(docSnapshot => {
                console.log(docSnapshot.data())
                if((docSnapshot.data().counter / sessionSize) > 0.50) {
                    //move screens. read document id, send that to next screen and pull data using the yelp api to
                    //populate the screen with information
                    navigation.navigate('Final Decision',{id: docSnapshot.id})
                    console.log("Majority Rule")
                }
            })
        })
    }

    if (data.length === 0) {
        return (
            <View style={styles.container}>
                <LoadingCard code={props.code} offset={props.offset}/>
            </View>
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
                                   onPress={() => {
                                       loveIt(cardState)
                                       setModalVisible(!modalVisible)
                                   }}>
                            <Text style={styles.modalText}>Love It!</Text>
                        </Pressable>
                        <Pressable style={styles.button}
                                   onPress={() => {
                                       hateIt(cardState)
                                       setModalVisible(!modalVisible)
                                   }}>
                            <Text style={styles.modalText}>Keep Swiping</Text>
                        </Pressable>
                    </View>
                </Modal>

                <SwipeCards
                    cards={data}
                    renderCard={(cardData) => <Card {...cardData} />}
                    keyExtractor={(cardData) => String(cardData.id)}
                    renderNoMoreCards={() => {
                            data=[]
                            return (<Data code={props.code} zip={props.zip} offset={props.offset+50}/>)
                        }
                    }
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
    yelpImage: {
        width: 150,
        height: 75,
    }
});

export default Cards;
