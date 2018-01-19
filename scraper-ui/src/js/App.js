import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import logo from '../logo.svg';
import '../styles/App.css';
import Login from './components/auth/login';
import Logout from './components/auth/logout';
import Authorize from './components/auth/auth';
import JobListings from './components/listings/jobListings';
import Scraper from './components/scraper/scraper';

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
    this.state = { isAuthorized: false };
  }
  // FIXME: Auth needs to be done via dynamo becaue it gets reset on route changes
  setAuthorized(val) {
    this.setState({ isAuthorized: val });
  }

  render() {
    const authorized = this.state.isAuthorized;
    console.log(authorized)
    return (
      <BrowserRouter>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to ScraperJS</h1>
                {authorized ? (
                  <div>
                    <Logout setAuthorized={this.setAuthorized}/>
                    <Scraper />
                  </div>
                ) : (
                  <Login />
                )}
          </header>
            <div>
              <Switch>
                <PropsRoute path='/auth' component={Authorize} setAuthorized={this.setAuthorized}/>
                <Route path='/job-listings' component={JobListings}/>
              </Switch>
            </div>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
