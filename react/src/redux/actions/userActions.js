import {
  SET_USER,
  SET_ERRORS,
  CLEAR_ERRORS,
  LOADING_UI,
  SET_UNAUTHENTICATED,
  LOADING_USER,
  MARK_NOTIFICATIONS_READ
} from "../types";
import axios from "axios";

//login user action
export const loginUser = (userData, history) => (dispatch) => {
  //dispatch loading ui
  dispatch({ type: LOADING_UI });
  //make request to login endpoint
  axios
    .post("/login", userData)
    .then((response) => {
      //set authorization header to token
      setAuthorizationHeader(response.data.token);
      //get user data
      dispatch(getUserData());
      //clear errors
      dispatch({ type: CLEAR_ERRORS });
      history.push("/"); //redirect to the home page
    })
    .catch((error) => {
      //set errors if something goes wrong
      dispatch({
        type: SET_ERRORS,
        payload: error.response.data
      });
    });
};

//logout
export const logoutUser = () => (dispatch) => {
  //remove authorization token from local storage
  localStorage.removeItem("AuthToken");
  //delete auth header
  delete axios.defaults.headers.common["Authorization"];
  //set unauthenticated
  dispatch({ type: SET_UNAUTHENTICATED });
};

//signup
export const signUpUser = (newUserData, history) => (dispatch) => {
  //dispatch loading ui
  dispatch({ type: LOADING_UI });
  //make request to signup endpoint
  axios
    .post("/signup", newUserData)
    .then((response) => {
      //set authorization header to token
      setAuthorizationHeader(response.data.token);
      //get user data
      dispatch(getUserData());
      //clear errors
      dispatch({ type: CLEAR_ERRORS });
      history.push("/"); //redirect to the home page
    })
    .catch((error) => {
      //dispatch errors if anything went wrong
      dispatch({
        type: SET_ERRORS,
        payload: error.response.data
      });
    });
};

//get user data
export const getUserData = () => (dispatch) => {
  //loading
  dispatch({ type: LOADING_USER });
  //make request to user endpoint
  axios
    .get("/user")
    .then((res) => {
      //set user data in payload
      dispatch({
        type: SET_USER,
        payload: res.data
      });
    })
    .catch((err) => console.log(err));
};

//upload profile picture
export const uploadImage = (formData) => (dispatch) => {
  //loading
  dispatch({ type: LOADING_USER });
  //make request to image endpoint with form data
  axios
    .post("/user/image", formData)
    .then(() => {
      //get user data
      dispatch(getUserData());
    })
    .catch((err) => console.log(err));
};

//edit optional user details
export const editUserDetails = (userDetails) => (dispatch) => {
  //loading
  dispatch({ type: LOADING_USER });
  //make request to endpoint
  axios
    .post("/user", userDetails)
    .then(() => {
      //get user data
      dispatch(getUserData());
    })
    .catch((err) => console.log(err));
};

//mark notifications as read
export const markNotificationsRead = (notificationIds) => (dispatch) => {
  //make request to endpoint
  axios
    .post('/notifications', notificationIds)
    .then((res) => {
      dispatch({ type: MARK_NOTIFICATIONS_READ });
    })
    .catch((err) => console.log(err));
};

//helper function to set authorization header
const setAuthorizationHeader = (token) => {
  const AuthToken = `Bearer ${token}`;
  //set authtoken in local storage
  localStorage.setItem("AuthToken", AuthToken);
  //set authoization header
  axios.defaults.headers.common["Authorization"] = AuthToken;
};