import React, {useEffect,useState} from 'react';
import SwipeFeature from "./components/SwipeFeature";
import {NavigationContainer} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import ForgotPassword from "./components/ForgotPassword";
import Profile from "./components/Profile";
import EditAccount from "./components/EditAccount";
import AddFriend from "./components/AddFriend";
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
                    backgroundColor: 'rgba(218,44,56,.25)',
                    elevation: 0,
                    shadowOpacity: 0,
                },
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
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
{/*            <Stack.Screen
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
            />*/}
            <Stack.Screen
                name="Guest Session"
                component={GuestSession}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name="Connect"
                component={Connect}
                options={{headerShown: false}}
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
                backgroundColor: 'rgba(218,44,56,.25)',
                elevation: 0,
                shadowOpacity: 0,
            },
            headerTintColor: '#2A232D',
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
    },[])

  return (
      <NavigationContainer>
          {isLoggedIn ? (<AuthStack/>) : (<LoginSignup/>)}
      </NavigationContainer>
  );
}
