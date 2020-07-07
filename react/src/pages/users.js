import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import axios from 'axios';

//components
import Post from '../components/post';
import NavBar from '../components/navbar';
import Profile from '../components/profile';
import StaticProfile from '../components/staticProfile';

//MUI components
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';

//redux
import { connect } from 'react-redux';
import { getUserData } from '../redux/actions/dataActions';

//styles
const styles = (theme) => ({
  ...theme.spreadThis,
  container: {
    textAlign: 'center'
  },
  loadingIcon: {
    marginTop: 70
  },
  grid: {
    width: 1200,
    margin: '0 auto'
  }
});

class Users extends Component {
  state = { 
    profile: null 
  }
  componentDidMount(){
    //when components mounts
    const handle = this.props.match.params.handle;
    
    //pass user data to redux action
    this.props.getUserData(handle);
    //set user data in the state
    axios
      .get(`/user/${handle}`)
      .then((res) => {
        this.setState({
          profile: res.data.user
        });
      })
      .catch((err) => console.log(err));
  }
  render() {
    const { posts, loading } = this.props.data;
    const { classes, user: { credentials: { handle } } } = this.props;
    //check if post data is loading
    const postsMarkup = loading ? (
      //display loading icon
      <CircularProgress size={30} className={classes.loadingIcon} />
    ) : posts === null ? (
      //if user has no posts display message
      <p>This user has not posted anything yet!</p>
    ) : (
      //map posts
      posts.map((post) => <Post key={post.postId} post={post} />)
    );
    //check if profile data is loading
    const profileMarkup =  this.state.profile === null ? (
      //display loading icon if loading
      <CircularProgress size={30} className={classes.loadingIcon} />
    ) : this.state.profile.handle === handle ? (
      //check if user is authenticated and show profile component with editing functionality
      <Profile />
    ) : (
      //if user is not the authenticated user show a static profile component
      <StaticProfile profile={this.state.profile} />
    );
    return (
      <Grid container className={classes.grid}>
        <NavBar />
        <Grid item sm={2} xs={12} className={classes.container}>
          {profileMarkup}
        </Grid>
        <Grid item sm={8} xs={12} className={classes.container}>
          {postsMarkup}
        </Grid>
      </Grid>
    );
  }
}

//set required data
Users.propTypes = {
  getUserData: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  data: state.data,
  user: state.user
});

export default connect(mapStateToProps, { getUserData })(withStyles(styles)(Users));