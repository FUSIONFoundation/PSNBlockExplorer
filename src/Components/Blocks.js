import React, { Component } from "react";
import { View, Text, Image, StyleSheet } from "react-native";

import styles from "./StandardStyles.js"
import TitleBar from "./TitleBar.js"
import dataStore from "../api/dataAPI.js";

export default class Blocks extends Component {

    render() {

        return (<View>
               <TitleBar title="Blocks"/>
               <View>
                   <Text>{this.props.match.params.blockNumber}</Text>
               </View>
            </View>)
    }

    componentDidMount() {
        dataStore.setMenuPath( "Blocks" )
      }
}