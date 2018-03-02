import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect, NavLink } from 'react-router-dom';
import '../styles/App.css';
import Login from './components/auth/login';
import Logout from './components/auth/logout';
import Authorize from './components/auth/auth';
import JobListings from './components/listings/jobListings';
import Scraper from './components/scraper/scraper';
import ErrorModal from './components/errors/errorModal';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import { MuiThemeProvider } from 'material-ui/styles';
import Button from 'material-ui/Button';
import styles, { themeOverride } from './appStyle'

const api = process.env.REACT_APP_NODE_API;

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
    this.state = {
      isAuthorized: this.checkAuthorized(),
      errorObject: {
        status: '',
        message: '',
      },
      errorModalOpen: false,
    };
    this.setAuthorized = this.setAuthorized.bind(this);
    this.checkAuthorized = this.checkAuthorized.bind(this);
    this.PrivateRoute = this.PrivateRoute.bind(this);

    this.closeErrorModal = this.closeErrorModal.bind(this);
    this.openErrorModal = this.openErrorModal.bind(this);
    this.setErrorObject = this.setErrorObject.bind(this);
    this.handleFetchError = this.handleFetchError.bind(this);
  }

  setAuthorized(val) {
    this.setState({ isAuthorized: val });
  }

  setErrorObject(status, message) {
    this.setState({ errorObject: {
      status: status,
      message: message,
    }})
  }

  closeErrorModal() {
    this.setState({ errorModalOpen: false });
  }

  openErrorModal() {
    this.setState({ errorModalOpen: true });
  }

  handleFetchError(status, message) {
    if (status === 401) {
      this.setAuthorized(false);
    }
    this.setErrorObject(status, message);
    this.openErrorModal();
  }

  PrivateRoute({ component, redirectTo, ...rest }) {
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
      return fetch(`${api}users/validate`, {
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
        <MuiThemeProvider theme={themeOverride}>
          <div className={classes.root}>
            <Grid container className={classes.mainContainer} alignItems={'stretch'} direction={'row-reverse'} justify={'center'} spacing={24}>
              <Grid item xs={12} sm={4} md={2}>
                <div className={`${classes.nav}`}>
                  <Typography type='headline' className={classes.navGrey}>ScraperJS</Typography>
                      {isAuthorized ? (
                        <div>
                          <Scraper />
                          <div className={classes.navLinkDiv}>
                            <Typography type='title' className={classes.navGrey}>View Listings</Typography>
                            <Button size='small' activeClassName={classes.navLink}
                                                 className={classes.navGrey}
                                                 component={props => <NavLink {...props}/>}
                                                 to='/job-listings'>All Listings</Button>
                            <Button size='small' activeClassName={classes.navLink}
                                                 className={classes.navGrey}
                                                 component={props => <NavLink {...props}/>}
                                                 to='/user-listings'>My Listings</Button>
                          </div>
                          <Logout setAuthorized={this.setAuthorized}/>
                        </div>
                      ) : (
                        <Login />
                      )}
                </div>
              </Grid>
              <Grid item xs={12} sm={8} md={10} className={classes.paper}>
              <ErrorModal error={this.state.errorObject} open={this.state.errorModalOpen} handleClose={this.closeErrorModal}/>
                <Switch>
                  <PropsRoute path='/auth' component={Authorize} setAuthorized={this.setAuthorized}/>
                  <this.PrivateRoute path='/job-listings' component={JobListings}
                    userListings={false} setAuthorized={this.setAuthorized}
                    handleFetchError={this.handleFetchError} redirectTo='/login'/>
                  <this.PrivateRoute path='/user-listings' component={JobListings}
                    userListings={true} setAuthorized={this.setAuthorized}
                    handleFetchError={this.handleFetchError} redirectTo='/login'/>
                </Switch>
              </Grid>
            </Grid>
          </div>
        </MuiThemeProvider>
      </BrowserRouter>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);
