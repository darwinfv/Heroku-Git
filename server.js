//dependencies:
module.exports = {
  UID
}
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


function test2() {

}
//test-function
function test() {
  //create an intern
  create.createIntern(internRef, "1" + UID("darwin@gmail.com"), "darwin@gmail.com", "Goggle", "San Fran");

  //create a basic password
  var pass_shasum = encrypt("something");//crypto.createHash('sha256').update("vaz").digest('hex');

  //create psuedo preferences
  create.createBasicPreferences(internRef,"1" + UID("darwin@gmail.com"), "Darwin", "Vaz", "yeah, cool description", "dv@fb.com", "dv@t.com", "dv@linked.in");

  //create basic employee
  create.createEmployee(employeeRef, companyRef,"2" + UID("hiten@gmail.com"), "hiten", "rathod", pass_shasum, "hiten@gmail.com", "Goggle", "San Fran", "bio, gotta be fast like Sanic", "hiten@fb.com", "hiten@linkedin.com", "");

  //create a psuedo intern
  create.createIntern(internRef, "1" + UID("arvindh@gmail.com"), "arvindh@gmail.com", "Carrot", "novalue");

  //create basic preferences for a different intern
  create.createBasicPreferences(internRef,"1" + UID("arvindh@gmail.com"), "ED", "Bob", "not yeah", "asv@fb.com", "asv@t.com", "asv@linkedin.com");

  //create password for arvindh
  create.createPassword(internRef, "1" + UID("arvindh@gmail.com"), pass_shasum);

  //create possword for darwin:
  create.createPassword(internRef, "1" + UID("darwin@gmail.com"), pass_shasum);

  console.log('reading preferences for:');
  console.log("1" + UID("darwin@gmail.com"));
  console.log('basic preferences:');
  read.getBasicPreferences(internRef, "1" + UID("darwin@gmail.com"), (x) => {
    console.log('Printing out prefs');
    console.log(x);
  });
  console.log('reading company: pin 3135');
  read.getCompany(companyRef, "3135", (x) =>{
    console.log('Printing out company name');
    var name = x[0];
    console.log(name);
    var location = x.splice(1);
    console.log('Printing names');
    console.log(location);
  });

  console.log('adding random names');

  //create an intern2
  create.createIntern(internRef, "1" + UID("adam@gmail.com"), "adam@gmail.com", "Carrot", "IN");
  create.createPassword(internRef, "1" + UID("adam@gmail.com"), pass_shasum);
  //create psuedo preferences
  create.createBasicPreferences(internRef,"1" + UID("adam@gmail.com"), "Adam", "Kogut", "yeah, bro I am ded", "ak@fb.com", "ak@t.com", "ak@linked.in");


  //create an intern3
  create.createIntern(internRef, "1" + UID("kunal@gmail.com"), "kunal@gmail.com", "Goggle", "San Fran");
  create.createPassword(internRef, "1" + UID("kunal@gmail.com"), pass_shasum);

  //create psuedo preferences
  create.createBasicPreferences(internRef,"1" + UID("kunal@gmail.com"), "Kunal", "Sinha", "yeah, bro", "ks@fb.com", "ks@t.com", "ks@linked.in");

  //delete intern
  /*update.removeIntern(internRef, 1258, encrypt("something"), (x) => {
    console.log("success");
  });*/
}

//encrypt password
function encrypt(password) {
  var cipher = password;
  var actual = "";
  for(i = 0; i < password.length;i++) {
    console.log((password.charCodeAt(i)*941)%16);
    actual = actual + ((password.charCodeAt(i)*941)%16).toString(16);
  }
  //return cipher
  return actual;
}

//create UID
function UID(username) {
  var uid = 0;
  for (i = 0; i < username.length; i++) {
    var char = username.charCodeAt(i);
    //52 chars (lower and upper letters + 10 digits)
    uid = (uid * 941) % 742 + char;
  }
  return (String(uid));
}

//set bodyParser
app.use(bodyParser.json());

