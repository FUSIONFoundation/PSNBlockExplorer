import moment from "moment";
import EventEmitter from "events"
const rp = require("request-promise")

var datablock = {
  priceInfo : {},
  latestBlock : {},
  transactions : {},
  blocks : {},
};


let eventEmitter = new EventEmitter();

let server = "https://explorefusion.io"

function scheduleRefresh() {
      setTimeout( ()=> {
        getServerRefresh()
      }, 75000 )
}

getServerRefresh()

function getServerRefresh() {
  const requestOptions = {
    method: "GET",
    uri: server + "/fsnprice",
    qs: {
    },
    headers: {
      "X-Content-Type-Options":"nosniff"
    },
    json: true,
    gzip: true
  };

  rp(requestOptions)
    .then(response => {
      if ( Array.isArray( response ) && response.length > 0 ) {
        console.log(response)
        datablock.priceInfo = response[0]
        console.log( datablock.priceInfo )
        /*
        circulating_supply: 29704811.2
        last_updated: "2018-12-09T10:32:21.000Z"
        market_cap: 19564463.42403713
        percentChange1H: -3.55823
        percentChange24H: 1.27305
        price: 0.658629448688
        recCreated: "2018-12-09T10:34:37.000Z"
        recEdited: "2018-12-09T10:34:37.000Z"
        total_supply: 57344000
        _id: "2018-12-09T15:34:32.062Z"
        */
      }
      scheduleRefresh()
    })
    .catch(err => {
      console.log("API call error:", err.message);
      scheduleRefresh()
    });
}

export default class currentDataState {

  static get datablock() {
    return datablock
  }
 
  static blockInfo( balanceInfo ) {
  }

  /**
   * Adds the @listener function to the end of the listeners array
   * for the event named @eventName
   * Will ensure that only one time the listener added for the event
   *
   * @param {string} eventName
   * @param {function} listener
   */
  static on(eventName, listener) {
    eventEmitter.on(eventName, listener);
  }

  /**
   * Will temove the specified @listener from @eventname list
   *
   * @param {string} eventName
   * @param {function} listener
   */
  static removeEventListener(eventName, listener) {
    eventEmitter.removeListener(eventName, listener);
  }
  /**
   * Will emit the event on the evetn name with the @payload
   * and if its an error set the @error value
   *
   * @param {string} event
   * @param {object} payload
   * @param {boolean} error
   */
  static emit(event, payload, error = false) {
    eventEmitter.emit(event, payload, error);
  }
  /**
   * Returns the event emitter
   * Used for testing purpose and avoid using this during development
   */
  static getEventEmitter() {
    return eventEmitter;
  }
}
