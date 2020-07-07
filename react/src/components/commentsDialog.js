import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import MyButton from '../util/button';
import dayjs from 'dayjs';
import Comments from './comments';

//MUI components
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import ChatIcon from '@material-ui/icons/Chat';
import TextField from '@material-ui/core/TextField';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import Link from '@material-ui/core/Link';

//redux
import { connect } from 'react-redux';
import { getPost, clearErrors, submitComment } from '../redux/actions/dataActions';

//styles
const styles = (theme) => ({
  ...theme.spreadThis,
  image: {
    maxWidth: 100,
    height: 100,
    borderRadius: '50%',
    objectFit: 'cover'
  },
  content: {
    padding: 20
  },
  close: {
    position: 'absolute',
    left: '91%'
  },
  loadingIcon: {
    textAlign: 'center',
    marginTop: 50,
    marginBottom: 50
  },
  body: {
    margin: 10
  },
  padRight: {
    marginRight: 70
  },
  inline: {
    marginLeft: 7,
    display: 'inline',
    paddingBottom: 10
  }
});

class CommentsDialog extends Component {
  state = {
    open: false,
    oldPath: '',
    newPath: '',
    body: '',
    errors: {}
  };
  componentDidMount() {
    //if component mounted open the dialog
    if (this.props.openDialog) {
      this.handleOpen();
    }
  }
  componentWillReceiveProps(nextProps) {
    //set errors in the state
    if(nextProps.UI.errors){
      this.setState({ errors: nextProps.UI.errors });
    }
    //clear errors from the state
    if(!nextProps.UI.errors && !nextProps.UI.loading){
      this.setState({ body: '' });
    }
  }
  //when dialog is opened
  handleOpen = () => {
    //get old url
    let oldPath = window.location.pathname;

    //set the new url with the user handle and post id
    const { userHandle, postId } = this.props;
    const newPath = `/users/${userHandle}/post/${postId}`;

    //check if old url is the same as the new url
    if(oldPath === newPath) oldPath = `/users/${userHandle}`;

    //set the new url
    window.history.pushState(null, null, newPath);

    //set state
    this.setState({ open: true, oldPath, newPath });
    //set post id to the get post redux action
    this.props.getPost(this.props.postId);
  };
  //when dialog is closed
  handleClose = () => {
    //set the old url
    window.history.pushState(null, null, this.state.oldPath);
    //set state
    this.setState({ open: false });
    //clear errors
    this.props.clearErrors();
  };
  //handle comment form field changes
  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };
  //handle comment form field submit
  handleSubmit = (event) => {
    //stop default submit
    event.preventDefault();
    //set post id and form data to submit comment redux action
    this.props.submitComment(this.props.postId, { body: this.state.body });
  }
  //handle like icon
  likedPost = () => {
    //return true if the authenticated user has liked the post
    if(this.props.user.likes && this.props.user.likes.find((like) => like.postId === this.props.postId)){
      return true;
    } else return false;
  }
  render() {
    const {
      classes,
      post: {
        body,
        createdAt,
        likeCount,
        commentCount,
        userImage,
        userHandle,
        comments
      },
      UI: { loading },
    } = this.props;
    const errors = this.state.errors;
    //change the like icon depending if the authenitcated user has liked the post or not
    const likeButton = this.likedPost() ? (
      <MyButton tip="Likes">
        <FavoriteIcon color="secondary" />
      </MyButton>
    ) : (
      <MyButton tip="Likes">
        <FavoriteBorder color="secondary" />
      </MyButton>
    );
    //check if dialog markup is loading before rendering
    const dialogMarkup = loading ? (
      <div className={classes.loadingIcon}>
        <CircularProgress size={50} />
      </div>
    ) : (
      <Grid container>
        <Grid item sm={4}>
          <img src={userImage} alt="Profile" className={classes.image} />
        </Grid>
        <Grid item sm={8}>
          <Typography variant="h6" className={classes.inline}><Link href={`/users/${userHandle}`} underline='hover'>@{userHandle}</Link></Typography>
          <Typography variant="body2" color="textSecondary" className={classes.inline}>
            {dayjs(createdAt).format('MMMM DD YYYY')} at {dayjs(createdAt).format('h:mm a')}
          </Typography>
          <Typography variant="body1" className={classes.body}>{body}</Typography>
          <MyButton tip="Comments">
            <ChatIcon color="primary" />
          </MyButton>
          <span className={classes.padRight}>{commentCount}</span>
          {likeButton}
          <span>{likeCount}</span>
          <div className={classes.separator}></div>
        </Grid>
        <Grid item sm={12} style={{ textAlign: 'center' }}>
          <form onSubmit={this.handleSubmit}>
            <TextField
              name="body"
              type="text"
              label="Comment"
              error={errors.comment ? true : false}
              helperText={errors.comment}
              value={this.state.body}
              onChange={this.handleChange}
              fullWidth
            />
          </form>
          <div className={classes.separator}></div>
        </Grid>
        <Comments comments={comments} />
      </Grid>
    );
    return (
      <Fragment>
        <MyButton
          onClick={this.handleOpen}
          tip="Leave a comment"
        >
          <ChatIcon color="primary" />
        </MyButton>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth
          maxWidth="sm"
        >
          <MyButton
            tip="Close"
            onClick={this.handleClose}
            tipClassName={classes.close}
          >
            <CloseIcon color="primary" />
          </MyButton>
          <DialogContent className={classes.content}>
            {dialogMarkup}
          </DialogContent>
        </Dialog>
      </Fragment>
    );
  }
}

//set required data
CommentsDialog.propTypes = {
  clearErrors: PropTypes.func.isRequired,
  getPost: PropTypes.func.isRequired,
  postId: PropTypes.string.isRequired,
  userHandle: PropTypes.string.isRequired,
  post: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired,
  submitComment: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  post: state.data.post,
  UI: state.UI,
  user: state.user
});

const mapActionsToProps = {
  getPost,
  clearErrors,
  submitComment
};

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(CommentsDialog));