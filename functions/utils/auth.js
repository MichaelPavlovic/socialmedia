const { db, admin } = require("./admin");

//Authenticated layer to check if the user is logged in before accessing specific endpoints
module.exports = (request, response, next) => {
  let idToken;
  //check for the authorization token in the request headers
  if(request.headers.authorization && request.headers.authorization.startsWith("Bearer ")) {
    idToken = request.headers.authorization.split("Bearer ")[1];
  } else {
    //return a 403 response if there is no token
    console.error("No token found");
    return response.status(403).json({ error: "Unauthorized" });
  }
  //attempt to verify the token
  admin
    .auth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      request.user = decodedToken;
      return db
        .collection("users")
        .where("userId", "==", request.user.uid)
        .limit(1)
        .get();
    })
    .then((data) => {
      request.user.handle = data.docs[0].data().handle;
      request.user.imageUrl = data.docs[0].data().imageUrl;
      return next();
    })
    .catch((err) => {
      //return a 403 respoonse if the token could not be verified
      console.error("Error while verifying token", err);
      return response.status(403).json(err);
    });
};
