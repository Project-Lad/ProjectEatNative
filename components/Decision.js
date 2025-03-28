//checks for location
import {YELP_API_KEY} from '@env'
import React, {useState, useEffect} from 'react';
import {View, Text, Image, Platform, Linking, ScrollView, TouchableOpacity, LogBox} from "react-native";
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
import {useNavigation} from "@react-navigation/native";
import YelpImage from "../assets/yelp_burst.png";
import {IconStyles, InputStyles, DecisionStyle, ProfileStyles} from "./InputStyles";
import {Ionicons} from "@expo/vector-icons";
import * as Sentry from "@sentry/react-native";
import * as WebBrowser from "expo-web-browser";
import {StrokeAnimation} from "./AnimatedSVG";
import burgerJPG from '../assets/burger_image.jpg';
import {getFirestore, deleteDoc, getDocs, collection, doc} from "firebase/firestore";
import {getAuth} from "firebase/auth";
LogBox.ignoreLogs(['Setting a timer']);
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
    let [isLoading, setIsLoading] = useState(true)
    let [selectedIndex, setSelectedIndex] = useState(0)
    let navigation = useNavigation()
    let rating = ""
    let phone = ""
    let address = []
    let name = []
    let googleURL = "https://www.google.com/maps/search/?api=1&query=";
    let counter = 0

    useEffect(() => {
        getData() //use API fetch only once to reduce amount of API calls
        clearSubs()
        setTimeout(() => {setIsLoading(false)}, 1650)
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
            .catch((error) => {
                Sentry.captureException(error.message);
            });
    }

    function setData() {
        rating = restaurant.rating

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

        if(restaurant.photos.length === 0) {
            restaurant.photos = [burgerJPG];
        }
    }

    function clearSubs() {
        for (let i = 0; i < route.params.unsubs.length; i++) {
            if(route.params.unsubs[i] !== undefined) {
                route.params.unsubs[i]()
            }
        }
    }

    //for dots under images
    const setIndex = event => {
        const viewSize = event.nativeEvent.layoutMeasurement.width
        const contentOffset = event.nativeEvent.contentOffset.x;
        const selectedIndex = Math.floor(contentOffset / viewSize)
        setSelectedIndex(selectedIndex)
    }

    async function deleteDocument() {
        const firestore = getFirestore();
        const auth = getAuth();
        const currentSession = doc(collection(firestore, 'sessions'), route.params.code);

        if (route.params.isHost) {
            // Delete all documents in the "matched" subcollection
            const matchedDocs = await getDocs(collection(currentSession, 'matched'));
            matchedDocs.forEach((doc) => {
                deleteDoc(doc.ref).catch((error) => {
                    Sentry.captureException(error.message);
                });
            });

            // Delete all documents in the "users" subcollection
            const usersDocs = await getDocs(collection(currentSession, 'users'));
            usersDocs.forEach((doc) => {
                deleteDoc(doc.ref).catch((error) => {
                    Sentry.captureException(error.message);
                });
            });

            // Delete the session document
            deleteDoc(currentSession)
                .then(() => {
                    navigation.navigate('Profile');
                })
                .catch((error) => {
                    Sentry.captureException(error.message);
                });
        } else {
            // Delete the current user's document in the "users" subcollection
            deleteDoc(doc(collection(currentSession, 'users'), auth.currentUser.uid))
                .then(() => {
                    navigation.navigate('Profile');
                })
                .catch((error) => {
                    Sentry.captureException(error.message);
                    navigation.navigate('Profile');
                });
        }
    }

    function callRestaurant(number) {
        let phoneNumber;
        if (Platform.OS === 'android') {
            phoneNumber = `tel:${number}`;
        } else {
            phoneNumber = `telprompt:${number}`;
        }
        Linking.openURL(phoneNumber).then(() => {}).catch(() => {})
    }

    return(
        <>
            {isLoading ?
                <View style={[ProfileStyles.container, {backgroundColor: '#FFF'}]}>
                    <StrokeAnimation viewBox="-15 -50 425 475"/>
                </View>
                :
                <View style={DecisionStyle.container}>
                    <View style={{width:"100%"}}>
                        <ScrollView
                            horizontal
                            pagingEnabled
                            onMomentumScrollEnd={setIndex}>
                            {restaurant.photos.map(image => (
                                <Image
                                    key={image}
                                    source={image === burgerJPG ? burgerJPG : {uri: image}}
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
                        <View style={DecisionStyle.yelpStars}>
                            <View>
                                <View style={DecisionStyle.yelpInformation}>
                                    <Text style={DecisionStyle.yelpText}>{restaurant.location.address1}</Text>
                                    <Text style={DecisionStyle.yelpText}>{restaurant.location.city}, {restaurant.location.state}</Text>
                                    <Text style={DecisionStyle.yelpText}>Based on {restaurant.review_count} Reviews</Text>
                                </View>
                                <Image source={rating} style={DecisionStyle.yelpStarReview}/>
                            </View>
                            <TouchableOpacity style={{width:'25%', alignItems:"center"}} onPress={() => WebBrowser.openBrowserAsync(restaurant.url)}>
                                <Image style={DecisionStyle.yelpImage} source={YelpImage}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{padding:25}}>
                        <TouchableOpacity style = {InputStyles.buttons} onPress={() => {callRestaurant(phone)}}>
                            <Ionicons name="call" size={24} style={IconStyles.iconLeft} />
                            <Text style={InputStyles.buttonText}>Call Now</Text>
                            <Ionicons style={IconStyles.arrowRight} name="chevron-forward-outline"/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => Linking.openURL(googleURL)} style = {InputStyles.buttons}>
                            <Ionicons style={IconStyles.iconLeft} name="map"/>
                            <Text style={InputStyles.buttonText}>Open in Maps</Text>
                            <Ionicons style={IconStyles.arrowRight} name="chevron-forward-outline"/>
                        </TouchableOpacity>
                        <TouchableOpacity  onPress={() => {setIsLoading(true); deleteDocument();}} style={InputStyles.buttons}>
                            <Ionicons style={IconStyles.iconLeft} name="fast-food-outline"/>
                            <Text style={InputStyles.buttonText}>Finished</Text>
                            <Ionicons style={IconStyles.arrowRight} name="chevron-forward-outline"/>
                        </TouchableOpacity>
                    </View>
                </View>
            }
        </>
    )
}

export default Decision;
