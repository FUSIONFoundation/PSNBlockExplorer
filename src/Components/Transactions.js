import React, { Component } from "react";
import { View, Text, Image, StyleSheet } from "react-native";

import styles from "./StandardStyles.js";
import TitleBar from "./TitleBar.js";
import dataStore from "../api/dataAPI";
import TransactionListLine from "./TransactionListLine";
import Utils from "../utils";
import moment from "moment";
import Colors from "./colors.js";

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
    dataStore.removeEventListener("data", this.dataListener);
    dataStore.removeEventListener("transactionsLoaded", this.dataListener);
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
      let tr = dataStore.getTransaction(t);
      if (tr === "loading") {
        ret.push(
          <View key={t}>
            <Text>loading {t}</Text>
          </View>
        );
      } else {
        let hash = tr.parsed.hash;
        let from = tr.fromAddress;
        let to = tr.toAddress;
        let fusionCommand = t.fusionCommand;
        let extraCommand = tr.extraCommand;

        let shortHash = hash.substr(0, 32) + "...";

        let tm = Utils.timeAgo(new Date(tr.timeStamp * 1000));

        let midTo = Utils.midHashDisplay(to);
        let midFrom = Utils.midHashDisplay(from);

        let commandExtra = tr.commandExtra;
        let index = 0;

        ret.push(
          <View>
            <View
              key={tr.hash}
              style={{
                width: 1216,
                height: 40,
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start"
              }}
            >
              <Text style={styles.transactionShortHash}>{shortHash}</Text>
              <Text style={styles.transactionBlock}>{tr.height}</Text>
              <Text style={styles.transactionAge}>{tm}</Text>

              <Text style={styles.transactionCmd}>{fusionCommand}</Text>
              <Text style={styles.transactionExtra}>{commandExtra}</Text>
            </View>
            <View
              style={{
                height: 1,
                width: 1216,
                backgroundColor:
                  index++ < b.parsed.transactions.length
                    ? Colors.orderGrey
                    : "transparent"
              }}
            />
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
