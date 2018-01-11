import React, { Component } from 'react';

class Login extends Component {
  login() {
    fetch('/users/login', {
      method: 'GET',
      mode: 'no-cors',
    })
    .then((data) => {
      console.log(data);
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
