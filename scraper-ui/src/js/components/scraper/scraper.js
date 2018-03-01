import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import styles from './scraperStyle';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';

const api = process.env.REACT_APP_NODE_API;

class Scraper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: '',
      keywords: '',
      pages: '',
    };
    this.scrape = this.scrape.bind(this)
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
    return fetch(`${api}listings/create/all`, {
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
      console.log(resp);
      window.location.assign('/user-listings');
    })
    .catch(err => console.log(err));
  }

  render() {
    const { classes } = this.props;
    const disabled = this.state.location && this.state.keywords ? false : true;
    let buttonClass;

    disabled ? buttonClass = classes.disabled : buttonClass = classes.scraperFormBtn;
    return (
      <div>
        <div>
          <div>
            <form id='scraper-form' onSubmit={this.scrape}>
              <TextField labelClassName={classes.scraperFormInput}
                         InputProps={{ classes: { root: classes.scraperFormInput,
                                                  inkbar: classes.inkbarOverride,
                                                  underline: classes.underlineOverride } }}
                         label='City' value={this.state.location}
                         onChange={this.setLocation}/>
              <TextField labelClassName={classes.scraperFormInput}
                         InputProps={{ classes: { root: classes.scraperFormInput,
                                                  inkbar: classes.inkbarOverride,
                                                  underline: classes.underlineOverride } }}
                         label='Keywords' value={this.state.keywords}
                         onChange={this.setKeywords}/>
              <TextField labelClassName={classes.scraperFormInput}
                         InputProps={{ classes: { root: classes.scraperFormInput,
                                                  inkbar: classes.inkbarOverride,
                                                  underline: classes.underlineOverride } }}
                         label='# of Pages' value={this.state.pages}
                         onChange={this.setPages}/>
              <div className={classes.scrapeDiv}>
                <Button raised disabled={disabled} className={buttonClass} type="submit" value="Submit">Find Jobs!</Button>
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
