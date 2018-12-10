import React, { Component } from "react";
import { View, Text, Image, StyleSheet } from "react-native";

import styles from "./StandardStyles.js";
import TitleBar from "./TitleBar.js";
import dataStore from "../api/dataAPI.js";

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = { data: {} };
    this.dataListener = this.dataListener.bind(this);
  }
  render() {
    let data = dataStore.datablock;
    let price = data.priceInfo.price
    let market_cap = data.priceInfo.market_cap
    let supply = data.priceInfo.circulating_supply
    let maxBlock = data.maxBlock
    let seconds = 0
    if ( data.lastTwoBlocks && data.lastTwoBlocks.length > 1 ) {
        seconds = data.lastTwoBlocks[0].timeStamp -  data.lastTwoBlocks[1].timeStamp
    }
    console.log(data);
    return (
      <View>
        <TitleBar title="DashBoard" />
        <View style={styles.dashBoardHeader}>
          <View style={styles.currentPriceBox}>
            <Text>Current Price {price}</Text>
            <Text>Market Cap {market_cap}</Text>
            <Text>Supply {supply}</Text>
          </View>
          <View style={{ width: 33, height: 1 }} />
          <View style={styles.currentPriceBox}>
            <Text>Block Height {maxBlock}</Text>
            <Text>Total Transactions {data.totalTransactions}</Text>
            <Text>Block Time {seconds}s</Text>
          </View>
        </View>
        <View style={styles.dashBoardHeader}>
          <View style={styles.currentPriceBox}>
                <Text>Recent Blocks</Text>
          </View>
          <View style={{ width: 33, height: 1 }} />
          <View style={styles.currentPriceBox}>
                <Text>Recent Transactions</Text>
          </View>
        </View>
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
