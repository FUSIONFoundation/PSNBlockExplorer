import moment from "moment";
import EventEmitter from "events";
import { debug } from "util";
const rp = require("request-promise");

var datablock = {
  priceInfo: {},
  transactions: {},
  blocks: {},
  totalTransactions: "-",
  lastUpdateTime: new Date(),
  last5Blocks: [],
  last5Transactions: [],
  menuPath: "Dashboard",
  blockCache: {},
  pendingLoad: {},
  pendingTLoad: {},
  cacheTLoad: {},
  letPageTransactionCache : {},
  letPageTransactionCachePending : {},
  letPageBlockCache : {},
  letPageBlockCachePending : {},
  maxBlock: 0
};

let eventEmitter = new EventEmitter();

let server = "https://api.fusionnetwork.io";

function scheduleRefresh() {
  setTimeout(() => {
    getServerRefresh();
  }, 7500);
}

getServerRefresh();

function getServerRefresh() {
  const requestOptions = {
    method: "GET",
    uri: server + "/fsnprice",
    qs: {
      sort: "desc"
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
        //if ( datablock.)
        //   if ( datablock.maxBlock !== response.maxBlock ||
        //   datablock.totalTransactions !== response.totalTransactions ||
        //   datablock.priceInfo._id !== response.data.priceInfo._id )
        //  {
        //we want to always update the update time
        let getNext5 = false;
        console.log(response);
        if (datablock.maxBlock !== response.maxBlock) {
          getNext5 = true;
          datablock.maxBlock = response.maxBlock;
        }
        datablock.totalTransactions = response.totalTransactions;
        datablock.priceInfo = response.priceInfo;
        datablock.lastTwoBlocks = response.lastTwoBlocks;
        datablock.lastUpdateTime = new Date();
        if (getNext5) {
          fetchNext5();
        }
        currentDataState.emit("data", datablock);
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
      scheduleRefresh();
    })
    .catch(err => {
      console.log("API call error:", err.message);
      scheduleRefresh();
    });
}

function fetchNext5() {
  const requestOptions = {
    method: "GET",
    uri: server + "/blocks/all",
    qs: {
      sort: "desc",
      page: 0,
      size: 5
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
        console.log("555555");
        console.log(response);
        datablock.last5Blocks = response;
        currentDataState.emit("data", datablock);
        for (let b of response) {
          datablock.blockCache[b.hash] = b;
          datablock.blockCache[b.height] = b;
        }
        return getNext5Transactions();
      }
      return true;
    })
    .catch(err => {
      console.log("Fetch next blocks API call error:", err.message);
      setTimeout(fetchNext5, 1000);
    });
}

function getNext5Transactions() {
  const requestOptions = {
    method: "GET",
    uri: server + "/transactions/all",
    qs: {
      sort: "desc",
      page: 0,
      size: 5
    },
    headers: {
      "X-Content-Type-Options": "nosniff"
    },
    json: true,
    gzip: true
  };

  return rp(requestOptions)
    .then(response => {
      if (response) {
        console.log("TTTT");
        console.log(response);
        datablock.last5Transactions = response;
        currentDataState.emit("data", datablock);
      }
      return true;
    })
    .catch(err => {
      console.log("Fetch next blocks API call error:", err.message);
      setTimeout(getNext5Transactions, 1000);
    });
}

export default class currentDataState {
  static get datablock() {
    return datablock;
  }

  static blockInfo(balanceInfo) {}

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
    listener("data", datablock);
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

  static setMenuPath(path) {
    datablock.menuPath = path;
    eventEmitter.emit("menuPathChanged", path, false);
  }

  static getBlock(blockNumber) {
    let b = datablock.blockCache[blockNumber];
    if (b) {
      if (!b.parsed) {
        b.parsed = JSON.parse(b.block);
      }
      return b;
    }

    if (datablock.pendingLoad[blockNumber]) {
      return "loading";
    }

    datablock.pendingLoad[blockNumber] = true;

    if (typeof blockNumber === "string" && blockNumber.startsWith("0x")) {
      currentDataState.requestBlockRange(blockNumber, blockNumber);
      return "loading";
    }
    // lets request 10 blocks
    let blockStart = blockNumber;
    if (blockNumber < 5) {
      blockStart -= 5;
    }
    currentDataState.requestBlockRange(blockStart, blockNumber, blockNumber);
    return "loading";
  }

  static requestBlockRange(blockStart, keyToLoad, orgVal) {
    let page = 0,
      size = 1;
    let uri = server + "/blocks/" + blockStart;

    if (typeof blockStart !== "string" || !blockStart.startsWith("0x")) {
      // debugger
      page = parseInt(parseInt(blockStart) / 10);
      size = 10;
      uri = server + "/blocks/all";
    }

    const requestOptions = {
      method: "GET",
      uri,
      qs: {
        sort: "asc",
        page,
        size
      },
      headers: {
        "X-Content-Type-Options": "nosniff"
      },
      json: true,
      gzip: true
    };

    return rp(requestOptions)
      .then(response => {
        if (response) {
          //console.log( "yyyyyy")
          //console.log( response )

          for (let b of response) {
            datablock.blockCache[b.hash] = b;
            datablock.blockCache[b.height] = b;
          }
          eventEmitter.emit("blocksLoaded", datablock, false);
        }
        delete datablock.pendingLoad[keyToLoad];
        return true;
      })
      .catch(err => {
        console.log("Fetch next blocks API call error:", err.message);
        delete datablock.pendingLoad[keyToLoad];
        setTimeout(() => {
          currentDataState.requestBlockRange(blockStart, keyToLoad, orgVal);
        }, 1000);
      });
  }

