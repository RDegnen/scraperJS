import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import Button from 'material-ui/Button';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import styles from './authStyle';

class Logout extends Component {
  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
  }

  logout() {
    this.props.history.push('/login');
    const authToken = localStorage.getItem('authToken');
    return fetch('/users/logout', {
      method: 'POST',
      mode: 'cors',
      headers: {
        authtoken: authToken,
      },
    })
    .then(() => {
      localStorage.removeItem('authToken');
      this.props.setAuthorized(false);
    })
    .catch(err => console.log(err));
  }

  render() {
    const { classes } = this.props
    return (
      <Button className={classes.grey} id='sign-out-btn' onClick={this.logout}>Sign Out</Button>
    );
  }
}

Logout.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withRouter(Logout));
