import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import MyButton from '../util/button';

//components
import CreatePost from '../components/createPost';
import Notifications from './notification';

//MUI components
import AppBar from '@material-ui/core/AppBar';
import ToolBar from '@material-ui/core/Toolbar';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Avatar from '@material-ui/core/Avatar';  
import HomeIcon from '@material-ui/icons/Home';
import Link from '@material-ui/core/Link';

//redux
import { connect } from 'react-redux';
import { logoutUser } from '../redux/actions/userActions';

//styles
const styles = (theme) => ({
  ...theme.spreadThis,
  icon: {
    color: "white"
  },
  navbar: {
    width: 500,
    margin: '0 auto'
  },
  container: {
    margin: '0 auto'
  },
  appbar: {
    backgroundColor: '#15202B'
  },
  img: {
    height: 26,
    width: 26
  }
});

class NavBar extends Component {
  //handle logout button
  handleLogout = () => {
    this.props.logoutUser();
  }
  render() {
    const { classes, user: { credentials: { handle, imageUrl } } } = this.props;
    return (
      <Fragment>
        <AppBar className={classes.appbar}>
          <ToolBar className={classes.navbar}>
            <div className={classes.container}>
              <CreatePost />
              <Link href="/">
                <MyButton tip="Home">
                  <HomeIcon className={classes.icon} />
                </MyButton>
              </Link>
              <Link href={`/users/${handle}`}>
                <MyButton tip="Profile">
                  <Avatar alt="Profile image" src={imageUrl} className={classes.img}></Avatar>
                </MyButton>
              </Link>
              <Notifications />
              <Link href="/login">
                <MyButton tip="Logout" onClick={this.handleLogout}>
                  <ExitToAppIcon color="secondary" />
                </MyButton>
              </Link>
            </div>
          </ToolBar>
        </AppBar>
      </Fragment>
    );
  }
}

//set required data
NavBar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  user: state.user
});

const mapActionsToProps = { logoutUser }

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(NavBar));