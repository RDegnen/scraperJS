import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import '../styles/App.css';
import Login from './components/auth/login';
import Logout from './components/auth/logout';
import Authorize from './components/auth/auth';
import JobListings from './components/listings/jobListings';
import Scraper from './components/scraper/scraper';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import styles from './appStyle'

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
    const { isAuthorized } = this.state;
    const { classes } = this.props;
    return (
      <BrowserRouter>
        <div className={classes.root}>
          <Grid container className={classes.mainContainer} alignItems={'stretch'} direction={'row-reverse'} justify={'center'} spacing={24}>
            <Grid item xs={12} sm={2}>
              <div className={classes.nav}>
                <h1 className="App-title">ScraperJS</h1>
                    {isAuthorized ? (
                      <div>
                        <Logout setAuthorized={this.setAuthorized}/>
                        <Scraper />
                      </div>
                    ) : (
                      <Login />
                    )}
              </div>
            </Grid>
            <Grid item xs={12} sm={10} className={classes.paper}>
              <Switch>
                <PropsRoute path='/auth' component={Authorize} setAuthorized={this.setAuthorized}/>
                <this.PrivateRoute path='/job-listings' component={JobListings} redirectTo='/login'/>
              </Switch>
            </Grid>
          </Grid>
        </div>
      </BrowserRouter>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);
