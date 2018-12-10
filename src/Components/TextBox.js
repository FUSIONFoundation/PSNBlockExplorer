import React, { Component } from "react";
import { View, Text} from "react-native";

import styles from "./StandardStyles.js"


export default class TextBox extends Component {

    render() {
        return (<View style={styles.TextBoxColumn}>
               <Text>{this.props.line1}</Text>
               <Text>{this.props.line2}</Text>
            </View>)
    }
}