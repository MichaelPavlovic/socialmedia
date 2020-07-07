import { LOADING_DATA, SET_ERRORS, CREATE_POST, CLEAR_ERRORS, LOADING_UI, SET_POST, SET_POSTS, LIKE_POST, UNLIKE_POST, DELETE_POST, STOP_LOADING_UI, SEND_COMMENT } from '../types';
import axios from 'axios';

//get all posts
export const getPosts = () => (dispatch) => {
  //loading
  dispatch({ type: LOADING_DATA });
  //make request to endpoint
  axios.get('/posts').then((response) => {
    //set posts in payload
    dispatch({
      type: SET_POSTS,
      payload: response.data
    });
  }).catch(error => {
    dispatch({
      type: SET_POSTS,
      payload: []
    });
  });
}
//get a post by id
export const getPost = (postId) => (dispatch) => {
  //loading
  dispatch({ type: LOADING_UI });
  //make request to endpoint with postid
  axios
    .get(`/post/${postId}`)
    .then((res) => {
      //set post data in payload
      dispatch({
        type: SET_POST,
        payload: res.data
      });
      //stop loading
      dispatch({ type: STOP_LOADING_UI });
    })
    .catch((err) => console.log(err));
}
//create a new post
export const createPost = (newPost) => (dispatch) => {
  //set loading
  dispatch({ type: LOADING_UI });
  //make request to endpoint with post data
  axios.post('/post', newPost).then(response => {
    //set response data in payload
    dispatch({
      type: CREATE_POST,
      payload: response.data
    });
    //clear any errors so they don't persist 
    dispatch(clearErrors());
  }).catch(error => {
    //set errors if something went wrong
    dispatch({
      type: SET_ERRORS,
      payload: error.response.data
    });
  });
}
//delete a post 
export const deletePost = (postId) => (dispatch) => {
  //make request to endpoint with post id
  axios.delete(`/post/${postId}`).then(() => {
    dispatch({ 
      type: DELETE_POST,
      payload: postId
    });
  }).catch(error => console.log(error));
}
//like a post
export const likePost = (postId) => (dispatch) => {
  //make request to endpoint with post id
  axios.get(`/post/${postId}/like`).then((res) => {
    //set response data in payload
    dispatch({
      type: LIKE_POST,
      payload: res.data
    });
  }).catch(err => console.log(err));
}
//unlike a post
export const unlikePost = (postId) => (dispatch) => {
  //make request to endpoint with post id
  axios.get(`/post/${postId}/unlike`).then((res) => {
    //set response data in payload
    dispatch({
      type: UNLIKE_POST,
      payload: res.data
    });
  }).catch(err => console.log(err));
}
//send a comment
export const submitComment = (postId, commentData) => (dispatch) => {
  //make request to endpoint with post id and comment data
  axios
    .post(`/post/${postId}/comment`, commentData)
    .then((res) => {
      //set response data to payload
      dispatch({
        type: SEND_COMMENT,
        payload: res.data
      });
      //clear errors so they don't persist in form
      dispatch(clearErrors());
    })
    .catch((err) => {
      //set errors if something went wrong
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data
      });
    });
};
//helper funciton to dispatch clear errors
export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
}
//get user data
export const getUserData = (userHandle) => (dispatch) => {
  //set loading
  dispatch({ type: LOADING_DATA });
  //make request to endpoint with user handle
  axios
    .get(`/user/${userHandle}`)
    .then((res) => {
      //dispatch set posts and set post data to payload
      dispatch({
        type: SET_POSTS,
        payload: res.data.posts
      });
    })
    .catch(() => {
      dispatch({
        type: SET_POSTS,
        payload: null
      });
    });
}