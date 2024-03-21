import React, {useCallback, useEffect, useState} from 'react';
import {Text, View, Image, Linking, Modal, Pressable, Platform, TouchableOpacity,LogBox} from "react-native";
import {useNavigation} from '@react-navigation/native'
import burgerJPG from '../assets/burger_image.jpg';
import YelpBurst from '../assets/yelp_burst.png'
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
import Swiper from 'react-native-deck-swiper';
import { getAuth } from "firebase/auth";
import {
    getFirestore,
    doc,
    setDoc,
    getDoc,
    collection,
    onSnapshot,
    runTransaction,
    updateDoc
} from "firebase/firestore";
import "firebase/firestore"
import {CardStyle, IconStyles, InputStyles} from "./InputStyles";
import {Ionicons} from "@expo/vector-icons";
LogBox.ignoreLogs(['Setting a timer']);
import YelpAPI from "./YelpAPI.js";
import * as Sentry from "sentry-expo";
import * as WebBrowser from "expo-web-browser";
import {StrokeAnimation} from "./AnimatedSVG";

class Card extends React.Component {
    constructor(props) {
        super(props);
        //comment
    }
    render() {
        if(this.props.imageURL === burgerJPG) {
            return (
                <View style={CardStyle.card}>
                    <Image source={this.props.imageURL} style={CardStyle.burgerCardImage} />
                    <View style={CardStyle.yelpInfo}>
                        <Text style={CardStyle.cardTitle}>{this.props.name}</Text>
                        <View style={CardStyle.yelpReview}>
                            <View style={{width:'85%'}}>
                                <View>
                                    <Text style={CardStyle.yelpText}>{(this.props.distance / 1609.3).toFixed(2)} mi.</Text>
                                    <Text style={CardStyle.yelpText}>{this.props.address}</Text>
                                </View>
                                <Image style={CardStyle.yelpStars} source={this.props.rating} />
                                <Text style={CardStyle.yelpText}>{this.props.review_count} Reviews</Text>
                            </View>
                            <TouchableOpacity style={{width:'15%'}} onPress={() => Linking.openURL(this.props.businessURL)}>
                                <Image style={CardStyle.yelpImage} source={YelpBurst}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )
        }else {
            return (
                <View style={CardStyle.card}>
                    <Image source={{uri: `${this.props.imageURL}`}} style={CardStyle.cardImage}/>
                    <View style={CardStyle.yelpInfo}>
                        <Text style={CardStyle.cardTitle}>{this.props.name}</Text>
                        <View style={CardStyle.yelpReview}>
                            <View style={{width:'90%'}}>
                                <View>
                                    <Text style={CardStyle.yelpText}>{(this.props.distance / 1609.3).toFixed(2)} mi.</Text>
                                    <Text style={CardStyle.yelpText}>{this.props.address}</Text>
                                </View>
                                <Image style={CardStyle.yelpStars} source={this.props.rating} />
                                <Text style={CardStyle.yelpText}>{this.props.review_count} Reviews</Text>
                            </View>
                            <TouchableOpacity style={{width:'10%'}} onPress={() => WebBrowser.openBrowserAsync(this.props.businessURL)}>
                                <Image style={CardStyle.yelpImage} source={YelpBurst}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )
        }
    }
}

class LoadingCard extends React.Component {
    constructor(props) {
        super(props);
    }

    updateLobby = () => {
        data = [];
        if (this.props.isHost === true) {
            //updates the start field in the current session to true to send everyone to the swipe feature
            const firestore = getFirestore();
            const sessionDocRef = doc(firestore, "sessions", this.props.code);
            updateDoc(sessionDocRef, {
                zip: null,
                start: false,
                distance: null,
            })
                .then(() => {})
                .catch(() => {});

            //if user is the host
            this.props.navigation.navigate('HostSession', {code: this.props.code, zip: null, distance: null})
        } else {
            //if not, back to guest session
            this.props.navigation.navigate('Guest Session', {code: this.props.code})
        }
    }

