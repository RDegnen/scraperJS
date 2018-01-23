import React, { Component } from 'react';

class Scraper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: 'boston'
    };
    this.scrape = this.scrape.bind(this)
    this.createListings = this.createListings.bind(this)
    this.setLocation = this.setLocation.bind(this)
  }

  setLocation(e) {
    e.preventDefault();
    this.setState({ location: e.target.value })
  }

  scrape(e) {
    e.preventDefault();
    const source = e.target.value;
    const authToken = localStorage.getItem('authToken');
    return fetch('http://localhost:8080/gather', {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({
        source: source,
        location: this.state.location,
      }),
      headers: {
        authtoken: authToken,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
    .then(res => res.json())
    .then((resp) => {
      this.createListings(source);
      console.log(resp);
    })
    .catch(err => console.log(err));
  }

  createListings(source) {
    const authToken = localStorage.getItem('authToken');
    return fetch(`listings/create/${source}`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        authtoken: authToken,
      },
    })
    .then(res => res.json())
    .then((resp) => {
      console.log(resp);
    })
    .catch(err => console.log(err));
  }

  render() {
    return (
      <div>
        <input type='text' onChange={this.setLocation} placeholder='boston'/>
        <button id='scrape-crg-btn' value='craigslist' onClick={this.scrape}>Scrape Craigslist</button>
      </div>
    )
  }
};

export default Scraper;
