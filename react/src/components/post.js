import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

//components
import Like from './like';
import DeletePost from './deletePost';
import CommentsDialog from './commentsDialog';

//MUI components
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Link from '@material-ui/core/Link';

//redux
import { connect } from 'react-redux';

//styles
const styles = (theme) => ({
  ...theme.spreadThis,
  card: {
    position: 'relative',
    marginBottom: 20,
    maxWidth: 600,
    display: 'flex',
    margin: '0 auto',
    textAlign: 'left',
    backgroundColor: '#15202B',
    color: 'white'
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    padding: 15,
    paddingLeft: 35
  },
  img: {
    top: 15,
    left: 15
  },
  body: {
    paddingTop: 15,
    paddingBottom: 15
  },
  icons: {
    padding: 0,
    display: 'flex',
    flexDirection: 'row'
  },
  icon: {
    padding: 0
  },
  count: {
    paddingTop: 15,
    paddingRight: 70,
  }
});

class Post extends Component {
  render() {
    dayjs.extend(relativeTime);
    const { 
      classes, 
      post : { body, createdAt, userImage, userHandle, postId, likeCount, commentCount },  //post data
      user: { authenticated, credentials: { handle } } //user data
    } = this.props;
    //only show delete button on post if it was created by the authenticated user
    const deleteButton =
      authenticated && userHandle === handle ? (
        <DeletePost postId={postId} />
      ) : null;
    return (
      <Card className={classes.card}>
        <div>
          <Avatar alt="Profile image" src={userImage} className={classes.img} />
        </div>
        <div className={classes.content}>
          <span>{deleteButton}</span>
          <Typography variant="subtitle2"><Link href={`/users/${userHandle}`} underline='hover' className={classes.link}>@{userHandle}</Link> • {dayjs(createdAt).fromNow()}</Typography>
          <Typography variant="body2" component="p" className={classes.body}>{body}</Typography>
          <div className={classes.icons}>
            <div>
              <CommentsDialog postId={postId} userHandle={userHandle} openDialog={this.props.openDialog} />
              <span className={classes.count}>{commentCount}</span>
            </div>
            <div>
              <Like postId={postId} className={classes.icon} />
              <span className={classes.count}>{likeCount}</span>
            </div>
          </div>
        </div>
      </Card>
    );
  }
}

//set required data
Post.propTypes = {
  user: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  openDialog: PropTypes.bool
}

const mapStateToProps = (state) => ({
  user: state.user
});

export default connect(mapStateToProps)(withStyles(styles)(Post));