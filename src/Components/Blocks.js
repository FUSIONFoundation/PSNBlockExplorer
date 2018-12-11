import React, { Component } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from "react-native";

import styles from "./StandardStyles.js";
import TitleBar from "./TitleBar.js";
import dataStore from "../api/dataAPI.js";
import Utils from "../utils";
import DetailLine from "./DetailLine";
import history from "../history.js";

export default class Blocks extends Component {
  constructor(props) {
    super(props);
    let b = this.props.match.params.blockNumber;

    if (b) {
      if ( typeof b === 'string' && b.startsWith('0x')) 
      {

      } else if (isNaN(b) || b < 0) {
        b = -1;
      } else {
        b = parseInt(b);
      }
    }

    this.state = { block: b, update: 0 };
    this.dataListener = this.dataListener.bind(this);
  }

  componentWillReceiveProps(newProps)
  {
      if (  this.props.match.params.blockNumber !==
           newProps.match.params.blockNumber ) 
           {
               let b = newProps.match.params.blockNumber
               if (b) {
                if ( typeof b === 'string' && b.startsWith('0x')) 
                {
          
                } else if (isNaN(b) || b < 0) {
                  b = -1;
                } else {
                  b = parseInt(b);
                }
              }
          
            this.setState( { block : b })
           }
  }

  returnSingleBlock() {
    let b = dataStore.getBlock(this.state.block);

    if (b === "loading") {
        let s = this.state.block 
        if ( typeof s  === 'string' ) {
            if ( s > 21 ) {
                s = Utils.midHashDisplay(s)
            }
        }
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
            {"Loading block " + s}
          </Text>
        </View>
      );
    }

    let miner = b.parsed.miner;
    let transactionCount = b.numberOfTransactions;
    let reward = "" + Utils.calcReward(b.height) + " FSN";
    let t = Utils.timeAgo(new Date(b.timeStamp * 1000)) + " ago";
    let tText = transactionCount === 1 ? "Transaction" : "Transactions";
    let parentHash = b.parsed.parentHash

    return (
      <View key={parentHash} style={{ width: 1280, marginLeft: 80, marginTop: 16 }}>
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
            <Text style={styles.blockNumberText}>{b.height}</Text>
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
            <View style={{ marginLeft: 16 }}>
              <DetailLine label="Block Height" val={b.height} />
              <DetailLine label="Transactions" val={transactionCount} />
              <DetailLine label="Age" val={t} />
              <DetailLine label="Reward" val={reward} />
              <DetailLine label="Hash" val={b.hash} />
              <TouchableOpacity onPress={() => {
                     dataStore.setMenuPath(  "Blocks" );
                     history.push(`/blocks/${parentHash}`);
              }}>
                <DetailLine
                  label="ParentHash"
                  hideBorder={true}
                  clickable={true}
                  val={b.parsed.parentHash}
                />
              </TouchableOpacity>
            </View>
            <View style={{ marginRight: 8 }}>
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
