import React, { Component } from "react";
import { View, Text, Image, StyleSheet } from "react-native";

import styles from "./StandardStyles.js";
import TitleBar from "./TitleBar.js";
import dataStore from "../api/dataAPI.js";
import TextBox from './TextBox.js'
import Utils from '../utils'
import BlockSummary from './BlockSummary.js'
import TransactionSummary from './TransactionSummary.js'

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = { data: {} };
    this.dataListener = this.dataListener.bind(this);
  }

  renderLast5Blocks() {
    let blocks = [];
    let data = dataStore.datablock;
    let index = 0
    for (let b of data.last5Blocks) {
        index++
      blocks.push(<BlockSummary key={b.hash} block={b} divider={index<5?"true":"false"}/>)
    }
    return blocks;
  }

  renderLast5Transactions() {
    let transactions = [];
    let data = dataStore.datablock;
    let index = 0
    for (let t of data.last5Transactions) {
      transactions.push(<TransactionSummary key={t.hash} transaction={t} divider={index<4?"true":"false"}/>);
      index++
    }
    return transactions;
  }

  render() {
      // displayNumber(value, precision = 2, trimTrailingZeros = false) {
    let data = dataStore.datablock;
    let price = Utils.displayNumber( data.priceInfo.price , 5 , true ) 
    let market_cap = Utils.displayNumber(data.priceInfo.market_cap, 3 , true ) ;
    let supply = Utils.displayNumber(data.priceInfo.circulating_supply, 2 , true ) ;
    let maxBlock = data.maxBlock;
    let seconds = 0;
    if (data.lastTwoBlocks && data.lastTwoBlocks.length > 1) {
      seconds =
        data.lastTwoBlocks[0].timeStamp - data.lastTwoBlocks[1].timeStamp;
    }
    console.log(data);
    return (
      <View style={{width:1240}}>
        <TitleBar title="DashBoard" />
        <View style={styles.dashBoardHeader}>
          <View style={styles.currentPriceBox}>
            <View style={styles.simpleRow}>
              <TextBox line1="Current Price" line2={"$"+price} />
              <TextBox line1="Market Cap" line2={"$"+market_cap} />
              <TextBox line1="Circulating Supply" line2={"$"+supply} />
            </View>
          </View>
          <View style={{ width: 33, height: 1 }} />
          <View style={styles.currentPriceBox}>
            <View style={styles.simpleRow}>
              <TextBox line1="Block Height" line2={maxBlock} />
              <TextBox
                line1="Total Transactions"
                line2={data.totalTransactions}
              />
              <TextBox line1="Block Time" line2={seconds + "s"} />
            </View>
          </View>
        </View>
        <View style={styles.dashBoardHeader}>
          <View style={styles.currentPriceBox}>
            <Text style={styles.sectionHeader}>Recent Blocks</Text>
            {this.renderLast5Blocks()}
          </View>
          <View style={{ width: 33, height: 1 }} />
          <View style={styles.currentPriceBox}>
            <Text  style={styles.sectionHeader}>Recent Transactions</Text>
            {this.renderLast5Transactions()}
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
