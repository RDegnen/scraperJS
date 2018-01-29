import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
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
    this.state = { isAuthorized: this.checkAuthorized() };
    this.setAuthorized = this.setAuthorized.bind(this);
    this.checkAuthorized = this.checkAuthorized.bind(this);
    this.PrivateRoute = this.PrivateRoute.bind(this);
  }

  setAuthorized(val) {
    this.setState({ isAuthorized: val });
  }

  PrivateRoute({ component, redirectTo, ...rest }) {
    console.log(this.state.isAuthorized)
    return (
      <Route {...rest} render={routeProps => {
        return this.state.isAuthorized ? (
          renderMergedProps(component, routeProps, rest)
        ) : (
          <Redirect to={{
            pathname: redirectTo,
            state: { from: routeProps.location }
          }}/>
        );
      }}/>
    );
  };
  // Not using a data store so checking this whenever the component mounts
  checkAuthorized() {
    if (localStorage.getItem('authToken')) {
      return fetch('users/validate', {
        method: 'GET',
        mode: 'cors',
        headers: {
          authtoken: localStorage.getItem('authToken'),
        },
      })
      .then((data) => {
        return true;
      })
      .catch((err) => {
        console.log(err);
        return false;
      })
    } else {
      console.log('No Token, Unauthorized');
    }
  }

  render() {
    const authorized = this.state.isAuthorized;
    return (
      <BrowserRouter>
        <div className="App">
          <header className="App-header">
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
                <this.PrivateRoute path='/job-listings' component={JobListings} redirectTo='/login'/>
              </Switch>
            </div>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
