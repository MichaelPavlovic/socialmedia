import React, { Fragment } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

//MUI
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Link from '@material-ui/core/Link';
import LocationOn from '@material-ui/icons/LocationOn';
import CalendarToday from '@material-ui/icons/CalendarToday';

//styles
const styles = (theme) => ({
  ...theme.spreadThis,
  container: {
    textAlign: 'center',
  },
  img: {
    margin: '0 auto',
    height: 100,
    width: 100
  },
  padtop: {
    marginTop: 15
  },
  loadingIcon: {
    marginTop: 70
  }
});

//render static profile
const StaticProfile = (props) => {
  const {
    classes,
    profile: { handle, createdAt, imageUrl, bio, location }
  } = props;
  return (
    <div className={classes.container}>
      <Avatar alt="Profile image" src={imageUrl} className={classes.img}></Avatar>
      <div>
        <Link component={Link} to={`/users/${handle}`} color="primary" variant="h5">@{handle}</Link>
        <div className={classes.padtop}>
          {bio && <Typography variant="body2">{bio}</Typography>}
        </div>
        <div className={classes.padtop}>
          {location && (
            <Fragment>
              <LocationOn color="primary" />
              <Typography variant="body2">{location}</Typography>
            </Fragment>
          )}
        </div>
        <div className={classes.padtop}>
          <CalendarToday color="primary" />
          <Typography variant="body2">Joined {dayjs(createdAt).format('MMM YYYY')}</Typography>
        </div>
      </div>
    </div>
  );
}

//set required data
StaticProfile.propTypes = {
  profile: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(StaticProfile);