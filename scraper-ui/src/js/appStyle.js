import grey from 'material-ui/colors/grey';

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: '100%',
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
    background: grey[800],
    height: '100%',
    position: 'fixed',
  },
  mainContainer: {
    height: '100%',
  },
});

export default styles;
