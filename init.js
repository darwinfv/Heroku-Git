
 var admin = require("firebase-admin");

 var serviceAccount = require("./pair-ab7d0-firebase-adminsdk-3wjxh-99b0bb40ab.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://pair-ab7d0.firebaseio.com"
});
