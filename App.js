import React, {useEffect,useState} from 'react';
import SwipeFeature from "./components/SwipeFeature";
import {NavigationContainer} from '@react-navigation/native';
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
import firebase from "./firebase";
import {Alert, BackHandler} from "react-native";

function AuthStack() {
    return (
        <Stack.Navigator
            initialRouteName="Profile"
            screenOptions={{
                headerTitleAlign: 'center',
                headerStyle: {
                    backgroundColor: '#2decb4',

                },
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
                gestureEnabled:false
            }}>
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
                name="Profile"
                component={Profile}
                options={{ headerShown: false,}}
            />
            <Stack.Screen
                name="Edit Account"
                component={EditAccount}
                options={{ title: 'Edit Account',}}
            />
            <Stack.Screen
                name="HostSession"
                component={HostSession}
                options={{ title: 'Lobby', headerLeft:null}}
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
            headerStyle: {
                backgroundColor: '#2decb4',

            },
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
            options={{ title: 'ForgotPassword'}}
        />
    </Stack.Navigator>
    )
}

const Stack = createStackNavigator();

export default function App() {
    const [isLoggedIn, setLogIn] = useState(false)

    useEffect(()=>{
        firebase.auth().onAuthStateChanged(user => {
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
    },[])

  return (
      <NavigationContainer>
          {isLoggedIn ? (<AuthStack/>) : (<LoginSignup/>)}
      </NavigationContainer>

  );
}
