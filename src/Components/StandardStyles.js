import React, { Component } from "react";
import { StyleSheet } from "react-native";
import colors from "./colors";
import constants from "./constants";

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    flexShrink: 0,
    flexBasis: "auto",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 15,
    marginLeft: 15,
    backgroundColor: colors.backgroundGrey
  },
  sectionTitle: {
    fontSize: 24,
    lineHeight: 32,
    fontFamily: "Roboto, san-serif",
    fontWeight: constants.boldFont,
    color: colors.textBlue
  },
  sectionNumberTitle: {
    fontSize: 18,
    color: "rgb(22,22,22)",
    marginTop: 30,
    marginBottom: 10
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
  },
  Auto_Buy_Stake_Monit: {
    fontSize: 24,
    lineHeight: 32,
    fontFamily: constants.fontFamily,
    fontWeight: constants.boldFont,
    color: colors.textBlue,
    marginBottom: 4
  },
  lastUpdated: {
    fontSize: 12,
    fontFamily: constants.fontFamily,
    fontWeight: constants.regularFont,
    color: colors.labelGrey
  },
  labelLineText: {
    fontSize: 12,
    fontFamily: constants.fontFamily,
    fontWeight: constants.regularFont,
    color: colors.labelGrey
  },
  simpleLineText: {
    fontSize: 12,
    fontFamily: constants.fontFamily,
    fontWeight: constants.regularFont,
    color: colors.textBlue
  },
  activeButton: {
    color: colors.textGreen,
    fontSize: 14,
    backgroundColor: colors.lightSuccessGreen,
    fontFamily: constants.fontFamily,
    padding: 8,
    fontWeight: constants.regularFont
  },
  stopAutoBuyButton: {
    padding: 8,
    fontSize: 14,
    color: colors.errorRed,
    fontWeight: constants.regularFont
  },
  startAutoBuyButton: {
    color: colors.textBlue,
    padding: 8,
    fontSize: 14,
    fontWeight: constants.regularFont
  },
  inActiveButton: {
    color: colors.textBlue,
    fontSize: 14,
    backgroundColor: colors.backgroundGrey,
    fontFamily: constants.fontFamily,
    padding: 8,
    fontWeight: constants.regularFont
  },
  stakingMonitorActive: {
    fontSize: 32,
    fontFamily: constants.fontFamily,
    color: colors.textBlue,
    fontWeight: constants.boldFont,
    marginTop: 8,
    marginBottom: 4
  },
  stakingMonitorActivePercent: {
    fontSize: 32,
    fontFamily: constants.fontFamily,
    color: colors.textBlue,
    fontWeight: constants.boldFont,
    marginTop: 4,
    marginBottom: 4,
    marginLeft: 1
  },
  largeMetricBox: {
    flex: 1,
    flexBasis: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    width: 620
  },
  stakeTextFSN: {
    fontFamily: constants.fontFamily,
    fontSize: 12,
    fontWeight: constants.regularFont,
    marginLeft: 4
  },
  viewTicketDetails: {
    fontFamily: constants.fontFamily,
    fontSize: 12,
    fontWeight: constants.regularFont,
    color: colors.linkBlue
  },
  maxIt: {
    fontFamily: constants.fontFamily,
    fontSize: 12,
    fontWeight: constants.mediumFont,
    color: colors.linkBlue,
    alignSelf: "flex-end"
  },
  stakeTextVal: {
    fontSize: 18,
    fontFamily: constants.fontFamily,
    fontWeight: constants.boldFont,
    color: colors.textBlue,
    alignSelf: "flex-end"
  },
  valText: {
    fontSize: 18,
    fontFamily: constants.fontFamily,
    fontWeight: constants.mediumFont,
    color: colors.textBlue,
    alignSelf: "flex-end"
  },
  dateValue: {
    fontSize: 14,
    fontFamily: constants.fontFamily,
    fontWeight: constants.regularFont,
    color: colors.textBlue
  },
  statText: {
    fontSize: 18,
    fontFamily: constants.fontFamily,
    fontWeight: constants.mediumFont,
    color: colors.textBlue
  },
  infoText: {
    fontSize: 14,
    fontFamily: constants.fontFamily,
    fontWeight: constants.mediumFont,
    color: colors.textGrey,
    lineHeight: "1.71"
  },
  infoTextLink: {
    fontSize: 14,
    fontFamily: constants.fontFamily,
    fontWeight: constants.mediumFont,
    color: colors.linkBlue
  },
  orderBorder: {
    backgroundColor: colors.orderGrey,
    height: 1,
    width: 556
  },
  rewardsGivenBox: {
    borderColor: colors.orderGrey,
    borderRadius: 3,
    backgroundColor: "white",
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    width: 200,
    height: 132,
    overflow: "visible",
    boxShadow: "0 2px 0 0 rgba(189, 196, 206, 0.2)"
  },
  stakeDetailBox: {
    borderColor: colors.orderGrey,
    borderRadius: 3,
    backgroundColor: "white",
    borderWidth: 1,
    width: 620,
    padding: 32,
    flex: 1,
    flexBasis: "100%",
    marginTop: 24,
    overflow: "visible",
    boxShadow: "0 2px 0 0 rgba(189, 196, 206, 0.2)"
  },
  rewardHolderView: {
    borderColor: colors.orderGrey,
    borderRadius: 3,
    backgroundColor: "white",
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    width: 388,
    height: 132,
    overflow: "visible",
    boxShadow: "0 2px 0 0 rgba(189, 196, 206, 0.2)"
  },
  rwcTextViewbox: {
    marginBottom: 16
  },
  rewardHolderViewText: {
    width: 227,
    marginLeft: 32,
    flex: 1,
    flexBasis: "100%",
    justifyContent: "center"
  },
  rewardHolderViewGradient: {
    backgroundImage:
      "linear-gradient(to right, #ffffff, rgba(255, 255, 255, 0))",
    width: 40,
    marginLeft: 32,
    position: "absolute",
    height: 130,
    left: 138
  },
  rewardGivenBoxTextHolder: {
    marginLeft: 32,
    paddingTop: 8
  },
  textNumberOfRewardsGivenType: {
    fontSize: 12,
    fontFamily: constants.fontFamily,
    color: colors.textBlue,
    fontWeight: constants.regularFont,
    marginBottom: 10,
    marginLeft: 4
  },
  textNumberOfRewardsGivenTypeSmaller: {
    fontSize: 12,
    fontFamily: constants.fontFamily,
    color: colors.textBlue,
    fontWeight: constants.regularFont,
    marginBottom: 6,
    marginLeft: 4
  },
  textNumberOfRewardsGiven: {
    fontSize: 48,
    fontFamily: constants.fontFamily,
    color: colors.textBlue,
    fontWeight: constants.boldFont,
    marginTop: 8
  },
  textNumberOfRewardsGivenSmaller: {
    fontSize: 36,
    fontFamily: constants.fontFamily,
    color: colors.textBlue,
    fontWeight: constants.boldFont,
    marginTop: 8
  },
  rewardsGivenBoxRewardCount: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "flex-start",
    marginTop: -2
  },
  lineGraph: {
    width: 216,
    height: 126,
    position: "absolute",
    left: 170,
    overflow: "visible"
  },
  walletBox: {
    backgroundColor: colors.tagGrey,
    borderRadius: 3,
    width: 620,
    height: 48,
    marginTop: 20,
    flex: 1,
    flexBasis: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  walletLabel: {
    fontSize: 12,
    fontFamily: constants.fontFamily,
    fontWeight: constants.regularFont,
    marginLeft: 32,
    color: colors.labelGrey
  },
  walletLabelAddress: {
    fontSize: 14,
    fontFamily: constants.fontFamily,
    fontWeight: constants.regularFont,
    marginRight: 32,
    color: colors.textBlue
  },
  stakeDetailText: {
    color: colors.textBlue,
    fontSize: 18,
    fontFamily: constants.fontFamily,
    fontWeight: constants.boldFont
  },
  stakesPurchaseTicketButtton: {
    borderRadius: 3,
    padding: 8,
    backgroundColor: colors.primaryBlue,
    color: colors.white,
    fontSize: 14,
    fontFamily: constants.fontFamily,
    fontWeight: constants.mediumFont
  },
  stakesStopAutoBuy: {
    borderColor: colors.backgroundGrey,
    borderWidth: 1,
    borderRadius: 3,
    padding: 8,
    backgroundColor: colors.white
  },
  stakesStopAutoBuyText: {
    backgroundColor: colors.white,
    color: colors.errorRed,
    fontSize: 14,
    fontFamily: constants.fontFamily,
    fontWeight: constants.mediumFont
  },
  stakeDetailRow: {
    flex: 1,
    flexBasis: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 56
  },
  fundsDetailRow: {
    flex: 1,
    flexBasis: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 44
  },
  errorForFunds: {
    fontSize: 12,
    fontWeight: constants.mediumFont,
    fontFamily: constants.fontFamily,
    color: colors.white,
    backgroundColor: colors.errorRed,
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 8,
    paddingRight: 8,
    borderRadius: 3,
    height: 24,
    alignSelf: "center"
  },
  errorForFundsBox: {
    flex: 1,
    flexDirection: "row",
    marginRight: 6,
    alignItems: "center"
  },
  ticketQuantityInput: {
    borderColor: colors.orderGrey,
    borderRadius: 3,
    backgroundColor: "white",
    borderWidth: 1,
    fontSize: 14,
    fontFamily: constants.mediumFont,
    color: colors.labelGrey,
    height: 36,
    width: 110,
    marginTop: 6,
    marginBottom: 6,
    alignSelf: "flex-end",
    textAlign: "right",
    paddingRight: 4,
    paddingLeft: 4,
    outline: "none"
  },
  costCalcLineText: {
    fontFamily: constants.fontFamily,
    fontSize: 12,
    fontWeight: constants.mediumFont,
    color: colors.labelGrey,
    alignSelf: "flex-end"
  },
  purchaseTicketButtonDisabled: {
    fontSize: 16,
    width: 556,
    borderRadius: 3,
    fontFamily: constants.fontFamily,
    fontWeight: constants.regularFont,
    color: colors.white,
    backgroundColor: colors.disabledBlue,
    textAlign: "center",
    padding: 12,
    marginTop: 20
  },
  purchaseTicketButton: {
    fontSize: 16,
    width: 556,
    borderRadius: 3,
    fontFamily: constants.fontFamily,
    fontWeight: constants.regularFont,
    color: colors.white,
    backgroundColor: colors.linkBlue,
    textAlign: "center",
    padding: 12,
    marginTop: 20
  },
  footerText: {
    fontSize: 14,
    fontFamily: constants.fontFamily,
    fontWeight: constants.mediumFont,
    color: colors.disabledGrey
  },
  menuButtonView: {
    marginRight: 16,
    height : 36 ,
    alignItems : 'center',
    justifyContent : 'center',
    borderBottom: "2px solid transparent",
    position : 'relative',
    top : 1 
  },
  menuButtonViewActive: {
    height: 16,
    marginRight: 16,
    height : 36 ,
    alignItems : 'center',
    justifyContent : 'center',
    borderBottom: "2px solid " + colors.primaryBlue,
    position : 'relative',
    top : 1 
  },
  menuButtonText: {
    fontFamily: constants.font,
    fontSize: 14,
    fontWeight: constants.mediumFont,
    color: colors.labelGrey
  },
  menuButtonTextActive: {
    fontFamily: constants.font,
    fontSize: 14,
    fontWeight: constants.mediumFont,
    color: colors.textBlue
  },
  menuBar : {
    width : 1280,
    flex: 1,
    flexGrow: 1,
    flexShrink: 0,
    flexBasis: "auto",
    flexDirection : 'row',
    justifyContent : 'flex-start',
    alignItems : 'center',
    alignSelf : 'flex-start',
    borderBottom: "1px solid #bdc4ce",
    marginLeft : 80,
  },
  explorerTitleBar : {
      width : 1280,
      marginLeft : 80,
      flex: 1,
      flexGrow: 1,
      flexShrink: 0,
      flexBasis: "auto",
      flexDirection : 'row',
      justifyContent : 'flex-start',
      alignItems : 'center',
      alignSelf : 'flex-start',
  },
  explorerTitleBarText : {
    fontFamily: constants.font,
    fontSize: 24,
    fontWeight: constants.boldFont,
    color: colors.textBlue,
    marginTop : 18,
    marginBottom : 18,
    marginRight : 16
  },
  explorerTitleText : {
    fontFamily: constants.font,
    fontSize: 12,
    fontWeight: constants.regularFont,
    color: colors.labelGrey,
    marginTop : 18,
    marginBottom : 18,
    marginRight : 16
  },
  dashBoardHeader : {
    marginLeft : 80,
    flex: 1,
    flexDirection : 'row',
    justifyContent : 'flex-start',
    width : 1240
  },
  currentPriceBox: {
    borderColor: colors.orderGrey,
    borderRadius: 3,
    backgroundColor: "white",
    borderWidth: 1,
    width: 624,
    padding: 32,
    flex: 1,
    marginTop: 24,
    overflow: "visible",
    boxShadow: "0 2px 0 0 rgba(189, 196, 206, 0.2)"
  },
  simpleRow : {
    flex: 1,
    flexGrow: 1,
    flexShrink: 0,
    flexBasis: "auto",
    flexDirection : 'row',
    justifyContent : 'flex-start',
    alignItems : 'flex-start'
  },
  TextBoxColumn : {
    flex: 1,
    flexGrow: 1,
    flexShrink: 0,
    flexBasis: "auto",
    flexDirection : 'column',
    justifyContent : 'flex-start',
    alignItems : 'flex-start'
  },
  textBoxLine1Text : {
      fontFamily : constants.fontFamily,
      fontSize : 12 ,
      letterSpacing : 0,
      color : colors.labelGrey,
      fontWeight : constants.regularFont
  },
  textBoxLine2Text : {
    fontFamily : constants.fontFamily,
    fontSize : 24 ,
    letterSpacing : 0,
    color : colors.textBlue,
    fontWeight : constants.boldFont,
    marginTop : 8,
    },
    sectionHeader : { 
        fontFamily : constants.fontFamily,
        fontSize : 18 ,
        letterSpacing : 0,
        color : colors.textBlue,
        fontWeight : constants.boldFont,
        marginBottom : 32
    },
    SummaryBoxColum : {
        height : 106,
        width :  560,
        flex: 1,
        flexDirection : 'column',
        justifyContent : 'flex-start',
        alignItems : 'flex-start',
    },
    summaryDetailRow : {
        width : 560,
        flex : 1 ,
        flexDirection : 'row',
        alignItems : 'center',
        justifyContent : 'flex-start'
    },
    summaryLabel : {
        width : 80,
        fontFamily : constants.fontFamily,
        fontSize : 12 ,
        letterSpacing : 0,
        color : colors.labelGrey,
        fontWeight : constants.regularFont,
    },
    summaryLine1Text : {
        fontFamily : constants.fontFamily,
        fontSize : 18 ,
        letterSpacing : 0,
        color : colors.primaryBlue,
        fontWeight : constants.boldFont,
    },
    summaryLine2Text : {
        fontFamily : constants.fontFamily,
        fontSize : 14 ,
        letterSpacing : 0,
        color : colors.primaryBlue,
        fontWeight : constants.regularFont,
    },
    summaryLine3Text : {
        fontFamily : constants.fontFamily,
        fontSize : 12 ,
        letterSpacing : 0,
        color : colors.textGreen,
        fontWeight : constants.mediumFont,
    },
    summaryLine1RightText : {
        fontFamily : constants.fontFamily,
        fontSize : 14 ,
        letterSpacing : 0,
        color : colors.labelGrey,
        fontWeight : constants.regularFont,
        textAlign : 'right'
    },
    largerTitleBar :   {
        fontFamily: constants.font,
        fontSize: 24,
        fontWeight: constants.boldFont,
        color: colors.textBlue,
    },
    blockGrayBox: { 
        borderRadius : 3,
        overflow : 'visible',
        backgroundColor : colors.tagGrey,
        marginleft : 16,
        textAlign : 'center',
        padding : 8,
        marginLeft : 16,
    },
    blockNumberText : {
        fontFamily: constants.font,
        fontSize: 14,
        fontWeight: constants.regularFont,
        color: colors.textBlue, 
    }
});

export default styles;
