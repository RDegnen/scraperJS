import React, { Component } from 'react';
import Button from 'material-ui/Button';

class Login extends Component {
  login() {
    fetch('/users/login', {
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
