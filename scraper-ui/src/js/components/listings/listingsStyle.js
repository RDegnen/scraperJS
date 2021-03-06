const styles = theme => ({
  cardContent: {
    color: theme.palette.text.secondary,
  },
  listingsContainer: {
    paddingLeft: 24,
    [theme.breakpoints.down('xs')]: {
      padding: '0 24px',
    },
  },
  filterHeader: {
    display: 'inline',
    color: theme.palette.text.primary,
  },
  filterOptions: {
    padding: '0 16px'
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
  deleteAllDiv: {
    right: 0,
    position: 'absolute',
  },
  listingCardInfo: {
    padding: '5px 0',
  },
});

export default styles;
