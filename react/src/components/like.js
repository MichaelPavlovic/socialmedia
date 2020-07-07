import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MyButton from '../util/button';

//MUI components
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';

//redux
import { connect } from 'react-redux';
import { likePost, unlikePost } from '../redux/actions/dataActions';

export class Like extends Component {
  //check if the authenitcated user has liked the post
  likedPost = () => {
    if(this.props.user.likes && this.props.user.likes.find((like) => like.postId === this.props.postId)){
      return true;
    } else return false;
  }
  //handle like post
  likePost = () => {
    this.props.likePost(this.props.postId);
  }
  //handle unlike post
  unlikePost = () => {
    this.props.unlikePost(this.props.postId);
  }
  render(){
    //display icon depending on if post is liked or not liked
    const likeButton = this.likedPost() ? (
      <MyButton tip="Undo like" onClick={this.unlikePost}>
        <FavoriteIcon color="secondary" />
      </MyButton>
    ) : (
      <MyButton tip="Like" onClick={this.likePost}>
        <FavoriteBorder color="secondary" />
      </MyButton>
    );
    return likeButton;
  }
}

//set required data
Like.propTypes = {
  user: PropTypes.object.isRequired,
  postId: PropTypes.string.isRequired,
  likePost: PropTypes.func.isRequired,
  unlikePost: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  user: state.user
});

const mapActionsToProps = { likePost, unlikePost }

export default connect(mapStateToProps, mapActionsToProps)(Like);