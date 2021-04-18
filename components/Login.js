import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, ActivityIndicator } from 'react-native';
import firebase from "firebase";
import "firebase/firestore";

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
        state[prop] = val;
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
                        alert('invalid password')

                    }
                })
        }
    }

    render() {
        if(this.state.isLoading){
            return(
                <View style={styles.preloader}>
                    <ActivityIndicator size="large" color="#9E9E9E"/>
                </View>
            )
        }
        return (
            <View style={styles.container}>
                <TextInput
                    style={styles.inputStyle}
                    placeholder="Email"
                    value={this.state.email}
                    keyboardType={'email-address'}
                    onChangeText={(val) => this.updateInputVal(val, 'email')}
                    windowSoftInputMode="adjustPan"
                />
                <TextInput
                    style={styles.inputStyle}
                    placeholder="Password"
                    value={this.state.password}
                    onChangeText={(val) => this.updateInputVal(val, 'password')}
                    maxLength={15}
                    secureTextEntry={true}
                    windowSoftInputMode="adjustPan"
                />
                <Button
                    color="#e98477"
                    title="Sign In"
                    onPress={() => this.userLogin()}
                />

                <Text
                    style={styles.loginText}
                    onPress={() => this.props.navigation.navigate('SignUp')}>
                    Don't have account? Click here to signup
                </Text>
                <Text
                    style={styles.loginText}
                    onPress={() => this.props.navigation.navigate('Forgot Password')}>
                    Forgot Password?
                </Text>
            </View>
        );
    }
}

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
    loginText: {
        color: '#000',
        marginTop: 25,
        textAlign: 'center'
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
