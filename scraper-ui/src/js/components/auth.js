import React, { Component } from 'react';

class Authorize extends Component {
  authorizeGithub(authUrl) {
    let data = { authUrl: authUrl }
    fetch('/users/auth', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(res => res.json())
    .then((data) => {
      console.log(data);
    })
    .catch(err => console.log(err));
  }
  componentDidMount() {
    this.authorizeGithub(this.props.location.search)
  }

  render() {
    return (
      <h2>Authorized</h2>
    );
  }
}

export default Authorize;
