import React, {useRef} from "react";
import {Image, View, Text, ScrollView} from "react-native";
import Onboarding from "react-native-onboarding-swiper";
import SVGComponent from "./SVGLogo";
import {useNavigation} from "@react-navigation/native";

export default function Intro(){
    const onboardingRef = useRef(null);
    const navigation = useNavigation()
    return(
        <Onboarding
            ref={onboardingRef}
            onSkip={() => navigation.navigate('Profile')}
            onDone={() => navigation.navigate('Profile')}
            imageContainerStyles={{paddingBottom: 15, marginTop:5}}
            titleStyles={{color: 'white', fontSize: 24, fontWeight: 'bold', padding: 0, margin: 0}}
            pages={[
                {
                    backgroundColor: '#2e344f',
                    image: <SVGComponent fill='white' viewBox="-80 -50 425 300"/>,
                    title: 'Welcome to Out2Eat!',
                    subtitle: 'Swipe to continue to the Tutorial or tap Skip!',
                },
                {
                    backgroundColor: 'rgba(46,52,79,1)',
                    image:
                        <View style={{width:'95%', alignItems:'center'}}>
                            <Image source={require('../assets/Onboarding/profile-onboard.png')} style={{aspectRatio:3/4, resizeMode:'contain',height:400}}/>
                        </View>,
                    title: 'Profile Screen',
                    subtitle:
                        <View style={{height:200}}>
                            <ScrollView>
                                <Text style={{color:"#fff", fontSize:16, paddingBottom:5}}>1. Tap on your profile pic to go to your settings.</Text>
                                <Text style={{color:"#fff", fontSize:16, paddingBottom:5}}>2. Tap on Create Lobby for your friends to join to find restaurants!</Text>
                                <Text style={{color:"#fff", fontSize:16, paddingBottom:5}}>3. Tap on Join Lobby to join your friends!</Text>
                            </ScrollView>
                        </View>,
                },
                {
                    backgroundColor: 'rgba(46,52,79,0.85)',
                    image: <View style={{width:'95%', alignItems:'center'}}>
                        <Image source={require('../assets/Onboarding/editAccount-onboard.png')} style={{aspectRatio:3/4, resizeMode:'contain',height:400}}/>
                    </View>,
                    title: 'Edit Account Screen',
                    subtitle:
                        <View style={{width:"95%"}}>
                            <ScrollView style={{ height:200}}>
                                <Text style={{color:"#fff", fontSize:16, paddingBottom:5}}>1. To update your profile picture Tap on the camera icon, and tap "Update" to change it!</Text>
                                <Text style={{color:"#fff", fontSize:16, paddingBottom:5}}>2. Tap on your username to modify, and tap "Update" to change it!</Text>
                                <Text style={{color:"#fff", fontSize:16, paddingBottom:5}}>3. Here you will find our Terms of Service and Privacy Policy</Text>
                                <Text style={{color:"#fff", fontSize:16, paddingBottom:5}}>4. Press Logout to be signed out of the app.</Text>
                            </ScrollView>
                        </View>,
                },{
                    backgroundColor: 'rgba(46,52,79,0.65)',
                    title: 'Lobby Host Screen',
                    image:
                        <View style={{width:'95%', alignItems:'center'}}>
                            <Image source={require('../assets/Onboarding/host-onboard.png')} style={{aspectRatio:3/4, resizeMode:'contain',height:400}}/>
                        </View>,
                    subtitle:
                        <View style={{width:"95%"}}>
                            <ScrollView style={{ height:200}}>
                                <Text style={{color:"#fff", fontSize:16, paddingBottom:5}}>1. Filter by cuisine and/or zipcode. Empty zipcode uses current location.</Text>
                                <Text style={{color:"#fff", fontSize:16, paddingBottom:5}}>2. Friends join here. Click start when everyone's here.</Text>
                                <Text style={{color:"#fff", fontSize:16, paddingBottom:5}}>3. Distance slider for restaurants. Up to 20 miles!</Text>
                                <Text style={{color:"#fff", fontSize:16, paddingBottom:5}}>4. Share this code for friends to join you!</Text>
                            </ScrollView>
                        </View>,
                },
                {
                    backgroundColor: 'rgba(249,124,77,0.65)',
                    title:  'Swipe Screen',
                    image:
                        <View style={{width:'95%', alignItems:'center'}}>
                            <Image source={require('../assets/Onboarding/swipeCard-onboard.png')} style={{aspectRatio:3/4, resizeMode:'contain',height:400}}/>
                        </View>,
                    subtitle:
                        <View style={{ width:"95%"}}>
                            <ScrollView style={{ height:200}}>
                                <Text style={{color:"#fff", fontSize:16, paddingBottom:5}}>1. Yelp information for this restaurant: distance, address, review count, and clickable logo for their Yelp page.</Text>
                                <Text style={{color:"#fff", fontSize:16, paddingBottom:5}}>2. Here's where you choose: thumbs up/down to indicate interest, or swipe left/right for dislike/like</Text>
                            </ScrollView>
                        </View>,
                },                {
                    backgroundColor: 'rgba(249,124,77,.85)',
                    title: 'Match Pop-Up',
                    image:
                        <View style={{width:'95%', alignItems:'center'}}>
                            <Image source={require('../assets/Onboarding/matchModal-onboard.png')} style={{aspectRatio:3/4, resizeMode:'contain',height:400}}/>
                        </View>,
                    subtitle:
                        <View style={{ width:"95%"}}>
                            <ScrollView style={{ height:200}}>
                                <Text style={{color:"#fff", fontSize:16, paddingBottom:5}}>1. Group's chosen restaurant that everyone swiped right on.</Text>
                                <Text style={{color:"#fff", fontSize:16, paddingBottom:5}}>2. To confirm, tap "Love It!" if you want to choose this restaurant.</Text>
                                <Text style={{color:"#fff", fontSize:16, paddingBottom:5}}>3. Select "Keep Swiping" to pass on the restaurant. Majority rule determines the final decision.</Text>
                            </ScrollView>
                        </View>,
                },
                {
                    backgroundColor: 'rgba(249,124,77,1)',
                    title: 'Final Decision',
                    image:
                        <View style={{width:'95%', alignItems:'center'}}>
                            <Image source={require('../assets/Onboarding/decision-onboard.png')} style={{aspectRatio:3/4, resizeMode:'contain',height:400}}/>
                        </View>,
                    subtitle:
                        <View style={{ width:"95%"}}>
                            <ScrollView style={{ height:200}}>
                                <Text style={{color:"#fff", fontSize:16, paddingBottom:5}}>1. Explore establishment details. Tap the Yelp! logo for additional information</Text>
                                <Text style={{color:"#fff", fontSize:16, paddingBottom:5}}>2. Call the restaurant using the phone number listed on Yelp! by tapping the button provided.</Text>
                                <Text style={{color:"#fff", fontSize:16, paddingBottom:5}}>3. Click here to quickly access Google Maps and navigate to the restaurant.</Text>
                                <Text style={{color:"#fff", fontSize:16, paddingBottom:5}}>4. Tap here to leave the lobby!</Text>
                            </ScrollView>
                        </View>,
                }
            ]}
        />
    )
}
