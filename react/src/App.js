import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import Theme from './util/theme';
import jwtDecode from 'jwt-decode';
import axios from 'axios';
import AuthRoute from './util/authRoute';
//Redux
import { Provider } from 'react-redux';
import store from './redux/store';
import { SET_AUTHENTICATED } from './redux/types';
import { logoutUser, getUserData } from './redux/actions/userActions';

//import pages
import Login from './pages/login';
import SignUp from './pages/signup';
import Home from './pages/home';
import Users from './pages/users';

//create a material ui theme from the theme object
const theme = createMuiTheme(Theme);

//set base url for endpoint
axios.defaults.baseURL = 'https://us-central1-socialmedia-7c417.cloudfunctions.net/api';

//check if the user has an expired token
const token = localStorage.AuthToken;
//check if token exists
if(token){
  const decodedToken = jwtDecode(token);
  //get the expiry time of the token
  if(decodedToken.exp * 1000 < Date.now()){
    //logout user if the token has existed for a set amount of time
    store.dispatch(logoutUser());
    //send to login page
    window.location.href = '/login';
  } else {
    //set token in authorization header
    store.dispatch({ type: SET_AUTHENTICATED });
    axios.defaults.headers.common['Authorization'] = token;
    store.dispatch(getUserData());
  }
}

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <Provider store={store}>
        <Router>
          <div className="container">
            <Switch>
              <Route exact path="/" component={Home}/>
              <Route exact path="/users/:handle" component={Users}/>
              <AuthRoute exact path="/login" component={Login}/>
              <AuthRoute exact path="/signup" component={SignUp}/>
            </Switch>
          </div>
        </Router>
      </Provider>
    </MuiThemeProvider>
  );
}

export default App;