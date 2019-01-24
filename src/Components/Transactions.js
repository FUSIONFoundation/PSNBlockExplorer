import React, { Component } from "react";
import {
  View,
  Text,
  Clipboard,
  TouchableOpacity
} from "react-native";

import styles from "./StandardStyles.js";
import TitleBar from "./TitleBar.js";
import dataStore from "../api/dataAPI";
import Utils from "../utils";
import moment from "moment";
import colors from "./colors.js";
import BigNumber from "big-number";
import history from "../history.js";
import Pager from "./Pager";
import Sorter from "./Sorter";
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
      address: props.address,
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
      this.setState({ hash: undefined, address: undefined });
    }
  }

  hex2a(hexData) {
    hexData = hexData.replace("0x", "");
    let hex = hexData.toString(); //force conversion
    let str = "";
    for (let i = 0; i < hex.length && hex.substr(i, 2) !== "00"; i += 2)
      str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str
}

  renderAssetField(tr) {
    let data = tr.data || {};
    let value;
    if (data.Value) {
      if (
        !data.AssetID ||
        data.AssetID ===
          "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
      ) {
        value = (
          <Text style={styles.transactionExtra}>
            {Utils.formatWei(data.Value.toString())}
          </Text>
        );
      } else {
        value = <Text style={styles.transactionExtra}>{data.Value}</Text>;
      }
    }
    if (data.AssetID) {
      let asset = data.AssetID;
      if (
        asset ===
        "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
      ) {
        asset = "FSN";
      } else {
        asset = Utils.midHashDisplay(asset);
      }
      return (
        <View key="aff">
          <Text key="asset" style={styles.transactionExtra}>
            {asset}
          </Text>
          {value}
        </View>
      );
    } else {
      return (
        <View key="aff">
          <Text key="asset" style={styles.transactionExtra}>
            FSN
          </Text>
          {value}
        </View>
      );
    }
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
        },
        this.state.address
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
        let data = tr.data;
        let fusionCommand = Utils.getFusionCmdDisplayName(
          tr.fusionCommand,
          data
        );

        let shortHash = hash.substr(0, 33) + "...";

        let tm = Utils.timeAgo(new Date(tr.timeStamp * 1000));

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
                flex: "1 0 0",
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
              {this.renderAssetField(tr)}
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
        style={{
          flex: "1 0 0",
          flexDirection: "row",
          justifyContent: "flex-start"
        }}
      >
        <TitleBar key="title" title="Transaction" noUpdateTime={true}>
          <View>
            <View
              style={{
                flex: "1 0 0",
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

      let data = tr.data;
      let fusionCommand = Utils.getFusionCmdDisplayName(tr.fusionCommand, data);

      let d = new Date(tr.timeStamp * 1000);
      let tm = Utils.timeAgo(d) + " (" + moment(d).format("LLL") + ")";

      if (!data) {
        data = {};
      }

      let toAddress = data.ToAddress || tr.toAddress;
      let value = data.Value;
      let AssetID = data.AssetID;

      if (toAddress === "0xffffffffffffffffffffffffffffffffffffffff") {
        toAddress = undefined;
      }

      let fromAddress = tr.fromAddress;

      if (fromAddress === "0xffffffffffffffffffffffffffffffffffffffff") {
        fromAddress = undefined;
      }

      if (
        AssetID ===
        "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
      ) {
        AssetID = "FSN";
      }

      let dataFields = [];
      let dataKeys = {};
      if (tr.data) {
        dataKeys = tr.data;

        let keys = Object.keys(tr.data);
        for (let key of keys) {
          let val = tr.data[key];
          if (
            key === "AssetID" &&
            val ===
              "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
          ) {
            val = "FSN";
          }
          if (key === "To" || key === "From") {
            dataFields.push(
              <View
                key={key}
                style={{
                  height: 30,
                  width: 440,
                  flex: 1,
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  marginBottom: 6
                }}
              >
                <Text style={styles.transactionInfoLabel}>{key + ":"}</Text>
                <TouchableOpacity
                  onPress={() => {
                    dataStore.setMenuPath("Addresses");
                    history.push(`/Addresses/${val}`);
                  }}
                >
                  <Text style={styles.transactionInfoValueLink}>{val}</Text>
                </TouchableOpacity>
              </View>
            );
          } else {
            dataFields.push(
              <View
                key={key}
                style={{
                  height: 30,
                  width: 440,
                  flex: 1,
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  marginBottom: 6
                }}
              >
                <Text style={styles.transactionInfoLabel}>{key + ":"}</Text>
                <Text style={styles.transactionInfoValue}>{val}</Text>
              </View>
            );
          }
        }
      }

      if (dataKeys["Value"]) {
        value = undefined;
      }
      if (dataKeys["AssetID"]) {
        AssetID = undefined;
      }

      ret = (
        <View key={hash}>
          {title}

          <View
            style={[
              styles.detailBox,
              { marginLeft: 80, paddingBottom: 0, paddingTop: 0 }
            ]}
          >
            <View style={{ flex: "1 0 0", flexDirection: "row" }}>
              <View
                style={{
                  width: 503,
                  padding: 32,
                  justifyContent: "flex-start",
                  alignItems: "flex-start"
                }}
              >
                <Text style={styles.transactionInfoCmd}>
                  {Utils.getFusionCmdDisplayName(fusionCommand, data)}
                </Text>
                <View style={{ height: 12 }} />
                <Text style={styles.transactionInfoTime}>
                  {moment(d).format("LLL")}
                </Text>
                <View style={{ height: 12 }} />
                <View>{dataFields}</View>
                <View style={{ height: 12 }} />
                {value && (
                  <Text
                    style={styles.transactionInfoLabel}
                  >{`Value: ${value}`}</Text>
                )}
                {toAddress && (
                  <View>
                    <Text style={styles.transactionInfoLabel}>{"To: "}</Text>
                    <TouchableOpacity
                      onPress={() => {
                        dataStore.setMenuPath("Addresses");
                        history.push(`/Addresses/${toAddress}`);
                      }}
                    >
                      <Text style={styles.transactionInfoValueLink}>
                        {toAddress}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
                {fromAddress && (
                  <View>
                    <Text style={styles.transactionInfoLabel}>{"From: "}</Text>
                    <TouchableOpacity
                      onPress={() => {
                        dataStore.setMenuPath("Addresses");
                        history.push(`/Addresses/${fromAddress}`);
                      }}
                    >
                      <Text style={styles.transactionInfoValueLink}>
                        {fromAddress}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
                {AssetID && (
                  <Text
                    style={styles.transactionInfoLabel}
                  >{`AssetID: ${AssetID}`}</Text>
                )}
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
                  <Text style={styles.transactionDetailValue}>
                    {tr.receipt.status ? "Success" : "Failed"}
                  </Text>
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
                  <Text style={styles.transactionDetailValueInput}>
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

  indexMove(amount) {
    let index = this.state.index;
    index += amount;
    if (index < 0) {
      index = 0;
    }
    if (
      index + this.state.size >
      currentDataState.datablock.totalTransactions
    ) {
      index = currentDataState.datablock.totalTransactions - this.state.size;
    }
    this.setState({ index: index });
  }

  renderHeader() {
    let sortField = this.state.sortField;
    let direction = this.state.direction;
    return (
      <View>
        <View style={{ alignSelf: "flex-end", marginRight: 0 }}>
          <Pager
            start={this.state.index}
            end={this.state.index + this.state.size - 1}
            count={
              this.props.totalCount ||
              currentDataState.datablock.totalTransactions
            }
            onLeft={() => {
              this.indexMove(-20);
            }}
            onRight={() => {
              this.indexMove(20);
            }}
            onNewPage={(page, index) => {
              this.setState({ index: index });
            }}
          />
        </View>
        <View
          style={{
            flex: "1 0 0",
            marginBottom: 8,
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center"
          }}
        >
          <View
            style={{
              marginLeft: 0,
              marginRight: 255,
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "center"
            }}
          >
            <Text style={[styles.headerFieldText, { marginTop: 6 }]}>
              Transaction Hash
            </Text>
            <Sorter
              active={sortField === "hash"}
              direction={direction}
              onPress={dir => {
                this.setState({ sortField: "hash", index: 0, direction: dir });
              }}
            />
          </View>
          <View
            style={{ marginLeft: 0, marginRight: 106, flexDirection: "row" }}
          >
            <Text style={[styles.headerFieldText, { marginTop: 6 }]}>
              Block
            </Text>
            <Sorter
              active={sortField === "block"}
              direction={direction}
              onPress={dir => {
                this.setState({ sortField: "block", index: 0, direction: dir });
              }}
            />
          </View>
          <View
            style={{ marginLeft: 0, marginRight: 66, flexDirection: "row" }}
          >
            <Text style={[styles.headerFieldText, { marginTop: 6 }]}>Age</Text>
            <Sorter
              active={sortField === "timestamp"}
              direction={direction}
              onPress={dir => {
                this.setState({
                  sortField: "timestamp",
                  index: 0,
                  direction: dir
                });
              }}
            />
          </View>
          <View
            style={{ marginLeft: 0, marginRight: 86, flexDirection: "row" }}
          >
            <Text style={[styles.headerFieldText, { marginTop: 6 }]}>Type</Text>
            <Sorter
              active={sortField === "type"}
              direction={direction}
              onPress={dir => {
                this.setState({ sortField: "type", index: 0, direction: dir });
              }}
            />
          </View>
          <View
            style={{ marginLeft: 0, marginRight: 300, flexDirection: "row" }}
          >
            <Text style={[styles.headerFieldText, { marginTop: 6 }]}>
              Asset(s)
            </Text>
          </View>
          <View
            style={{ marginLeft: 60, marginRight: 0, flexDirection: "row" }}
          >
            <Text style={[styles.headerFieldText, { marginTop: 6 }]}>Fees</Text>
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

    if (this.props.address) {
      title = undefined;
    }

    return (
      <View key={"hash"} style={{ width: 1280, marginTop: 32 }}>
        <View
          style={{
            flex: "1 0 0",
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
              flex: "1 0 0",
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
