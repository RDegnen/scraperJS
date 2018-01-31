import grey from 'material-ui/colors/grey';
import green from 'material-ui/colors/green';
import { createMuiTheme } from 'material-ui/styles';

const themeOverride = createMuiTheme({
  palette: {
    primary: {
      main: green[700],
    },
  },
});

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
    borderLeft: `solid ${themeOverride.palette.primary.main}`,
    [theme.breakpoints.down('xs')]: {
      position: 'static',
    },
  },
  mainContainer: {
    height: '100%',
  },
  navGrey: {
    color: grey[50],
  },
  fixed: {
    position: 'fixed',
  },
  static: {
    position: 'static',
  },
});
export { themeOverride };
export default styles;