//login handler
app.post('/LOGIN', function (req, res) {
  console.log('Received request for LOGIN:');
  console.log(req.body);

  //verify the values:
  //send UID and ENCRYPTED PASSWORD to verify
  //create ENCRYPTED PASSWORD
  var pass_shasum = encrypt(req.body.password);//crypto.createHash('sha256').update(req.body.password).digest('hex');

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
  read.verifyIntern(internRef, actual_uid_intern, pass_shasum, (x) => {
    console.log(x);
    //make the login token
    if (x != null)
      res.json({
        "userID": actual_uid_intern
      });
    console.log("updated from intern");
  });
  read.verifyEmployee(employeeRef, actual_uid_employee, pass_shasum, (x) => {
    console.log(x);
    //make the login token
    if (x != null)
      res.json({
        "userID": actual_uid_employee
      });
    console.log("updated from employee");
  });

  //return null
  console.log('Done handling login');
});

//intial set password request handler for intern
app.post('/SET-INTERN-PASSWORD', function (req, res) {
  console.log('Received request for SET-PASSWORD-INTERN:');
  console.log(req.body);

  //create UID (0 for interns)
  console.log("UID generated:");
  var uid = UID(req.body.username);
  console.log(uid);

  //create intern uid
  var intern_uid = "1" + uid;
  var pass = encrypt(req.body.password);
  create.createPassword(internRef, intern_uid, pass);
  res.json({
    "status": true
  });
});

//forgot password handler
app.post('/FORGOT-INTERN-PASSWORD', function (req, res) {
  console.log('Received request for FORGOT-PASSWORD-INTERN:');
  console.log(req.body);

  //create UID (0 for interns)
  console.log("UID generated:");
  var uid = UID(req.body.username);
  console.log(uid);

  //create intern uid
  var intern_uid = "1" + uid;
  var pass = encrypt(req.body.newPassword);
  create.createPassword(internRef, intern_uid, pass);
  res.json({
    "status": true
  });
});

//reset password handler
app.post('/RESET-PASSWORD', function (req, res) {
  console.log('Received request for RESET-PASSWORD:');
  console.log(req.body);

  //create UID (0 for interns)
  console.log("UID received:");
  var uid = req.body.userID;
  console.log(uid);

  //password
  var pass = encrypt(req.body.newPassword);

  if(uid.charAt(0) == '1')
  {
    create.createPassword(internRef, uid, pass);
    res.json({
      "status": true
    });
  }
  else if(uid.charAt(0) == '2')
  {
    create.createPassword(employeeRef, uid, pass);
    res.json({
      "status": true
    });
  }
  else{
    res.json({
      "status": false
    });
  }
});

//initial set password for employee
app.post('/SET-EMPLOYEE-PASSWORD', function (req, res) {
  console.log('Received request for SET-PASSWORD-EMPLOYEE:');
  console.log(req.body);

  //create UID (0 for interns)
  console.log("UID generated:");
  var uid = UID(req.body.username);
  console.log(uid);

  //create intern uid
  var employee_uid = "2" + uid;
  var pass = encrypt(req.body.password);
  create.createPassword(employeeRef, employee_uid, pass);
  res.json({
    "status": true
  });
});

//remove user handler
app.post('/REMOVE-USER', function (req, res) {
  console.log('Received request for REMOVE-USER:');
  console.log(req.body);

  //create UID (0 for interns)
  console.log("UID received:");
  var uid = req.body.userID;
  console.log(uid);

  update.removeIntern(internRef, uid, (x) => {
    if (x != false)
    {
      res.json({
        "status": true
      });
    }
    else {
      res.json({
        "status": false
      });
    }
  });
});

//get company
app.post('/GET-COMPANY', function (req, res) {
  console.log('Received request for GET-COMPANY:');
  console.log(req.body);

  //create UID (0 for interns)
  console.log("UID generated:");
  var pin = req.body.pid;
  console.log(pin);

  read.getCompany(companyRef, pin, (x) => {
    if (x != null) {
        console.log(x[0]);
        var y = x.splice(1);
        console.log(y);
        res.json({
        "company": x[0],
        "location": y,
        "status": true
        });
    }
  });
});

//get basic preferences
app.post('/GET-PREFERENCES/BASIC-PREFERENCES', function (req, res) {
  console.log('Received request for BAISC PREFERENCES:');
  console.log(req.body);

  //create UID (0 for interns)
  console.log("UID received:");
  var uid = req.body.uid;
  console.log(uid);

  //create intern uid
  read.getBasicPreferences(internRef, uid, (x) => {
    if (x != null)
      console.log(x);
    res.json({
      "basic": x
    });
  });
});

