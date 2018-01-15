import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import logo from '../logo.svg';
import '../styles/App.css';
import Login from './components/login';
import Authorize from './components/auth';

class Header extends Component {
  render() {
    return (
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1 className="App-title">Welcome to ScraperJS</h1>
      </header>
    );
  }
}

class Body extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Switch>
            <Route path='/login' component={Login}/>
            <Route path='/auth' component={Authorize}/>
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <Body />
      </div>
    );
  }
}

export default App;
