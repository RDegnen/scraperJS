import grey from 'material-ui/colors/grey';

const styles = theme => ({
  root: {
    flexGrow: 1,
    marginTop: 30,
  },
  paper: {
    padding: 16,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    height: '100%',
  },
  nav: {
    padding: 16,
    textAlign: 'center',
    color: grey[50],
    height: '100%',
    background: grey[800],
  },
});

export default styles;
