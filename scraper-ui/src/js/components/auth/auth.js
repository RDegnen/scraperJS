import React, { Component } from 'react';

class Authorize extends Component {
  authorizeGithub(authUrl) {
    let data = { authUrl: authUrl }
    return fetch('/users/auth', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(res => res.json())
    .then((data) => {
      localStorage.setItem('authToken', data.authToken);
    })
    .catch(err => console.log(err));
  }
  componentDidMount() {
    this.authorizeGithub(this.props.location.search)
  }

  render() {
    return (
      <h2 className='h2-auth'>Authorized</h2>
    );
  }
}

export default Authorize;
