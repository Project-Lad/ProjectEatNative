import React, { Component } from 'react'
import {Alert, Button, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native'
import firebase from "firebase";
import {IconStyles, InputStyles} from "./InputStyles";
import {Ionicons} from "@expo/vector-icons";

class ForgotPassword extends Component {
    constructor() {
        super();
        this.state = {
            email: '',
            isLoading:false
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
            <View style={InputStyles.container}>
                <TextInput
                    style={InputStyles.inputStyle}
                    placeholder="Email"
                    value={this.state.email}
                    keyboardType={'email-address'}
                    onChangeText={(val) => this.updateInputVal(val, 'email')}
                />
                <TouchableOpacity style={InputStyles.buttons} onPress={() => this.forgotPassword()}>
                    <Text style={InputStyles.buttonText}>Reset Password</Text>
                    <Ionicons style={IconStyles.arrowRight} name="chevron-forward-outline"/>
                </TouchableOpacity>

            </View>
        )
    }
}
export default ForgotPassword
const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 35,
        backgroundColor: '#fff'
    },
    inputStyle: {
        width: '100%',
        marginBottom: 15,
        paddingBottom: 15,
        alignSelf: "center",
        borderColor: "#ccc",
        borderBottomWidth: 1
    },
    preloader: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff'
    }
});
