import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from "react-native";
import SwipeFeature from "./components/SwipeFeature";
import {NavigationContainer, useBackButton} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import {Button} from "react-native-web";
import ForgotPassword from "./components/ForgotPassword";

function MyStack() {
    return (
        <Stack.Navigator
            initialRouteName="Signup"
            screenOptions={{
                headerTitleAlign: 'center',
                headerStyle: {
                    backgroundColor: '#3740FE',
                },
                headerTintColor: '#fff',
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
                options={
                    { title: 'Swipe Feature', headerLeft: null}}
            />
            <Stack.Screen
                name="Forgot Password"
                component={ForgotPassword}
                options={
                    { title: 'Forgot Password', headerLeft:()=>{
                        <Button title="Back" onPress={() => this.props.navigation.navigate('SignUp')}/>
                        }
                    }}
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
