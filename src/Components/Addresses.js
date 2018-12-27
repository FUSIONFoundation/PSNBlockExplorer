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
import Sorter from "./Sorter";
import currentDataState from "../api/dataAPI.js";

export default class Transactions extends Component {
  constructor(props) {
    super(props);
    let hash =
      this.props.isExact || !props.match
        ? null
        : props.match.params.addressHash;

    if (!hash) {
      hash = props.address;
    }

    this.state = {
      sortField: "san",
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
      dataStore.setMenuPath("Addresses");
    }
    dataStore.on("data", this.dataListener);
    dataStore.on("addressesLoaded", this.dataListener);
  }

  componentWillUnmount() {
    this.mounted = false;
    dataStore.removeEventListener("data", this.dataListener);
    dataStore.removeEventListener("addressesLoaded", this.dataListener);
  }

  componentWillReceiveProps(newProps) {
    if (this.props.match) {
      this.setState({ hash: newProps.match.params.addressHash });
    } else {
      this.setState({ hash: undefined });
    }
  }

  generateAddressList() {
    let ret = [];
    let transactions;

    let { index, sortField, direction, size } = this.state;
    let addresses = dataStore.generateAddressList(
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
    if (addresses === "loading") {
      return <Text>Loading Addresses List...</Text>;
    }

    if (!addresses || addresses.length === 0) {
      return <Text>No Addresses</Text>;
    }
    for (let a of addresses) {
      let ar = dataStore.getAddress(a);
      if (ar === "loading") {
        ret.push(
          <View key={a}>
            <Text>loading {a}</Text>
          </View>
        );
      } else {
        let index = 0;
        let san;
        let haveSan;
        if (ar.san === 0) {
          san = "-";
          haveSan = false;
        } else {
          san = ar.san;
          haveSan = true;
        }
        ret.push(
          <View key={ar._id}>
            <View
              key={ar._id}
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
                disabled={!haveSan}
                onPress={() => {
                  dataStore.setMenuPath("Addresses");
                  history.push(`/Addresses/${ar._id}`);
                }}
              >
                <Text style={styles.addressShortHash}>{san}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  dataStore.setMenuPath("Addresses");
                  history.push(`/Addresses/${ar._id}`);
                }}
              >
                <Text style={styles.addressAddress}>{ar._id}</Text>
              </TouchableOpacity>
              <Text style={styles.addressBalance}>{Utils.formatWei(ar.fsnBalance)+" FSN"}</Text>
              <Text style={styles.addressAssetsHeld}>{ar.assetsHeld}</Text>
              <Text style={styles.addressCmds}>
                {ar.numberOfTransactions}
              </Text>
            </View>
            <View
              style={{
                height: 1,
                width: 1216,
                backgroundColor:
                  index++ < addresses.length ? colors.orderGrey : "transparent"
              }}
            />
          </View>
        );
      }
    }
    return ret;
  }

  renderOneAddress() {
    let t = this.state.hash;
    let ret;
    let tr = dataStore.getAddress(t);

    let title = (
      <View
        key="title"
        style={{
          flex: "1 0 0",
          flexDirection: "row",
          justifyContent: "flex-start"
        }}
      >
        <TitleBar key="title" title="Address" noUpdateTime={true}>
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
      // debugger

      ret = (
        <View key={tr._id}>
          {title}

          <View
            style={[
              styles.detailBox,
              { width: 1360, marginLeft: 80, paddingBottom: 0, paddingTop: 0 }
            ]}
          >
            <View style={{ flex: "1 0 0", flexDirection: "row" , justifyContent : 'flex-start', alignItems : 'flex-start'}}>
              <View
                style={{
                  width: 640,
                  padding: 32,
                  alignItems: "flex-start",
                  justifyContent: "flex-start"
                }}
              >
                <View style={styles.addressDetailRow}>
                  <Text style={styles.transactionDetailLabel}>
                    Short Address
                  </Text>
                  <Text style={styles.transactionDetailValue}>
                    {tr.san !== "0" ? tr.san : "-"}
                  </Text>
                </View>
                <View style={styles.addressDetailBorder} />
                <View style={styles.addressDetailRow}>
                  <Text style={styles.transactionDetailLabel}>
                    Public Address
                  </Text>
                  <Text style={styles.transactionDetailValue}>{tr._id}</Text>
                </View>
                <View style={styles.addressDetailBorder} />
                <View style={styles.addressDetailRow}>
                <Text style={styles.transactionDetailLabel}>
                  Fusion Balance
                </Text>
                <Text style={styles.transactionDetailValue}>
                  {tr.fsnBalance}
                </Text>
                </View>
              </View>

            <View
              style={{
                width: 640,
                flex : '1 0 0',
                padding: 32,
                alignItems: "flex-start",
                justifyContent: "flex-start"
              }}
            >
              <View style={styles.addressDetailRow}>
                <Text style={styles.transactionDetailLabel}>Assets Held</Text>
                <Text style={styles.transactionDetailValue}>
                  {tr.assetsHeld}
                </Text>
              </View>
              <View style={styles.addressDetailBorder} />
              <View style={styles.addressDetailRow}>
                <Text style={styles.transactionDetailLabel}>
                  Total Transactions
                </Text>
                <Text style={styles.transactionDetailValue}>
                  {tr.numberOfTransactions}
                </Text>
              </View>
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
    if (index + this.state.size > currentDataState.datablock.totalAddresses) {
      index = currentDataState.datablock.totalAddresses - this.state.size;
    }
    this.setState({ index: index });
  }

  renderHeader() {
    let sortField = this.state.sortField;
    let direction = this.state.direction;
    return (
      <View style={{width:1280}}>
        <View style={{ alignSelf: "flex-end", marginRight: 64 }}>
          <Pager
            start={this.state.index}
            end={this.state.index + this.state.size - 1}
            count={currentDataState.datablock.totalAddresses}
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
              marginRight: 120,
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "center"
            }}
          >
            <Text style={[styles.headerFieldText, { marginTop: 6 }]}>
              Short Address
            </Text>
            <Sorter
              active={sortField === "san"}
              direction={direction}
              onPress={dir => {
                this.setState({ sortField: "san", index: 0, direction: dir });
              }}
            />
          </View>
          <View
            style={{ marginLeft: 0, marginRight: 390, flexDirection: "row" }}
          >
            <Text style={[styles.headerFieldText, { marginTop: 6 }]}>
              Address
            </Text>
            <Sorter
              active={sortField === "address"}
              direction={direction}
              onPress={dir => {
                this.setState({
                  sortField: "address",
                  index: 0,
                  direction: dir
                });
              }}
            />
          </View>
          <View
            style={{ marginLeft: 0, marginRight: 130, flexDirection: "row" }}
          >
            <Text style={[styles.headerFieldText, { marginTop: 6 }]}>
              FSN Balance
            </Text>
            <Sorter
              active={sortField === "fsnBalance"}
              direction={direction}
              onPress={dir => {
                this.setState({
                  sortField: "fsnBalance",
                  index: 0,
                  direction: dir
                });
              }}
            />
          </View>
          <View
            style={{ marginLeft: 0, marginRight: 146, flexDirection: "row" }}
          >
            <Text style={[styles.headerFieldText, { marginTop: 6 }]}>
              AssetsHeld
            </Text>
            <Sorter
              active={sortField === "assetsHeld"}
              direction={direction}
              onPress={dir => {
                this.setState({
                  sortField: "assetsHeld",
                  index: 0,
                  direction: dir
                });
              }}
            />
          </View>
          <View
            style={{ marginLeft: 0, marginRight: 300, flexDirection: "row" }}
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
        </View>
      </View>
    );
  }

  render() {
    let title;
    if (this.props.history) {
      title = <TitleBar key="title" title="Addresses" />;
    } else {
      title = <TitleBar key="title" title="Addresses" />;
    }
    if (this.state.hash) {
      return this.renderOneAddress();
    }

    return (
      <View key={"address"} style={{ width: 1280, marginTop: 32 }}>
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
              {this.generateAddressList()}
              <View />
            </View>
          </View>
        </View>
      </View>
    );
  }
}
