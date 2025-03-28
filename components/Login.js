import React, { Component } from 'react';
import {
    Text,
    View,
    TextInput,
    Alert,
    ActivityIndicator,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    LogBox
} from 'react-native';
//import {firebase} from "firebase";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import "firebase/firestore";
import {InputStyles,IconStyles} from "./InputStyles";
import { Ionicons } from '@expo/vector-icons';
import SVGComponent from './SVGLogo'
import * as Sentry from "@sentry/react-native";
LogBox.ignoreLogs(['Setting a timer']);
export default class Login extends Component {

    constructor() {
        super();
        this.state = {
            email: '',
            password: '',
            isLoading: false,
            isFocused: false,
            onFocus:false
        }
    }

    updateInputVal = (val, prop) => {
        const state = this.state;
        state[prop] = val.trim();
        this.setState(state);
    }

    userLogin = () => {
        if(this.state.email === '' && this.state.password === '') {
            Alert.alert('Enter details to Sign In!')
        } else {
            this.setState({
                isLoading: true,
            })
            const auth = getAuth();
             signInWithEmailAndPassword(auth,this.state.email, this.state.password)
                .then((res) => {
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
                    Sentry.captureException(error.message);
                })
        }
    }
    //Focus functions for password field.
    onFocus() {
        this.setState({
            onFocus: true
        })
    }
    onBlur() {
        this.setState({
            onFocus:false
        })
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
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={InputStyles.container}>
                {/*<Image source={require('../assets/branding/out2eat_image.png')}  style={{marginBottom:'5%'}}/>*/}
                <SVGComponent style={{marginLeft:"auto", marginRight:"auto"}}/>

                <TextInput
                    style={this.state.isFocused ? InputStyles.focusInputStyle : InputStyles.inputStyle}
                    placeholder="Email"
                    value={this.state.email}
                    keyboardType={'email-address'}
                    onChangeText={(val) => this.updateInputVal(val, 'email')}
                    windowSoftInputMode="adjustPan"
                    autoComplete='email'
                    autoCapitalize={'none'}
                    onFocus={()=>{this.setState({isFocused:true})}}
                    onBlur={()=>{this.setState({isFocused:false})}}
                    placeholderTextColor={"#000"}
                />
                <TextInput
                    style={this.state.onFocus ? InputStyles.focusInputStyle : InputStyles.inputStyle}
                    placeholder="Password"
                    autoComplete='password'
                    value={this.state.password}
                    onChangeText={(val) => this.updateInputVal(val, 'password')}
                    maxLength={15}
                    secureTextEntry={true}
                    onFocus={()=>this.onFocus()}
                    onBlur={()=>this.onBlur()}
                    placeholderTextColor={"#000"}
                />
                <Text
                    style={InputStyles.ForgotPasswordText}
                    onPress={() => this.props.navigation.navigate('Forgot Password')}>
                    Forgot Password?
                </Text>
                <TouchableOpacity style={InputStyles.buttons} onPress={() => this.userLogin()}>
                    <Text style={InputStyles.buttonText}>Login</Text>
                    <Ionicons style={IconStyles.arrowRight} name="chevron-forward-outline"/>
                </TouchableOpacity>

                <Text
                    style={InputStyles.loginText}
                    onPress={() => this.props.navigation.navigate('SignUp')}>
                    Don't have account? Sign Up
                </Text>
            </KeyboardAvoidingView>
        );
    }
}


