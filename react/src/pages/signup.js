import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';

//MUI components
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
import { signUpUser } from '../redux/actions/userActions';

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

class SignUp extends Component {
  constructor() {
		super();
		this.state = {
			email: '',
      password: '',
      confirmPassword: '',
      handle: '',
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
    //stop default submitting
    event.preventDefault();
    //get new user data from the state
		const newUserData = {
			email: this.state.email,
      password: this.state.password,
      confirmPassword: this.state.confirmPassword,
      handle: this.state.handle
    };
    //pass dta to the signup redux action
    this.props.signUpUser(newUserData, this.props.history);
  }
  //this function will handle the form field on change event
  handleChange = (event) => {
    //set form data in the state in the state
    this.setState({
      [event.target.name]: event.target.value
    });
  };
  render() {
    const { classes, UI: { loading } } = this.props;
    const { errors } = this.state;
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.flex}>
          <Typography component="h1" variant="h3">Sign Up</Typography>
          <form className={classes.form} noValidate onSubmit={this.handleSubmit}>
            <TextField
              id="handle"
              name="handle"
              type="text"
              label="Handle"
              variant="outlined"
              margin="normal"
              fullWidth
              required
              autoComplete="current-password"
              helperText={errors.handle}
              error={errors.handle ? true : false}
              value={this.state.handle}
              onChange={this.handleChange}
              InputProps={{ className: classes.textField }}
            />
            <TextField
              id="email"
              name="email"
              label="Email Address"
              variant="outlined"
              margin="normal"
              fullWidth
              required
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
              fullWidth
              required
							autoComplete="current-password"
              helperText={errors.password}
              error={errors.password ? true : false}
              value={this.state.password}
              onChange={this.handleChange}
              InputProps={{ className: classes.textField }}
						/>
            <TextField
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              label="Confirm Password"
              variant="outlined"
              margin="normal"
              fullWidth
              required
              autoComplete="current-password"
              helperText={errors.confirmPassword}
              error={errors.confirmPassword ? true : false}
              value={this.state.confirmPassword}
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
							Sign Up
							{loading && <CircularProgress size={30} className={classes.loadingIcon} />}
						</Button>
            <Grid container>
							<Grid item className={classes.center}>
								<Link href="login" variant="body2">
									{"Already have an account? Login"}
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
SignUp.propTypes = {
  classes: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired,
  signUpUser: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  user: state.user,
  UI: state.UI
})

export default connect(mapStateToProps, { signUpUser })(withStyles(styles)(SignUp));