import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import logo from '../logo.svg';
import '../styles/App.css';
import Login from './components/auth/login';
import Logout from './components/auth/logout';
import Authorize from './components/auth/auth';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to ScraperJS</h1>
            <Logout />
          </header>
          <div>
            <Switch>
              <Route path='/login' component={Login}/>
              <Route path='/auth' component={Authorize}/>
            </Switch>
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
