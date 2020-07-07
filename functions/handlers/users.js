const { admin, db } = require("../utils/admin");

const config = require("../utils/config");

//initialize firebase app
const firebase = require("firebase");
firebase.initializeApp(config);

//need to generate a uuid to upload a picture to firebase storage
const { uuid } = require("uuidv4");

//get validation functions
const {
  validateSignupData,
  validateLoginData,
  reduceUserDetails,
} = require("../utils/validation");

//signup
exports.signup = (req, res) => {
  //create a new user object with form data
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle,
  };

  //pass data to validation functions
  const { valid, errors } = validateSignupData(newUser);

  //return errors if data does not go through validation
  if (!valid) return res.status(400).json(errors);

  //this image is stored in the firebase storage
  const noImg = "no-img.png";

  let token, userId;
  //get a document with the new user handle
  db.doc(`/users/${newUser.handle}`)
    .get()
    .then((doc) => {
      //check if the user handle already exists
      if (doc.exists) {
        return res.status(400).json({ handle: "That handle is already taken" });
      } else {
        //create the new user through firebase authentication
        return firebase
          .auth()
          .createUserWithEmailAndPassword(newUser.email, newUser.password);
      }
    })
    .then((data) => {
      //get user id
      userId = data.user.uid;
      return data.user.getIdToken(); //return firebase id token
    })
    .then((idToken) => {
      token = idToken;
      //create user credentials
      const userCredentials = {
        handle: newUser.handle,
        email: newUser.email,
        createdAt: new Date().toISOString(),
        imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImg}?alt=media`,
        userId
      };
      //set user credentials
      return db.doc(`/users/${newUser.handle}`).set(userCredentials);
    })
    .then(() => {
      return res.status(201).json({ token }); //return a token if the user was created successfully
    })
    .catch((err) => {
      console.error(err);
      //firebase has error codes to check if the email is already in use
      if (err.code === "auth/email-already-in-use") {
        return res.status(400).json({ email: "Email is already is use" });
      } else {
        return res.status(500).json({ general: "Something went wrong, please try again" });
      }
    });
};
//login
exports.login = (req, res) => {
  //get form data
  const user = {
    email: req.body.email,
    password: req.body.password,
  };

  //pass form data through validation fucntions
  const { valid, errors } = validateLoginData(user);

  //return errors if form data is not valid
  if (!valid) return res.status(400).json(errors);

  //authenticate user with firebase
  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then((data) => {
      return data.user.getIdToken();
    })
    .then((token) => {
      return res.json({ token }); //return id token if logged in successfully
    })
    .catch((err) => {
      //return 403 if credentials are not valid
      console.error(err);
      return res.status(403).json({ general: "Wrong credentials, please try again" });
    });
};
//Optional user details
exports.addUserDetails = (req, res) => {
  let userDetails = reduceUserDetails(req.body);

  //get user by user handle and attempt to update details with form data
  db.doc(`/users/${req.user.handle}`)
    .update(userDetails)
    .then(() => {
      return res.json({ message: "Details added successfully" });
    })
    .catch((err) => {
      //return 500 response if something goes wrong
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};
//Get details of any user
exports.getUserDetails = (req, res) => {
  let userData = {};
  //get user by handle
  db.doc(`/users/${req.params.handle}`)
    .get()
    .then((doc) => {
      //check if user exists
      if (doc.exists) {
        userData.user = doc.data();
        //return a collection of posts by handle ordered by created date
        return db
          .collection("posts")
          .where("userHandle", "==", req.params.handle)
          .orderBy("createdAt", "desc")
          .get();
      } else {
        //return 404 if user is not found
        return res.status(404).json({ errror: "User not found" });
      }
    })
    .then((data) => {
      userData.posts = [];
      data.forEach((doc) => {
        userData.posts.push({
          body: doc.data().body,
          createdAt: doc.data().createdAt,
          userHandle: doc.data().userHandle,
          userImage: doc.data().userImage,
          likeCount: doc.data().likeCount,
          commentCount: doc.data().commentCount,
          postId: doc.id
        });
      });
      return res.json(userData); //return user data as json
    })
    .catch((err) => {
      //return 500 response if something went wrong
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};
//Get details of the authenticated user
exports.getAuthenticatedUser = (req, res) => {
  let userData = {};
  //get user data by handle
  db.doc(`/users/${req.user.handle}`)
    .get()
    .then((doc) => {
      //check if user exists
      if (doc.exists) {
        userData.credentials = doc.data();
        //get likes by handle
        return db
          .collection("likes")
          .where("userHandle", "==", req.user.handle)
          .get();
      }
    })
    .then((data) => {
      //set likes in user data object
      userData.likes = [];
      data.forEach((doc) => {
        userData.likes.push(doc.data());
      });
      //get 10 newest notifications
      return db
        .collection("notifications")
        .where("recipient", "==", req.user.handle)
        .orderBy("createdAt", "desc")
        .limit(10)
        .get();
    })
    .then((data) => {
      //set notifications in userdata object
      userData.notifications = [];
      data.forEach((doc) => {
        userData.notifications.push({
          recipient: doc.data().recipient,
          sender: doc.data().sender,
          createdAt: doc.data().createdAt,
          postId: doc.data().postId,
          type: doc.data().type,
          read: doc.data().read,
          notificationId: doc.id,
        });
      });
      return res.json(userData); //return user data as json
    })
    .catch((err) => {
      //return 500 response if something goes wrong
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};
//Upload profile picture
exports.uploadImage = (req, res) => {
  const BusBoy = require("busboy");
  const path = require("path");
  const os = require("os");
  const fs = require("fs");
  const busboy = new BusBoy({ headers: req.headers });

  let imageToBeUploaded = {};
  let imageFileName;
  let generatedToken = uuid(); //generate uuid token

  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    //check if the uploaded file is something other than a png or jpg
    if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
      return res.status(400).json({ error: "Wrong file type submitted" });
    }
    //get image extension from the uploaded file
    const imageExtension = filename.split(".")[filename.split(".").length - 1];

    //generate an image file name
    imageFileName = `${Math.round(
      Math.random() * 1000000000000
    ).toString()}.${imageExtension}`;
    
    const filepath = path.join(os.tmpdir(), imageFileName);
    imageToBeUploaded = { filepath, mimetype };
    file.pipe(fs.createWriteStream(filepath));
  });
  busboy.on("finish", () => {
    //upload image to firebase storage
    admin
      .storage()
      .bucket()
      .upload(imageToBeUploaded.filepath, {
        resumable: false,
        metadata: {
          metadata: {
            contentType: imageToBeUploaded.mimetype,
            //generate token
            firebaseStorageDownloadTokens: generatedToken,
          },
        },
      })
      .then(() => {
        //set image url with generated token
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media&token=${generatedToken}`;
        return db.doc(`/users/${req.user.handle}`).update({ imageUrl }); //update the users profile picture in the database
      })
      .then(() => {
        return res.json({ message: "Image uploaded successfully" }); //return success message
      })
      .catch((err) => {
        //return 500 response if something goes wrong
        console.error(err);
        return res.status(500).json({ error: "Something went wrong" });
      });
  });
  busboy.end(req.rawBody);
};
//mark notifications as read
exports.markNotificationsRead = (req, res) => {
  let batch = db.batch();
  //set each notification as read in the database
  req.body.forEach((notificationId) => {
    const notification = db.doc(`/notifications/${notificationId}`);
    batch.update(notification, { read: true });
  });
  batch
    .commit()
    .then(() => {
      return res.json({ message: "Notifications marked read" }); //return success message
    })
    .catch((err) => {
      //return 500 response if something goes wrong
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};