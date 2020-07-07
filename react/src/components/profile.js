import React, { Component, Fragment } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import MyButton from '../util/button';
import dayjs from 'dayjs';

//components
import EditProfile from './editProfile';

//MUI components
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Link from '@material-ui/core/Link';
import LocationOn from '@material-ui/icons/LocationOn';
import CalendarToday from '@material-ui/icons/CalendarToday';
import EditIcon from '@material-ui/icons/Edit';

//redux
import { connect } from 'react-redux';
import { uploadImage } from '../redux/actions/userActions';

//styles
const styles = (theme) => ({
  ...theme.spreadThis,
  container: {
    textAlign: 'center',
  },
  img: {
    margin: '0 auto',
    height: 100,
    width: 100
  },
  padtop: {
    marginTop: 15
  }
});

//render editable profile for authenticated user
class Profile extends Component {
  //if picture is uploaded
  handleImageChange = (event) => {
    //get image data
    const image = event.target.files[0];
    const formData = new FormData();
    formData.append('image', image, image.name);
    //upload picture redux action
    this.props.uploadImage(formData);
  }
  //if edit picture button si clicked
  handleEditPicture = () => {
    //open file input
    const fileInput = document.getElementById('imageInput');
    fileInput.click();
  }
  render() {
    const {
      classes,
      user: {
        credentials: { handle, createdAt, imageUrl, bio, location } //user data
      }
    } = this.props;
    return (
      <div className={classes.container}>
        <Avatar alt="Profile image" src={imageUrl} className={classes.img}></Avatar>
        <input
          type="file"
          id="imageInput"
          hidden="hidden"
          onChange={this.handleImageChange}
        />
        <MyButton
          tip="Change profile picture"
          onClick={this.handleEditPicture}
          btnClassName="button"
        >
          <EditIcon color="primary" />
        </MyButton>
        <div>
          <Link component={Link} to={`/users/${handle}`} color="primary" variant="h5">@{handle}</Link>
          <div className={classes.padtop}>
            {bio && <Typography variant="body2">{bio}</Typography>}
          </div>
          <div className={classes.padtop}>
            {location && (
              <Fragment>
                <LocationOn color="primary" />
                <Typography variant="body2">{location}</Typography>
              </Fragment>
            )}
          </div>
          <div className={classes.padtop}>
            <CalendarToday color="primary" />
            <Typography variant="body2">Joined {dayjs(createdAt).format('MMM YYYY')}</Typography>
          </div>
        </div>
        <EditProfile />
      </div>
    );
  }
}

//set required data
Profile.propTypes = {
  user: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  uploadImage: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  user: state.user
});

const mapActionsToProps = { uploadImage }

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(Profile));