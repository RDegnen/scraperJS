import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import logo from '../logo.svg';
import '../styles/App.css';
import Login from './components/login';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to ScraperJS</h1>
        </header>
        <Switch>
          <Route path='/login' component={Login}/>
        </Switch>
      </div>
    );
  }
}

export default App;
