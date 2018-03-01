import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import styles from './errorModalStyle';
import Typography from 'material-ui/Typography';
import Modal from 'material-ui/Modal';
import Clear from 'material-ui-icons/Clear';

function ErrorModal(props) {
  const { error, open, handleClose, classes } = props;
  return (
    <div>
      <Modal open={open}
             onClose={handleClose}
             hideBackdrop={true}
             className={classes.errorModal}>
        <div className={classes.errorModalContent}>
          <Clear onClick={handleClose} className={classes.clearBtn}/>
          <Typography type='display2' align='center' color='secondary' className={classes.status}>{error.status}</Typography>
          <Typography type='body1' align='center'>{error.message}</Typography>
        </div>
      </Modal>
    </div>
  )
}

ErrorModal.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ErrorModal);
