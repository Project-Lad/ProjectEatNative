import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import {Container, Content} from 'native-base';
import Data from "./components/API.js";

export default function App() {
  return (
    <Container style={styles.container}>
      <View style={styles.content}>
        <Data/>
      </View>
      <StatusBar style="auto" />
    </Container>
  );
}

const styles = StyleSheet.create({
    container: {},
    content: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    card: {
        flex: 0.45,
        borderRadius: 8,
        shadowRadius: 25,
        shadowOpacity: 0.08,
        shadowOffset: {width: 0, height: 0},
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff'
    }
});
