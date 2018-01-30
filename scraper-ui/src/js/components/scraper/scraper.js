import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import styles from './scraperStyle';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';

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
    console.log(e.target.value)
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
        <div>
          <div>
            <form id='scraper-form' onSubmit={this.scrape}>
              <TextField label='Location' value={this.state.location} onChange={this.setLocation}/>
              <TextField label='Keywords' value={this.state.keywords} onChange={this.setKeywords}/>
              <TextField label='Pages' value={this.state.pages} onChange={this.setPages}/>
              <Button raised color='primary' type="submit" value="Submit">Submit</Button>
            </form>
          </div>
        </div>
      </div>
    )
  }
};

export default Scraper;
