import React, { Component } from 'react';
import Listing from './listing';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Toolbar from 'material-ui/Toolbar';
import Button from 'material-ui/Button';
import Input, { InputLabel }from 'material-ui/Input';
import { FormControl } from 'material-ui/Form';
import styles from './listingsStyle';
import { checkResponseStatus } from '../../utils/helpers';

const api = process.env.REACT_APP_NODE_API;

class JobListings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jobListings: [],
      filteredListings: [],
      currentSiteFilter: 'all',
      currentInputFilter: [],
      currentInput: '',
    };
    this.deleteJobListing = this.deleteJobListing.bind(this);
    this.deleteAllListings = this.deleteAllListings.bind(this);
    this.sourceSiteFilter = this.sourceSiteFilter.bind(this);
    this.inputFilter = this.inputFilter.bind(this);
  }

  getJobListings(isUser) {
    const authToken = localStorage.getItem('authToken');
    let url;
    isUser ? url = `${api}listings/get/user` : url = `${api}listings/all`;
    return fetch(url, {
      method: 'GET',
      mode: 'cors',
      headers: {
        authtoken: authToken,
      },
    })
    .then(res => checkResponseStatus(res, true))
    .then((data) => {
      this.setState({ jobListings: data.Items })
      this.setState({ filteredListings: data.Items })
      this.setState({ currentInputFilter: data.Items })
    })
    .catch((err) => {
      console.log(err);
      this.props.handleFetchError(err.status, err.statusText);
    });
  }

  deleteJobListing(e) {
    const params = e.currentTarget.value.split(',');
    const body = {
      listingId: params[0],
      listingDate: params[1],
    };
    const authToken = localStorage.getItem('authToken');
    return fetch(`${api}listings/destroy`, {
      method: 'delete',
      mode: 'cors',
      body: JSON.stringify(body),
      headers: {
        authtoken: authToken,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
    .then((res) => {
      checkResponseStatus(res);
      // get the index of listing in the jobListings array when deleting from filteredListings
      const index = this.state.jobListings.map(i => i.listingId.S).indexOf(params[0])
      // Check if a site filter or input filter is active and remove from those
      if (this.state.currentSiteFilter !== 'all') this.state.filteredListings.splice(params[2], 1);
      if (this.state.currentInput.length > 0) this.state.currentInputFilter.splice(params[2], 1);
      this.state.jobListings.splice(index, 1)

      this.setState({ jobListings: this.state.jobListings  });
    })
    .catch((err) => {
      console.log(err);
      this.props.handleFetchError(err.status, err.statusText);
    });
  }

  deleteAllListings(e) {
    const authToken = localStorage.getItem('authToken');
    return fetch(`${api}listings/destroy/bulk`, {
      method: 'delete',
      mode: 'cors',
      headers: {
        authtoken: authToken,
      },
    })
    .then((res) => {
      checkResponseStatus(res);
      this.setState({ jobListings: [] });
      this.setState({ filteredListings: [] });
    })
    .catch((err) => {
      console.log(err);
      this.props.handleFetchError(err.status, err.statusText);
    });
  }
  // Determine to get the job listings scraped by the user or all the listings from all users.
  componentWillMount() {
    this.props.userListings ? this.getJobListings(true) : this.getJobListings(false);
  }

  componentWillReceiveProps(nextProps) {
    nextProps.userListings ? this.getJobListings(true) : this.getJobListings(false);
  }
  // FILTERS: inputFilter is applied first onto this.state.jobListings, and then
  // sourceSiteFilter is applied onto that. inputFilter will then check if currentSiteFilter
  // is applied and if so, it will apply that to its full results.
  inputFilter(e) {
    e.preventDefault();
    // Setting current input in state to track its length to delete cards properly
    this.setState({ currentInput: e.target.value })

    let allMatches = this.state.jobListings.filter((item) => {
      let myRegEx = new RegExp(`^.*${e.target.value}.*$`, 'gi');
        return myRegEx.exec(item.jobTitle.S);
    });

    let matches;
    if (this.state.currentSiteFilter !== 'all') {
      matches = allMatches.filter((item) => {
        let myRegEx = new RegExp(`^.*${e.target.value}.*$`, 'gi');
        if (myRegEx.exec(item.jobTitle.S) && item.sourceSite.S === this.state.currentSiteFilter) {
          return item;
        }
      });
    }

    this.setState({ currentInputFilter: allMatches });
    this.setState({ filteredListings: matches || allMatches });
  }

  sourceSiteFilter(val) {
    this.setState({ currentSiteFilter: val });
    if (val === 'all') {
      return this.setState({ filteredListings: this.state.currentInputFilter});
    };
    const result = this.state.currentInputFilter.filter(item => item.sourceSite.S === val);
    this.setState({ filteredListings: result });
  }

  render() {
    const { classes, userListings } = this.props;
    return (
      <div>
        <Toolbar>
          <FormControl>
            <InputLabel htmlFor="jobTitleSearch">Search Title</InputLabel>
            <Input id='jobTitleSearch' onChange={this.inputFilter}/>
          </FormControl>
          {/* Not sure I want site filters, they don't really make sense
          <div className={classes.filterOptions}>
            <Typography type='button' className={classes.filterHeader}>Filters:</Typography>
            <Button onClick={this.sourceSiteFilter.bind(this, 'all')}>All</Button>
            <Button onClick={this.sourceSiteFilter.bind(this, 'craigslist')}>Craigslist</Button>
            <Button id='indeed-filter-btn' onClick={this.sourceSiteFilter.bind(this, 'indeed')}>Indeed</Button>
          </div> */}
          {userListings === true &&
            <div className={classes.deleteAllDiv}>
              <Button raised color='secondary' onClick={this.deleteAllListings}>Delete All Listings</Button>
            </div>
          }
        </Toolbar>
        <Grid container className={classes.listingsContainer} alignItems={'center'} direction={'row'} justify={'center'} spacing={16}>
          {this.state.filteredListings.map((item, i) => {
            return <Listing listing={item} index={i} key={item.listingId.S} deleteItem={this.deleteJobListing} isUserListing={this.props.userListings}/>
          })}
        </Grid>
      </div>
    )
  }
};

JobListings.propTypes = {
  classes: PropTypes.object.isRequired,
};
export { JobListings as TestJobListings }
export default withStyles(styles)(JobListings);
