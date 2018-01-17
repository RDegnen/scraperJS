import React, { Component } from 'react';
import Listing from './listing';

class JobListings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jobListings: [],
      filteredListings: [],
    };
    this.filterListings = this.filterListings.bind(this);
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
      this.setState({ filteredListings: data.Items })
    })
    .catch(err => console.log(err));
  }

  componentWillMount() {
    this.getAllJobListings();
  }

  filterListings(e) {
    e.preventDefault();
    if (e.target.value === 'all') {
      return this.setState({ filteredListings: this.state.jobListings});
    };
    const result = this.state.jobListings.filter(item => item.sourceSite.S === e.target.value);
    this.setState({ filteredListings: result });
  }

  render() {
    return (
      <div>
        <div>
          <ul>
            <li><button value='all' onClick={this.filterListings}>All</button></li>
            <li><button value='craigslist' onClick={this.filterListings}>Craigslist</button></li>
            <li><button value='indeed' onClick={this.filterListings}>Indeed</button></li>
          </ul>
        </div>
        <div>
          {this.state.filteredListings.map((item) => {
            return <Listing listing={item} key={item.listingId.S}/>
          })}
        </div>
      </div>
    )
  }
};

export default JobListings;
