import React, { Component, Fragment } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import PropTypes from 'prop-types';

//MUI components
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import withStyles from '@material-ui/core/styles/withStyles';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
import NotificationsIcon from '@material-ui/icons/Notifications';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ChatIcon from '@material-ui/icons/Chat';
import Link from '@material-ui/core/Link';

//redux
import { connect } from 'react-redux';
import { markNotificationsRead } from '../redux/actions/userActions';

//styles
const styles = (theme) => ({
  ...theme.spreadThis,
  notificationIcon: {
    color: 'white'
  },
  icon: {
    marginRight: 5
  }
});

class Notifications extends Component {
  state = {
    anchorEl: null
  }
  //handle menu open
  handleOpen = (event) => {
    this.setState({ anchorEl: event.target });
  }
  //handle menu close
  handleClose = () => {
    this.setState({ anchorEl: null });
  }
  onMenuOpened = () => {
    //get ids of unread notifications
    let unreadNotificationsIds = this.props.notifications
      .filter((not) => !not.read)
      .map((not) => not.notificationId);
    
    //mark the unread notifications as read
    this.props.markNotificationsRead(unreadNotificationsIds);
  }
  render() {
    const { classes } = this.props;

    const notifications = this.props.notifications;
    const anchorEl = this.state.anchorEl;

    dayjs.extend(relativeTime);

    let notificationsIcon;
    //set badge number for notification icon
    if(notifications && notifications.length > 0){
      notifications.filter((not) => not.read === false).length > 0
        ? (notificationsIcon = (
            <Badge
              badgeContent={
                notifications.filter((not) => not.read === false).length
              }
              color="primary"
            >
              <NotificationsIcon className={classes.notificationIcon} />
            </Badge>
          ))
        : (notificationsIcon = <NotificationsIcon className={classes.notificationIcon} />);
    } else{
      notificationsIcon = <NotificationsIcon className={classes.notificationIcon} />;
    }
    //check if there are notifications
    let notificationsMarkup =
      notifications && notifications.length > 0 ? (
        notifications.map((not) => {
          //change the variable to liked if the notification type is a like and not a comment
          //other wise make it commented on
          const verb = not.type === 'like' ? 'liked' : 'commented on';
          //get time of like/comment
          const time = dayjs(not.createdAt).fromNow();
          //change the icon depending on if it is read or unread
          const iconColor = not.read ? 'primary' : 'secondary';
          //set icon to like if the notification is a like or comment if it is a comment
          const icon =
            not.type === 'like' ? (
              <FavoriteIcon color={iconColor} className={classes.icon} />
            ) : (
              <ChatIcon color={iconColor} className={classes.icon} />
            );

          return (
            <MenuItem key={not.createdAt} onClick={this.handleClose}>
              {icon}
              <Typography variant="body1" className={classes.text}><Link href={`/users/${not.sender}`} underline='hover'>{not.sender} {verb} your post {time}</Link></Typography>
            </MenuItem>
          );
        })
      ) : (
        //if there are no notifications
        <MenuItem onClick={this.handleClose}>
          No notifications.
        </MenuItem>
      );
    return (
      <Fragment>
        <Tooltip placement="top" title="Notifications">
          <IconButton
            aria-owns={anchorEl ? 'simple-menu' : undefined}
            aria-haspopup="true"
            onClick={this.handleOpen}
          >
            {notificationsIcon}
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
          onEntered={this.onMenuOpened}
        >
          {notificationsMarkup}
        </Menu>
      </Fragment>
    );
  }
}

//set required data
Notifications.propTypes = {
  markNotificationsRead: PropTypes.func.isRequired,
  notifications: PropTypes.array.isRequired
};

const mapStateToProps = (state) => ({
  notifications: state.user.notifications
});

export default connect(mapStateToProps, { markNotificationsRead })(withStyles(styles)(Notifications));