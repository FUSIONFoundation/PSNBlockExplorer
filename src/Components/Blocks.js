import React, { Component } from "react";
import { View, Text, Image, StyleSheet, ActivityIndicator } from "react-native";

import styles from "./StandardStyles.js";
import TitleBar from "./TitleBar.js";
import dataStore from "../api/dataAPI.js";
import Utils from "../utils";
import DetailLine from "./DetailLine";

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

    this.state = { block: b, update: 0 };
    this.dataListener = this.dataListener.bind(this);
  }

  returnSingleBlock() {
    let b = dataStore.getBlock(this.state.block);

    if (b === "loading") {
      return (
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            marginLeft: 80,
            marginTop: 16,
            justifyContent: "flex-start",
            alignItems: "center"
          }}
        >
          <ActivityIndicator size="large" animating="true" />
          <Text style={styles.largerTitleBar}>
            {"Loading block " + this.state.block}
          </Text>
        </View>
      );
    }

    let miner = b.parsed.miner;
    let transactionCount = b.numberOfTransactions;
    let reward = "" + Utils.calcReward(b.height) + " FSN";
    let t = Utils.timeAgo(new Date(b.timeStamp * 1000)) + " ago";
    let tText = transactionCount === 1 ? "Transaction" : "Transactions";

    return (
      <View style={{ width: 1280, marginLeft: 80, marginTop: 16 }}>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center"
          }}
        >
          <Text style={styles.largerTitleBar}>Block</Text>
          <View style={styles.blockGrayBox}>
            <Text style={styles.blockNumberText}>{this.state.block}</Text>
          </View>
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
            <View style={{paddingLeft:16}}>
              <DetailLine label="Block Height" val={this.state.block} />
              <DetailLine label="Transactions" val={transactionCount} />
              <DetailLine label="Age" val={t} />
              <DetailLine label="Reward" val={reward} />
              <DetailLine label="Hash" val={b.hash} />
              <DetailLine
                label="ParentHash"
                hideBorder={true}
                val={b.parsed.parentHash}
              />
            </View>
            <View style={{marginRight:8}}>
              <DetailLine label="Miner" val={miner} />
              <DetailLine label="Size" val={b.parsed.size} />
              <DetailLine label="Gas Used" val={b.parsed.gasUsed} />
              <DetailLine label="Gas Limit" val={b.parsed.gasLimit} />
              <DetailLine label="Nonce" val={b.parsed.nonce} />
              <DetailLine
                label="Extra Data"
                hideBorder={true}
                val={b.parsed.extraData}
              />
            </View>
            <View />
          </View>
        </View>
      </View>
    );
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
    this.setState({ update: this.state.update + 1 });
  }

  componentDidMount() {
    dataStore.setMenuPath("Blocks");
    dataStore.on("blocksLoaded", this.dataListener);
  }

  componentWillUnmount() {
    dataStore.removeEventListener("blocksLoaded", this.dataListener);
  }
}
