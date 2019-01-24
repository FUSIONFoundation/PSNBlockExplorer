import React, { Component } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from "react-native";

import "../App.css";
import colors from "./colors";
import "font-awesome/css/font-awesome.min.css";
import dataStore from "../api/dataAPI"
import styles from "./StandardStyles.js";


export default class BlockSelect extends Component {

  constructor(props) {
    super(props);

    this.state = {
        inputNodeMode : false,
        block : this.props.block,
        newBlock : ""
    }
  }


  render() {

    if (this.state.inputNodeMode) {
      return (
        <View>
          <TextInput
            style={styles.blockNodeInput}
            placeholder="enter #"
            autoCorrect={false}
            placeholderTextColor={colors.orderGrey}
            maxLength={128}
            value={this.state.newBlock}
            clearButtonMode="always"
            onChangeText={val => {
              this.setState({ newBlock: val });
            }}
            autoFocus={true}
            onBlur={() => {
              this.setState({ inputNodeMode: false });
            }}
            onKeyPress={a => {
              if (a.charCode === 13) {
                if (this.state.newBlock ) {
                    let b = parseInt( this.state.newBlock )
                    if ( isNaN(b) || b < 0 || b > dataStore.datablock.maxBlock  ) {
                        alert("Invalid block entered.  Please try again")
                    } else {
                        this.setState({ block : b, inputNodeMode: false });
                        this.props.onPress( b )
                    }
                }
              }
            }}
          />
        </View>
      );
    }

    return (
      <TouchableOpacity
        onPress={() => {
          this.setState({ inputNodeMode: true });
        }}
      >
            <Text style={[styles.blockWhiteBox]}>
              {this.state.block}
            </Text>
      </TouchableOpacity>
    );
  }
}
