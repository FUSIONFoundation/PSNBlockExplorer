import moment from "moment";
import EventEmitter from "events"
const rp = require("request-promise")

var datablock = {
  priceInfo : {},
  latestBlock : {},
  transactions : {},
  blocks : {},
  totalTransactions : "-",
  lastUpdateTime : new  Date(),
  last5Blocks : [],
  last5Transactions : [],
  menuPath : 'Dashboard',
  blockCache : {}
};


let eventEmitter = new EventEmitter();

let server = "https://explorefusion.io"

function scheduleRefresh() {
      setTimeout( ()=> {
        getServerRefresh()
      }, 7500 )
}

getServerRefresh()

function getServerRefresh() {
  const requestOptions = {
    method: "GET",
    uri: server + "/fsnprice",
    qs: {
      sort : 'desc'
    },
    headers: {
      "X-Content-Type-Options":"nosniff"
    },
    json: true,
    gzip: true
  };

  rp(requestOptions)
    .then(response => {
      if ( response ) {
        //if ( datablock.)
      //   if ( datablock.maxBlock !== response.maxBlock ||
      //   datablock.totalTransactions !== response.totalTransactions ||
      //   datablock.priceInfo._id !== response.data.priceInfo._id )
      //  {
        //we want to always update the update time
          let getNext5 = false
          console.log(response);
          if ( datablock.maxBlock !== response.maxBlock ) {
            getNext5 = true
            datablock.maxBlock = response.maxBlock
          }
          datablock.totalTransactions = response.totalTransactions
          datablock.priceInfo = response.priceInfo
          datablock.lastTwoBlocks = response.lastTwoBlocks
          datablock.lastUpdateTime = new Date()
          if ( getNext5 ) {
            fetchNext5()
          }
          currentDataState.emit( "data", datablock )
        // }
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

function fetchNext5() {
  const requestOptions = {
    method: "GET",
    uri: server + "/blocks/all",
    qs: {
      sort : 'desc',
      page : 0,
      size : 5
    },
    headers: {
      "X-Content-Type-Options":"nosniff"
    },
    json: true,
    gzip: true
  };

  return rp(requestOptions)
    .then(response => {
      if ( response ) {
        console.log( "555555")
        console.log( response )
        datablock.last5Blocks = response
        currentDataState.emit( "data", datablock )
        for ( let b of response ) {
          datablock.blockCache[b.hash] = b
          datablock.blockCache[b.height] = b
        }
        return getNext5Transactions()
      }
      return true
    })
    .catch(err => {
      console.log("Fetch next blocks API call error:", err.message);
      setTimeout( fetchNext5, 1000 ) 
    });
}

function getNext5Transactions() {
  const requestOptions = {
    method: "GET",
    uri: server + "/transactions/all",
    qs: {
      sort : 'desc',
      page : 0,
      size : 5
    },
    headers: {
      "X-Content-Type-Options":"nosniff"
    },
    json: true,
    gzip: true
  };

  return rp(requestOptions)
    .then(response => {
      if ( response ) {
        console.log( "TTTT")
        console.log( response )
        datablock.last5Transactions = response
        currentDataState.emit( "data", datablock )
      }
      return true
    })
    .catch(err => {
      console.log("Fetch next blocks API call error:", err.message);
      setTimeout( getNext5Transactions, 1000 ) 
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
    listener( 'data', datablock )
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

  static setMenuPath( path ) {
    datablock.menuPath = path
    eventEmitter.emit( 'menuPathChanged', path, false )
  }

  static getBlock( blockNumber ) {
   
    let b = datablock.blockCache[blockNumber]
    if ( b ) {
      return b
    }

    // lets request 10 blocks
    let blockStart 
    if ( blockNumber < 5 ) {
      blockStart = 0
    } else {
      blockStart = blockNumber - 5
    }
    requestBlockRange(blockStart)
    return "loading"
  }
}

function requestBlockRange(blockStart ) {
  
  let page = Math.floor( blockStart ) / 20
  let size = 20 
  const requestOptions = {
    method: "GET",
    uri: server + "/blocks/all",
    qs: {
      sort : 'asc',
      page ,
      size 
    },
    headers: {
      "X-Content-Type-Options":"nosniff"
    },
    json: true,
    gzip: true
  };

  return rp(requestOptions)
    .then(response => {
      if ( response ) {
        console.log( "yyyyyy")
        console.log( response )
        currentDataState.emit( "data", datablock )
         
        for ( let b of response ) {
          datablock.blockCache[b.hash] = b
          datablock.blockCache[b.height] = b
        }
        eventEmitter.emit("blocksLoaded", datablock , false )
      }
      return true
    })
    .catch(err => {
      console.log("Fetch next blocks API call error:", err.message);
      setTimeout( () => {
        requestBlockRange(blockStart )
      }, 1000 ) 
    });
}
