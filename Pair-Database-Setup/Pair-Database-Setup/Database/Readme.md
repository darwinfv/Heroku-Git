Database started code written in Firebase


Service account
firebase-adminsdk-3wjxh@pair-ab7d0.iam.gserviceaccount.com


var admin = require("firebase-admin");

var serviceAccount = require("path/to/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://pair-ab7d0.firebaseio.com"
});


