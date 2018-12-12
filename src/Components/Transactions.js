import React, { Component } from "react";
import { View, Text, Image, StyleSheet } from "react-native";

import styles from "./StandardStyles.js";
import TitleBar from "./TitleBar.js";
import dataStore from "../api/dataAPI";
import TransactionListLine from "./TransactionListLine";

export default class Transactions extends Component {
  constructor(props) {
    super(props);

    this.state = {
      block: props.block,
      transaction: props.transaction,
      update: 0
    };

    this.dataListener = this.dataListener.bind(this);
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

  generateTransactionList() {
    let ret = [];
    if (!this.props.block) {
      return;
    }
    let b = dataStore.getBlock(this.state.block);
    if (b === "loading") {
      return <Text>Loading Block</Text>;
    }
    for (let t of b.parsed.transactions) {
      console.log(t);
      let transaction = dataStore.getTransaction(t);
      if (transaction === "loading") {
        ret.push(
          <View key={t}>
            <Text>loading {t}</Text>
          </View>
        );
      } else {
        ret.push(
          <View key={t}>
            <Text>loaded {t}</Text>
          </View>
        );
      }
    }
    return ret;
  }

  render() {
    return (
      <View key={"hash"} style={{ width: 1280, marginTop: 32 }}>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center"
          }}
        >
          <Text style={styles.largerTitleBar}>Transactions</Text>
        </View>
        <View style={styles.detailBox}>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center"
            }}
          >
            <View style={{ marginLeft: 16 }}>
              <Text>hi</Text>
              {this.generateTransactionList()}
              <View />
            </View>
          </View>
        </View>
      </View>
    );
  }
}
