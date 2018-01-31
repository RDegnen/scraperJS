import grey from 'material-ui/colors/grey';

const styles = theme => ({
  scraperFormInput: {
    color: grey[50],
  },
  scraperFormBtn: {
    color: grey[50],
    backgroundColor: theme.palette.primary.light,
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
      backgroundColor: theme.palette.primary.light,
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