  // pendingTLoad : {},
  // cacheTLoad : {},

  static getTransaction(t) {
    let tr = datablock.transactions[t];
    if (tr) {
      if ( !tr.parsed ) {
        tr.transaction = JSON.parse(tr.transaction)
        tr.receipt = JSON.parse(tr.receipt)
        tr.parsed = true
      }
      return tr;
    }

    if (datablock.pendingTLoad[t]) {
      return "loading";
    }

    let startTimer = Object.keys(datablock.cacheTLoad).length === 0;

    datablock.pendingTLoad[t] = true;

    datablock.cacheTLoad[t] = true;

    if (startTimer && !datablock.disableTLoader) {
      setTimeout(currentDataState.executeLoadOfTransactions, 1);
    }

    return "loading";
  }

  static executeLoadOfTransactions(c) {
    let uri = server + "/transactions/ts";
    
    let cacheToProces = c ? c : Object.keys( datablock.cacheTLoad );
    if (!c) {
      datablock.cacheTLoad = {};
    }
    if ( cacheToProces.length === 0 ) {
      return
    }
    datablock.disableTLoader = true;

    const requestOptions = {
      method: "GET",
      uri,
      qs: {
        ts: cacheToProces.join("-")
      },
      headers: {
        "X-Content-Type-Options": "nosniff"
      },
      json: true,
      gzip: true
    };

    return rp(requestOptions)
      .then(response => {
        if (response) {
          console.log("yyyTTTTTTyy" + cacheToProces.join("-"), requestOptions);
          console.log(response);

          for (let t of response) {
            datablock.transactions[t.hash] = t;
            delete datablock.pendingTLoad[t.hash];
          }
          datablock.disableTLoader = false;
          eventEmitter.emit("transactionsLoaded", datablock, false);
        }
        return true;
      })
      .catch(err => {
        console.log("Fetch next transaction API call error:", err);
        setTimeout(() => {
          currentDataState.executeLoadOfTransactions(cacheToProces);
        }, 1000);
      });
  }

  static generateTransactionListFromTime( pageNumber, sortField, direction, size , callback ) {
    let uri = server + "/transactions/all";
    let qs = { pageNumber, sortField , direction }
    let qsStringify = JSON.stringify(qs)

    if (  datablock.letPageTransactionCache[qsStringify] ) {
      return datablock.letPageTransactionCache[qsStringify]
    }

    if ( datablock.letPageTransactionCachePending[qsStringify] ) {
      return "loading"
    }

    datablock.letPageTransactionCachePending[qsStringify] = true

    // http://localhost:3000/transactions/all?sort=asc&page=20&size=10&field=height

    const requestOptions = {
      method: "GET",
      uri,
      qs: {
        page : pageNumber,
        size : size,
        sort : direction,
        field : sortField
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
          let tss = []
          for ( let t of response ) {
            datablock.transactions[t.hash] = t
            tss.push( t.hash )
          }
          datablock.letPageTransactionCache[qsStringify] = tss
          callback( null, datablock.letPageTransactionCache[qsStringify]  )
        }
        delete datablock.letPageTransactionCachePending[qsStringify] 
        return true;
      })
      .catch(err => {
        delete datablock.letPageTransactionCachePending[qsStringify] 
        callback( err, null )
      });

    return "loading"
  }

  static generateBlockList( index, sortField, direction, size , callback ) {
    let uri = server + "/blocks/all";
    let qs = { index, sortField , direction }
    let qsStringify = JSON.stringify(qs)

    if (  datablock.letPageBlockCache[qsStringify] ) {
      return datablock.letPageBlockCache[qsStringify]
    }

    if ( datablock.letPageBlockCachePending[qsStringify] ) {
      return "loading"
    }

    datablock.letPageBlockCachePending[qsStringify] = true

    // http://localhost:3000/transactions/all?sort=asc&page=20&size=10&field=height

    const requestOptions = {
      method: "GET",
      uri,
      qs: {
        index : index,
        size : size,
        sort : direction,
        field : sortField
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
          let bbb = []
          for ( let b of response ) {
            b.parsed = JSON.parse(b.block);
            datablock.blockCache[b.hash] = b;
            datablock.blockCache[b.height] = b;
            bbb.push( b )
          }
          datablock.letPageBlockCache[qsStringify] = bbb
          //debugger
          callback( null, bbb  )
        }
        delete datablock.letPageBlockCachePending[qsStringify]
        return true;
      })
      .catch(err => {
        delete datablock.letPageBlockCachePending[qsStringify]
        callback( err, null )

      });

    return "loading"
  }

}
