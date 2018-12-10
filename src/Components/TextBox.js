import React, { Component } from "react";
import { View, Text} from "react-native";

import styles from "./StandardStyles.js"


export default class TextBox extends Component {

 

    render() {
        let line3 
        if ( this.props.line3 ) {
            line3 = <Text key="l3" style={[styles.textBoxLine1Text,{color:this.props.colorLine3}]}>{this.props.line3}</Text>
        }
        return (<View style={styles.TextBoxColumn}>
               <Text style={styles.textBoxLine1Text}>{this.props.line1}</Text>
               <Text style={styles.textBoxLine2Text}>{this.props.line2}</Text>
               {line3}
            </View>)
    }
}