import React, {useEffect, useState} from 'react';
import SwipeFeature from "./components/SwipeFeature";
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import ForgotPassword from "./components/ForgotPassword";
import Profile from "./components/Profile";
import EditAccount from "./components/EditAccount";
import HostSession from "./components/HostSession";
import GuestSession from "./components/GuestSession";
import Connect from "./components/Connect";
import Decision from "./components/Decision";
import Intro from "./components/Intro"
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {BackHandler, View, TouchableOpacity,Text} from "react-native";
import * as Sentry from 'sentry-expo';
import * as Linking from 'expo-linking';
import { ProfileStyles} from "./components/InputStyles";
import {StrokeAnimation} from "./components/AnimatedSVG";
import {Ionicons} from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';
async function fetchLaunchData() {
    const appData = await AsyncStorage.getItem("appLaunched");
    let firstLaunch;
    if(appData === null) {
        firstLaunch = true;
        await AsyncStorage.setItem("appLaunched", "false");
    } else {
        firstLaunch = false;
    }

    return firstLaunch
}

function AuthStack(props) {
    const navigation = useNavigation()
    return (
        <Stack.Navigator
            initialRouteName={props.firstLaunch ? "Intro" : "Profile"}
            screenOptions={{
                headerTitleAlign: 'center',
                headerTitleStyle: {
                    fontWeight: 'bold',
                    fontSize:24
                },
                gestureEnabled:false
            }
        }>
            {props.firstLaunch && (
                <Stack.Screen
                    options={{ headerShown: false }}
                    name="Intro"
                    component={Intro}
                />
            )}
            <Stack.Screen
                name="Profile"
                component={Profile}
                options={{ headerShown: false,}}
            />
            <Stack.Screen
                name="Swipe Feature"
                component={SwipeFeature}
                options={{ headerShown: false}}
            />
            <Stack.Screen
                name="Final Decision"
                component={Decision}
                options={{ headerShown: false}}
            />
            <Stack.Screen
                name="Forgot Password"
                component={ForgotPassword}
                options={{ headerShown: false, headerLeft: null}}
            />

            <Stack.Screen
                name="EditAccount"
                component={EditAccount}
                options={{ title: 'Edit Account',headerTintColor:'#2e344f'}}
            />
            <Stack.Screen
                name="HostSession"
                component={HostSession}
                options={{ headerShown:true,title: 'Lobby', headerLeft:null}}
            />
            <Stack.Screen
                name="Guest Session"
                component={GuestSession}
                options={{headerShown: true, title:'Lobby', headerLeft:null}}
            />
            <Stack.Screen
                name="Connect"
                component={Connect}
                options={{
                    headerShown: true,
                    headerTitle:'',
                    headerTintColor:'#2e344f',
                    headerLeft:()=>(
                        <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={{flexDirection:'row', alignItems:'center',justifyContent:'flex-start'}}>
                            <Ionicons style={{color:'#2e344f', fontSize:22}}  name="arrow-back"/>
                            {Device.brand === 'Apple'?<Text style={{color:'#2e344f', fontSize:18}}>Profile</Text>:null}
                        </TouchableOpacity>
                        ),
                    }}
            />
        </Stack.Navigator>
    );
}

function LoginSignup(){
    return(
    <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
            headerTitleAlign: 'center',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        }}>
        <Stack.Screen
            name="SignUp"
            component={SignUp}
            options={{ headerShown: false }}
        />
        <Stack.Screen
            name="Login"
            component={Login}
            options={{headerShown: false, headerLeft: null}}
        />
        <Stack.Screen
            name="Forgot Password"
            component={ForgotPassword}
            options={{ title: 'Forgot Password', headerTintColor:'#2e344f'}}
        />
    </Stack.Navigator>
    )
}
Sentry.init({
    dsn: "https://767ea43956cc4dbdbbb48abbeb8dffa7@o1403110.ingest.sentry.io/6735768",
    enableInExpoDevelopment: true,
    debug:true,
});

const Stack = createStackNavigator();
let linkPrefix = Linking.createURL('path/screen/')
const linking = {
    prefixes: [linkPrefix],
    config:{
        screens:{
            Connect:{
                path:'Connect/:code',
                parse: {
                    code: (code) => `${code}`,
                },
            },
        }
    }
}
export default function App() {
    const [isLoggedIn, setLogIn] = useState(false)
    const [isLoading, setIsLoading] = useState(true);
    const [firstLaunch, setFirstLaunch] = React.useState(false);
    const auth = getAuth();

    useEffect(()=>{
        fetchLaunchData().then(r => setFirstLaunch(r));

        onAuthStateChanged(auth,user => {
            if(user) {
                setLogIn(true)
            } else {
                setLogIn(false)
            }
        })

        const backAction = () => {
            return false;
        };

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        setTimeout(() => {setIsLoading(false)}, 1650)
    }, []);

    return (
        <NavigationContainer linking={linking}>
            {isLoading ?
                <View style={ProfileStyles.container}>
                    <StrokeAnimation viewBox="0 0 400 400"/>
                </View>
                :
                isLoggedIn ? (
                    <AuthStack firstLaunch={firstLaunch}/>
                ) : (
                    <LoginSignup/>
                )
            }
        </NavigationContainer>
    );
}
