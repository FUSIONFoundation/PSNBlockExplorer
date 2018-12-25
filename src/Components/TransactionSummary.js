import React, { Component } from "react";
import { View, Text , TouchableOpacity} from "react-native";

import styles from "./StandardStyles.js";
import Utils from "../utils";
import moment from "moment";
import Colors from "./colors.js";
import dataStore from "../api/dataAPI.js";
import history from "../history.js";

export default class TransactionSummary extends Component {
  render() {
    let t = this.props.transaction;
    if (!t) {
      return <View />;
    }
    if (!t.parsed) {
      t.parsed = JSON.parse(t.transaction);
    }
    let hash = t.parsed.hash;
    let from = t.fromAddress
    let to = t.toAddress
    let fusionCommand = t.fusionCommand
    let extraCommand = t.extraCommand

    let shortHash = hash.substr( 0, 32) + "..."
 
    let tm = Utils.timeAgo( new Date(t.timeStamp * 1000) ) + " ago"

    let midTo = Utils.midHashDisplay( to )
    let midFrom = Utils.midHashDisplay( from )

    return (
      <View style={styles.SummaryBoxColum}>
        <View style={{ height: 8 }} />
        <View style={styles.summaryDetailRow}>
          <Text style={styles.summaryLabel}>Transaction</Text>
          <View
            style={{
              width: 350,
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start"
            }}
          >
            <TouchableOpacity onPress={()=>{
                      dataStore.setMenuPath(  "Transactions" );
                      history.push(`/Transactions/${hash}`);
            }}>
            <Text style={styles.summaryLine1Text}>{shortHash}</Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.summaryLine1RightText,
            {width:120, marginRight:10}]}>{tm}</Text>
        </View>
        <View style={styles.summaryDetailRow}>
          <Text style={styles.summaryLabel}>Type/Asset</Text>
          <Text style={styles.summaryLine2Text}>{Utils.getFusionCmdDisplayName(fusionCommand, t.data)}</Text>
        </View>
        <View style={styles.summaryDetailRow}>
          <Text style={styles.summaryLabel}>From/To</Text>
            <Text style={[styles.summaryLine3Text,{color: Colors.primaryBlue,fontSize : 14}]}>{midFrom} / {midTo}</Text>
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
