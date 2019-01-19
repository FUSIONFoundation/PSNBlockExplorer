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
import currentDataState from "../api/dataAPI";

var styles;

class BigButton extends Component {
  render() {
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.onPress();
        }}
      >
        <View
          style={{
            width: 80,
            marginRight: 16,
            height: 48,
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

export default class Staking extends Component {
  state = {
    stakeVal: 100,
    cmd: "30d",
    PFSN_Amount: "-",
    FSN_Amount: "-",
    PFSN_Return: "-",
    FSN_Return: "-",
    Total_Amount: "-",
    Total_Return: "-",
    ticketNumber: currentDataState.datablock.ticketNumber
  };

  constructor(props) {
    super(props);
    this.calcDisplay = this.calcDisplay.bind(this);
    this.ticketNumberChanged = this.ticketNumberChanged.bind(this);
  }

  calcDisplay(valIn, cmdPast) {
    let val = valIn || this.state.stakeVal;
    let obj = Object.assign({}, this.state);
    let cmd = cmdPast || this.state.cmd;

    let ticketNumber = parseInt(this.state.ticketNumber);

    val = parseInt(val);
    if (isNaN(val) || val <= 0 || isNaN(ticketNumber)) {
      obj.stakeVal = "0";
      obj.PFSN_Amount = "-";
      obj.FSN_Amount = "-";
      obj.PFSN_Return = "-";
      obj.FSN_Return = "-";
      obj.Total_Amount = "-";
      obj.Total_Return = "-";
      obj.cmd = cmd;
      this.setState(obj);
      return;
    }

    let days = 30;
    switch (cmd) {
      default:
      case "30d":
        days = 30;
        break;
      case "60d":
        days = 60;
        break;
      case "90d":
        days = 90;
        break;
      case "180d":
        days = 180;
        break;
      case "1yr":
        days = 365;
        break;
    }

    let averageBlockTime = 15;
    let numberOfTicketsInSystem = 10000; // update to realtime
    let numberOfTicketsUserBuys = val;
    let timeInvestedDays = days;
    let pFsnToFsnExchange = 1;

    let numberOfBlocksPerDay = 5760;
    let totalExistingTicketsPlusNewTickets =
      numberOfTicketsUserBuys + numberOfTicketsInSystem;

    let probabilityOfReward =
      numberOfTicketsUserBuys / totalExistingTicketsPlusNewTickets;

    let pfsnRewardPerBlock = 2.5;
    let fsnRewardPerBlock = 0.625;
    let totalPFSNRRewardsPerDay = pfsnRewardPerBlock * numberOfBlocksPerDay;
    let totalFSNRRewardsPerDay = fsnRewardPerBlock * numberOfBlocksPerDay;

    let pfsnDailyReturnRate =
      (probabilityOfReward * totalPFSNRRewardsPerDay) /
      (numberOfTicketsUserBuys * 200);
    let pfsnEarned =
      numberOfTicketsUserBuys *
        Math.pow(1 + pfsnDailyReturnRate, timeInvestedDays) -
      numberOfTicketsUserBuys;
    let pfsnAnnualizedReturn = -1 + Math.pow(1 + pfsnDailyReturnRate, 365);

    let fsnDailyReturnRate =
      (probabilityOfReward * totalFSNRRewardsPerDay) /
      (numberOfTicketsUserBuys * 200);
    let fsnEarned =
      numberOfTicketsUserBuys *
        Math.pow(1 + fsnDailyReturnRate, timeInvestedDays) -
      numberOfTicketsUserBuys;
    let fsnAnnualizedReturn = -1 + Math.pow(1 + fsnDailyReturnRate, 365);

    let totalReturn = pfsnEarned * pFsnToFsnExchange + fsnEarned;
    let totalDailyReturn =
      (probabilityOfReward *
        (totalPFSNRRewardsPerDay * pFsnToFsnExchange +
          totalFSNRRewardsPerDay)) /
      (numberOfTicketsUserBuys * 200);
    let totalQAnnualizedReturn = -1 + Math.pow(1 + totalDailyReturn, 365);

    fsnEarned = fsnEarned.toFixed(2);
    pfsnEarned = pfsnEarned.toFixed(2);
    totalReturn = totalReturn.toFixed(2);

    obj.PFSN_Amount = pfsnEarned;
    obj.FSN_Amount = fsnEarned;
    obj.PFSN_Return = pfsnAnnualizedReturn;
    obj.FSN_Return = fsnAnnualizedReturn;
    obj.Total_Amount = totalReturn;
    obj.Total_Return = totalQAnnualizedReturn;
    obj.stakeVal = "" + val;

    obj.cmd = cmd;
    this.setState(obj);
  }

  ticketNumberChanged(ticketNumber) {
    this.setState({ ticketNumber });
  }

  componentDidMount() {
    this.calcDisplay(100);
    this.mounted = true;
    currentDataState.on("ticketNumber", this.ticketNumberChanged);
  }

  componentWillUnmount() {
    this.mounted = false;
    currentDataState.removeEventListener(
      "ticketNumber",
      this.ticketNumberChanged
    );
  }

  render() {
    let cmd = this.state.cmd;

    return (
      <View style={styles.container}>
        <View>
          <View style={styles.youStakeRowText}>
            <Text style={styles.youStakeText}>
              {"Active Tickets: " + this.state.ticketNumber}{" "}
            </Text>
          </View>
          <View style={styles.youStakeRowText}>
            <Text style={styles.youStakeText}>You Stake</Text>
            <Text style={styles.youStakeForText}>For</Text>
          </View>
          <View style={styles.youStakeRow}>
            <View style={{ width: 220, marginRight : 16 }}>
              <TextInput
                style={[styles.stakeQuantityInput]}
                placeholder="0"
                autoCorrect={false}
                placeholderTextColor={colors.orderGrey}
                maxLength={10}
                value={"" + (this.state.stakeVal || "")}
                onChangeText={val => {
                  this.calcDisplay(val);
                }}
              />
            </View>
            <BigButton
              text="30d"
              active={cmd === "30d"}
              onPress={() => {
                this.calcDisplay(undefined, "30d");
              }}
            />
            <BigButton
              text="60d"
              active={cmd === "60d"}
              onPress={() => {
                this.calcDisplay(undefined, "60d");
              }}
            />
            <BigButton
              text="90d"
              active={cmd === "90d"}
              onPress={() => {
                this.calcDisplay(undefined, "90d");
              }}
            />
            <BigButton
              text="180d"
              active={cmd === "180d"}
              onPress={() => {
                this.calcDisplay(undefined, "180d");
              }}
            />
            <BigButton
              text="1yr"
              active={cmd === "1yr"}
              onPress={() => {
                this.calcDisplay(undefined, "1yr");
              }}
            />
          </View>
          <View style={{ height: 32 }} />
          <Text style={styles.youReceiveText}>You Receive</Text>
          <View style={styles.simpleRow}>
            <Text style={[styles.smallLabelText, { width: 200 }]}>Token</Text>
            <Text style={[styles.smallLabelText, { width: 200 }]}>Amount</Text>
            <Text style={[styles.smallLabelText, { width: 200 }]}>
              Annualized Return
            </Text>
          </View>
          <View style={styles.simpleRow}>
            <Text style={styles.calcLabelText}>P-FSN</Text>
            <Text style={styles.calcAmountText}>{this.state.PFSN_Amount}</Text>
            <Text style={styles.calcReturnText}>
              {utils.formatPercent(this.state.PFSN_Return)}
            </Text>
          </View>
          <Text style={styles.plusText}>+</Text>
          <View style={styles.simpleRow}>
            <Text style={styles.calcLabelText}>FSN</Text>
            <Text style={styles.calcAmountText}>{this.state.FSN_Amount}</Text>
            <Text style={styles.calcReturnText}>
              {utils.formatPercent(this.state.FSN_Return)}
            </Text>
          </View>
          <View
            style={{
              width: 736,
              height: 1,
              backgroundColor: colors.white,
              marginTop: 16
            }}
          />
          <View style={styles.simpleRow}>
            <Text style={styles.calcLabelText}>~FSN</Text>
            <Text style={styles.calcAmountText}>{this.state.Total_Amount}</Text>
            <Text style={styles.calcReturnText}>
              {utils.formatPercent(this.state.Total_Return)}
            </Text>
          </View>
        </View>
      </View>
    );
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
    height: 1200,
    width: 1200
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
  titleText: {
    fontFamily: constants.fontFamily,
    fontSize: 22,
    color: colors.textBlue,
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
    width: 150
  },
  calcAmountText: {
    fontFamily: constants.fontFamily,
    fontSize: 24,
    color: colors.white,
    fontWeight: constants.mediumFont,
    width: 100,
    marginRight: 150,
    textAlign: "right"
  },
  calcReturnText: {
    fontFamily: constants.fontFamily,
    fontSize: 24,
    color: colors.white,
    fontWeight: constants.mediumFont,
    width: 90,
    textAlign: "right"
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
    outline: "none"
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
    fontSize: 18,
    fontWeight: constants.regularFont,
    color: colors.textBlue,
    textAlign: "center",
    padding: 16,
    marginBottom: 8
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
