import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';

//Material UI components
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import CircularProgress from '@material-ui/core/CircularProgress';

//Redux
import { connect } from 'react-redux';
import { loginUser } from '../redux/actions/userActions';

//styles
const styles = (theme) => ({
  ...theme.spreadThis,
  loadingIcon: {
    margin: '0 auto',
    position: 'absolute'
  },
  center: {
    margin: '0 auto',
    paddingTop: 20
  },
  textField: {
    color: 'white'
  }
});

class Login extends Component {
  constructor() {
		super();
		this.state = {
			email: '',
			password: '',
			errors: {}
		};
  }
  componentWillReceiveProps(nextProps) {
    //set errors in the state
    if (nextProps.UI.errors) {
      this.setState({ errors: nextProps.UI.errors });
    }
  }
  //this function will handle the form data when the users clicks the submit button
  handleSubmit = (event) => {
    //stop page from submitting
    event.preventDefault();
    //get the data from the state
		const userData = {
			email: this.state.email,
			password: this.state.password
    };
    //pass data to redux action
    this.props.loginUser(userData, this.props.history);
  }
  //this function will handle the form field on change event
  handleChange = (event) => {
    //set the input of the text field to the corresponding input in the state
    this.setState({
      [event.target.name]: event.target.value
    });
  };
  render() {
    const { classes, UI: { loading }} = this.props;
    const { errors } = this.state;
    return (
      <Container component="main" maxWidth="xs" className={classes.form}>
        <CssBaseline />
        <div className={classes.flex}>
          <Typography component="h1" variant="h3">Login</Typography>
          <form noValidate onSubmit={this.handleSubmit}>
            <TextField
              id="email"
              name="email"
              label="Email Address"
			        variant="outlined"
			        margin="normal"
			        required
			        fullWidth
			        autoComplete="email"
              helperText={errors.email}
              error={errors.email ? true : false}
              value={this.state.email}
              onChange={this.handleChange}
              InputProps={{ className: classes.textField }}
			      />
			      <TextField
              id="password"
              name="password"
              type="password"
			        label="Password"
			        variant="outlined"
			        margin="normal"
			        required
			        fullWidth
			        autoComplete="current-password"
              helperText={errors.password}
              error={errors.password ? true : false}
              value={this.state.password}
              onChange={this.handleChange}
              InputProps={{ className: classes.textField }}
			      />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              disabled={loading}
            >
              Login
              {loading && <CircularProgress size={30} className={classes.loadingIcon} />}
            </Button>
            <Grid container>
              <Grid item className={classes.center}>
                <Link href="signup" variant="body2">
									{"Don't have an account? Sign Up"}
								</Link>
							</Grid>
						</Grid>
            {errors.general && (
							<Typography variant="body2" className={classes.customError}>
								{errors.general}
							</Typography>
						)}
          </form>
        </div>
      </Container>
    );
  }
}

//set required data
Login.proopTypes = {
  classes: PropTypes.object.isRequired,
  loginUser: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  user: state.user,
  UI: state.UI
});

const mapActionsToProps = {
  loginUser
}

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(Login));