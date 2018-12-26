import React, { Component } from "react";
import {
  View,
  Text,
  Clipboard,
  TouchableOpacity,
  Image,
  StyleSheet
} from "react-native";

import styles from "./StandardStyles.js";
import TitleBar from "./TitleBar.js";
import dataStore from "../api/dataAPI";
import TransactionListLine from "./TransactionListLine";
import Utils from "../utils";
import moment from "moment";
import colors from "./colors.js";
import BigNumber from "big-number";
import history from "../history.js";
import Pager from "./Pager";
import currentDataState from "../api/dataAPI.js";

export default class Transactions extends Component {
  constructor(props) {
    super(props);
    let hash =
      this.props.isExact || !props.match
        ? null
        : props.match.params.transactionHash;

    this.state = {
      block: props.block,
      transaction: props.transaction,
      sortField: "timestamp",
      direction: "desc",
      index: 0,
      size: 20,
      update: 0,
      hash: hash
    };

    this.dataListener = this.dataListener.bind(this);
    this.mounted = false;
  }

  dataListener(datablock) {
    if (this.mounted) {
      this.setState({ update: this.state.update + 1 });
    }
  }

  componentDidMount() {
    this.mounted = true;
    if (this.props.history) {
      dataStore.setMenuPath("Transactions");
    }
    dataStore.on("data", this.dataListener);
    dataStore.on("transactionsLoaded", this.dataListener);
  }

  componentWillUnmount() {
    this.mounted = false;
    dataStore.removeEventListener("data", this.dataListener);
    dataStore.removeEventListener("transactionsLoaded", this.dataListener);
  }

  componentWillReceiveProps(newProps) {
    if (this.props.match) {
      this.setState({ hash: newProps.match.params.transactionHash });
    } else {
      this.setState({ hash: undefined });
    }
  }

  renderAssetField(tr) {
    return <Text style={styles.transactionExtra}>loading...</Text>;
  }

  generateTransactionList() {
    let ret = [];
    let transactions;
    let b;

    if (!this.state.block) {
      let { index, sortField, direction, size } = this.state;
      transactions = dataStore.generateTransactionListFromTime(
        index,
        sortField,
        direction,
        size,
        () => {
          if (this.mounted) {
            this.setState({ update: this.state.update + 1 });
          }
        }
      );
      if (transactions === "loading") {
        return <Text>Loading Transaction List...</Text>;
      }
    } else {
      b = dataStore.getBlock(this.state.block);
      if (b === "loading") {
        return <Text>Loading Block</Text>;
      }
      transactions = b.parsed.transactions;
    }
    if (!transactions || transactions.length === 0) {
      return <Text>No Transactions</Text>;
    }
    for (let t of transactions) {
      let tr = dataStore.getTransaction(t);
      if (tr === "loading") {
        ret.push(
          <View key={t}>
            <Text>loading {t}</Text>
          </View>
        );
      } else {
        let hash = tr.hash;
        let from = tr.fromAddress;
        let to = tr.toAddress;
        let data = tr.data;
        let fusionCommand = Utils.getFusionCmdDisplayName(
          tr.fusionCommand,
          data
        );
        let extraCommand = tr.extraCommand;

        let shortHash = hash.substr(0, 33) + "...";

        let tm = Utils.timeAgo(new Date(tr.timeStamp * 1000));

        let midTo = Utils.midHashDisplay(to);
        let midFrom = Utils.midHashDisplay(from);

        let commandExtra = tr.commandExtra;
        let index = 0;

        let gasPrice = BigNumber(tr.transaction.gasPrice).multiply(
          tr.receipt.gasUsed
        );

        gasPrice = Utils.formatWei(gasPrice.toString());

        ret.push(
          <View key={hash}>
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
              <TouchableOpacity
                onPress={() => {
                  dataStore.setMenuPath("Transactions");
                  history.push(`/Transactions/${hash}`);
                }}
              >
                <Text style={styles.transactionShortHash}>{shortHash}</Text>
              </TouchableOpacity>
              <Text style={styles.transactionBlock}>{tr.height}</Text>
              <Text style={styles.transactionAge}>{tm}</Text>

              <Text style={styles.transactionCmd}>{fusionCommand}</Text>
              {this.renderAssetField()}
              <Text style={styles.transactionFee}>{gasPrice}</Text>
            </View>
            <View
              style={{
                height: 1,
                width: 1216,
                backgroundColor:
                  index++ < transactions.length
                    ? colors.orderGrey
                    : "transparent"
              }}
            />
          </View>
        );
      }
    }
    return ret;
  }

