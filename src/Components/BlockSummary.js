import React, { Component } from "react";
import { View, Text } from "react-native";

import styles from "./StandardStyles.js";
import Utils from "../utils";
import moment from "moment";
import Colors from "./colors.js";

export default class BlockSummary extends Component {
  render() {
    let b = this.props.block;
    if (!b) {
      return <View />;
    }
    let height = b.height;
    if (!b.parsed) {
      b.parsed = JSON.parse(b.block);
    }
    let miner = b.parsed.miner;
    let transactionCount = b.numberOfTransactions;
    let reward = "" + Utils.calcReward(height) + " FSN";
    let t =
      (new Date().getTime() - new Date(b.timeStamp * 1000).getTime()) / 1000;

    let tText = transactionCount === 1 ? "Transaction" : "Transactions";

    return (
      <View style={styles.SummaryBoxColum}>
        <View style={{ height: 8 }} />
        <View style={styles.summaryDetailRow}>
          <Text style={styles.summaryLabel}>Block Height</Text>
          <View
            style={{
              width: 350,
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start"
            }}
          >
            <Text style={styles.summaryLine1Text}>{height}</Text>
            <Text
              style={styles.summaryLine2Text}
            >{`  (${transactionCount} ${tText})`}</Text>
          </View>
          <Text style={[styles.summaryLine1RightText,{alignText:'right',width:134}]}>{t}</Text>
        </View>
        <View style={styles.summaryDetailRow}>
          <Text style={styles.summaryLabel}>Mined By</Text>
          <Text style={styles.summaryLine2Text}>{miner}</Text>
        </View>
        <View style={styles.summaryDetailRow}>
          <Text style={styles.summaryLabel}>Reward</Text>
          <View style={{ backgroundColor: Colors.lightSuccessGreen }}>
            <Text style={styles.summaryLine3Text}>{reward}</Text>
          </View>
        </View>
        <View
          style={{
            marginTop: 6,
            marginBottom: 8,
            height: 1,
            width: 560,
            backgroundColor: this.props.divider === "true" ? Colors.orderGrey : "transparent"
          }}
        />
      </View>
    );
  }
}
