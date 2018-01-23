import React, { Component } from 'react';

class Scraper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: 'boston',
      indeedKeywords: '',
      indeedPages: 0,
    };
    this.scrapeCraigslist = this.scrapeCraigslist.bind(this)
    this.scrapeIndeed = this.scrapeIndeed.bind(this)

    this.createListings = this.createListings.bind(this)
    this.setLocation = this.setLocation.bind(this)

    this.setIndeedKeywords = this.setIndeedKeywords.bind(this)
    this.setIndeedPages = this.setIndeedPages.bind(this)
  }

  setLocation(e) {
    e.preventDefault();
    this.setState({ location: e.target.value })
  }

  setIndeedKeywords(e) {
    e.preventDefault();
    this.setState({ indeedKeywords: e.target.value })
  }

  setIndeedPages(e) {
    e.preventDefault();
    this.setState({ indeedPages: e.target.value })
  }
  // FIXME: Maybe put scraping into seperate components?
  scrapeCraigslist(e) {
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

  scrapeIndeed(e) {
    e.preventDefault();
    const authToken = localStorage.getItem('authToken');
    const terms = this.state.indeedKeywords.split(' ');
    return fetch('http://localhost:8080/gather', {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({
        source: 'indeed',
        location: this.state.location,
        terms: terms,
        pages: this.state.indeedPages,
      }),
      headers: {
        authtoken: authToken,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
    .then(res => res.json())
    .then((resp) => {
      this.createListings('indeed');
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
        <div>
          <div>
            <button id='scrape-crg-btn' value='craigslist' onClick={this.scrapeCraigslist}>Scrape Craigslist</button>
          </div>
          <div>
            <form onSubmit={this.scrapeIndeed}>
              <label>
                Keywords:
                <input type='text' value={this.state.indeedKeywords} onChange={this.setIndeedKeywords}/>
              </label>
              <label>
                Amount of pages:
                <input type='text' value={this.state.indeedPages} onChange={this.setIndeedPages}/>
              </label>
              <input type="submit" value="Submit" />
            </form>
          </div>
        </div>
      </div>
    )
  }
};

export default Scraper;
