import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity
} from "react-native";
import colors from "../colors";
import constants from "../constants";
import NodeSelect from "../NodeSelect";
import Header from "./Header";

var fusionLogo = require("../../images/explorer-logo.svg");
var boxes = require("./9Boxes.svg");

export default class AppSelect extends Component {
 
  constructor( props ) {
      super(props)
      this.state = {
        appSelectOpen: false
      };
      Header.setAppDisplay(this)
  }
  render() {
    if ( !this.state.appSelectOpen ) {
        return  <View></View>;
    }
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          Header.hideAppDisplay()
        }}
      >
        <View style={styles.modalBackground}>
          <View style={styles.popupMenuBox}>
            <Text>Apps</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

var styles = StyleSheet.create({
  modalBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0)"
  },
  popupMenuBox: {
    backgroundColor: colors.white,
    width: 224,
    boxShadow:
      "0 8px 16px 0 rgba(0, 15, 33, 0.16), 0 0 8px 0 rgba(0, 15, 33, 0.08);",
    borderWidth: 1,
    borderRadius: 3,
    borderColor: colors.orderGrey,
    position: "absolute",
    top: 64,
    left: 224,
    padding: 16
  },
  borderTitle: {
    width: 0.9,
    backgroundColor: colors.grey,
    height: 19,
    marginLeft: 14,
    marginRight: 14
  },
  titleAutoBuy: {
    fontFamily: constants.fontFamily,
    fontSize: 16,
    fontWeight: constants.boldFont,
    marginLeft: 8,
    color: colors.textBlue
  },
  programVersion: {
    fontFamily: constants.fontFamily,
    fontSize: 12,
    fontWeight: constants.regularFont,
    color: colors.textBlue,
    padding: 2,
    marginLeft: 16,
    backgroundColor: colors.grey
  },
  nodeSelectBox: {
    alignSelf: "center",
    marginRight: 32,
    marginLeft: 32
  }
});
