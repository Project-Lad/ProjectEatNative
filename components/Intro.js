import React, {useEffect, useRef, useState} from "react";
import {Image, Button, View} from "react-native";
import Onboarding from "react-native-onboarding-swiper";
import {CardStyle, ProfileStyles} from "./InputStyles"
import SVGComponent from "./SVGLogo";

export default function Intro(){
    const onboardingRef = useRef(null);

    return(
        <Onboarding
            ref={onboardingRef}
            onSkip={() => console.log('skip')}
            onDone={() => console.log('done')}
            pages={[
                {
                    backgroundColor: '#fff',
                    image: <SVGComponent />,
                    title: 'Welcome to Out2Eat!',
                    subtitle: 'Swipe to continue to the Tutorial or tap Skip!',
                },
                {
                    backgroundColor: '#fe6e58',
                    image: <Image source={require('../assets/burger.gif')} />,
                    title: 'Profile Page',
                    subtitle: 'This is the subtitle that supplements the title.',
                },
                {
                    backgroundColor: '#999',
                    image: <Image source={require('../assets/YelpImage.png')} />,
                    title: 'Host Lobby',
                    subtitle: "This page is for host lobby",
                },
                {
                    backgroundColor: '#999',
                    image: <Image source={require('../assets/YelpImage.png')} />,
                    title: 'Matched!',
                    subtitle: "This page is for when you match",
                },
                {
                    backgroundColor: '#999',
                    image: <Image source={require('../assets/YelpImage.png')} />,
                    title: 'General Info and FAQ',
                    subtitle: "Where to find general information and FAQ page",
                },
                {
                    backgroundColor: '#999',
                    image: <Image source={require('../assets/YelpImage.png')} />,
                    title: 'Now go Swipe!',
                    subtitle: "Explain that now is time to go swipe",
                }
            ]}
        />
    )
}