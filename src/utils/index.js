
let glb_commandMap = {
  "BuyTicketFunc" : "Buy Ticket",
  "MakeSwapFunc" : "Make Swap",
  "GenAssetFunc" : "Create Asset",
  "SendAssetFunc" : "Send Asset",
  "TakeSwapFunc" : "Take Swap",
  "RecallSwapFunc" : "Recall Swap",
  "AssetToTimeLock" : "Asset To Time Lock",
  "TimeLockToTimeLock" : "Time Lock to Time Lock",
  "TimeLockToAsset" : "Time Lock To Asset"
}
export default class Utils {
  // https://stackoverflow.com/questions/10599933/convert-long-number-into-abbreviated-string-in-javascript-with-a-special-shortn
  static displayNumber2(value) {
    var newValue = value;
    if (value >= 1000) {
      let suffixes = ["", "K", "M", "B", "T"];
      let suffixNum = Math.floor(("" + value).length / 3);
      let shortValue = "";
      for (let precision = 2; precision >= 1; precision--) {
        shortValue = parseFloat(
          (suffixNum !== 0
            ? value / Math.pow(1000, suffixNum)
            : value
          ).toPrecision(precision)
        );
        var dotLessShortValue = (shortValue + "").replace(
          /[^a-zA-Z 0-9]+/g,
          ""
        );
        if (dotLessShortValue.length <= 2) {
          break;
        }
      }
      if (shortValue % 1 !== 0) shortValue = shortValue.toFixed(2);
      newValue = shortValue + suffixes[suffixNum];
    }
    return newValue;
  }

  static getServer() {
    if ( window.location.href.indexOf( "useServer2") > 0 ) {
      return  "https://api2.fusionnetwork.io";
    } else {
      return  "https://psn2api.fusionnetwork.io";
    }
  }

  static insert(str, index, value) {
    return str.substr(0, index) + value + str.substr(index);
  }

  static formatWei(val) {
    if (typeof val === "object") {
      val = val.toString();
    }
    let len = val.length;
    if (len < 18) {
      val = "0".repeat(18 - len) + val;
      len = 18;
    }
    if (len === 18) {
      val = "." + val;
    } else {
      val = Utils.insert(val, val.length - 18, ".");
    }

    val = Utils.removeZeros(val, true, true, true);

    if (val.charAt(0) === ".") {
      return "0" + val;
    }
    if (val.length === 0) {
      return 0;
    }
    return val;
  }

  static removeZeros(val, trailing = true, leading = false, decimal = true) {
    var regEx1 = /^[0]+/;
    var regEx2 = /[0]+$/;
    var regEx3 = /[.]$/;

    var before = "";
    var after = "";

    before = val;

    if (leading) {
      after = before.replace(regEx1, ""); // Remove leading 0's
    } else {
      after = before;
    }
    if (trailing) {
      if (after.indexOf(".") > -1) {
        after = after.replace(regEx2, ""); // Remove trailing 0's
      }
    }
    if (decimal) {
      after = after.replace(regEx3, ""); // Remove trailing decimal
    }
    return after;
  }

  static formatPercent( a ) {
    if (  typeof a === 'string') {
      return "-"
    }
    if ( a > 99 ) {
      a = a.toFixed( 0 )
    } else {
      a = a.toFixed(2)
    }
    return a + "%"
  } 

  static displayNumber(value, precision = 2, trimTrailingZeros = false) {
    var units = " K M G T P E Z Y".split(" ");

    if (isNaN(value)) {
      return "-";
    }

    if (value < 0) {
      return "-" + Utils.displayNumber(Math.abs(value));
    }

    // if (value < 1) {
    //   debugger
    //   // return value + units[0];
    // }

    var power = Math.min(
      Math.floor(Math.log(value) / Math.log(1000)),
      units.length - 1
    );

    if (power === -1) {
      power = 0;
    }

    var val = "" + (value / Math.pow(1000, power)).toFixed(precision);

    if (trimTrailingZeros) {
      val = Utils.removeZeros(val);
    }

    return val + units[power];
  }

  static displayPercent(a) {
    a = a * 100;
    return a.toFixed(2);
  }

  static calcReward(height) {
    let i;
    // initial reward 2.5
    let reward = 2.5;
    // every 4915200 blocks divide reward by 2
    let segment = Math.floor(height / 4915200);
    for (i = 0; i < segment; i++) {
      reward = reward / 2;
    }
    return reward;
  }

  static timeAgo(date) {
    // Should show all seconds. If > 59s show in minutes only. (1m).
    // If greater than 1m wait until next minute to change time. (2m)
    // If greater than an hour we can show Hours and mins (1h2m)
    // If greater than 24 hours we can show in days and hours. (2d 12h)... etc.
    // ago

    if (typeof date !== "object") {
      date = new Date(date);
    }

    var seconds = Math.floor((new Date() - date) / 1000);
    var intervalType;

    var interval = Math.floor(seconds / 31536000);
    if (interval >= 1) {
      intervalType = "year";
    } else {
      interval = Math.floor(seconds / 2592000);
      if (interval >= 1) {
        intervalType = "month";
      } else {
        interval = Math.floor(seconds / 86400);
        if (interval >= 1) {
          intervalType = "day";
        } else {
          interval = Math.floor(seconds / 3600);
          if (interval >= 1) {
            intervalType = "hour";
          } else {
            interval = Math.floor(seconds / 60);
            if (interval >= 1) {
              intervalType = "minute";
            } else {
              interval = seconds;
              intervalType = "second";
            }
          }
        }
      }
    }

    if (interval > 1 || interval === 0) {
      intervalType += "s";
    }

    return interval + " " + intervalType;
  }

  static midHashDisplay(addr) {
    let first = addr.substr(0, 9);
    let end = addr.substr(addr.length - 10, 9);
    return first + "..." + end;
  }

  /**
   * Should be called to get ascii from it's hex representation
   *
   * @method toAscii
   * @param {String} string in hex
   * @returns {String} ascii string representation of hex value
   */
  static toAscii(hex) {
    // Find termination
    var str = "";
    var i = 0,
      l = hex.length;
    if (hex.substring(0, 2) === "0x") {
      i = 2;
    }
    for (; i < l; i += 2) {
      var code = parseInt(hex.substr(i, 2), 16);
      str += String.fromCharCode(code);
    }

    return str;
  }

  static getFusionCmdDisplayName(cmd, data) {
    if ( !cmd ) {
      return "Send"
    }
    let ret = glb_commandMap[cmd]
    if ( !ret ) {
      if ( cmd === 'AssetValueChangeFunc' ) {
        if ( data.IsInc ) {
          return "Increase Asset Supply"
        } else {
          return "Decrease Asset Supply"
        }
      }
      return cmd
    }
    return ret
  }
}
