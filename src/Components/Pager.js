import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import colors from "./colors";
import constants from "./constants";
import styles from "./StandardStyles.js";
import currentDataState from "../api/dataAPI";

export default class Pager extends Component {
  constructor(props) {
    super(props);
    let { start, end, count } = this.props;
    let pageSize = end - start + 1;
    let pages = Math.floor(count / pageSize) + 1;
    let pageNumber = Math.floor(start / pageSize) + 1;

    this.state = {
      inputOn: false,
      pageNumber: 0
    };
    this.pageNumber = pageNumber;
  }

  render() {
    let { start, end, count } = this.props;
    let pageSize = end - start + 1;
    let pages = Math.floor(count / pageSize) + 1;
    let pageNumber = Math.floor(start / pageSize) + 1;

    let maxPage = pages;

    let pageInput;

    if (!this.state.inputOn) {
      pageInput = (
        <TouchableOpacity
          key="tpai"
          onPress={() => {
            this.setState({ inputOn: true, pageNumber: pageNumber });
          }}
        >
          <View style={styles.pagePageBox}>
            <Text style={styles.pagePageCountText}>{pageNumber}</Text>
          </View>
        </TouchableOpacity>
      );
    } else {
      pageInput = (
        <TextInput
          key="tpaX"
          style={styles.blockNodeInput}
          placeholder="#"
          autoCorrect={false}
          placeholderTextColor={colors.orderGrey}
          maxLength={10}
          value={this.state.pageNumber}
          clearButtonMode="always"
          onChangeText={val => {
            this.setState({ pageNumber: val });
          }}
          autoFocus={true}
          onBlur={() => {
            this.setState({ inputOn: false });
          }}
          onKeyPress={a => {
            if (a.charCode === 13) {
              if (this.state.pageNumber) {
                let reg = new RegExp("^\\d+$");
                let p = parseInt(this.state.pageNumber);
                if (
                  isNaN(p) ||
                  p < 1 ||
                  p > maxPage ||
                  !reg.test(this.state.pageNumber)
                ) {
                  alert("Invalid page entered.  Please try again");
                } else {
                  this.setState({ pageNumber: p, inputOn: false });
                  if (this.props.onNewPage) {
                    this.props.onNewPage(p, (p - 1) * pageSize);
                  }
                }
              }
            }
          }}
        />
      );
    }

    return (
      <View style={{ flex: 1, flexDirection: "row", marginBottom: 16 , alignItems : 'center'}}>
        <Text style={styles.pageRowText}>Rows</Text>
        <Text
          style={[styles.pageRowCountText, { marginRight: 24 }]}
        >{` ${start + 1}-${end + 1} of ${count}`}</Text>
        {pageInput}
        <Text style={styles.pagePageCountText}>{` of ${pages}`}</Text>
        <TouchableOpacity
          onPress={() => {
            if (this.props.onLeft) {
              this.props.onLeft();
            }
          }}
        >
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
        <TouchableOpacity
          onPress={() => {
            if (this.props.onRight) {
              this.props.onRight();
            }
          }}
        >
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
