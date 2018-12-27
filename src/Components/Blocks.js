import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator
} from "react-native";

import styles from "./StandardStyles.js";
import TitleBar from "./TitleBar.js";
import dataStore from "../api/dataAPI.js";
import Utils from "../utils";
import DetailLine from "./DetailLine";
import history from "../history.js";
import colors from "./colors";
import Transactions from "./Transactions";
import "font-awesome/css/font-awesome.min.css";
import BlockSelect from "./BlockSelect";
import Pager from "./Pager";
import currentDataState from "../api/dataAPI.js";
import Sorter from "./Sorter.js";

export default class Blocks extends Component {
  constructor(props) {
    super(props);
    let b = this.props.match.params.blockNumber;

    if (b) {
      if (typeof b === "string" && b.startsWith("0x")) {
      } else if (isNaN(b) || b < 0) {
        b = -1;
      } else {
        b = parseInt(b);
      }
    }

    this.state = {
      block: b,
      update: 0,
      sortField: "block",
      direction: "asc",
      index: 0,
      size: 20,
      update: 0
    };
    this.dataListener = this.dataListener.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (
      this.props.match &&
      this.props.match.params.blockNumber !== newProps.match.params.blockNumber
    ) {
      let b = newProps.match.params.blockNumber;
      if (b) {
        if (typeof b === "string" && b.startsWith("0x")) {
        } else if (isNaN(b) || b < 0) {
          b = -1;
        } else {
          b = parseInt(b);
        }
      }

      this.setState({ block: b });
    }
  }

  indexMove(amount) {
    let index = this.state.index;
    index += amount;
    if (index < 0) {
      index = 0;
    }
    if (index + this.state.size > currentDataState.datablock.maxBlock) {
      index = currentDataState.datablock.maxBlock - this.state.size;
    }
    this.setState({ index: index });
  }

  blockMove(direction) {
    let b = dataStore.getBlock(this.state.block);
    let block;
    if (direction < 0) {
      block = b.height - 1;
    } else {
      block = b.height + 1;
    }
    dataStore.setMenuPath("Blocks");
    history.push(`/blocks/${block}`);
  }

