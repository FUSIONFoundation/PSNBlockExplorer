import React, { Component } from "react";
import { View, Text, Image, StyleSheet } from "react-native";

import styles from "./StandardStyles.js";
import TitleBar from "./TitleBar.js";
import dataStore from "../api/dataAPI.js";

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = { data: {} };
    this.dataListener = this.dataListener.bind(this)
  }
  render() {
    let data = dataStore.datablock;
    console.log(data);
    return (
      <View>
        <TitleBar title="DashBoard" />
        <Text>Transactions {data.totalTransactions}</Text>
      </View>
    );
  }

  dataListener(data) {
    this.setState({ data: data });
  }

  componentDidMount() {
    dataStore.on("data", this.dataListener);
  }

  componentWillUnmount() {
    dataStore.removeEventListener("data", this.dataListener);
  }
}
