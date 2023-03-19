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
                    backgroundColor: 'rgba(46,52,79,0.85)',
                    image: <Image source={require('../assets/Onboarding/profile-onboard.png')} style={{width:"75%",height:450, borderRadius:15}}/>,
                    title: 'Profile Screen',
                    subtitle: <View>
                        <Text style={{color:"#fff", fontSize:16}}>1. Testing</Text>
                        <Text style={{color:"#fff", fontSize:16}}>2. Testing</Text>
                        <Text style={{color:"#fff", fontSize:16}}>3. Testing</Text>
                    </View>,
                },
                {
                    backgroundColor: 'rgba(46,52,79,0.65)',
                    title: 'Host Screen',
                    image: <Image source={require('../assets/Onboarding/host-onboard.png')} style={{width:"75%",height:450, borderRadius:15}}/>,
                    subtitle: <View>
                        <Text style={{color:"#fff", fontSize:16}}>1. Testing</Text>
                        <Text style={{color:"#fff", fontSize:16}}>2. Testing</Text>
                        <Text style={{color:"#fff", fontSize:16}}>3. Testing</Text>
                        <Text style={{color:"#fff", fontSize:16}}>4. Testing</Text>
                    </View>,
                },
                {
                    backgroundColor: 'rgba(249,124,77,0.65)',
                    title: 'Swipe Screen',
                    image: <Image source={require('../assets/Onboarding/swipeCard-onboard.png')} style={{width:"75%",height:450,borderRadius:15}}/>,
                    subtitle: <View>
                        <Text style={{color:"#fff", fontSize:16}}>1. Testing</Text>
                        <Text style={{color:"#fff", fontSize:16}}>2. Testing</Text>
                    </View>,
                },
                {
                    backgroundColor: 'rgba(249,124,77,.85)',
                    title: 'Match Modal',
                    image: <Image source={require('../assets/Onboarding/matchModal-onboard.png')} style={{width:"85%",height:450, borderRadius:15}}/>,
                    subtitle: <View>
                        <Text style={{color:"#fff", fontSize:16}}>1. Testing</Text>
                        <Text style={{color:"#fff", fontSize:16}}>2. Testing</Text>
                        <Text style={{color:"#fff", fontSize:16}}>3. Testing</Text>
                    </View>,
                },
                {
                    backgroundColor: 'rgba(249,124,77,1)',
                    title: 'Tutorial Finished',
                    image: <Image source={require('../assets/Onboarding/decision-onboard.png')} style={{width:"85%",height:450, borderRadius:15}}/>,
                    subtitle: <View>
                        <Text style={{color:"#fff", fontSize:16}}>1. Testing</Text>
                        <Text style={{color:"#fff", fontSize:16}}>2. Testing</Text>
                        <Text style={{color:"#fff", fontSize:16}}>3. Testing</Text>
                        <Text style={{color:"#fff", fontSize:16}}>4. Testing</Text>
                    </View>,
                }
            ]}
        />
    )
}
