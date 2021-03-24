import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {StyleSheet, TouchableOpacity, Text, TextInput, View} from "react-native";
import SwipeFeature from "./components/SwipeFeature";
import {NavigationContainer} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import ForgotPassword from "./components/ForgotPassword";
import Profile from "./components/Profile";
import EditAccount from "./components/EditAccount";
import Friendslist from "./components/Friendslist";
import AddFriend from "./components/AddFriend";

function MyStack() {
    return (
        <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{
                headerTitleAlign: 'center',
                headerStyle: {
                    backgroundColor: '#37edfe',
                },
                headerTintColor: '#333',
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
                name="Swipe Feature"
                component={SwipeFeature}
                options={{ title: 'Swipe Feature', headerLeft: null}}
            />
            <Stack.Screen
                name="Friendslist"
                component={Friendslist}
                options={({navigation}) =>({ title: 'Friends List',
                    headerRight: () => (
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Add Friend')}>
                            <Text style={{marginRight:20, fontSize:25}}>+</Text>
                        </TouchableOpacity>
                            )
                })}
            />
            <Stack.Screen
                name="Forgot Password"
                component={ForgotPassword}
                options={{ title: 'ForgotPassword'}}
            />
            <Stack.Screen
                name="Add Friend"
                component={AddFriend}
                options={{ title: 'Find Friends'}}
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
        </Stack.Navigator>
    );
}
const Stack = createStackNavigator();

export default function App() {
  return (
      <NavigationContainer>
          <MyStack/>
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
    },
});
