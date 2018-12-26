import React, { Component } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import colors from "./colors";
import constants from "./constants";
import styles from "./StandardStyles.js";

export default class Pager extends Component {
  render() {
    let { start, end, count } = this.props;
    let pageSize = end - start + 1;
    let pages = Math.floor(count / pageSize) + 1;
    let pageNumber = Math.floor(start / pageSize) + 1;

    return (
      <View style={{ flex: 1, flexDirection: "row", marginBottom: 16 }}>
        <Text style={styles.pageRowText}>Rows</Text>
        <Text
          style={[styles.pageRowCountText, { marginRight: 24 }]}
        >{` ${start + 1}-${end + 1} of ${count}`}</Text>
        <Text style={styles.pagePageCountText}>{pageNumber}</Text>
        <Text style={styles.pagePageCountText}>{` of ${pages}`}</Text>
        <TouchableOpacity onPress={() => {
             if ( this.props.onLeft ) {
                this.props.onLeft()
            }
        }}>
          <i
            style={{
              color: colors.labelGrey,
              marginLeft: 20,
              marginRight: 8,
              fontSize: 14
            }}
            className="fa fa-angle-left"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
            if ( this.props.onRight ) {
                this.props.onRight()
            }
        }}>
          <i
            style={{
              color: colors.labelGrey,
              marginLeft: 16,
              marginRight: 8,
              fontSize: 14
            }}
            className="fa fa-angle-right"
          />
        </TouchableOpacity>
      </View>
    );
  }
}
