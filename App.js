import { StatusBar } from 'expo-status-bar';
import React, {useEffect,useState} from 'react';
import {StyleSheet, TouchableOpacity, Text} from "react-native";
import SwipeFeature from "./components/SwipeFeature";
import {NavigationContainer, useIsFocused} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import ForgotPassword from "./components/ForgotPassword";
import Profile from "./components/Profile";
import EditAccount from "./components/EditAccount";
import AddFriend from "./components/AddFriend";
import FriendsList from "./components/FriendsList";
import HostSession from "./components/HostSession";
import GuestSession from "./components/GuestSession";
import Connect from "./components/Connect";
import Decision from "./components/Decision";
import firebase from "./firebase";

function AuthStack() {
    return (
        <Stack.Navigator
            initialRouteName="Profile"
            screenOptions={{
                headerTitleAlign: 'center',
                headerStyle: {
                    backgroundColor: '#EBBB5C',
                },
                headerTintColor: '#2A232D',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}>
            <Stack.Screen
                name="Swipe Feature"
                component={SwipeFeature}
                options={{ title: 'Swipe Feature', headerLeft: null}}
            />
            <Stack.Screen
                name="Final Decision"
                component={Decision}
                options={{ title: 'Final Decision', headerLeft: null}}
            />
            <Stack.Screen
                name="Forgot Password"
                component={ForgotPassword}
                options={{ title: 'ForgotPassword'}}
            />
            <Stack.Screen
                name="Profile"
                component={Profile}
                options={{ title: 'Profile', headerLeft: null}}
            />
            <Stack.Screen
                name="Edit Account"
                component={EditAccount}
                options={{ title: 'Edit Account',}}
            />
            <Stack.Screen
                name="HostSession"
                component={HostSession}
                options={{ title: 'Lobby',}}
            />
            <Stack.Screen
                name="Friends List"
                component={FriendsList}
                options={({navigation}) =>({ title: 'Friends List',
                    headerRight: () => (
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Add Friends')}>
                            <Text style={{marginRight:20, fontSize:25}}>+</Text>
                        </TouchableOpacity>
                    )
                })}
            />
            <Stack.Screen
                name="Guest Session"
                component={GuestSession}
                options={{title:'Lobby',}}
            />
            <Stack.Screen
                name="Connect"
                component={Connect}
                options={{title:'Connect to a Session',}}
            />
            <Stack.Screen
                name="Add Friends"
                component={AddFriend}
                options={{ title: 'Add Friends'}}
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
                backgroundColor: '#EBBB5C',
            },
            headerTintColor: '#2A232D',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        }}>
        <Stack.Screen
            name="SignUp"
            component={SignUp}
            options={{ title: 'Signup' }}
        />
        <Stack.Screen
            name="Login"
            component={Login}
            options={{title: 'Login', headerLeft: null}}
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
    },[])

  return (
      <NavigationContainer>
          {isLoggedIn ? (<AuthStack/>) : (<LoginSignup/>)}
      </NavigationContainer>
  );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    button: {
        alignItems: "center",
        backgroundColor: "#DDDDDD",
        padding: 10,
        width:250,
        marginTop:20,
        borderRadius:50,
        shadowColor: '#3E3C3C',
        shadowOffset: { width: 250, height: 2 },
        shadowOpacity: 0.2,
        elevation: 5,
    }
});
