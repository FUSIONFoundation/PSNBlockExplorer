import React, { Component } from "react";
import { View, Text, Image, StyleSheet } from "react-native";

import styles from "./StandardStyles.js"

import TitleBar from "./TitleBar.js"

export default class Assets extends Component {

    render() {
        return (<View>
            <TitleBar title="Assets"/>
            </View>)
    }
}