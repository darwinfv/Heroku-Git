//listening to server
var express = require('express');
var app = express();
var port = 9090;
var axios = require('axios');
var create = require('./create.js')
var bodyParser = require('body-parser');
var crypto = require('crypto');

//setting up dtaabase
var admin = require("firebase-admin");
//var firebase_app = admin.initializeApp();
//serviceAccount
var serviceAccount = require("./pair-ab7d0-firebase-adminsdk-3wjxh-99b0bb40ab.json");
//initializeApp
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://pair-ab7d0.firebaseio.com"
});

//get a database reference
var db = admin.database();
var ref = db.ref("/NEW");
var companyRef = db.ref("/Company");
var internRef = db.ref("/User");

function test()
{
      create.createCompany(companyRef, 'GOGGLE', listOfLocations = "novalue", listOfEmployees = "novalue");
      create.createIntern(internRef,'Hiten','Rathod', 'HIHELLO123','hitenrathod98@gmail.com','Purdue');
      var test = ref.child("NEW_HITEN");
      test.set({
        Hiten: {
        date_of_birth: "May 30, 1998",
        full_name: "Hiten Rathod"
      },
      Darwin: {
        date_of_birth: "Jan 11, 1999",
        full_name: "Darwin Vaz"
      }
    });
}

function verify(username,password) {
  //do the database calling
  //if(database_verify())
    return true;
  //else
  // return false;
}

function UID(username) {
  var uid = 0;
  for (i = 0; i < username.length; i++) {
    var char = username.charCodeAt(i);
    //52 chars (lower and upper letters + 10 digits)
    uid = (uid * 62) + char;
  }
  return(String(uid));
}


app.use(bodyParser.json());

app.post('/LOGIN',function( req, res) {
  console.log('Received the request');
  console.log(req.body);

  //verify the values:
  //send UID and ENCRYPTED PASSWORD to verify
  //create ENCRYPTED PASSWORD
  var pass_shasum = crypto.createHash('sha256').update(req.body.password).digest('hex');

  //print things out
  console.log("ENCRYPTED PASSWORD");
  console.log(pass_shasum);

  //create UID
  console.log("UID for user");
  var uid = UID(req.body.username);
  console.log(uid);

  //create uids for interns and employees
  //for interns:
  var actual_uid_intern = "0" + uid;
  //for employees:
  var actual_uid_employee = "1" + uid;

  //print out values
  console.log("UID FOR INTERN");
  console.log(actual_pass_intern);
  console.log("UID FOR EMPLOYEE");
  console.log(actual_pass_employee);

  //check and return
  if(verify(actual_uid_intern, pass_shasum)))
  {
    //make the login token
    res.json({
      "userID": actual_uid_intern
    });
  } else if(verify(actual_uid_employee, pass_shasum))
  {
    //make the login token
    res.json({
      "userID": actual_uid_employee
    });
  }
  else {
    res.json({
      "userID": null
    });
  }

  console.log('Done printing the request');
});

app.post('/REGISTER',function( req, res) {

  //verifyUserExists();
  //if(!verifyUserExists())
  //do registering shit

  
  var STATUS = false;
  res.json({
    //check for errors from database:
    //if(!error)
    "STATUS": "SUCCESSFUL"
    //else
    //"STATUS": "ERROR CODE" + error
  });
});

app.post('/GET-MASTER-LIST',function( req, res) {
  res.json({
    //check for authority
    //if(authority)
    //get appropriate master list
    "LIST": ["Adam", "Arvindh", "Darwin", "Hiten", "Kunal"]
    //else
    //"STATUS": "ERROR CODE" + error
  });
});



app.listen(port, function () {
  console.log('Testing adding to database');
  test();
  console.log('Testing done');
  console.log('Database setup done');
  console.log('App listening on port: ' + port + '!');
});
