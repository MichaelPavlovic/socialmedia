import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

//Material UI components
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Link from '@material-ui/core/Link';

//styles
const styles = (theme) => ({
  ...theme.spreadThis,
  img: {
    margin: '0 auto',
    height: 50,
    width: 50
  },
  text: {
    marginTop: 10
  }
});

class Account extends Component {
  render() {
    const { classes, user: { credentials: { handle, imageUrl } } } = this.props;
    return (
      <div>
        <Avatar alt="Profile image" src={imageUrl} className={classes.img}></Avatar>
        <Typography variant="h6" className={classes.text}><Link href={`/users/${handle}`} underline='hover'>@{handle}</Link></Typography>
      </div>
    );
  }
}

//set required data
Account.propTypes = {
  user: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  user: state.user
});

export default connect(mapStateToProps)(withStyles(styles)(Account));