//get housing PREFERENCES
app.post('/GET-PREFERENCES/HOUSING-PREFERENCES', function (req, res) {
  console.log('Received request for HOUSING PREFERENCES:');
  console.log(req.body);

  //create UID (0 for interns)
  console.log("UID received:");
  var uid = req.body.userID;
  console.log(uid);

  //create intern uid
  read.getHousingPreferences(internRef, uid, (x) => {
    if (x != null)
      res.json({
        "housing": x
      });
  });
});

//get roommate preferences
app.post('/GET-PREFERENCES/ROOMMATE-PREFERENCES', function (req, res) {
  console.log('Received request for ROOMMATE PREFERENCES:');
  console.log(req.body);

  //create UID (0 for interns)
  console.log("UID received:");
  var uid = req.body.userID;
  console.log(uid);

  //create intern uid
  read.getRoommatePreferences(internRef, uid, (x) => {
    if (x != null)
      res.json({
        "roommate": x
      });
  });
});

//create employee hadnler
app.post('/CREATE-EMPLOYEE', function (req, res) {
  console.log('Received request for CREATE-EMPLOYEE:');
  console.log(req.body);

  //create UID (0 for interns)
  console.log("UID generated:");
  console.log(uid);

  //create intern uid
  var employee_uid = "2" + uid;
  var pass = encrypt(req.body.password);

  //store variables
  var uid = "2" + UID(req.body.username);
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var password = encrypt(req.body.password);
  var email = req.body.username;
  var company = req.body.company;
  var location = req.body.location;
  var description = req.body.description;
  var facebook = req.body.facebook;
  var linkedin = req.body.linkedin;
  var twitter = req.body.twitter;

  create.createEmployee(employeeRef, companyRef, uid, firstName, lastName, password, email, company, location, description, facebook, linkedin, twitter);

  //create.createEmployee(employeeRef, employee_uid, req.body.password);
  res.json({
    "userID": uid,
    "status": true
  });
});

//initial create intern
app.post('/CREATE-INTERN', function (req, res) {
  console.log('Received request for CREATE-INTERN:');
  console.log(req.body);

  //create UID (0 for interns)
  console.log("UID generated:");
  var uid = "1" + UID(req.body.username);
  console.log(uid);
  var location = req.body.location;
  var company = req.body.company;
  create.createIntern(internRef, uid, req.body.username, company, location);
  res.json({
    "status": true
  });
});

//intial set preferences request handler
app.post('/UPDATE-PREFERENCES/BASIC-PREFERENCES', function (req, res) {
  console.log('Received request for /UPDATE-PREFERENCES/BASIC-PREFERENCES:');
  console.log(req.body);

  //create UID (0 for interns)
  console.log("UID generated:");
  var uid = req.body.userID;
  console.log(uid);

  //create intern uid
  var intern_uid = uid;
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var description = req.body.description;
  var fbLink = req.body.fbLink;
  var twitterLink = req.body.twitterLink;
  var linkedin = req.body.linkedInLink;
  create.createBasicPreferences(internRef, intern_uid, firstName, lastName, description, fbLink, twitterLink, linkedin);
  res.json({
    "status": true
  });
});

//initial Roommate preferences
app.post('/UPDATE-PREFERENCES/ROOMMATE-PREFERENCES', function (req, res) {
  console.log('Received request for /UPDATE-PREFERENCES/ROOMMATE-PREFERENCES:');
  console.log(req.body);

  //create UID (0 for interns)
  console.log("UID generated:");
  var uid = req.body.userID;
  console.log(uid);

  //create intern uid
  var intern_uid = uid;
  var youguest = req.body.youguest;
  var themguest = req.body.themguest;
  var youpet = req.body.youpet;
  var thempet = req.body.thempet;
  var sharing = req.body.sharing;
  var smoke = req.body.smoke;
  var bedtime = req.body.bedtime;
  var waketime = req.body.waketime;
  var lights = req.body.lights;
  var clean = req.body.clean;
  create.createRoommatePreferences(internRef, intern_uid, youguest, themguest, youpet, thempet, sharing, smoke, bedtime, waketime, lights, clean);
  res.json({
    "status": true
  });
});

