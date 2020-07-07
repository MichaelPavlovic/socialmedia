import { CREATE_POST, LIKE_POST, UNLIKE_POST, SET_POST, SET_POSTS, DELETE_POST, SEND_COMMENT, LOADING_DATA } from '../types';

//Data reducer

const intialState = {
  posts: [],
  post: {},
  loading: false
}

//switch based on action type
export default function(state = intialState, action){
  switch(action.type){
    case CREATE_POST:
      return {
        ...state,
        posts: [action.payload, ...state.posts]
      }
    case SET_POSTS:
      return {
        ...state,
        posts: action.payload,
        loading: false
      }
    case SET_POST:
      return {
        ...state,
        post: action.payload
      }
    case LOADING_DATA:
      return {
        ...state,
        loading: true
      }
    case LIKE_POST:
    case UNLIKE_POST:
      let i = state.posts.findIndex(
        (post) => post.postId === action.payload.postId
      );
      state.posts[i] = action.payload;
      if(state.post.postId === action.payload.postId){
        state.post = action.payload;
      }
      return { ...state }
    case DELETE_POST:
      i = state.posts.findIndex(post => post.postId === action.payload);
      state.posts.splice(i, 1);
      return {
        ...state
      }
    case SEND_COMMENT:
      return {
        ...state,
        post: {
          ...state.post,
          comments: [action.payload, ...state.post.comments]
        }
      }
    default:
      return state;
  }
}