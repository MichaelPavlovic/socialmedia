//function to validate an email (returns true if valid)
const isEmail = (email) => {
  const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(regEx)) return true;
  else return false;
};

//function that checks for an empty string (returns false if not empty)
const isEmpty = (string) => {
  if (string.trim() === '') return true;
  else return false;
};

//validate signup fields
exports.validateSignupData = (data) => {
  let errors = {};

  //check if email is not empty and valid
  if (isEmpty(data.email)) {
    errors.email = 'Must not be empty';
  } else if (!isEmail(data.email)) {
    errors.email = 'Must be a valid email address';
  }

  //check if password is not empty and matches confirm password
  if (isEmpty(data.password)) errors.password = 'Must not be empty';
  if (data.password !== data.confirmPassword) errors.confirmPassword = 'Passwords must match';

  //check if handle is not empty
  if (isEmpty(data.handle)) errors.handle = 'Must not be empty';

  //return errors as an object
  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  };
};

//validate login data
exports.validateLoginData = (data) => {
  let errors = {};

  //check if email and password are not empty
  if (isEmpty(data.email)) errors.email = 'Must not be empty';
  if (isEmpty(data.password)) errors.password = 'Must not be empty';

  //return errors
  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  };
};

//function to reduce optional user details
//by default these are empty until a user adds them
exports.reduceUserDetails = (data) => {
  let userDetails = {};

  if (!isEmpty(data.bio.trim())) userDetails.bio = data.bio;
  if (!isEmpty(data.location.trim())) userDetails.location = data.location;

  return userDetails;
};