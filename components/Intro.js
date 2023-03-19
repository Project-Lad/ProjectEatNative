import React, {useRef} from "react";
import {Image, View, Text}from "react-native";
import Onboarding from "react-native-onboarding-swiper";
import SVGComponent from "./SVGLogo";
import {useNavigation} from "@react-navigation/native";
import {InputStyles} from "./InputStyles";
export default function Intro(){
    const onboardingRef = useRef(null);
    const navigation = useNavigation()
    return(
        <Onboarding
            ref={onboardingRef}
            onSkip={() => navigation.navigate('Profile')}
            onDone={() => navigation.navigate('Profile')}
            pages={[
                {
                    backgroundColor: '#2e344f',
                    image: <SVGComponent fill='white' viewBox="-80 -50 425 300"/>,
                    title: 'Welcome to Out2Eat!',
                    subtitle: 'Swipe to continue to the Tutorial or tap Skip!',
                },
                {
                    backgroundColor: 'rgba(46,52,79,1)',
                    image: <Image source={require('../assets/Onboarding/profile-onboard.png')} style={{width:"75%",height:450, borderRadius:15}}/>,
                    title: 'Home Screen',
                    subtitle: <View>
                        <Text style={{color:"#fff", fontSize:16}}>1. This is where your username is displayed along with the profile picture which can be tapped to go to your settings.</Text>
                        <Text style={{color:"#fff", fontSize:16}}>2. This is where you will create a lobby for your friends to join to find restaurants!</Text>
                        <Text style={{color:"#fff", fontSize:16}}>3. This is where you tap to join your friend's lobbies!</Text>
                    </View>,
                },
                {
                    backgroundColor: 'rgba(46,52,79,0.85)',
                    image: <Image source={require('../assets/Onboarding/editAccount-onboard.png')} style={{width:"75%",height:450, borderRadius:15}}/>,
                    title: 'Edit Account Screen',
                    subtitle: <View>
                        <Text style={{color:"#fff", fontSize:16}}>1. This is where you can change your profile picture. Tap on the camera to change your photo, and tap "Update" to change it!</Text>
                        <Text style={{color:"#fff", fontSize:16}}>2. You can change your username at any point. Just edit the name, and tap "Update" to change your username!</Text>
                        <Text style={{color:"#fff", fontSize:16}}>3. This is where important documents can be found. Here you can find our Privacy Policy and our Terms of Service. Any documents that need to be added in the future can be found here.</Text>
                        <Text style={{color:"#fff", fontSize:16}}>4. Here you can logout by tapping the button.</Text>
                    </View>,
                },
                {
                    backgroundColor: 'rgba(46,52,79,0.65)',
                    title: 'Lobby Host Screen',
                    image: <Image source={require('../assets/Onboarding/host-onboard.png')} style={{width:"75%",height:450, borderRadius:15}}/>,
                    subtitle: <View>
                        <Text style={{color:"#fff", fontSize:16}}>1. This is where you will enter your zipcode, but you may leave it blank to use your current location! You will also see a filter button on the right-hand side!</Text>
                        <Text style={{color:"#fff", fontSize:16}}>2. This is where your friends will load when they join. When everyone appears here, click start at the bottom!</Text>
                        <Text style={{color:"#fff", fontSize:16}}>3. This is your distance slider to find restaurants within that specified distance. This reached up to 20 miles!</Text>
                        <Text style={{color:"#fff", fontSize:16}}>4. This is where your share code is located. This is the code your friends will enter when they want to join you!</Text>
                    </View>,
                },
                {
                    backgroundColor: 'rgba(249,124,77,0.65)',
                    title: 'Swipe Screen',
                    image: <Image source={require('../assets/Onboarding/swipeCard-onboard.png')} style={{width:"75%",height:450,borderRadius:15}}/>,
                    subtitle: <View>
                        <Text style={{color:"#fff", fontSize:16}}>1. This is the restaurant. This displays information directly from Yelp! This will show you the distance, the address, the review count, and you can click on the Yelp! logo to go right to their Yelp! page.</Text>
                        <Text style={{color:"#fff", fontSize:16}}>2. This is where you make your selection. You may select thumbs up or thumbs down based on if you want to go here. You may also swipe left for dislike, or right if you like them.</Text>
                    </View>,
                },
                {
                    backgroundColor: 'rgba(249,124,77,.85)',
                    title: 'Match Pop-Up',
                    image: <Image source={require('../assets/Onboarding/matchModal-onboard.png')} style={{width:"85%",height:450, borderRadius:15}}/>,
                    subtitle: <View>
                        <Text style={{color:"#fff", fontSize:16}}>1. This shows you the restaurant that the group chose. This will only appear when everyone likes the restaurant. Here you make the final decision.</Text>
                        <Text style={{color:"#fff", fontSize:16}}>2. If you officially want to go to this restaurant, you tap on "Love It!" to finalize your vote.</Text>
                        <Text style={{color:"#fff", fontSize:16}}>3. If you do not want to go to this restaurant, you hit "Keep Swiping". However, the votes are tallied by majority rule! So when majority of people vote "Love It!", the decision will be made!</Text>
                    </View>,
                },
                {
                    backgroundColor: 'rgba(249,124,77,1)',
                    title: 'Final Decision',
                    image: <Image source={require('../assets/Onboarding/decision-onboard.png')} style={{width:"85%",height:450, borderRadius:15}}/>,
                    subtitle: <View>
                        <Text style={{color:"#fff", fontSize:16}}>1. This shows you all of the information of the establishment. This will show address, rating, review count, Yelp! logo (which is still clickable to see all information), and multiple pictures that you can swipe through!</Text>
                        <Text style={{color:"#fff", fontSize:16}}>2. This button appears when you are able to call the restaurant using the phone number listed on Yelp!</Text>
                        <Text style={{color:"#fff", fontSize:16}}>3. You can click here to go right to Google Maps and find this restaurant to chart your destination.</Text>
                        <Text style={{color:"#fff", fontSize:16}}>4. Tap here when you are finished to leave the lobby!</Text>
                    </View>,
                }
            ]}
        />
    )
}
