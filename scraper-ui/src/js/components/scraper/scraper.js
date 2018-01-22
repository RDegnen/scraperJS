import React, { Component } from 'react';

class Scraper extends Component {
  constructor(props) {
    super(props);
    this.scrapeCraigslist = this.scrapeCraigslist.bind(this)
    this.createListings = this.createListings.bind(this)
  }

  scrapeCraigslist () {
    const authToken = localStorage.getItem('authToken');
    return fetch('http://localhost:8080/gather', {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({
        source: 'craigslist',
      }),
      headers: {
        authtoken: authToken,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
    .then(res => res.json())
    .then((resp) => {
      this.createListings();
      console.log(resp);
    })
    .catch(err => console.log(err));
  }

  createListings() {
    const authToken = localStorage.getItem('authToken');
    return fetch('listings/create/craigslist', {
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
        <button id='scrape-crg-btn' onClick={this.scrapeCraigslist}>Scrape Craigslist</button>
      </div>
    )
  }
};

export default Scraper;
