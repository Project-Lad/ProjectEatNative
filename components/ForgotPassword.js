import React, { Component } from 'react'
import {Alert, LogBox, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView} from 'react-native'
import firebase from "firebase";
import {IconStyles, InputStyles} from "./InputStyles";
import {Ionicons} from "@expo/vector-icons";
import SVGComponent from "./SVGLogo";
LogBox.ignoreLogs(['Setting a timer']);
class ForgotPassword extends Component {
    constructor() {
        super();
        this.state = {
            email: '',
            isLoading:false,
            isFocused:false
        }
    }
    updateInputVal = (val, prop) => {
        const state = this.state;
        state[prop] = val;
        this.setState(state);
    }
    forgotPassword = () => {
        if(this.state.email === '') {
            Alert.alert('Enter Email!')
        } else {
            this.setState({
                isLoading: true,
            })
            firebase.auth().sendPasswordResetEmail(this.state.email)
                .then(() => {
                    console.log('Email Sent')
                    this.setState({
                        isLoading: false,
                        email: '',
                        password: ''
                    })
                    this.props.navigation.navigate('Login')
                })
                .catch(error => this.setState({ errorMessage: error.message }))
        }
    }
    render() {
        return (
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={InputStyles.container}>
                <SVGComponent/>
                <TextInput
                    style={this.state.isFocused ? InputStyles.focusInputStyle : InputStyles.inputStyle}
                    placeholder="Email"
                    value={this.state.email}
                    keyboardType={'email-address'}
                    onChangeText={(val) => this.updateInputVal(val, 'email')}
                    onFocus={()=>{this.setState({isFocused:true})}}
                    onBlur={()=>{this.setState({isFocused:false})}}
                />
                <TouchableOpacity style={InputStyles.buttons} onPress={() => this.forgotPassword()}>
                    <Text style={InputStyles.buttonText}>Reset Password</Text>
                    <Ionicons style={IconStyles.arrowRight} name="chevron-forward-outline"/>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        )
    }
}
export default ForgotPassword

