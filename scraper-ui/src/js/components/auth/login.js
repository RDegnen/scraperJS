import React, { Component } from 'react';

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
      <button id='github-auth-btn' onClick={this.login}>Github</button>
    );
  }
}

export default Login;
