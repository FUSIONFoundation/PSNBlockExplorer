import React, { Component } from "react";
import { View, Text, Image, StyleSheet } from "react-native";

import styles from "./StandardStyles.js"
import TitleBar from "./TitleBar.js"
import dataStore from "../api/dataAPI.js"


export default class Dashboard extends Component {

    render() {
        let data = dataStore.datablock
        console.log( data )
        return (<View>
            <TitleBar title="DashBoard"/>
            </View>)
    }
}