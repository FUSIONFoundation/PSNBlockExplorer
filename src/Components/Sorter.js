import React, { Component } from "react";
import { View, Image, TouchableOpacity } from "react-native";

let sortUp = require( "../images/sort-up-light.svg")
let sortUpActive = require( "../images/sort-up-dark.svg")
let sortDown = require( "../images/sort-down-light.svg")
let sortDownActive = require( "../images/sort-down-dark.svg")

export default class Sorter extends Component {
  render() {

    let up = sortUp
    let down = sortDown 
    if (this.props.active) {
      if (this.props.direction === "asc") {
        up = sortUpActive
      } else {
        down = sortDownActive
      }
    }
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItem : 'center',
          marginLeft : 8,
          marginRight : 4,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            this.props.onPress("asc");
          }}
        >
            <Image
                resizeMode="contain"
                source={up}
                style={{width:12, height : 12}}
              />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            this.props.onPress("desc");
          }}
        >
           <Image
                resizeMode="contain"
                source={down}
                style={{width:12, height : 12}}
              />
        </TouchableOpacity>
      </View>
    );
  }
}
