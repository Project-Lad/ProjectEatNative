//checks for location
import {YELP_API_KEY} from '@env'
import React, {useState, useEffect} from 'react';
import {Button, View, Text, Image, Platform, Linking, StyleSheet, ScrollView, TouchableOpacity} from "react-native";
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
import firebase from "../firebase";
import {useNavigation} from "@react-navigation/native";
import YelpImage from "../assets/YelpImage.png";
import {IconStyles, InputStyles,DecisionStyle} from "./InputStyles";
import {Ionicons} from "@expo/vector-icons";

const Decision = ({route}) => {
    let [restaurant, setRestaurant] = useState({
        name: "",
        location: {
            address1: "",
            address2: "",
            address3: "",
            city: "",
            state: ""
        },
        review_count: "",
        photos: [],
        code: route.params.code
    })
    let [isLoading, setIsLoading] = useState(false)
    let [selectedIndex, setSelectedIndex] = useState(0)
    let navigation = useNavigation()
    let rating = ""
    let phone = ""
    let address = []
    let name = []
    let googleURL = "https://www.google.com/maps/search/?api=1&query=";
    let counter = 0

    useEffect(() => {
        console.log("Getting Data")
        getData() //use API fetch only once to reduce amount of API calls
        setIsLoading(true)
        clearSubs()
    }, []);

    setData()   //called everytime an action occurs on the screen
                //cannot call just one time otherwise googleURL doesn't work

    function getData(){
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${YELP_API_KEY}`);

        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(`https://api.yelp.com/v3/businesses/${route.params.id}`, requestOptions)
            .then(response => response.json())
            .then(result => {
                setRestaurant(result);
            })
            .catch(error => console.log('error', error));
    }

    function setData() {
        rating = restaurant.rating

        //console.log(restaurant)
        phone = restaurant.phone

        //set image based upon platform
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

        //split the first address into array
        address = restaurant.location.address1.split(' ')

        //push city and state to the address array
        address.push(
            restaurant.location.city,
            restaurant.location.state
        )

        //split name into an array
        name = restaurant.name.split(' ');

        //while the name array isn't null
        while (name[counter] != null) {
            //add to the google URL
            googleURL += name[counter];
            googleURL += "+";
            counter++;
        }

        counter = 0; //reset counter

        //while address array isn't null
        while (address[counter] != null) {
            //add to the google URL
            googleURL += address[counter];
            googleURL += "+";
            counter++;
        }

        console.log(googleURL)
    }

    function clearSubs() {
        for (let i = 0; i < route.params.unsubs.length; i++) {
            route.params.unsubs[i]()
        }
    }

    //for dots under images
    const setIndex = event => {
        const viewSize = event.nativeEvent.layoutMeasurement.width
        const contentOffset = event.nativeEvent.contentOffset.x;
        const selectedIndex = Math.floor(contentOffset / viewSize)
        setSelectedIndex(selectedIndex)
    }

    function deleteDocument() {
        let currentSession = firebase.firestore().collection('sessions').doc(route.params.code)

        currentSession.collection('matched').get().then(snapshot => {
            snapshot.forEach(doc => {
                currentSession.collection('matched').doc(doc.id).delete().then(() => {
                    console.log("Deleted match restaurant number: ", doc.id)
                }).catch((error) => {
                    console.log("Error deleting matched restaurant: ", error)
                })
            })
        })

        currentSession.collection('users').get().then(snapshot => {
            snapshot.forEach(doc => {
                currentSession.collection('users').doc(doc.id).delete().then(() => {
                    console.log("Deleted user: ", doc.id)
                }).catch((error) => {
                    console.log("Error deleting user: ", error)
                })
            })
        })

        //delete the firebase document
        firebase.firestore().collection('sessions').doc(route.params.code).delete()
            .then(() => {navigation.navigate('Profile')})
            .catch((e) => console.log("Error deleting document session: ", e))
    }

    function callRestaurant(number) {
        let phoneNumber = '';
        if (Platform.OS === 'android') {
            phoneNumber = `tel:${number}`;
        } else {
            phoneNumber = `telprompt:${number}`;
        }
        Linking.openURL(phoneNumber).then(() => {console.log("Making phone call")}).catch((error) => {console.log("Error making call ", error)})
    }

    if(isLoading === false) {
        return(
            <View>
                <Text>Loading Restaurant...</Text>
            </View>
        )
    } else {
        return(
            <View style={DecisionStyle.container}>
                <View style={{width:"100%" ,borderRadius:10}}>
                    <ScrollView
                        horizontal
                        pagingEnabled
                        onMomentumScrollEnd={setIndex}>
                        {restaurant.photos.map(image => (
                               <Image
                                    key={image}
                                    source={{uri: image}}
                                    style={DecisionStyle.cardImages}
                                />
                            ))}
                    </ScrollView>
                    <View style={DecisionStyle.circleDiv}>
                        {restaurant.photos.map((image,i) => (
                            <View
                                key={image}
                                style={[
                                    DecisionStyle.whiteCircle,
                                    {opacity: i === selectedIndex ? 1 : 0.5}
                                ]}
                            />
                        ))}
                    </View>
                </View>

                <Text style={DecisionStyle.cardsText}>{restaurant.name}</Text>

                <View style={DecisionStyle.yelpContainer}>
                    <View style={DecisionStyle.yelpInformation}>
                        <Text style={DecisionStyle.yelpText}>{restaurant.location.address1}</Text>
                        <Text style={DecisionStyle.yelpText}>{restaurant.location.city}, {restaurant.location.state}</Text>
                        <Text style={DecisionStyle.yelpText}>Based on {restaurant.review_count} Reviews</Text>
                        <TouchableOpacity onPress={() => {callRestaurant(phone)}}>
                            <Ionicons name="call" size={24} color="black" />
                        </TouchableOpacity>
                        <Image source={rating} style={{width:200}}/>
                    </View>
                    <TouchableOpacity onPress={() => Linking.openURL(restaurant.url)}>
                        <Image style={DecisionStyle.yelpImage} source={YelpImage}/>
                    </TouchableOpacity>
                </View>

                <View>
                    <TouchableOpacity onPress={() => Linking.openURL(googleURL)} style = {InputStyles.buttons}>
                        <Ionicons style={IconStyles.iconLeft} name="map"/>
                        <Text style={InputStyles.buttonText}>Open in Maps</Text>
                        <Ionicons style={IconStyles.arrowRight} name="chevron-forward-outline"/>
                    </TouchableOpacity>
                    <TouchableOpacity  onPress={() => deleteDocument()} style = {InputStyles.buttons}>
                        <Ionicons style={IconStyles.iconLeft} name="fast-food-outline"/>
                        <Text style={InputStyles.buttonText}>Finished</Text>
                        <Ionicons style={IconStyles.arrowRight} name="chevron-forward-outline"/>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

export default Decision;