  returnSingleBlock() {
    let b = dataStore.getBlock(this.state.block);

    if (b === "loading") {
      let s = this.state.block;
      if (typeof s === "string") {
        if (s > 21) {
          s = Utils.midHashDisplay(s);
        }
      }
      return (
        <View
          style={{
            flex: "1 0 0",
            flexDirection: "row",
            marginLeft: 80,
            marginTop: 16,
            justifyContent: "flex-start",
            alignItems: "center"
          }}
        >
          <ActivityIndicator size="large" animating={true} />
          <Text style={styles.largerTitleBar}>{"Loading block " + s}</Text>
        </View>
      );
    }

    let miner = b.parsed.miner;
    let transactionCount = b.numberOfTransactions;
    let reward = "" + Utils.calcReward(b.height) + " FSN";
    let t = Utils.timeAgo(new Date(b.timeStamp * 1000)) + " ago";
    let tText = transactionCount === 1 ? "Transaction" : "Transactions";
    let parentHash = b.parsed.parentHash;

    let leftEnabled = b.height > 0;
    let rightEnabled = b.height < dataStore.datablock.maxBlock;
    let leftBlock = leftEnabled ? b.height - 1 : "0";
    let rightBlock = rightEnabled ? b.height + 1 : b.height;

    return (
      <View
        key={parentHash}
        style={{ width: 1280, marginLeft: 80, marginTop: 32 }}
      >
        <View
          style={{
            flex: "1 0 0",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center"
          }}
        >
          <Text style={styles.largerTitleBar}>Block</Text>
          
          <View
            style={{
              flex: "1 0 0",
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
              alignSelf: "flex-end"
            }}
          >
            <TouchableOpacity
              disabled={!leftEnabled}
              onPress={() => {
                this.blockMove(-1);
              }}
            >
              <Text
                style={[
                  styles.leftBlockText,
                  { opacity: leftEnabled ? 1 : 0.4 }
                ]}
              >
                <i
                  style={{
                    color: colors.textBlue,
                    marginLeft: 4,
                    marginRight: 8,
                    fontSize: 16
                  }}
                  className="fa fa-angle-left"
                />
                {`${leftBlock}`}
              </Text>
            </TouchableOpacity>
            <View>
            <BlockSelect
            block={b.height}
            onPress={b => {
              dataStore.setMenuPath("Blocks");
              history.push(`/blocks/${b}`);
            }}
          />
          </View>
            <TouchableOpacity
              disabled={!rightEnabled}
              onPress={() => {
                this.blockMove(1);
              }}
            >
              <Text
                style={[
                  styles.rightBlockText,
                  { opacity: rightEnabled ? 1 : 0.4 }
                ]}
              >{`${rightBlock}  >`}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.detailBox}>
          <View
            style={{
              flex: "1 0 0",
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
              <TouchableOpacity
                onPress={() => {
                  dataStore.setMenuPath("Blocks");
                  history.push(`/blocks/${parentHash}`);
                }}
              >
                <DetailLine
                  label="ParentHash"
                  hideBorder={true}
                  clickable={true}
                  val={b.parsed.parentHash}
                />
              </TouchableOpacity>
            </View>
            <View style={{ marginRight: 8 }}>
              <View style={{ height: 16 }} />
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
              <Text style={styles.extraDataLineBlock}>
                {Utils.toAscii(b.parsed.extraData)}
              </Text>
            </View>
            <View />
          </View>
        </View>
        <Transactions block={b.height} />
      </View>
    );
  }

  render() {
    let sortField = this.state.sortField;
    let direction = this.state.direction;

    if (!isNaN(this.state.block) && this.state.block >= 0) {
      return this.returnSingleBlock();
    }

    return (
      <View key={"block"} style={{ width: 1280, marginTop: 32 }}>
        <View
          style={{
            flex: "1 0 0",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center"
          }}
        >
          <TitleBar title="Blocks" />
        </View>
        <View style={[styles.detailBox, { marginLeft: 80 }]}>
          <View style={{ alignSelf: "flex-end", marginRight: 48 }}>
            <Pager
              start={this.state.index}
              end={this.state.index + this.state.size - 1}
              count={currentDataState.datablock.maxBlock}
              onLeft={() => {
                this.indexMove(-20);
              }}
              onRight={() => {
                this.indexMove(20);
              }}
              onNewPage={(page, index) => {
                //debugger
                this.setState({ index: index });
              }}
            />
          </View>
          <View
            style={{
              flex: "1 0 0",
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center"
            }}
          >
            <View style={{ marginLeft: 16 }}>
              <View
                style={{
                  flex: "1 0 0",
                  marginBottom: 8,
                  flexDirection: "row",
                  alignItems: "flex-start"
                }}
              >
                <View
                  style={{
                    marginLeft: 0,
                    marginRight: 125,
                    flexDirection: "row"
                  }}
                >
                  <Text style={[styles.headerFieldText, { marginTop: 6 }]}>
                    Block
                  </Text>
                  <Sorter
                    active={sortField === "block"}
                    direction={direction}
                    onPress={dir => {
                      this.setState({
                        sortField: "block",
                        index: 0,
                        direction: dir
                      });
                    }}
                  />
                </View>
                <View
                  style={{
                    marginLeft: 0,
                    marginRight: 60,
                    flexDirection: "row"
                  }}
                >
                  <Text style={[styles.headerFieldText, { marginTop: 6 }]}>
                    Age
                  </Text>
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
                  style={{
                    marginLeft: 0,
                    marginRight: 35,
                    flexDirection: "row"
                  }}
                >
                  <Text style={[styles.headerFieldText, { marginTop: 6 }]}>
                    Transactions
                  </Text>
                  <Sorter
                    active={sortField === "numberOfTransactions"}
                    direction={direction}
                    onPress={dir => {
                      this.setState({
                        sortField: "numberOfTransactions",
                        index: 0,
                        direction: dir
                      });
                    }}
                  />
                </View>
                <View
                  style={{
                    marginLeft: 0,
                    marginRight: 360,
                    flexDirection: "row"
                  }}
                >
                  <Text style={[styles.headerFieldText, { marginTop: 6 }]}>
                    Miner
                  </Text>
                  <Sorter
                    active={sortField === "miner"}
                    direction={direction}
                    onPress={dir => {
                      this.setState({
                        sortField: "miner",
                        index: 0,
                        direction: dir
                      });
                    }}
                  />
                </View>
                <View style={{ marginLeft: 0, marginRight: 90 }}>
                  <Text style={[styles.headerFieldText, { marginTop: 6 }]}>
                    Gas Used
                  </Text>
                </View>
                <View style={{ marginLeft: 0, marginRight: 155 }}>
                  <Text style={[styles.headerFieldText, { marginTop: 6 }]}>
                    Gas Limit
                  </Text>
                </View>
                <View style={{ marginLeft: 0, marginRight: 0 }}>
                  <Text style={[styles.headerFieldText, { marginTop: 6 }]}>
                    Reward
                  </Text>
                </View>
              </View>
              <View
                style={{
                  height: 1,
                  width: 1216,
                  backgroundColor: colors.orderGrey
                }}
              />
              {this.generateBlockList()}
            </View>
          </View>
        </View>
      </View>
    );
  }

  generateBlockList() {
    let { index, sortField, direction, size } = this.state;
    let blocks = dataStore.generateBlockList(
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
    if (blocks === "loading") {
      return <Text>Loading Block List...</Text>;
    }
    let bls = [];
    index = 0;
    for (let b of blocks) {
      let height = b.height;
      let tm = Utils.timeAgo(new Date(b.timeStamp * 1000));
      let { miner, transactions, gasUsed, gasLimit } = b.parsed;
      let reward = Utils.calcReward(height);
      bls.push(
        <View key={b.hash}>
          <View
            key={b.hash}
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
                window.scrollTo(0, 0);
                dataStore.setMenuPath("Blocks");
                history.push(`/blocks/${height}`);
              }}
            >
              <Text style={styles.blocksBlock}> {height} </Text>
            </TouchableOpacity>
            <Text style={styles.blocksTimeAgo}> {tm} </Text>
            <Text style={styles.blocksTransactions}>
              {" "}
              {transactions.length}{" "}
            </Text>
            <TouchableOpacity
              disabled={miner === "0x0000000000000000000000000000000000000000"}
              onPress={() => {
                dataStore.setMenuPath("Addresses");
                history.push(`/Addresses/${miner}`);
              }}
            >
              <Text style={styles.blocksMiner}> {miner.toLowerCase()} </Text>
            </TouchableOpacity>
            <Text style={styles.blocksGasUsed}> {gasUsed} </Text>
            <Text style={styles.blocksGasLimit}> {gasLimit} </Text>
            <View style={{ width: 140, alignItems: "flex-end" }}>
              <Text style={styles.blocksReward}> {reward + " FSN"} </Text>
            </View>
          </View>
          <View
            style={{
              height: 1,
              width: 1216,
              backgroundColor:
                index++ < blocks.length ? colors.orderGrey : "transparent"
            }}
          />
        </View>
      );
    }
    return bls;
  }

  dataListener(datablock) {
    if (this.mounted) {
      this.setState({ update: this.state.update + 1 });
    }
  }

  componentDidMount() {
    dataStore.setMenuPath("Blocks");
    this.mounted = true;
    dataStore.on("data", this.dataListener);
    dataStore.on("blocksLoaded", this.dataListener);
  }

  componentWillUnmount() {
    this.mounted = false;
    dataStore.removeEventListener("blocksLoaded", this.dataListener);
    dataStore.on("data", this.dataListener);
  }
}
