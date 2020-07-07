import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import dayjs from 'dayjs';

//MUI components
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

//styles
const styles = (theme) => ({
  ...theme.spreadThis,
  commentImage: {
    maxWidth: 70,
    height: 70,
    objectFit: 'cover',
    borderRadius: '50%'
  },
  commentData: {
    marginLeft: 20
  },
  inline: {
    display: 'inline',
    marginLeft: 7
  },
  body: {
    margin: 10
  }
});

//render markup for comments passed in from props
class Comments extends Component {
  render() {
    const { classes, comments } = this.props;
    return (
      <Grid container>
        {comments.map((comment, index) => {
          const { body, createdAt, userImage, userHandle } = comment;
          return (
            <Fragment key={createdAt}>
              <Grid item sm={12}>
                <Grid container>
                  <Grid item sm={2}>
                    <img
                      src={userImage}
                      alt="Profile"
                      className={classes.commentImage}
                    />
                  </Grid>
                  <Grid item sm={9}>
                    <div className={classes.commentData}>
                      <Typography variant="body1" className={classes.inline}><Link href={`/users/${userHandle}`} underline='hover'>@{userHandle}</Link></Typography>
                      <Typography variant="body2" color="textSecondary" className={classes.inline}>
                        {dayjs(createdAt).format('MMMM DD YYYY')} at {dayjs(createdAt).format('h:mm a')}
                      </Typography>
                      <Typography variabnt="body1" className={classes.body}>{body}</Typography>
                    </div>
                  </Grid>
                </Grid>
              </Grid>
              {index !== comments.length - 1 && (
                <div className={classes.separator}></div>
              )}
            </Fragment>
          );
        })}
      </Grid>
    );
  }
}

//set required data
Comments.propTypes = {
  comments: PropTypes.array.isRequired
};

export default withStyles(styles)(Comments);