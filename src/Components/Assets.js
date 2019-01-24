import React, { Component } from "react";
import {
  View,
  Text,
  Clipboard,
  TouchableOpacity,

} from "react-native";

import styles from "./StandardStyles.js";
import TitleBar from "./TitleBar.js";
import dataStore from "../api/dataAPI";
import Utils from "../utils";
import colors from "./colors.js";
import history from "../history.js";
import Pager from "./Pager";
import Sorter from "./Sorter";
import currentDataState from "../api/dataAPI.js";
import Transactions from "./Transactions"

export default class Assets extends Component {
  constructor(props) {
    super(props);
    let hash =
      this.props.isExact || !props.match
        ? null
        : props.match.params.assetsHash;

    if (!hash) {
      hash = props.asset;
    }

    this.state = {
      sortField: "name",
      direction: "asc",
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
      dataStore.setMenuPath("Assets");
    }
    dataStore.on("data", this.dataListener);
    dataStore.on("assetsLoaded", this.dataListener);
  }

  componentWillUnmount() {
    this.mounted = false;
    dataStore.removeEventListener("data", this.dataListener);
    dataStore.removeEventListener("assetsLoaded", this.dataListener);
  }

  componentWillReceiveProps(newProps) {
    if (this.props.match) {
      this.setState({ hash: newProps.match.params.assetHash });
    } else {
      this.setState({ hash: undefined });
    }
  }

  generateAssetList() {
    let ret = [];

    // return (
    //     <Text>Coming Soon</Text> 
    // )

    let { index, sortField, direction, size } = this.state;
    let assets = dataStore.generateAssetList(
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
    if (assets === "loading") {
      return <Text>Loading Asset List...</Text>;
    }

    if (!assets || assets.length === 0) {
      return <Text>No Assets</Text>;
    }
    for (let a of assets) {
      let ar = dataStore.getAsset(a);
      if (ar === "loading") {
        ret.push(
          <View key={a}>
            <Text>loading {a}</Text>
          </View>
        );
      } else {
        let index = 0;
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
                disabled={true}
                onPress={() => {
                  dataStore.setMenuPath("Addresses");
                  history.push(`/Addresses/${ar._id}`);
                }}
              >
                <Text style={styles.addressShortHash}>{ar.commandExtra2}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled = {true}
                onPress={() => {
                  dataStore.setMenuPath("Addresses");
                  history.push(`/Addresses/${ar._id}`);
                }}
              >
                <Text style={styles.addressAddress}>{ar.commandExtra}</Text>
              </TouchableOpacity>
              {/* <Text style={styles.addressBalance}>{Utils.formatWei(ar.fsnBalance)+" FSN"}</Text>
              <Text style={styles.addressAssetsHeld}>{ar.assetsHeld}</Text>
              <Text style={styles.addressCmds}>
                {ar.numberOfTransactions}
              </Text> */}
            </View>
            <View
              style={{
                height: 1,
                width: 1216,
                backgroundColor:
                  index++ < assets.length ? colors.orderGrey : "transparent"
              }}
            />
          </View>
        );
      }
    }
    return ret;
  }

  renderOneAsset() {
    let t = this.state.hash;
    let ret;
    let tr = dataStore.getAsset(t);

    let title = (
      <View
        key="title"
        style={{
          flex: "1 0 0",
          flexDirection: "row",
          justifyContent: "flex-start"
        }}
      >
        <TitleBar key="title" title="Asset" noUpdateTime={true}>
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
                  {Utils.formatWei(tr.fsnBalance)+ " FSN"}
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
          <View style={{width:1280, marginLeft : 80}}>
            <Transactions asset={t} totalCount={currentDataState.datablock.totalAssets}/>
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
    if (index + this.state.size > currentDataState.datablock.totalAssets) {
      index = currentDataState.datablock.totalAssets - this.state.size;
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
            count={currentDataState.datablock.totalAssets}
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
              Asset Name
            </Text>
            <Sorter
              active={sortField === "name"}
              direction={direction}
              onPress={dir => {
                this.setState({ sortField: "name", index: 0, direction: dir });
              }}
            />
          </View>
          <View
            style={{ marginLeft: 0, marginRight: 390, flexDirection: "row" }}
          >
            <Text style={[styles.headerFieldText, { marginTop: 6 }]}>
              Asset ID
            </Text>
            <Sorter
              active={sortField === "assetId"}
              direction={direction}
              onPress={dir => {
                this.setState({
                  sortField: "assetId",
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
              Asset Type
            </Text>
            <Sorter
              active={sortField === "assetType"}
              direction={direction}
              onPress={dir => {
                this.setState({
                  sortField: "assetType",
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
              Circulating Supply
            </Text>
            <Sorter
              active={sortField === "supply"}
              direction={direction}
              onPress={dir => {
                this.setState({
                  sortField: "supply",
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
      title = <TitleBar key="title" title="Assets" />;
    } else {
      title = <TitleBar key="title" title="Assets" />;
    }
    if (this.state.hash) {
      return this.renderOneAsset();
    }
    return (
      <View key={"asset"} style={{ width: 1280, marginTop: 32 }}>
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
        <Text style={{marginLeft:80}}>Note: This page is still under construction!</Text>
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
              {this.generateAssetList()}
              <View />
            </View>
          </View>
        </View>
      </View>
    );
  }
}
