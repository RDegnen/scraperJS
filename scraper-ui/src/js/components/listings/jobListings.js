import React, { Component } from 'react';

class JobListings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jobListings: [],
    };
  }

  getAllJobListings() {
    const authToken = localStorage.getItem('authToken');
    return fetch('listings/all', {
      method: 'GET',
      mode: 'cors',
      headers: {
        authtoken: authToken,
      },
    })
    .then(res => res.json())
    .then((data) => {
      this.setState({ jobListings: data.Items })
    })
    .catch(err => console.log(err));
  }

  componentWillMount() {
    this.getAllJobListings();
  }

  render() {
    return (
      <div>
        {this.state.jobListings.map((item) => {
          return <h3>{item.jobTitle.S}</h3>
        })}
      </div>
    )
  }
};

export default JobListings;
