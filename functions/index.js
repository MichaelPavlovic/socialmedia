/* API built off of:
 * https://www.freecodecamp.org/news/how-to-build-a-todo-application-using-reactjs-and-firebase/
 * AND
 * https://www.youtube.com/watch?v=m_u6P5k0vP0
 */ 
const functions = require("firebase-functions");
const app = require("express")();
const FBAuth = require("./utils/auth"); //get authentication layer

//use the cors module to avoid issue calling api from the front end
const cors = require("cors");
app.use(cors());

const { db } = require("./utils/admin");

const { getAllPosts, createPost, getPost, commentOnPost, likePost, unlikePost, deletePost } = require("./handlers/posts");
const { signup, login, uploadImage, addUserDetails, getAuthenticatedUser, getUserDetails, markNotificationsRead } = require("./handlers/users");

// EXPRESS STUFF
//Post routes
app.get("/posts", getAllPosts);
app.post("/post", FBAuth, createPost);
app.get("/post/:postId", getPost);
app.delete("/post/:postId", FBAuth, deletePost);
app.get("/post/:postId/like", FBAuth, likePost);
app.get("/post/:postId/unlike", FBAuth, unlikePost);
app.post("/post/:postId/comment", FBAuth, commentOnPost);
// users routes
app.post("/signup", signup);
app.post("/login", login);
app.post("/user/image", FBAuth, uploadImage);
app.post("/user", FBAuth, addUserDetails);
app.get("/user", FBAuth, getAuthenticatedUser);
app.get("/user/:handle", getUserDetails);
app.post("/notifications", FBAuth, markNotificationsRead);

//export the api
exports.api = functions.region("us-central1").https.onRequest(app);

//create a notification when someone likes a post
exports.createNotificationOnLike = functions
  .region("us-central1")
  .firestore.document("likes/{id}")
  .onCreate((snapshot) => {
    return db
      .doc(`/posts/${snapshot.data().postId}`)
      .get()
      .then((doc) => {
        //ignore likes from the same user that made the post
        if(doc.exists &&doc.data().userHandle !== snapshot.data().userHandle){
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: "like",
            read: false,
            postId: doc.id,
          });
        }
      })
      .catch((err) => console.error(err));
  });
//delete the notification if the user unlikes the post that they previously liked
exports.deleteNotificationOnUnLike = functions
  .region("us-central1")
  .firestore.document("likes/{id}")
  .onDelete((snapshot) => {
    return db
      .doc(`/notifications/${snapshot.id}`)
      .delete()
      .catch((err) => {
        console.error(err);
        return;
      });
  });
//create a notification if a user comments on a post
exports.createNotificationOnComment = functions
  .region("us-central1")
  .firestore.document("comments/{id}")
  .onCreate((snapshot) => {
    return db
      .doc(`/posts/${snapshot.data().postId}`)
      .get()
      .then((doc) => {
        //ignore comments from the same user that made the post
        if(doc.exists &&doc.data().userHandle !== snapshot.data().userHandle) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: "comment",
            read: false,
            postId: doc.id
          });
        }
      })
      .catch((err) => {
        console.error(err);
        return;
      });
  });
//if a user changes their profile picture
exports.onUserImageChange = functions
  .region("us-central1")
  .firestore.document("/users/{userId}")
  .onUpdate((change) => {
    //check if the picture is the same before continuing
    if (change.before.data().imageUrl !== change.after.data().imageUrl) {
      const batch = db.batch();
      //get a collection of the user's posts
      return db
        .collection("posts")
        .where("userHandle", "==", change.before.data().handle)
        .get()
        .then((data) => {
          //update the profile picture in all of the user's posts
          data.forEach((doc) => {
            const post = db.doc(`/posts/${doc.id}`);
            batch.update(post, { userImage: change.after.data().imageUrl });
          });
          return batch.commit();
        });
    } else return true;
  });
//if a user deletes a post
exports.onPostDelete = functions
  .region("us-central1")
  .firestore.document("/posts/{postId}")
  .onDelete((snapshot, context) => {
    const postId = context.params.postId; //get the post id
    const batch = db.batch();
    return db
      .collection("comments")
      .where("postId", "==", postId)
      .get()
      .then((data) => {
        //delete all the comments for the post
        data.forEach((doc) => {
          batch.delete(db.doc(`/comments/${doc.id}`));
        });
        return db.collection("likes").where("postId", "==", postId).get();
      })
      .then((data) => {
        //delete all the likes for the post
        data.forEach((doc) => {
          batch.delete(db.doc(`/likes/${doc.id}`));
        });
        return db
          .collection("notifications")
          .where("postId", "==", postId)
          .get();
      })
      .then((data) => {
        //delete all the notifications for the post
        data.forEach((doc) => {
          batch.delete(db.doc(`/notifications/${doc.id}`));
        });
        return batch.commit();
      })
      .catch((err) => console.error(err));
  });
