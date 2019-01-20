import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Clipboard,
  TextInput,
  TouchableOpacity
} from "react-native";

import "../App.css";
import colors from "./colors";
import constants from "./constants";
import utils from "../utils";
const rp = require("request-promise");


let server = "https://api.fusionnetwork.io";

var styles;

class SelectButton extends Component {
  render() {
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.onPress();
        }}
      >
        <View
          style={{
            width: 100,
            marginRight: 16,
            height: 32,
            borderRadius: 3,
            borderWidth: 1,
            borderColor: colors.orderGrey,
            backgroundColor: this.props.active
              ? colors.disabledBlue
              : colors.white
          }}
        >
          <Text style={styles.bigButtonText}>{this.props.text}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

export default class Leaderboard extends Component {
  state = {
    loading : true,
    thisMonth : [],
    lastMonth : [],
    lastYear : [],
    cmd : "Year To Date"
  }
  render() {
    let { loading, error, cmd } = this.state
    if ( loading ) {
      return (<View>
          <Text>Loading...</Text>
      </View>)
    }
    if ( error ) {
      return (<View>
        <Text>{error}</Text>
    </View>)
    }
    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.titleText}>Top 10 Staking Leaderboard</Text>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <SelectButton text="Year To Date" active={cmd==='Year To Date'} onPress={()=>{
              this.setState( { cmd : "Year To Date"})
            }}/>
            <SelectButton text="Current Month"  active={cmd==='Current Month'}  onPress={()=>{
              this.setState( { cmd : "Current Month"})
            }} />
            <SelectButton text="Prior Month"  active={cmd==='Prior Month'}  onPress={()=>{
              this.setState( { cmd : "Prior Month"})
            }}/>
          </View>
          {this.renderTitle()}
          {this.renderTable()}
        </View>
      </View>
    );
  }

  renderTitle() {
    return ( <View style={{flex:1,flexDirection:'row', justifyContent:'flex-start'}}>
      <Text>Wallet</Text>
      <Text>pFSN</Text>
      <Text>FSN</Text>
    </View>)
  }

  renderTable() {
    let ret = []

    let data
    switch (this.state.cmd) {
      case 'Prior Month':
        data = this.state.lastMonth
        break
      case 'Current Month':
        data = this.state.thisMonth
        break
      default:
        data = this.state.lastYear
        break

    }

    for ( let row of data ) {
      let count = row['count(miner)']

      ret.push(
     <View key={row.miner} style={{flex:1,flexDirection:'row', justifyContent:'flex-start'}}>
        <Text>{row.miner.toLowerCase()}</Text>
        <Text>{this.pfsnEarned(count)}</Text>
        <Text>{this.fsnEarned(count)}</Text>
      </View>
      )
    }

    return ret
  }

  pfsnEarned( count ) {
    return count * 2.5
  }

  fsnEarned( count ) {
    return count * .625
  }


  componentDidMount() {
    this.mounted = true;

    const requestOptions = {
      method: "GET",
      uri: server + "/leaderboard",
      qs: {
      },
      headers: {
        "X-Content-Type-Options": "nosniff"
      },
      json: true,
      gzip: true
    };
  
    rp(requestOptions)
      .then(response => {
        if (response) {
          if ( this.mounted ) {
            this.setState( {
              loading: false,
               lastMonth : response.lastMonth,
               lastYear : response.lastYear,
               thisMonth : response.lastMonth
             } )
          }
        }
      })
      .catch(err => {
        console.log("API call error:", err.message);
        this.setState( { error : "Unable to load, please refresh the page" , loading : false })
      });
  }

  componentWillUnmount() {
    this.mounted = false;
  }
}

styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 0,
    flexShrink: 0,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    backgroundColor: colors.primaryBlue,
    padding: 64,
    height: 800,
    width: 800
  },
  youStakeRowText: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 16
  },
  youStakeText: {
    fontFamily: constants.fontFamily,
    fontSize: 20,
    color: colors.white,
    width: 240,
    fontWeight: constants.mediumFont
  },
  youStakeForText: {
    fontFamily: constants.fontFamily,
    fontSize: 20,
    color: colors.white,
    fontWeight: constants.mediumFont
  },
  youReceiveText: {
    fontFamily: constants.fontFamily,
    fontSize: 18,
    color: colors.white,
    fontWeight: constants.mediumFont
  },
  smallLabelText: {
    fontFamily: constants.fontFamily,
    fontSize: 12,
    color: colors.white,
    fontWeight: constants.mediumFont
  },
  simpleRow: {
    marginTop: 16,
    flexDirection: "row",
    flex: 1,
    justifyContent: "flex-start"
  },
  plusText: {
    fontFamily: constants.fontFamily,
    fontSize: 24,
    color: colors.white,
    fontWeight: constants.boldFont
  },
  calcLabelText: {
    fontFamily: constants.fontFamily,
    fontSize: 24,
    color: colors.white,
    fontWeight: constants.mediumFont,
    width: 200
  },
  calcAmountText: {
    fontFamily: constants.fontFamily,
    fontSize: 24,
    color: colors.white,
    fontWeight: constants.mediumFont,
    width: 200
  },
  calcReturnText: {
    fontFamily: constants.fontFamily,
    fontSize: 24,
    color: colors.white,
    fontWeight: constants.mediumFont
  },
  youStakeRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start"
  },
  stakeQuantityInput: {
    width: 200,
    borderColor: colors.orderGrey,
    borderRadius: 3,
    backgroundColor: "white",
    borderWidth: 1,
    fontSize: 18,
    fontFamily: constants.mediumFont,
    color: colors.labelGrey,
    height: 48,
    alignSelf: "flex-end",
    textAlign: "right",
    paddingRight: 4,
    paddingLeft: 4,
    outline: "none",
    alignSelf: "flex-start"
  },
  sectionTitle: {
    fontSize: 28,
    color: "rgba(22,22,22, .5)"
  },
  sectionNumberTitle: {
    fontSize: 18,
    color: "rgb(22,22,22)",
    marginTop: 30,
    marginBottom: 10
  },
  bigButtonText: {
    fontFamily: constants.fontFamily,
    fontSize: 12,
    fontWeight: constants.regularFont,
    color: colors.textBlue,
    textAlign: "center",
    padding: 8,
  },
  info: {
    fontSize: 16,
    color: "rgba(22,22,22, .5)"
  },
  imageUploadSection: {
    flex: 1,
    flexGrow: 1,
    flexShrink: 0,
    flexBasis: "auto",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    backgroundColor: "transparent",
    marginLeft: 35,
    marginTop: 15
  },
  actionButtonDisabled: {
    backgroundColor: "#20C0FF",
    height: 35,
    width: 130,
    opacity: 0.5,
    boxShadow: "5px 10px 18px #888888"
  },
  actionButtonTextDisabled: {
    color: "#7f7f7f",
    fontSize: 19,
    marginTop: 7,
    textAlign: "center"
  },
  actionButton: {
    backgroundColor: "#20C0FF",
    height: 35,
    width: 130,
    boxShadow: "5px 10px 18px #888888"
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 19,
    marginTop: 7,
    textAlign: "center"
  },
  label: {
    fontSize: 14,
    color: "rgba(22,22,22,.5)",
    width: 160,
    marginBottom: 5
  },
  balanceBox: {
    width: 160,
    marginBottom: 5,
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    flexBasis: "100%"
  }
});
