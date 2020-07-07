import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import { pushToLogin } from '../util/auth';

//components
import Post from '../components/post';
import NavBar from '../components/navbar';
import Account from '../components/account';

//MUI components
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';

//redux
import { connect } from 'react-redux';
import { getPosts } from '../redux/actions/dataActions';

//styles
const styles = (theme) => ({
  ...theme.spreadThis,
  container: {
    margin: '0 auto',
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

class Home extends Component {
  componentDidMount(){
    //when the component mounts check if they are authenticated
    pushToLogin(this.props.history);
    //get posts
    this.props.getPosts();
  }
  render() {
    //set prop data
    const { posts, loading } = this.props.data;
    const { classes } = this.props;
    //check if the post data is loading
    const recentPostsMarkup = !loading ? (
      posts.map((post) => <Post key={post.postId} post={post}/>)
    ) : (
      //display spinning icon if loading
      <CircularProgress size={30} className={classes.loadingIcon} />
    );
    //check if account data is loading
    const accountMarkup = !loading ? (
      <Account />
    ) : (
      //display loading icon if loading
      <CircularProgress size={30} className={classes.loadingIcon} />
    );
    return (
      <Grid container className={classes.grid}>
        <NavBar />
        <Grid item sm={2} xs={12} className={classes.container}>
          {accountMarkup}
        </Grid>
        <Grid item sm={8} xs={12} className={classes.container}>
          {recentPostsMarkup}
        </Grid>
        <Grid item sm={2} xs={12}>
        </Grid>
      </Grid>
    );
  }
}

//set required data
Home.propTypes = {
  getPosts: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired
}

//set data in the state
const mapStateToProps = (state) => ({
  data: state.data
});

export default connect(mapStateToProps, { getPosts })(withStyles(styles)(Home));