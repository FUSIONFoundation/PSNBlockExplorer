import React, { Component } from "react";
import { View } from "react-native";
import "./App.css";
import history from "./history.js";
import Dashboard from "./Components/Dashboard.js";
import Blocks from "./Components/Blocks.js";
import Transactions from "./Components/Transactions.js";
import Assets from "./Components/Assets.js";
import Addresses from "./Components/Addresses.js";
import Header from "./Components/Header/Header.js";
import AppSelect from "./Components/Header/AppSelect.js";
import Menu from "./Components/Menu.js";
import 'font-awesome/css/font-awesome.min.css';

import { Route, Router, Switch } from "react-router-dom";


class App extends Component {
  render() {

    return (
      <View>
        <Header title="Block Explorer" titleWidth={150} version="1.00.00"/>
        <Menu/>
        <Router history={history}>
            <div>
              <Switch>
              <Route exact path="/" component={Dashboard} />
              <Route path="/Blocks/:blockNumber" component={Blocks} />
              <Route path="/Blocks" component={Blocks} />
              <Route path="/Transactions/:transactionHash" component={Transactions} />
              <Route path="/Transactions" component={Transactions} />
              <Route path="/Assets" component={Assets} />
              <Route path="/Addresses/:addressHash" component={Addresses}/>
              <Route path="/Addresses" component={Addresses}/>
              </Switch>
            </div>
          </Router>
          <AppSelect/>
      </View>
    );
  }
}

export default App;
