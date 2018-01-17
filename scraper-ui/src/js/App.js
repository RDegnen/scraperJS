import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import logo from '../logo.svg';
import '../styles/App.css';
import Login from './components/auth/login';
import Logout from './components/auth/logout';
import Authorize from './components/auth/auth';

const renderMergedProps = (component, ...rest) => {
  const finalProps = Object.assign({}, ...rest);
  return (
    React.createElement(component, finalProps)
  );
}

const PropsRoute = ({ component, ...rest }) => {
  return (
    <Route {...rest} render={routeProps => {
      return renderMergedProps(component, routeProps, rest);
    }}/>
  );
}

class App extends Component {
  constructor(props) {
    super(props);
    this.setAuthorized = this.setAuthorized.bind(this);
    this.state = { isAuthenticated: false };
  }

  setAuthorized(val) {
    this.setState({ isAuthenticated: val });
  }

  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to ScraperJS</h1>
            <Logout setAuthorized={this.setAuthorized}/>
          </header>
          <div>
            <Switch>
              <Route path='/login' component={Login}/>
              <PropsRoute path='/auth' component={Authorize} setAuthorized={this.setAuthorized}/>
            </Switch>
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
