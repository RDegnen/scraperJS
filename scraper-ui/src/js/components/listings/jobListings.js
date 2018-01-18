import React, { Component } from 'react';
import Listing from './listing';

class JobListings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jobListings: [],
      filteredListings: [],
      currentSiteFilter: 'all',
    };
    this.filterListings = this.filterListings.bind(this);
    this.inputFilter = this.inputFilter.bind(this);
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

  inputFilter(e) {
    e.preventDefault();
    let matches = this.state.jobListings.filter((item) => {
      let myRegEx = new RegExp(`^.*${e.target.value}.*$`, 'gi');
      if (this.state.currentSiteFilter === 'all') {
        return myRegEx.exec(item.jobTitle.S);
      } else if (myRegEx.exec(item.jobTitle.S) && item.sourceSite.S === this.state.currentSiteFilter) {
        return item;
      }
    });
    console.log(matches)
    this.setState({ filteredListings: matches });
  }

  filterListings(e) {
    e.preventDefault();
    this.setState({ currentSiteFilter: e.target.value });
    if (e.target.value === 'all') {
      return this.setState({ filteredListings: this.state.jobListings});
    };
    const result = this.state.filteredListings.filter(item => item.sourceSite.S === e.target.value);
    this.setState({ filteredListings: result });
  }

  render() {
    return (
      <div>
        <div>
          <input type='text' onChange={this.inputFilter}/>
        </div>
        <div>
          <ul>
            <li><button value='all' onClick={this.filterListings}>All</button></li>
            <li><button value='craigslist' onClick={this.filterListings}>Craigslist</button></li>
            <li><button id='indeed-filter-btn' value='indeed' onClick={this.filterListings}>Indeed</button></li>
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
