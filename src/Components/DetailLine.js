import React, { Component } from "react";
import { View, Text} from "react-native";

import styles from "./StandardStyles.js";
import Colors from "./colors.js";

export default class DetailLine extends Component {

  render() {
    let color = this.props.clickable ? Colors.primaryBlue :  Colors.textBlue
    return (
      <View style={{ width: this.props.width || 620 }}>
        <View style={{flex:1,
                    flexDirection:'row',
                    width : 592,
                    marginLeft: 16,
                    alignItems : 'center',
                    justifyContent:'space-between'}}>
          <Text style={styles.detailLineLabel}>{this.props.label}</Text>
          <Text style={[styles.detailLineValue,{color}]}>{this.props.val}</Text>
        </View>
        <View style={{marginLeft:16,height:1,backgroundColor:this.props.hideBorder? 'transparent': Colors.orderGrey,width:592}}/>
      </View>
    );
  }
}
