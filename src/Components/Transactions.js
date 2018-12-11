import React, { Component } from "react";
import { View, Text, Image, StyleSheet } from "react-native";

import styles from "./StandardStyles.js";
import TitleBar from "./TitleBar.js";
import dataStore from '../api/dataAPI'

export default class Transactions extends Component {
  constructor(props) {
    super(props);

    this.state = {
      block: props.block,
      transaction : props.transaction,
      update : 0
    };

    this.dataListener = this.dataListener.bind( this )
  }

  dataListener(datablock) {
    this.setState({ update: this.state.update + 1 });
  }

  componentDidMount() {
    dataStore.setMenuPath("Blocks");
    dataStore.on("data", this.dataListener);
    dataStore.on("transactionsLoaded", this.dataListener);
  }

  componentWillUnmount() {
    dataStore.removeEventListener("transactionsLoaded", this.dataListener);
    dataStore.on("data", this.dataListener);
  }


  render() {
    return (
      <View>
        <TitleBar title="Transactions" />
      </View>
    );
  }

}
