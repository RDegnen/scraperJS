import React, { Component } from 'react';
import Button from 'material-ui/Button';

const api = process.env.REACT_APP_NODE_API;

class Login extends Component {
  login() {
    fetch(`${api}users/login`, {
      method: 'GET',
      mode: 'cors',
    })
    .then(res => res.json())
    .then((authUrl) => {
      window.location.assign(authUrl);
    })
    .catch(err => console.log(err));
  }

  render() {
    return (
      <Button raised id='github-auth-btn' color="primary" onClick={this.login}>Login via Github</Button>
    );
  }
}

export default Login;
