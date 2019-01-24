import React, { Component } from "react";
import { View, Text} from "react-native";
import moment from "moment";
import styles from "./StandardStyles.js"

import dataStore from "../api/dataAPI.js";

export default class TitleBar extends Component {

    constructor(props) {
        super(props)
        this.state = { data : dataStore.datablock }
        this.dataListener = this.dataListener.bind( this )
    }

    render() {
        let data = dataStore.datablock
        let dt = new moment(data.lastUpdateTime);

        let dtDisplay = dt.toString(); // dt.format("YYYY-MM-DD HH:mm:ss.SSS z");

        return (<View style={styles.explorerTitleBar}>
            <Text style={styles.explorerTitleBarText}>{this.props.title}</Text>
            { !this.props.noUpdateTime && (
                 <Text style={styles.explorerTitleText}>Last Updated: {dtDisplay}</Text>
            )}
            {this.props.children}
            </View>)
    }

    dataListener(data) {
        this.setState({ data });
      }
    
      componentDidMount() {
        dataStore.on("data", this.dataListener);
      }
    
      componentWillUnmount() {
        dataStore.removeEventListener("data", this.dataListener);
      }
}