import React, { Component } from 'react';
import { withRouter } from "react-router-dom";

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
    })
    .catch(err => console.log(err));
  }

  render() {
    return (
      <button id='sign-out-btn' onClick={this.logout}>Sign Out</button>
    );
  }
}

export default withRouter(Logout);
