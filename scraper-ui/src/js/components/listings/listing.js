import React from 'react';
import Grid from 'material-ui/Grid';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Delete from 'material-ui-icons/Delete';
import styles from './listingsStyle';

function Listing(props) {
  const { classes, listing } = props;
  return (
    <Grid item xs={12} sm={12} md={6}>
      <Card>
        <CardContent className={classes.cardContent}>
          <Typography align='left' type='title'>{listing.jobTitle.S}</Typography>
          <Typography align='left' type='subheading' className={classes.listingCardInfo}>Location: {listing.location.S}</Typography>
          <Typography align='left' type='subheading' className={classes.listingCardInfo}>Source: {listing.sourceSite.S}</Typography>
          <CardActions>
            <Button raised href={listing.link.S} size='small' color='primary'>
              Link
            </Button>
            {props.isUserListing === true &&
              <Button size='small'
                      onClick={props.deleteItem}
                      value={`${listing.listingId.S},${listing.listingDate.S},${props.index}`}>
                <Delete className={classes.rightIcon} />
              </Button>
            }
          </CardActions>
        </CardContent>
      </Card>
    </Grid>
  )
}

Listing.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Listing);
