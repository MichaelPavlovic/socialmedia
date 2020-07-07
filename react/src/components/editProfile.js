import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import MyButton from '../util/button';

//MUI components
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';

//redux
import { connect } from 'react-redux';
import { editUserDetails } from '../redux/actions/userActions';

//styles
const styles = (theme) => ({
  ...theme.spreadThis,
  submitButton: {
    position: 'absolute',
    top: 12,
    right: 25
  },
  textField: {
    marginBottom: 20
  },
  close: {
    position: 'absolute',
    left: '91%'
  },
  title: {
    marginLeft: 25,
    marginTop: 15,
    marginBottom: 15
  }
});

class EditDetails extends Component {
  state = {
    bio: '',
    location: '',
    open: false
  };
  mapUserDetailsToState = (credentials) => {
    //set credentials in the state
    this.setState({
      bio: credentials.bio ? credentials.bio : '',
      location: credentials.location ? credentials.location : ''
    });
  }
  //when dialog is opened
  handleOpen = () => {
    this.setState({ open: true });
    this.mapUserDetailsToState(this.props.credentials);
  }
  //when dialog is closed
  handleClose = () => {
    this.setState({ open: false });
  }
  componentDidMount() {
    //set credentials to state if component mounts
    const { credentials } = this.props;
    this.mapUserDetailsToState(credentials);
  }
  //handle form data changes
  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }
  //handle form submit
  handleSubmit = () => {
    //set  user details in the state
    const userDetails = {
      bio: this.state.bio,
      location: this.state.location
    }
    //edit details redux action
    this.props.editUserDetails(userDetails);
    //close dialog
    this.handleClose();
  }
  render() {
    const { classes } = this.props;
    return (
      <Fragment>
        <MyButton tip="Edit profile" onClick={this.handleOpen} btnClassName={classes.button}>
          <EditIcon color="primary" />
        </MyButton>
        <Dialog open={this.state.open} onClose={this.handleClose} fullWidth maxWidth="sm">
          <MyButton onClick={this.handleClose} tip="Close" tipClassName={classes.close}>
            <CloseIcon color="primary" />
          </MyButton>
          <Typography variant="h6" className={classes.title}>Edit profile details</Typography>
          <DialogContent>
            <form>
              <TextField
                name="bio"
                tpye="text"
                label="Enter a bio..."
                className={classes.textField}
                value={this.state.bio}
                onChange={this.handleChange}
                fullWidth
              />
              <TextField
                name="location"
                tpye="text"
                label="Enter a location..."
                className={classes.textField}
                value={this.state.location}
                onChange={this.handleChange}
                fullWidth
              />
              <DialogActions>
                <Button onClick={this.handleSubmit} color="primary" variant="contained" >Save</Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>
      </Fragment>
    );
  }
}

//set required data
EditDetails.propTypes = {
  editUserDetails: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  credentials: state.user.credentials
});

export default connect(mapStateToProps,{ editUserDetails })(withStyles(styles)(EditDetails));