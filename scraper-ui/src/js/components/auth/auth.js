import React, { Component } from 'react';

const api = process.env.REACT_APP_NODE_API;

class Authorize extends Component {
  // The Redirect from Github is sent here and then when the component mounts
  // it sends the url to the backend to create the token
  authorizeGithub(authUrl) {
    let data = { authUrl: authUrl }
    return fetch(`${api}users/auth`, {
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
      this.props.setAuthorized(true);
      window.location.assign('/job-listings');
    })
    .catch(err => console.log(err));
  }
  componentDidMount() {
    this.authorizeGithub(this.props.location.search)
  }

  render() {
    return (
      <h2 className='h2-auth'>Authorizing...</h2>
    );
  }
}

export default Authorize;
