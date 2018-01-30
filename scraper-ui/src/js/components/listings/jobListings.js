import React, { Component } from 'react';
import Listing from './listing';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Toolbar from 'material-ui/Toolbar';
import Button from 'material-ui/Button';
import Input, { InputLabel }from 'material-ui/Input';
import Typography from 'material-ui/Typography';
import { FormControl, FormHelperText } from 'material-ui/Form';
import styles from './listingsStyle';

class JobListings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jobListings: [],
      filteredListings: [],
      currentSiteFilter: 'all',
      currentInputFilter: [],
    };
    this.sourceSiteFilter = this.sourceSiteFilter.bind(this);
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
      this.setState({ currentInputFilter: data.Items })
    })
    .catch(err => console.log(err));
  }

  componentWillMount() {
    this.getAllJobListings();
  }
  // FILTERS: inputFilter is applied first onto this.state.jobListings, and then
  // sourceSiteFilter is applied onto that. inputFilter will then check if currentSiteFilter
  // is applied and if so, it will apply that to its full results.
  inputFilter(e) {
    e.preventDefault();
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
    const { classes } = this.props;
    return (
      <div>
        <Toolbar>
          <FormControl>
            <InputLabel htmlFor="jobTitleSearch">Search</InputLabel>
            <Input id='jobTitleSearch' onChange={this.inputFilter}/>
          </FormControl>
          <div className={classes.filterOptions}>
            <Typography type='button' className={classes.filterHeader}>Filters:</Typography>
            <Button onClick={this.sourceSiteFilter.bind(this, 'all')}>All</Button>
            <Button onClick={this.sourceSiteFilter.bind(this, 'craigslist')}>Craigslist</Button>
            <Button id='indeed-filter-btn' onClick={this.sourceSiteFilter.bind(this, 'indeed')}>Indeed</Button>
          </div>
        </Toolbar>
        <Grid container className={classes.listingsContainer} alignItems={'center'} direction={'row'} justify={'center'} spacing={16}>
          {this.state.filteredListings.map((item) => {
            return <Listing listing={item} key={item.listingId.S}/>
          })}
        </Grid>
      </div>
    )
  }
};

JobListings.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(JobListings);
