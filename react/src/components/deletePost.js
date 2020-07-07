import React, { Component, Fragment } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import MyButton from '../util/button';

//MUI components
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Typography from '@material-ui/core/Typography';

//redux
import { connect } from 'react-redux';
import { deletePost } from '../redux/actions/dataActions';

//styles
const styles = {
  deleteButton: {
    position: 'absolute',
    left: '90%',
    top: '5%'
  },
  content: {
    marginBottom: 25,
    marginLeft: 15
  },
  actions: {
    margin: '0 auto',
    paddingBottom: 20
  },
  delete: {
    marginRight: 15
  }
}

//render delete post dialog
class DeletePost extends Component {
  state = {
    open: false
  }
  //when dialog is opened
  handleOpen = () => {
    this.setState({ open: true });
  }
  //when dialog is clsoed
  handleClose = () => {
    this.setState({ open: false });
  }
  //when delete button is clicked
  deletePost = () => {
    //redux action
    this.props.deletePost(this.props.postId);
    this.setState({ open: false });
  }
  render() {
    const { classes } = this.props;
    return (
      <Fragment>
        <MyButton
          tip="Delete"
          onClick={this.handleOpen}
          btnClassName={classes.deleteButton}
        >
          <DeleteOutline color="secondary" />
        </MyButton>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth
          maxWidth="sm"
        >
          <DialogContent className={classes.content}>
            <Typography variant="h6">Are you sure you want to delete this post? It can't be undone.</Typography>
          </DialogContent>
          <div className={classes.actions}>
            <Button onClick={this.deletePost} color="secondary" variant="contained" className={classes.delete}>Delete</Button>
            <Button onClick={this.handleClose} variant="contained" className={classes.close}>Cancel</Button>
          </div>
        </Dialog>
      </Fragment>
    );
  }
}

//set set required data
DeletePost.propTypes = {
  deletePost: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  postId: PropTypes.string.isRequired
};

export default connect(null,{ deletePost })(withStyles(styles)(DeletePost));