    render() {
        return (
            <View style={CardStyle.loadContainer}>
                <View style={CardStyle.card}>
                    <View style={{
                        borderTopLeftRadius:10,
                        borderTopRightRadius:10,
                        borderBottomRightRadius:10,
                        borderBottomLeftRadius:10,
                        overflow: 'hidden',
                        width: "100%",
                        backgroundColor:"#fff"
                    }}>
                        <StrokeAnimation rewind={true} />
                        <View style={{paddingTop:15, paddingLeft:15, paddingRight:15}}>
                            <Text style={{color:"#000", fontSize:18}}>
                                {this.props.loadingMessage === "" ?
                                    "Finding Local Restaurants..."
                                    :
                                    "All out of Restaurants!"
                                }
                            </Text>
                            <Text style={{color:"#000", fontSize:18}}>
                                {this.props.loadingMessage === "" ?
                                    "Please remember, if you are waiting a long time for the restaurants to load, there may be no restaurants nearby or your connection was lost. If this is the case, please head back to the lobby and increase the distance or establish a connection."
                                    :
                                    this.props.loadingMessage
                                }
                            </Text>
                        </View>
                        <TouchableOpacity style={CardStyle.backButton} onPress={() => {
                            this.updateLobby();
                        }}>
                            <Ionicons style={IconStyles.iconBackLobby} name="arrow-undo-outline"/>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}

let data = [];
let unsubs = [];

const Cards = (props) => {
    let [resData, setResData] = useState([]);
    let [offset, setOffset] = useState(props.offset);
    let [calledYelp, setCalledYelp] = useState(false);
    let [loadingMessage, setLoadingMessage] = useState("");
    let [currentCard, setCurrentCard] = useState();
    const auth = getAuth()
    const userUid = auth.currentUser.uid;
    const firestore = getFirestore();

    const handleCardSet = useCallback((value) => {
        props.setCard(value)
    }, [props.setCard])

    const handleModalSet = useCallback((value) => {
        props.setModalVisible(value)
    }, [props.setModalVisible])

    const handleSetCounter = useCallback((value) => {
        props.setCounter(value)
    }, [props.setCounter])

    const navigation = useNavigation();
    let address = [];
    let name = [];
    let counter = 0;
    let swipeCardRef = React.createRef();
    const usersRef = collection(doc(firestore, 'sessions', props.code), 'users');

    useEffect(() => {
        if(resData.length === 0) {
            if(!calledYelp) {
                getYelpData().then(r => {
                    if(r.length !== 0) {
                        setData(r)
                        setResData(r)
                    } else {
                        setLoadingMessage("Oops! It seems you have run out of restaurants! Try increasing your distance to keep the search going!")
                    }

                    setCalledYelp(true)
                })
            }
        }
    }, [resData]);

    async function getYelpData() {
        return await YelpAPI(props.zip, props.categories, offset, props.distance, props.latitude, props.longitude)
    }

    function setData(restaurantData) {
        try {
            for (let i = 0; i < restaurantData.length; i++) {
                const current = restaurantData[i];

                const id = current.id;
                name = current.name;
                const price_range = current.price;
                address = current.location.address1;
                if (current.location.address2 === '' || current.location.address2 === null) {
                } else {
                    address += ', ';
                    address += current.location.address2;
                }

                if (current.location.address3 === '' || current.location.address3 === null) {
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

                if (current.image_url === '') {
                    imageURL = burgerJPG;
                } else {
                    imageURL = current.image_url;
                }

                const distance = current.distance;
                const review_count = current.review_count;

                if (Platform.OS === 'android') {
                    switch (rating) {
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
                    switch (rating) {
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

            shuffleRestaurants();
        } catch (error) {
            Sentry.Native.captureException(error.message);
        }
    }

    function shuffleRestaurants() {
        let currentIndex = data.length,  randomIndex;

        // While there remain elements to shuffle.
        while (currentIndex !== 0) {

            // Pick a remaining element.
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [data[currentIndex], data[randomIndex]] = [
                data[randomIndex], data[currentIndex]];
        }
    }

    function handleYup(card) {
        let match = false;
        let counter = 1;
        let restaurantID = card.id;

        setDoc(doc(usersRef, userUid), { [props.resCounter]: restaurantID }, { merge: true })
            .then(() => {
                handleSetCounter(props.resCounter + 1);
            })
            .catch((error) => {
                Sentry.Native.captureException(error.message);
            });

        let unsub = onSnapshot(usersRef, querySnapshot => {
            querySnapshot.forEach(documentSnapshot => {
                if (querySnapshot.size === 1) {
                    //sets card state and shows modal when solo
                    handleCardSet(card);
                    handleModalSet(true);
                    unsub();
                } else {
                    //if in a group, and match is not true
                    if (match === false) {
                        //compare current user to documentID to reduce redundancies
                        if (documentSnapshot.id !== userUid) {
                            //for each restaurant in firebase data
                            for (const restaurant in documentSnapshot.data()) {
                                //check if document data restaurant is equal to this specific restaurant for this card
                                if (documentSnapshot.data()[restaurant] === restaurantID) {
                                    //add counter to amount of people
                                    counter += 1;

                                    //if the amount of people in lobby are equal to the counter
                                    if (querySnapshot.size === counter) {
                                        //set match to true, set card state, show modal, and console matched
                                        match = true;
                                        handleCardSet(card);
                                        handleModalSet(true);
                                        unsub();
                                    }
                                }
                            }
                        }
                    }
                }
            });

            //reset counter so when snapshot detects changes, it doesn't over count
            counter = 1;
        });

        unsubs.push(unsub);
        return true;
    }

    function handleNope(card) {
        return true;
    }

    function loveIt() {
        const increment = 1;
        const sessionRef = doc(firestore, 'sessions', props.code);
        const matchedRef = doc(sessionRef, 'matched', props.card.id);

        // get the total number of users in the session
        const usersRef = collection(sessionRef, 'users');
        let sessionSize;
        const unsubFromSessionSize = onSnapshot(usersRef, (snapshot) => {
            sessionSize = snapshot.size;
        });

        let unsubscribeFromDocument;

        // perform the increment and update in a single transaction
        runTransaction(firestore, async (transaction) => {
            const docSnapshot = await transaction.get(matchedRef);
            const counter = (docSnapshot.exists()) ? docSnapshot.data().counter : 0;
            transaction.set(matchedRef, { counter: counter + increment }, { merge: true });
        }).then(() => {
            // listen for changes to the document and navigate to the final decision screen if a majority of the group wants it
            unsubscribeFromDocument = onSnapshot(matchedRef, (docSnapshot) => {
                if (docSnapshot.data() !== undefined && (docSnapshot.data().counter / sessionSize) > 0.50) {
                    unsubscribeFromDocument();
                    unsubFromSessionSize();
                    data = [];
                    navigation.navigate('Final Decision', {
                        id: docSnapshot.id,
                        code: props.code,
                        unsubs: unsubs,
                        isHost: props.isHost
                    });
                }
            });
        }).then(() => {
            unsubs.push(unsubscribeFromDocument);
            unsubs.push(unsubFromSessionSize);
        }).catch((error) => {
            Sentry.Native.captureException(error.message);
        })
        
        unsubs.push(unsubFromSessionSize)
        unsubs.push(unsubscribeFromDocument);
    }

    function hateIt() {
        const sessionRef = doc(firestore, 'sessions', props.code);
        const matchedRef = doc(sessionRef, 'matched', props.card.id);
        const usersRef = collection(sessionRef, 'users');

        let sessionSize;
        const unsubFromSessionSize = onSnapshot(usersRef, (snapshot) => {
            sessionSize = snapshot.size;
        });

        let unsubscribeFromDocument;

        getDoc(matchedRef).then((docSnapshot) => {
            if (!docSnapshot.exists()) {
                setDoc(matchedRef, { counter: 0 }).then(() => {
                    console.log("set document");
                }).catch((error) => {
                    Sentry.Native.captureException(error.message);
                });
            }

            unsubscribeFromDocument = onSnapshot(matchedRef, (docSnapshot) => {
                if (docSnapshot.data() !== undefined && (docSnapshot.data().counter / sessionSize) > 0.50) {
                    unsubscribeFromDocument();
                    unsubFromSessionSize();
                    //move screens. read document id, send that to next screen and pull data using the yelp api to
                    //populate the screen with information
                    data = [];
                    navigation.navigate('Final Decision',{id: docSnapshot.id, code: props.code, unsubs: unsubs})
                }
            });
        }).then(() => {
            unsubs.push(unsubscribeFromDocument);
            unsubs.push(unsubFromSessionSize);
        }).catch((error) => {
            Sentry.Native.captureException(error.message);
        });

        /*//basically the same as love it minus some features
        let matchedRef = firebase.firestore().collection('sessions').doc(props.code)
            .collection('matched').doc(props.card.id)

        let sessionSize;
        usersRef.onSnapshot(querySnapshot => {
            sessionSize = querySnapshot.size
        })

        matchedRef.get().then((doc) => {
            if (doc.data() === undefined) {
                matchedRef.set({
                    counter: 0
                }).then(() => {
                }).catch(() => {
                });
            }

            unsub = matchedRef.onSnapshot(docSnapshot => {
                if ((docSnapshot.data().counter / sessionSize) > 0.50) {
                    //move screens. read document id, send that to next screen and pull data using the yelp api to
                    //populate the screen with information
                    data = []
                    navigation.navigate('Final Decision', {id: docSnapshot.id, code: props.code, unsubs: unsubs})
                }
            })

            unsubs.push(unsub)
        })*/
    }

    return (
        <View style={CardStyle.container}>
            <Modal
                style={{flex: 1, justifyContent: 'center'}}
                animationType="slide"
                visible={props.modalVisible}
                onRequestClose={() => {
                    handleModalSet(!props.modalVisible);
                }}>
                <View style={CardStyle.modalView}>
                    <Text style={CardStyle.modalText}>Let's Eat!</Text>
                    <Image source={props.card.imageURL === burgerJPG ? props.card.imageURL : {uri: `${props.card.imageURL}`}} style={CardStyle.cardImageModal}/>
                    <Text style={CardStyle.modalText}>The group chose {'\n' + props.card.name}</Text>
                    <Pressable style={InputStyles.buttons}
                               onPress={() => {
                                   loveIt(props.card)
                                   handleModalSet(!props.modalVisible)
                               }}>
                        <Ionicons style={IconStyles.iconLeft} name="heart"/>
                        <Text style={InputStyles.buttonText}>Love It!</Text>
                        <Ionicons style={IconStyles.iconLeft} name="chevron-forward-outline"/>
                    </Pressable>
                    <Pressable style={InputStyles.buttons}
                               onPress={() => {
                                   hateIt(props.card)
                                   handleModalSet(!props.modalVisible)
                               }}>
                        <Ionicons style={IconStyles.iconLeft} name="heart-dislike"/>
                        <Text style={InputStyles.buttonText}>Keep Swiping</Text>
                        <Ionicons style={IconStyles.iconLeft} name="chevron-forward-outline"/>
                    </Pressable>
                </View>
            </Modal>
            {data.length === 0
                ?
                <LoadingCard code={props.code} offset={offset} navigation={navigation} isHost={props.isHost}
                             loadingMessage={loadingMessage}/>
                :
                <View style={CardStyle.container}>
                    <Swiper
                        ref={(swiper) => swipeCardRef = swiper}
                        onSwipedRight={() => handleYup(currentCard)}
                        onSwipedLeft={() => handleNope(currentCard)}
                        onSwipedAll={() => {
                            let size = data.length
                            data = []
                            setTimeout(() => setOffset(offset + size), 0);
                            setTimeout(() => setCalledYelp(false), 0);
                            setTimeout(() => setResData([]), 0);
                        }}
                        cards={data}
                        renderCard={(cardData, cardIndex) => {
                            setCurrentCard(cardData);

                            return (
                                <View style={{flex: 1, flexDirection: "column", justifyContent: "space-evenly"}}>
                                    <View style={{flex: 0.85}}>
                                        <Card {...cardData} />
                                    </View>
                                </View>
                            )}
                        }
                    >
                        <View style={CardStyle.yupNopeView}>
                            <TouchableOpacity style={CardStyle.yupNopeButtons} onPress={() => swipeCardRef.swipeRight()}>
                                <Ionicons style={{fontSize: 48}} name={"thumbs-up-outline"}/>
                            </TouchableOpacity>
                            <TouchableOpacity style={CardStyle.yupNopeButtons} onPress={() => swipeCardRef.swipeLeft()}>
                                <Ionicons style={{fontSize: 48}} name={"thumbs-down-outline"}/>
                            </TouchableOpacity>
                        </View>
                    </Swiper>
                    {/*<SwipeCards
                        ref={swipeCardRef}
                        cards={data}
                        renderCard={(cardData) => (
                            <View style={{flex: 1,flexDirection: "column", justifyContent: "space-evenly"}}>
                                <View style={{flex: 0.85}}>
                                    <Card {...cardData} />
                                </View>
                                <View style={CardStyle.yupNopeView}>
                                    <TouchableOpacity style={CardStyle.yupNopeButtons} onPress={() => {
                                        swipeCardRef.current.swipeYup()
                                        handleYup(swipeCardRef.current.state.card)
                                    }}>
                                        <Ionicons style={{fontSize: 48}} name={"thumbs-up-outline"}/>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={CardStyle.yupNopeButtons} onPress={() => {
                                        swipeCardRef.current.swipeNope()
                                        handleNope(swipeCardRef.current.state.card)
                                    }}>
                                        <Ionicons style={{fontSize: 48}} name={"thumbs-down-outline"}/>
                                    </TouchableOpacity>
                                </View>
                            </View>)
                        }
                        keyExtractor={(cardData) => String(cardData.id)}
                        renderNoMoreCards={() => {
                            let size = data.length
                            data = []
                            setTimeout(() => setOffset(offset + size), 0);
                            setTimeout(() => setCalledYelp(false), 0);
                            setTimeout(() => setResData([]), 0);
                        }}

                        actions={{
                            nope: {show: false, onAction: handleNope},
                            yup: {show: false, onAction: handleYup}
                        }}
                    />*/}
                </View>
            }
        </View>
    )
}

export default Cards;
