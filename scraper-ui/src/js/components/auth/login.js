import React, { Component } from 'react';
import Button from 'material-ui/Button';
import { checkResponseStatus } from '../../utils/helpers';

const api = process.env.REACT_APP_NODE_API;

class Login extends Component {
  login() {
    fetch(`${api}users/login`, {
      method: 'GET',
      mode: 'cors',
    })
    .then(res => checkResponseStatus(res, true))
    .then((authUrl) => {
      window.location.assign(authUrl);
    })
    .catch((err) => {
      console.log(err);
      this.props.handleFetchError(err.status, err.statusText);
    });
  }

  render() {
    return (
      <Button raised id='github-auth-btn' color="primary" onClick={this.login}>Login via Github</Button>
    );
  }
}

export default Login;
