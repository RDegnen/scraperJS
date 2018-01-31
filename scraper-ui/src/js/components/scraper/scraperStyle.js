import grey from 'material-ui/colors/grey';

const styles = theme => ({
  scraperForm: {
    color: grey[50],
  },
  disabled: {
    color: theme.palette.text.disabled,
  },
  inkbarOverride: {
    '&:after': {
      backgroundColor: grey[50],
    },
    '&:before': {
      backgroundColor: grey[50],
    }
  },
  underlineOverride: {
    '&:hover:not($disabled):before': {
      backgroundColor: grey[50],
    },
    transition: theme.transitions.create('background-color', {
      duration: theme.transitions.duration.shorter,
      easing: theme.transitions.easing.ease,
    }),
  },
  scrapeDiv: {
    padding: '10px 0 5px 0',
  },
});

export default styles;
