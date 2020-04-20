import React from 'react';
import Lobby from './components/Lobby';
import Game from './components/Game';
import Socket from './components/SocketStore';
import { Provider } from 'mobx-react';
import store from './store.js';
import './theme.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom'

/**

GAMEPLAY

* Fix resizing (dynamic with certain window sizes || min size big)

* Push

* Readme for running

 */

function App() {
  return (
      <Provider store={store}>
        <Router>
          <Switch>
            <Route exact path="/" component={Lobby} />
            <Route path="/game/:id" component={Game} />
            <Redirect to="/" />
          </Switch>
        </Router>
        <Socket/>
      </Provider>
  );
}

export default App;