  renderOneTransaction() {
    let t = this.state.hash;
    let ret;
    let tr = dataStore.getTransaction(t);

    let title = (
      <View
        key="title"
        style={{ flex: 1, flexDirection: "row", justifyContent: "flex-start" }}
      >
        <TitleBar key="title" title="Transaction" noUpdateTime={true}>
          <View>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                overflow: "hidden",
                padding: 4,
                backgroundColor: colors.tagGrey
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  Clipboard.setString(t);
                }}
              >
                <Text>
                  {t}
                  <i style={{ marginLeft: 4 }} className="fa fa-copy" />
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TitleBar>
      </View>
    );

    if (tr === "loading") {
      return (
        <View key={t}>
          {title}

          <View style={[styles.detailBox, { marginLeft: 80 }]}>
            <Text>loading {t}</Text>
          </View>
        </View>
      );
    } else {
      let hash = tr.hash;
      let from = tr.fromAddress;
      let to = tr.toAddress;
      let data = tr.data;
      let fusionCommand = Utils.getFusionCmdDisplayName(tr.fusionCommand, data);
      let extraCommand = tr.extraCommand;

      let shortHash = hash.substr(0, 33) + "...";

      let d = new Date(tr.timeStamp * 1000);
      let tm = Utils.timeAgo(d) + " (" + moment(d).format("LLL") + ")";

      let midTo = Utils.midHashDisplay(to);
      let midFrom = Utils.midHashDisplay(from);

      let commandExtra = tr.commandExtra;
      let index = 0;

      let gasPrice = BigNumber(tr.transaction.gasPrice).multiply(
        tr.receipt.gasUsed
      );

      gasPrice = Utils.formatWei(gasPrice.toString());
      //debugger

      ret = (
        <View key={hash}>
          {title}

          <View
            style={[
              styles.detailBox,
              { marginLeft: 80, paddingBottom: 0, paddingTop: 0 }
            ]}
          >
            <View style={{ flex: 1, flexDirection: "row" }}>
              <View style={{ width: 503 }}>
                <Text>
                  {Utils.getFusionCmdDisplayName(fusionCommand, data)}
                </Text>
              </View>
              <View
                style={{
                  width: 1,
                  height: 480,
                  backgroundColor: colors.orderGrey
                }}
              />
              <View
                style={{
                  width: 617,
                  padding: 32,
                  alignItems: "flex-start",
                  justifyContent: "flex-start"
                }}
              >
                <View style={styles.transactionDetailRow}>
                  <Text style={styles.transactionDetailLabel}>Status</Text>
                  <Text style={styles.transactionDetailValue}>true</Text>
                </View>
                <View style={styles.transactionDetailBorder} />
                <View style={styles.transactionDetailRow}>
                  <Text style={styles.transactionDetailLabel}>
                    Transaction Type
                  </Text>
                  <Text style={styles.transactionDetailValue}>
                    {Utils.getFusionCmdDisplayName(fusionCommand, data)}
                  </Text>
                </View>
                <View style={styles.transactionDetailBorder} />
                <View style={styles.transactionDetailRow}>
                  <Text style={styles.transactionDetailLabel}>
                    Transaction Hash
                  </Text>
                  <Text style={styles.transactionDetailValue}>{hash}</Text>
                </View>
                <View style={styles.transactionDetailBorder} />
                <View style={styles.transactionDetailRow}>
                  <Text style={styles.transactionDetailLabel}>Block</Text>
                  <TouchableOpacity
                    onPress={() => {
                      window.scrollTo(0, 0);
                      dataStore.setMenuPath("Blocks");
                      history.push(`/blocks/${tr.height}`);
                    }}
                  >
                    <Text style={styles.transactionDetailBlock}>
                      {tr.height}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.transactionDetailBorder} />
                <View style={styles.transactionDetailRow}>
                  <Text style={styles.transactionDetailLabel}>Age</Text>
                  <Text style={styles.transactionDetailValue}>{tm}</Text>
                </View>
                <View style={styles.transactionDetailBorder} />
                <View style={styles.transactionDetailRow}>
                  <Text style={styles.transactionDetailLabel}>Gas Used</Text>
                  <Text style={styles.transactionDetailValue}>
                    {tr.receipt.gasUsed}
                  </Text>
                </View>
                <View style={styles.transactionDetailBorder} />
                <View style={styles.transactionDetailRow}>
                  <Text style={styles.transactionDetailLabel}>Nonce</Text>
                  <Text style={styles.transactionDetailValue}>
                    {tr.transaction.nonce}
                  </Text>
                </View>
                <View style={styles.transactionDetailBorder} />
                <View style={styles.transactionDetailRow}>
                  <Text style={styles.transactionDetailLabel}>Input</Text>
                  <Text style={styles.transactionDetailValue}>
                    {tr.transaction.input}
                  </Text>
                </View>
                <View style={styles.transactionDetailBorder} />
              </View>
            </View>
          </View>
        </View>
      );
      return ret;
    }
  }

  indexMove( amount ) {
    let index = this.state.index
    index += amount
    if ( index < 0 ) {
        index = 0
    }
    if ( index + this.state.size > currentDataState.datablock.totalTransactions ) {
        index = currentDataState.datablock.totalTransactions  - this.state.size
    }
    this.setState( {index : index })
  }

  renderHeader() {
    return (
      <View>
        <View style={{ alignSelf: "flex-end", marginRight: 148 }}>
          <Pager
            start={this.state.index}
            end={this.state.index + this.state.size - 1}
            count={currentDataState.datablock.totalTransactions}
            onLeft={() => {
              this.indexMove(-20);
            }}
            onRight={() => {
              this.indexMove(20);
            }}
          />
        </View>
        <View
          style={{
            flex: 1,
            marginBottom: 8,
            flexDirection: "row",
            alignItems: "flex-start"
          }}
        >
          <View style={{ marginLeft: 0, marginRight: 280 }}>
            <Text style={styles.headerFieldText}>Transaction Hash</Text>
          </View>
          <View style={{ marginLeft: 0, marginRight: 130 }}>
            <Text style={styles.headerFieldText}>Block</Text>
          </View>
          <View style={{ marginLeft: 0, marginRight: 90 }}>
            <Text style={styles.headerFieldText}>Age</Text>
          </View>
          <View style={{ marginLeft: 0, marginRight: 110 }}>
            <Text style={styles.headerFieldText}>Type</Text>
          </View>
          <View style={{ marginLeft: 0, marginRight: 360 }}>
            <Text style={styles.headerFieldText}>Asset(s)</Text>
          </View>
          <View style={{ marginLeft: 0, marginRight: 155 }}>
            <Text style={styles.headerFieldText}>Fees</Text>
          </View>
        </View>
      </View>
    );
  }

  render() {
    let title;
    if (this.props.history) {
      title = <TitleBar key="title" title="Transactions" />;
    } else {
      title = <TitleBar key="title" title="Transactions" />;
    }
    if (this.state.hash) {
      return this.renderOneTransaction();
    }

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
          {title}
        </View>
        <View
          style={[
            styles.detailBox,
            { marginLeft: this.props.history ? 80 : 0 }
          ]}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center"
            }}
          >
            <View style={{ marginLeft: 16 }}>
              {this.renderHeader()}
              <View
                style={{
                  height: 1,
                  width: 1216,
                  backgroundColor: colors.orderGrey
                }}
              />
              {this.generateTransactionList()}
              <View />
            </View>
          </View>
        </View>
      </View>
    );
  }
}
