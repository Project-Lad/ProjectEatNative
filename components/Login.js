import React, { Component } from 'react';
import {StyleSheet, Text, View, TextInput, Alert, ActivityIndicator, TouchableOpacity} from 'react-native';
import firebase from "firebase";
import "firebase/firestore";
import {InputStyles,IconStyles} from "./InputStyles";
import { Ionicons } from '@expo/vector-icons';
export default class Login extends Component {

    constructor() {
        super();
        this.state = {
            email: '',
            password: '',
            isLoading: false
        }
    }

    updateInputVal = (val, prop) => {
        const state = this.state;
        state[prop] = val.trim();
        this.setState(state);
    }

    userLogin = (email, password) => {
        if(this.state.email === '' && this.state.password === '') {
            Alert.alert('Enter details to Sign In!')
        } else {
            this.setState({
                isLoading: true,
            })
             firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
                .then((res) => {
                    //console.log(res)
                    console.log('User logged-in successfully!')
                    this.setState({
                        isLoading: false,
                        email: '',
                        password: ''
                    })
                    this.props.navigation.navigate('Login',{screen:'Profile'})
                })
                .catch(error =>{
                    this.setState({
                        errorMessage: error.message,
                        isLoading:false
                    });
                    if(this.state.email || this.state.password !== firebase.auth().signInWithEmailAndPassword(this.state.email,this.state.password)){
                        alert('Invalid email or password')

                    }
                })
        }
    }

    render() {
        if(this.state.isLoading){
            return(
                <View style={InputStyles.preloader}>
                    <ActivityIndicator size="large" color="#9E9E9E"/>
                </View>
            )
        }
        return (
            <View style={InputStyles.container}>
                <TextInput
                    style={InputStyles.inputStyle}
                    placeholder="Email"
                    value={this.state.email}
                    keyboardType={'email-address'}
                    onChangeText={(val) => this.updateInputVal(val, 'email')}
                    windowSoftInputMode="adjustPan"
                />
                <TextInput
                    style={InputStyles.inputStyle}
                    placeholder="Password"
                    value={this.state.password}
                    onChangeText={(val) => this.updateInputVal(val, 'password')}
                    maxLength={15}
                    secureTextEntry={true}
                    windowSoftInputMode="adjustPan"
                />
                <TouchableOpacity style={InputStyles.buttons} onPress={() => this.userLogin()}>
                    <Text style={InputStyles.buttonText}>Login</Text>
                    <Ionicons style={IconStyles.arrowRight} name="chevron-forward-outline"/>
                </TouchableOpacity>

                <Text
                    style={InputStyles.loginText}
                    onPress={() => this.props.navigation.navigate('SignUp')}>
                    Don't have account? Sign Up
                </Text>
                <Text
                    style={InputStyles.loginText}
                    onPress={() => this.props.navigation.navigate('Forgot Password')}>
                    Forgot Password?
                </Text>
            </View>
        );
    }
}


