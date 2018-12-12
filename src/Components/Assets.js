import React, { Component } from "react";
import { View, Text, Image, StyleSheet } from "react-native";

import styles from "./StandardStyles.js";

import TitleBar from "./TitleBar.js";

export default class Assets extends Component {
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
          <TitleBar title="Assets" />
        </View>
        <View style={[styles.detailBox, { marginLeft: 80 }]}>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center"
            }}
          >
            <View style={{ marginLeft: 16 }}>
              <Text>Assets...</Text>
              <View />
            </View>
          </View>
        </View>
      </View>
    );
  }
}