//initial Housing preferences
app.post('/UPDATE-PREFERENCES/HOUSING-PREFERENCES', function (req, res) {
  console.log('Received request for /UPDATE-PREFERENCES/HOUSING-PREFERENCES:');
  console.log(req.body);

  //create UID (0 for interns)
  console.log("UID generated:");
  var uid = req.body.userID;
  console.log(uid);

  //create intern uid
  var intern_uid = uid;

  create.createHousingPreferences(internRef, intern_uid, req.body.desiredPrice, req.body.desiredRoommates, req.body.desiredDistance, req.body.desiredDuration);
  res.json({
    "status": true
  });
});

//reverse hashing
function revUID(uid) {
  console.log(uid);
  var email = "";
  while (uid != 0) {
    var char = uid % 281;
    console.log(char);
    email = email + String.fromCharCode(char);
    console.log(email);
    uid = (uid / 281 >> 0);
  }
}

//get email back from uid
app.post('/GET-EMAIL', function (req, res) {
  console.log('Received request for /GET-EMAIL:');
  console.log(req.body);

  //create UID (0 for interns)
  console.log("email generated:");
  var uid = req.body.userID;
  //uid = uid.substring(1,uid.length);
  //var email = revUID(uid);

  //create intern uid
  read.getIntern(internRef, uid, (x) => {
    console.log(x[1]);
    res.json({
      "email": x[1]
    });
  });
});

//get intern handler
app.post('/GET-INTERN', function (req, res) {
  console.log('Received request for /GET-INTERN:');
  console.log(req.body);

  //create UID (0 for interns)
  console.log("email generated:");
  var uid = req.body.userID;
  //uid = uid.substring(1,uid.length);
  //var email = revUID(uid);

  //create intern uid
  read.getIntern(internRef, uid, (x) => {
    console.log(x);
    res.json({
      "email": x
    });
  });
});

//forgot password for employee
app.post('/FORGOT-EMPLOYEE-PASSWORD', function (req, res) {
  console.log('Received request for FORGOT-PASSWORD-EMPLOYEE:');
  console.log(req.body);

  //create UID (0 for interns)
  console.log("UID generated:");
  var uid = UID(req.body.username);
  console.log(uid);

  //create intern uid
  var employee_uid = "2" + uid;
  var pass = encrypt(req.body.password);
  create.createPassword(employeeRef, employee_uid, pass);
  res.json({
    "status": true
  });
});

//forgot password request handler
app.post('/FORGOT-INTERN-PASSWORD', function (req, res) {
  console.log('Received request for FORGOT-PASSWORD-INTERN:');
  console.log(req.body);

  //create UID (0 for interns)
  console.log("UID generated:");
  var uid = UID(req.body.username);
  console.log(uid);

  //create intern uid
  var intern_uid = "1" + uid;
  var pass = encrypt(req.body.password);
  create.createPassword(internRef, intern_uid, pass);
  res.json({
    "status": true
  });
});

app.post('/GET-EMPLOYEE', function (req, res) {
  console.log('Received request for EMPLOYEE:');
  console.log(req.body);

  //create UID (0 for interns)
  console.log("UID received:");
  var uid = req.body.userID;
  console.log(uid);

  //create intern uid
  read.getEmployee(employeeRef, uid, (x) => {
    if (x != null)
      console.log(x);
    res.json({
      "employee": x
    });
  });
});

//master list handler
app.post('/GET-MASTER-LIST', function (req, res) {
  console.log("Master list request received");
  console.log(req.body)
  //check for authority
  //if(authority)
  //get appropriate master list
  if (req.body.userID.charAt(0) == '1') {
    res.json({
      "status": false
    });
    return;
  }
  else {
    read.getEmployee(employeeRef, req.body.userID, (x) => {
      console.log(x[0]);
      read.getMasterListOfInterns(internRef, x[0], (y) => {
        console.log(y);
        console.log("Master list printed");
        res.json({
          "userId": req.body.userID,
          "list": y
        });
      }

      );
    });

  }
});

var y;
app.listen(port, function () {

  //call test
  console.log('Testing begins, check database');
  test();
  console.log('Testing done');
  console.log('Database setup done');
  console.log('App listening on port: ' + port + '!');
});
