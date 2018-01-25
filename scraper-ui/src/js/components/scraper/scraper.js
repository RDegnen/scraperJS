import React, { Component } from 'react';

class Scraper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: 'boston',
      keywords: '',
      pages: 1,
    };
    this.scrape = this.scrape.bind(this)

    this.createListings = this.createListings.bind(this)
    this.setLocation = this.setLocation.bind(this)

    this.setKeywords = this.setKeywords.bind(this)
    this.setPages = this.setPages.bind(this)
  }

  setLocation(e) {
    e.preventDefault();
    this.setState({ location: e.target.value })
  }

  setKeywords(e) {
    e.preventDefault();
    this.setState({ keywords: e.target.value })
  }

  setPages(e) {
    e.preventDefault();
    this.setState({ pages: e.target.value })
  }

  scrape(e) {
    e.preventDefault()
    const body = {
      source: 'all',
      location: this.state.location,
      terms: [this.state.keywords],
      pages: this.state.pages,
    }
    const authToken = localStorage.getItem('authToken');
    return fetch('http://localhost:8080/gather', {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(body),
      headers: {
        authtoken: authToken,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
    .then(res => res.json())
    .then((resp) => {
      this.createListings('all');
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
            <button id='scrape-crg-btn' value='craigslist' onClick={this.setBodyandScrape}>Scrape Craigslist</button>
          </div>
          <div>
            <form onSubmit={this.scrape}>
              <label>
                Keywords:
                <input type='text' value={this.state.keywords} onChange={this.setKeywords}/>
              </label>
              <label>
                Amount of pages:
                <input type='text' value={this.state.pages} onChange={this.setPages}/>
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
