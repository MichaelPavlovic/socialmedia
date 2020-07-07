import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import MyButton from '../util/button';

//MUI
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';

//redux
import { connect } from 'react-redux';
import { createPost, clearErrors } from '../redux/actions/dataActions';

//styles
const styles = (theme) => ({
  ...theme.spreadThis,
  progressSpinner: {
    position: 'absolute'
  },
  content: {
    marginBottom: 10
  },
  actions: {
    marginLeft: 250,
    paddingBottom: 20
  },
  addButton: {
    color: 'white'
  },
  close: {
    position: 'absolute',
    left: '91%'
  },
  textField: {
    marginTop: 10
  }
});

//render create post dialog
class CreatePost extends Component {
  state = {
    open: false,
    body: '',
    errors: {}
  }
  componentWillReceiveProps(nextProps){
    //set errors in the state
    if(nextProps.UI.errors){
      this.setState({ errors: nextProps.UI.errors });
    }
    //clear errors from the state so they don't persist
    if(!nextProps.UI.errors && !nextProps.UI.loading){
      this.setState({ body: '', open: false, errors: {} });
    }
  }
  //when dialog is opened
  handleOpen = () => {
    this.setState({ open: true });
  }
  //when dialog is closed
  handleClose = () => {
    //clear errors
    this.props.clearErrors();
    this.setState({ open: false, errors: {} });
  }
  //when form data changes
  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  }
  //when form is submitted
  handleSubmit = (event) => {
    //stop default submission
    event.preventDefault();
    //set form data to redux create post action
    this.props.createPost({ body: this.state.body });
  }
  render() {
    const { errors } = this.state;
    const { classes, UI: { loading } } = this.props;
    return (
      <Fragment>
        <MyButton onClick={this.handleOpen} tip="Post">
          <AddIcon className={classes.addButton} />
        </MyButton>
        <Dialog open={this.state.open} onClose={this.handleClose} fullWidth maxWidth="sm">
          <MyButton onClick={this.handleClose} tip="Close" tipClassName={classes.close}>
            <CloseIcon color="primary" />
          </MyButton>
          <form onSubmit={this.handleSubmit}>
            <DialogContent className={classes.content}>
              <TextField
                name="body"
                type="text"
                label="Send a post..."
                error={errors.body ? true : false}
                helperText={errors.body}
                className={classes.textField}
                onChange={this.handleChange}
                fullWidth
              />
            </DialogContent>
            <div className={classes.actions}>
              <Button
                type="submit"
                color="primary"
                className={classes.submitButton}
                disabled={loading}
                variant="contained"
              >
                Post
                {loading && (
                  <CircularProgress size={30} className={classes.progressSpinner} />
                )}
              </Button>
            </div>
          </form>
        </Dialog>
      </Fragment>
    );
  }
}

//set required data
CreatePost.propTypes = {
  createPost: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  UI: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  UI: state.UI
});

export default connect(mapStateToProps, { createPost, clearErrors })(withStyles(styles)(CreatePost));