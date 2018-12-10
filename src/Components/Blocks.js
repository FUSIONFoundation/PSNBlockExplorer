import React, { Component } from "react";
import { View, Text, Image, StyleSheet, ActivityIndicator } from "react-native";

import styles from "./StandardStyles.js";
import TitleBar from "./TitleBar.js";
import dataStore from "../api/dataAPI.js";

export default class Blocks extends Component {
  constructor(props) {
    super(props);
    let b = this.props.match.params.blockNumber;

    if (b) {
      if (isNaN(b) || b < 0) {
        b = -1;
      } else {
        b = parseInt(b);
      }
    }

    this.state = { block: b , update : 0};
    this.dataListener = this.dataListener.bind(this)
  }

  returnSingleBlock() {
    let block = dataStore.getBlock(this.state.block);

    if (block === "loading") {
      return (
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            marginLeft: 80,
            marginTop : 16,
            justifyContent: "flex-start",
            alignItems: "center"
          }}
        >
          <ActivityIndicator size="large" animating="true" />
          <Text style={styles.largerTitleBar}>{"Loading block " + this.state.block}</Text>
        </View>
      );
    }
    return (
        <View style={{width:1280, marginLeft:80,marginTop:16}}>
        <View style={{flex:1,flexDirection:'row',justifyContent:'flex-start', alignItems:'center'}}>
        <Text style={styles.largerTitleBar}>Block</Text>
        <View style={styles.blockGrayBox}>
            <Text style={styles.blockNumberText}>{this.state.block}</Text>
        </View>
        </View>
        </View>
    )
  }

  render() {
    if (this.state.block > 0) {
      return this.returnSingleBlock();
    }

    return (
      <View style={{ width: 1280 }}>
        <TitleBar title="Blocks" />
        <View>
          <Text>blockExploer</Text>
        </View>
      </View>
    );
  }

  dataListener(datablock) {
        this.setState( { update : this.state.update + 1 })
  }

  componentDidMount() {
    dataStore.setMenuPath("Blocks");
    dataStore.on("blocksLoaded", this.dataListener);
  }

  componentWillUnmount() {
    dataStore.removeEventListener("blocksLoaded", this.dataListener);
  }
}
