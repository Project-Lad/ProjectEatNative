import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, TouchableOpacity } from 'react-native';
import firebase from "firebase";
import "firebase/firestore";

export default class Dashboard extends Component {
    signOut = () => {
        firebase.auth().signOut().then(() => {
            this.props.navigation.navigate('Login')
        })
            .catch(error => this.setState({ errorMessage: error.message }))
    }

    render() {
        this.state = {
            displayName: firebase.auth().currentUser.displayName,
            email: firebase.auth().currentUser.email
        }
        return (
            <View style={styles.container}>
                <View style = {styles.card}>
                    <Text style = {styles.textStyle}>
                        Username: {this.state.displayName}
                    </Text>
                    <Text style = {styles.textStyle}>
                        Email: {this.state.email}
                    </Text>
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => this.props.navigation.navigate('Edit Account')}>
                        <Text>Edit Account</Text>
                    </TouchableOpacity>
                </View>

                <View styles={styles.buttonView}>
                    <TouchableOpacity
                        onPress={() => this.props.navigation.navigate('HostSession')}
                        style = {styles.buttonStyle}
                    >
                        <Text style={styles.textButton}>Generate Code</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => this.props.navigation.navigate('Friends List')}
                        style = {styles.buttonStyle}
                    >
                        <Text style={styles.textButton}>Friends List</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.buttonStyle}
                        onPress={() => this.props.navigation.navigate('Swipe Feature')}>
                        <Text style={styles.textButton}>Swipe Feature</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.buttonStyle}
                        onPress={() => this.props.navigation.navigate('Connect')}>
                        <Text style={styles.textButton}>Connect to a Session</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => this.signOut()}
                        style = {styles.buttonStyle}
                    >
                        <Text style={styles.textButton}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: "flex",
        padding: 25,
        backgroundColor: '#fff'
    },
    textStyle: {
        fontSize: 15,
        marginBottom: 10,
    },
    card:{
        backgroundColor: '#fff',
        justifyContent:'center',
        alignItems: 'center',
        width:'100%',
        height:'50%',
        borderRadius:10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 6,
        marginBottom:10
    },
    editButton:{
        position:'absolute',
        bottom:20,
        right:10,
    },
    buttonView:{
        flex: 1,
        alignSelf: "center",
    },
    textButton:{
        color:'#fff',
        textAlign:'center'
    },
    buttonStyle:{
        marginBottom: 10,
        width:"100%",
        backgroundColor:"#e98477",
        padding:10,
        borderRadius:5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 4,
    }
});
