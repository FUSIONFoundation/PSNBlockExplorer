import React, { Component } from "react";
import { View } from "react-native";
import "./App.css";
import history from "./history.js";
import Dashboard from "./Components/Dashboard.js";
import Blocks from "./Components/Blocks.js";
import Transactions from "./Components/Transactions.js";
import Assets from "./Components/Assets.js";
import Addresses from "./Components/Addresses.js";
import Header from "./Components/Header.js";
import Menu from "./Components/Menu.js";
import BlockDisplayer from "./Components/BlockDisplayer";
import 'font-awesome/css/font-awesome.min.css';

import { Route, Router } from "react-router-dom";


class App extends Component {
  render() {

    return (
      <View>
        <Header/>
        <Menu/>
        <Router history={history}>
            <div>
              <Route exact path="/" component={Dashboard} />
              <Route path="/Blocks" component={Blocks} />         
              <Route path="/Transactions" component={Transactions} />
              <Route path="/Assets" component={Assets} />
              <Route path="/Addresses" component={Addresses}/>
              <Route path="/Block/:blockNumber" component={BlockDisplayer} />
            </div>
          </Router>
      </View>
    );
  }
}

export default App;
