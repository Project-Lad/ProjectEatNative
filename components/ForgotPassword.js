import React, { Component } from 'react'
import {Alert, Button, StyleSheet, Text, TextInput, View} from 'react-native'
import firebase from "firebase";

class ForgotPassword extends Component {
    constructor() {
        super();
        this.state = {
            email: '',
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
                .then((res) => {
                    console.log(res)
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
            <View style={styles.container}>

                <TextInput
                    style={styles.inputStyle}
                    placeholder="Email"
                    value={this.state.email}
                    onChangeText={(val) => this.updateInputVal(val, 'email')}
                />
                <Button
                    color="#3740FE"
                    title="Reset Password"
                    onPress={() => this.forgotPassword()}
                />
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
    loginText: {
        color: '#3740FE',
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
