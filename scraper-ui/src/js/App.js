import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import logo from '../logo.svg';
import '../styles/App.css';
import Login from './components/login';

// ReactDOM.render((
//   <Router>
//     <Route path='/login' Component={App}/>
//   </Router>
// ), document.getElementById('root'))

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to ScraperJS</h1>
        </header>
        <p className="App-intro">
          <Login />
        </p>
      </div>
    );
  }
}

export default App;
