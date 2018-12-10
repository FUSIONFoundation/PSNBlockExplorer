import React, { Component } from "react";
import { View, Text, Image, StyleSheet, ActivityIndicator } from "react-native";

import styles from "./StandardStyles.js";
import TitleBar from "./TitleBar.js";
import dataStore from "../api/dataAPI.js";
import Utils from '../utils'
import Colors from "./colors.js";

export default class DetailLine extends Component {

  render() {
    return (
      <View style={{ width: this.props.width || 640 }}>
        <View style={{flex:1,
                    flexDirection:'row',
                    width : 592,
                    alignItems : 'center',
                    justifyContent:'space-between'}}>
          <Text style={styles.detailLineLabel}>{this.props.label}</Text>
          <Text style={styles.detailLineValue}>{this.props.val}</Text>
        </View>
        <View style={{height:1,backgroundColor:this.props.hideBorder? 'transparent': Colors.orderGrey,width:592}}/>
      </View>
    );
  }
}
