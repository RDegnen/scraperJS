const styles = theme => ({
  errorModal: {
    position: 'absolute',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 1,
    height: '150px',
    top: '25%',
    left: '30%',
    border: `1px solid ${theme.palette.secondary.main}`,
  },
  errorModalContent: {
    width: '100%',
  },
  status: {
    paddingTop: '24px',
  },
  clearBtn: {
    padding: 0,
    float: 'right',
    '&:hover': {
      cursor: 'pointer',
    },
  },
});

export default styles;
