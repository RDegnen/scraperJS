import React from 'react';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import styles from './listingsStyle';

function Listing(props) {
  const { classes } = props;
  return (
    <Grid item xs={12} sm={6}>
      <Paper elevation={4} className={classes.paper}>
        <h4>{props.listing.jobTitle.S}</h4>
        <a href={props.listing.link.S}>{props.listing.link.S}</a>
        <h4>{props.listing.sourceSite.S}</h4>
      </Paper>
    </Grid>
  )
}

Listing.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Listing);
