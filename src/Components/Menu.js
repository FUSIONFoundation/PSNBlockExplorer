import React, { Component } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import history from "../history.js";
import styles from "./StandardStyles.js";

var path = "Dashboard";

class MenuButton extends Component {
  render() {
    let active = path === this.props.text;
    return (
      <TouchableOpacity
        onPress={() => {
          path = this.props.text;
          this.props.onpress()
          history.push(this.props.link);
        }}
      >
        <View
          style={active ? styles.menuButtonViewActive : styles.menuButtonView}
        >
          <Text
            style={active ? styles.menuButtonTextActive : styles.menuButtonText}
          >
            {this.props.text}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

export default class Menu extends Component {
    state = {
        paintKey : 0
    }

    constructor(props) {
        super(props)
        this.redraw = this.redraw.bind(this)
    }
  render() {
    return (
      <View style={styles.menuBar}>
        <MenuButton text="Dashboard" link="/" onpress={this.redraw} />
        <MenuButton text="Blocks" link="/Blocks"  onpress={this.redraw} />
        <MenuButton text="Transactions" link="/Transactions"  onpress={this.redraw}  />
        <MenuButton text="Assets" link="Assets"  onpress={this.redraw} />
        <MenuButton text="Addresses" link="Addresses"  onpress={this.redraw} />
      </View>
    );
  }

  redraw() {
    this.setState( {paintKey : this.state.paintKey + 1 })
  }
}
