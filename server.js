//dependencies:

//server dependencies
var express = require('express');
var app = express();
var port = 9090;
var axios = require('axios');
var bodyParser = require('body-parser');

//security dependencies
var crypto = require('crypto');

//database dependencies
var update = require('./Pair-Database-Setup/Database/update.js');
var read = require('./Pair-Database-Setup/Database/read.js');
var create = require('./Pair-Database-Setup/Database/create.js');

//setting up dtaabase
var admin = require("firebase-admin");

//uncomment if first time
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
var baseRef = db.ref("/");
var companyRef = db.ref("/Company");
var internRef = db.ref("/User/Interns");
var employeeRef = db.ref("/User/Employees");

function test() {
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

function verifyIntern(username, password) {
  return read.verifyIntern(internRef, username, password);
}

function verifyEmployee(username, password) {
  return read.verifyIntern(employeeRef, username, password);
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

//set bodyParser
app.use(bodyParser.json());

//login handler
app.post('/LOGIN', function(req, res) {
  console.log('Received request for LOGIN:');
  console.log(req.body);

  //verify the values:
  //send UID and ENCRYPTED PASSWORD to verify
  //create ENCRYPTED PASSWORD
  var pass_shasum = req.body.password;//crypto.createHash('sha256').update(req.body.password).digest('hex');

  //print things out
  console.log("ENCRYPTED PASSWORD");
  console.log(pass_shasum);

  //create UID
  console.log("UID generated:");
  var uid = UID(req.body.username);
  console.log(uid);

  //create uids for interns and employees
  //for interns:
  var actual_uid_intern = "1" + uid;
  //for employees:
  var actual_uid_employee = "2" + uid;

  //print out values
  console.log("UID FOR INTERN");
  console.log(actual_uid_intern);
  console.log("UID FOR EMPLOYEE");
  console.log(actual_uid_employee);

  //check and return
  read.verifyIntern(internRef, actual_uid_intern, "vaz", (x) =>
  {
    console.log(x);
    //make the login token
    /*res.json({
      "userID": actual_uid_intern
    });*/
  });
  read.verifyEmployee(employeeRef, actual_uid_employee, "vaz", (x) =>
  {
    console.log(x);
    //make the login token
    /*res.json({
      "userID": actual_uid_employee
    });*/
  });

  console.log('Done handling login');
});

//intial set password request handler
app.post('/SET-INTERN-PASSWORD', function(req, res) {
  console.log('Received request for SET-PASSWORD-INTERN:');
  console.log(req.body);

  //create UID (0 for interns)
  console.log("UID generated:");
  var uid = UID(req.body.username);
  console.log(uid);

  //create intern uid
  var intern_uid = "0" + uid;
  var pass = req.body.password;
  create.createPassword(internRef, intern_uid, req.body.password);
  res.json({
      "status": true
  });
});

//initial set password for employee
app.post('/SET-EMPLOYEE-PASSWORD', function(req, res) {
  console.log('Received request for SET-PASSWORD-EMPLOYEE:');
  console.log(req.body);

  //create UID (0 for interns)
  console.log("UID generated:");
  var uid = UID(req.body.username);
  console.log(uid);

  //create intern uid
  var employee_uid = "1" + uid;
  var pass = req.body.password;
  create.createPassword(employeeRef, employee_uid, req.body.password);
  res.json({
      "status": true
  });
});

//initial create intern
app.post('/CREATE-INTERN', function(req, res) {
  console.log('Received request for CREATE-INTERN:');
  console.log(req.body);

  //create UID (0 for interns)
  console.log("UID generated:");
  var uid = "0" + UID(req.body.username);
  console.log(uid);
  var location = req.body.location;
  var company = req.body.company;
  create.createIntern(internRef, uid, req.body.username, company, location);
  res.json({
      "status": true
  });
});

//register handler
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

//intial set preferences request handler
app.post('/UPDATE-PREFERENCES/BASIC-PREFERENCES', function(req, res) {
  console.log('Received request for /UPDATE-PREFERENCES/BASIC-PREFERENCES:');
  console.log(req.body);

  //create UID (0 for interns)
  console.log("UID generated:");
  var uid = UID(req.body.username);
  console.log(uid);

  //create intern uid
  var intern_uid = "0" + uid;
  var pass = req.body.password;
  create.createBasicPreferences(internRef, intern_uid, options);
  res.json({
      "status": true
  });
});

//initial Roommate preferences
app.post('/UPDATE-PREFERENCES/ROOMMATE-PREFERENCES', function(req, res) {
  console.log('Received request for /UPDATE-PREFERENCES/ROOMMATE-PREFERENCES:');
  console.log(req.body);

  //create UID (0 for interns)
  console.log("UID generated:");
  var uid = UID(req.body.username);
  console.log(uid);

  //create intern uid
  var intern_uid = "0" + uid;
  var pass = req.body.password;
  create.createRoommatePreferences(internRef, intern_uid, options);
  res.json({
      "status": true
  });
});

//initial Housing preferences
app.post('/UPDATE-PREFERENCES/HOUSING-PREFERENCES', function(req, res) {
  console.log('Received request for /UPDATE-PREFERENCES/HOUSING-PREFERENCES:');
  console.log(req.body);

  //create UID (0 for interns)
  console.log("UID generated:");
  var uid = UID(req.body.username);
  console.log(uid);

  //create intern uid
  var intern_uid = "0" + uid;
  var pass = req.body.password;
  create.createHousingPreferences(internRef, intern_uid, options);
  res.json({
      "status": true
  });
});

//reverse hashing
function revUID(uid) {
  var email = "";
  while(uid != 0) {
    var char = uid%62;
    email = email + String.fromCharCode(char);
    uid = (uid/62>>0);
  }
}

//get email back from uid
app.post('/GET-EMAIL', function(req, res) {
  console.log('Received request for /GET-EMAIL:');
  console.log(req.body);

  //create UID (0 for interns)
  console.log("email generated:");
  var uid = req.body.userID;
  uid = uid.substring(1,uid.length);
  var email = revUID(uid);
  console.log(email);

  //create intern uid
  res.json({
      "email": email
  });
});

//forgot password for employee
app.post('/FORGOT-EMPLOYEE-PASSWORD', function(req, res) {
  console.log('Received request for FORGOT-PASSWORD-EMPLOYEE:');
  console.log(req.body);

  //create UID (0 for interns)
  console.log("UID generated:");
  var uid = UID(req.body.username);
  console.log(uid);

  //create intern uid
  var employee_uid = "1" + uid;
  var pass = req.body.password;
  create.createPassword(employeeRef, employee_uid, req.body.password);
  res.json({
      "status": true
  });
});

//forgot password request handler
app.post('/FORGOT-INTERN-PASSWORD', function(req, res) {
  console.log('Received request for FORGOT-PASSWORD-INTERN:');
  console.log(req.body);

  //create UID (0 for interns)
  console.log("UID generated:");
  var uid = UID(req.body.username);
  console.log(uid);

  //create intern uid
  var intern_uid = "0" + uid;
  var pass = req.body.password;
  create.createPassword(internRef, intern_uid, req.body.password);
  res.json({
      "status": true
  });
});

//master list handler
app.post('/GET-MASTER-LIST',function( req, res) {
  console.log("Master list request received");
  res.json({
    //check for authority
    //if(authority)
    //get appropriate master list
    "LIST": ["Adam", "Arvindh", "Darwin", "Hiten", "Kunal"]
    //else
    //"STATUS": "ERROR CODE" + error
  });
});

var y;
app.listen(port, function () {
  create.createIntern(internRef, 11711362612, "r@pur.c", "company", "novalue");
  var pass_shasum = "vaz";//crypto.createHash('sha256').update("vaz").digest('hex');
  create.createEmployee(employeeRef, 21711362612,"hey", "rathod",pass_shasum, "r@pur.c", "company", "loc", "bio", "fb", "linkin", "twit");
  create.createPassword(internRef, 11711362612, pass_shasum);
//test();
  var z = read.verifyIntern(internRef, "DJW3e123", "password", function(z) {
    console.log(z);
    //some shit on z
    //return zyz
  });

  var xyz = read.getIntern(internRef, "12345");
  console.log('Testing done');
  console.log('Database setup done');
  console.log('App listening on port: ' + port + '!');
});
