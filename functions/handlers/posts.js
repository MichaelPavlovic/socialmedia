const { db } = require("../utils/admin");

//get all posts
exports.getAllPosts = (req, res) => {
  //get a collection of all posts ordered by created date
  db.collection("posts")
    .orderBy("createdAt", "desc")
    .get()
    .then((data) => {
      //set post data
      let posts = [];
      data.forEach((doc) => {
        //create a post for each post document in the database
        posts.push({
          postId: doc.id,
          body: doc.data().body,
          userHandle: doc.data().userHandle,
          createdAt: doc.data().createdAt,
          commentCount: doc.data().commentCount,
          likeCount: doc.data().likeCount,
          userImage: doc.data().userImage,
        });
      });
      return res.json(posts); //return posts as a json object
    })
    .catch((err) => {
      //return a 500 response if something goes wrong
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};
//Create a post
exports.createPost = (req, res) => {
  //check if the body is empty
  if (req.body.body.trim() === "") {
    return res.status(400).json({ body: "Must not be empty" });
  }

  //initialize the new post with the user's handle, profile picture and body content
  const newPost = {
    body: req.body.body,
    userHandle: req.user.handle,
    userImage: req.user.imageUrl,
    createdAt: new Date().toISOString(), //set current date as iso string
    likeCount: 0, //set like count
    commentCount: 0 //set comment count
  };

  //create a new document with the post data
  db.collection("posts")
    .add(newPost)
    .then((doc) => {
      const resPost = newPost;
      resPost.postId = doc.id;
      res.json(resPost);
    })
    .catch((err) => {
      //return a 500 response if something goes wrong
      res.status(500).json({ error: "Something went wrong" });
      console.error(err);
    });
};
//Get a specific post by id
exports.getPost = (req, res) => {
  let postData = {};
  //get post based off the id
  db.doc(`/posts/${req.params.postId}`)
    .get()
    .then((doc) => {
      //check if the post exists
      if (!doc.exists) {
        return res.status(404).json({ error: "Post not found" }); //return 404 if the post doesn't exist
      }
      postData = doc.data();
      postData.postId = doc.id;
      //get a collection of comments based on post id
      return db
        .collection("comments")
        .orderBy("createdAt", "desc")
        .where("postId", "==", req.params.postId)
        .get();
    })
    .then((data) => {
      postData.comments = [];
      data.forEach((doc) => {
        postData.comments.push(doc.data());
      });
      return res.json(postData);
    })
    .catch((err) => {
      //return a 500 response if something goes wrong
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};
//Create a comment on a post
exports.commentOnPost = (req, res) => {
  //check if comment body is empty
  if (req.body.body.trim() === ""){
    return res.status(400).json({ comment: "Must not be empty" });
  }

  //create a new comment with the user info and post id
  const newComment = {
    body: req.body.body,
    createdAt: new Date().toISOString(), //set current date as iso string
    postId: req.params.postId,
    userHandle: req.user.handle,
    userImage: req.user.imageUrl
  }

  //get post by id
  db.doc(`/posts/${req.params.postId}`)
    .get()
    .then((doc) => {
      //check if the post exists
      if (!doc.exists) {
        return res.status(404).json({ error: "Post not found" });
      }
      //increment the comment count
      return doc.ref.update({ commentCount: doc.data().commentCount + 1 });
    })
    .then(() => {
      return db.collection("comments").add(newComment); //add the comment
    })
    .then(() => {
      res.json(newComment); //return comment as json
    })
    .catch((err) => {
      //return 500 response if something goes wrong
      console.log(err);
      res.status(500).json({ error: "Something went wrong" });
    });
};
//Like a post
exports.likePost = (req, res) => {
  //create the like
  const likeDocument = db
    .collection("likes")
    .where("userHandle", "==", req.user.handle)
    .where("postId", "==", req.params.postId)
    .limit(1);

  //get the post
  const postDocument = db.doc(`/posts/${req.params.postId}`);

  let postData;

  postDocument
    .get()
    .then((doc) => {
      //check if the post exists
      if (doc.exists) {
        postData = doc.data();
        postData.postId = doc.id;
        return likeDocument.get();
      } else {
        return res.status(404).json({ error: "Post not found" }); //return 404 if it doesn't exist
      }
    })
    .then((data) => {
      //check if the post is already liked
      if (data.empty) {
        //add the like
        return db
          .collection("likes")
          .add({
            postId: req.params.postId,
            userHandle: req.user.handle,
          })
          .then(() => {
            //increment like count on the post
            postData.likeCount++;
            return postDocument.update({ likeCount: postData.likeCount });
          })
          .then(() => {
            return res.json(postData); //return post data as json
          });
      } else {
        return res.status(400).json({ error: "Post already liked" });
      }
    })
    .catch((err) => {
      //return 500 response if something goes wrong
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};
//Unlike a post
exports.unlikePost = (req, res) => {
  //create the like
  const likeDocument = db
    .collection("likes")
    .where("userHandle", "==", req.user.handle)
    .where("postId", "==", req.params.postId)
    .limit(1);

  //get the post by id
  const postDocument = db.doc(`/posts/${req.params.postId}`);

  let postData;

  postDocument
    .get()
    .then((doc) => {
      //check if the post exists
      if (doc.exists) {
        postData = doc.data();
        postData.postId = doc.id;
        return likeDocument.get();
      } else {
        return res.status(404).json({ error: "Post not found" });
      }
    })
    .then((data) => {
      //check if the post is already not liked
      if (data.empty) {
        return res.status(400).json({ error: "Post not liked" });
      } else {
        //delete the like from the post
        return db
          .doc(`/likes/${data.docs[0].id}`)
          .delete()
          .then(() => {
            //decrement like count from the post
            postData.likeCount--;
            return postDocument.update({ likeCount: postData.likeCount });
          })
          .then(() => {
            res.json(postData); //return post data as json
          });
      }
    })
    .catch((err) => {
      //return 500 response if something goes wrong
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};
// Delete a post
exports.deletePost = (req, res) => {
  //get post by id
  const document = db.doc(`/posts/${req.params.postId}`);
  document
    .get()
    .then((doc) => {
      //check if the post exists
      if (!doc.exists) {
        return res.status(404).json({ error: "Post not found" });
      }
      //check if the user that created the post is the user trying to delete the post
      if (doc.data().userHandle !== req.user.handle) {
        //return 403 if its not the right user
        return res.status(403).json({ error: "Unauthorized" });
      } else {
        //else delete the post
        return document.delete();
      }
    })
    .then(() => {
      res.json({ message: "Post deleted successfully" });
    })
    .catch((err) => {
      //return a 500 response if something goes wrong
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};
