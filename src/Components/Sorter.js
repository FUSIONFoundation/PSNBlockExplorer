import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import colors from "./colors";
import constants from "./constants";
import styles from "./StandardStyles.js";

export default class Sorter extends Component {
  render() {
    let ascColor = colors.orderGrey;
    let descColor = colors.orderGrey;
    if (this.props.active) {
      if (this.props.direction === "asc") {
        ascColor = colors.labelGrey;
      } else {
        descColor = colors.labelGrey;
      }
    }
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "flex-start",
          alignItem : 'flex-start'
        }}
      >
        <TouchableOpacity
          onPress={() => {
            this.props.onPress("asc");
          }}
        >
          <i
            style={{
              color: ascColor,
              marginLeft: 8,
              marginRight: 8,
              fontSize: 12,
            }}
            className="fa fa-sort-up"
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            this.props.onPress("desc");
          }}
        >
          <i
            style={{
              color: descColor,
              marginLeft: 8,
              marginRight: 8,
              fontSize: 12,
            }}
            className="fa fa-sort-down"
          />
        </TouchableOpacity>
      </View>
    );
  }
}
