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
      location: '',
      keywords: '',
      pages: '',
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
    const { classes } = this.props;
    const disabled = this.state.location && this.state.keywords ? false : true;
    let buttonClass;

    if (disabled) buttonClass = classes.disabled;
    else buttonClass = classes.scraperForm;

    return (
      <div>
        <div>
          <div>
            <form id='scraper-form' onSubmit={this.scrape}>
              <TextField labelClassName={classes.scraperForm}
                         InputProps={{ classes: { root: classes.scraperForm,
                                                  inkbar: classes.inkbarOverride,
                                                  underline: classes.underlineOverride } }}
                         label='Location' value={this.state.location}
                         onChange={this.setLocation}/>
              <TextField labelClassName={classes.scraperForm}
                         InputProps={{ classes: { root: classes.scraperForm,
                                                  inkbar: classes.inkbarOverride,
                                                  underline: classes.underlineOverride } }}
                         label='Keywords' value={this.state.keywords}
                         onChange={this.setKeywords}/>
              <TextField labelClassName={classes.scraperForm}
                         InputProps={{ classes: { root: classes.scraperForm,
                                                  inkbar: classes.inkbarOverride,
                                                  underline: classes.underlineOverride } }}
                         label='Pages' value={this.state.pages}
                         onChange={this.setPages}/>
              <div className={classes.scrapeDiv}>
                <Button raised disabled={disabled} color='secondary' className={buttonClass} type="submit" value="Submit">Scrape!</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }
};

Scraper.propTypes = {
  classes: PropTypes.object.isRequired,
};
// export TestScraper so I can test the component without it being wrapped by
// withStyles
export { Scraper as TestScraper }
export default withStyles(styles)(Scraper);
