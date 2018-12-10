import React, { Component } from "react";
import { View, Text, Image, StyleSheet } from "react-native";

import styles from "./StandardStyles.js"



export default class TitleBar extends Component {

    render() {
        return (<View style={styles.explorerTitleBar}>
            <Text style={styles.explorerTitleBarText}>{this.props.title}</Text>
            <Text style={styles.explorerTitleText}>Last Updated: </Text>
            </View>)
    }
}