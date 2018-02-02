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
  const { classes } = props;
  return (
    <Grid item xs={12} sm={6}>
      <Card>
        <CardContent className={classes.cardContent}>
          <Typography align='left' type='title'>{props.listing.jobTitle.S}</Typography>
          <Typography align='left' type='subheading'>{props.listing.sourceSite.S}</Typography>
          <CardActions>
            <Button raised href={props.listing.link.S} size='small' color='primary'>
              Link
            </Button>
            {props.isUserListing === true &&
              <Button size='small'
                      raised
                      color='secondary'
                      onClick={props.deleteItem}
                      value={`${props.listing.listingId.S},${props.listing.listingDate.S},${props.index}`}>
                 Delete
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
