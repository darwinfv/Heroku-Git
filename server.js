//dependencies:
//server dependencies
const express = require('express');
const app = express();
var port =  (process.env.PORT || 9090);
//var axios = require('axios');
const bodyParser = require('body-parser');

//security dependencies
var crypto = require('crypto');

//database dependencies
var read = require('./Pair-Database-Setup/Database/read.js');
var create = require('./Pair-Database-Setup/Database/create.js');
var update = require('./Pair-Database-Setup/Database/update.js');

//setting up dtaabase
var admin = require("firebase-admin");

/*const storage = googleStorage({
  projectId: "pair-ab7d0",
  keyFilename: "./pair-ab7d0-firebase-adminsdk-3wjxh-99b0bb40ab.json"
});
const bucket = storage.bucket("pair-ab7d0.appspot.com/");
*/


//setting up CORS
//app.use(express.methodOverride());
// ## CORS middleware
//
// see: http://stackoverflow.com/questions/7067966/how-to-allow-cors-in-express-nodejs
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};
app.use(allowCrossDomain);


//houses
var houses = {};
houses["CA"] = {};
houses["NY"] = {};
houses["TX"] = {};

//filtered
var filteredHouses = {};
filteredHouses["CA"] = {};
filteredHouses["NY"] = {};
filteredHouses["TX"] = {};

//previous filters
var prevFilters = {
  "minsqft": -1,
  "maxsqft": -1,
  "minPrice": -1,
  "maxPrice": -1,
  "minBedrooms": -1,
  "maxBedrooms": -1,
  "minBathrooms": -1,
  "maxBathrooms": -1,
  "state": ""
};

//addresses
var addresses = {};


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

//set up references
var companyRef = db.ref("/Company");
var internRef = db.ref("/User/Interns");
var employeeRef = db.ref("/User/Employees");
var chatroomRef = db.ref("/ChatRooms");
var groupChatRoomRef = db.ref("/ChatRooms/Group");
var privateChatRoomRef = db.ref("/ChatRooms/Private");
var locationChatRoomRef = db.ref("/ChatRooms/Location");
var companyChatRoomRef = db.ref("/ChatRooms/Company");
var adminRef = db.ref("/Admin");
var houseRef = db.ref("/Houses")

//set up zillow:
var Zillow = require('node-zillow');
//Instantiate
var zillow = new Zillow('X1-ZWz1gcc7xw62a3_3wguv');


//test-function
function test() {
  //create an intern
  create.createIntern(internRef, "1" + UID("darwin@gmail.com"), "darwin@gmail.com", "Goggle", "San Fran");

  //create a basic password
  var pass_shasum = encrypt("something");//crypto.createHash('sha256').update("vaz").digest('hex');

  //create psuedo preferences
  create.createBasicPreferences(internRef,"1" + UID("darwin@gmail.com"), "Darwin", "Vaz", "yeah, cool description", "dv@fb.com", "dv@t.com", "dv@linked.in");

  //create basic employee
  create.createEmployee(employeeRef, companyRef,"2" + UID("hiten@gmail.com"), "hiten", "rathod", pass_shasum, "hiten@gmail.com", "Goggle", "San Fran", "bio, gotta be fast like Sanic", "hiten@fb.com", "hiten@linkedin.com", "undefined");

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
    //console.log((password.charCodeAt(i)*941)%16);
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
    uid = (uid * 941) % 741 + char;
  }
  return (String(uid));
}

//set bodyParser
app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.send('Hello');
})

//login handler
app.post('/LOGIN', function (req, res) {
  console.log('Received request for LOGIN:');
  console.log(req.body);

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

  if(req.body.username == 'admin@pair.com' && req.body.password == 'password') {
    res.json({
      "status": true,
      "userID": 4000,
      "authority": "admin",
      "firstName": "Darwin",
      "lastName": "Vaz"
    })
  }
  else {
    read.verifyCompany(companyRef, req.body.username, pass_shasum, (z) => {
    if(z != false) {
      res.json({
        "userID" : z,
        "status": true,
        "authority": "company"
      });
    }
    else {
      //check and return
      read.verifyUser(internRef, actual_uid_intern, pass_shasum, (x) => {
        //make the login token
        if (x == true) {
          res.json({
            "userID": actual_uid_intern,
            "status": true,
            "authority": "intern"
          });
          console.log("intern: " + x);
        }
        else {
          read.verifyUser(employeeRef, actual_uid_employee, pass_shasum, (y) => {
            //make the login token
            if (y == true) {
              res.json({
                "userID": actual_uid_employee,
                "status": true,
                "authority": "employee"
              });
              console.log("employee: " + y);
            }
            else {
              res.json({
                "status": false
              });
            }
          });
        }
      });
    }
  });
  }
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
  var oldPass = encrypt(req.body.oldPassword);
  console.log(oldPass);

  if(uid.charAt(0) == '1') {
    update.updatePassword(internRef, uid, pass, oldPass, (x) => {
      if (x == true) {
        res.json({
          "status": true
        });
      }
      else {
        res.json({
          "status": false,
          "error": "wrong password"
        });
      }
    });
  }
  else if(uid.charAt(0) == '2') {
    update.updatePassword(employeeRef, uid, pass, oldPass, (x) => {
      if (x == true) {
        res.json({
          "status": true
        });
      }
      else {
        res.json({
          "status": false,
          "error": "wrong password"
        });
      }
    });
  }
  else{
    res.json({
      "status": false,
      "error": "user does not exist in database"
    });
  }
});

//FORGOT password handler
app.post('/FORGOT-PASSWORD', function (req, res) {
  console.log('Received request for RESET-PASSWORD:');
  console.log(req.body);

  //create UID (0 for interns)
  console.log("UID received:");
  var uid = UID(req.body.username);
  console.log(uid);

  //password
  var pass = encrypt(req.body.password);

  read.verifyUserExists(internRef,"1" + uid, (x) =>{
    if(x == true) {
      create.createPassword(internRef, "1" + uid, pass);
      res.json({
        "status": true,
        "userID": "1" + uid
      });
    }
    else {
      read.verifyUserExists(employeeRef,"2" + uid, (y) =>{
        if(y == true) {
          create.createPassword(employeeRef, "2" + uid, pass);
          res.json({
            "userID": "2" + uid,
            "status": true
          });
        }
        else {
          res.json({
            "status": false
          });
        }
      });
    }
  });
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

  update.removeIntern(internRef, chatroomRef, uid);
  update.removeEmployee(employeeRef, chatroomRef, companyRef, uid);
  res.json({
    "status": true
  });
});

//get company
app.post('/GET-COMPANY', function (req, res) {
  console.log('Received request for GET-COMPANY:');
  console.log(req.body);

  //create UID (0 for interns)
  console.log("PID generated:");
  var pin = req.body.pid;
  console.log(pin);

  read.getCompanyFromPin(companyRef, pin, (x) => {
    if (!isEmptyObject(x)) {
        x['status'] = 'true';
        console.log(x);
        //var y = x.splice(1);
        //console.log(y);
        res.send(x);
    }
    else {
      res.json ({
        "status": false,
        "error": "Company does not exist"
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
  var uid = req.body.userID;
  console.log(uid);

  //create intern uid
  read.getBasicPreferences(internRef, uid, (x) => {
    if (x != null)
      console.log(x);
    //res = x;
    res.send(x);
    /*res.json({
      "basic": x
    });*/
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
    {
      console.log(x);
      res.send(x);
    }
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
    {
      console.log(x);
      res.send(x);
    }
  });
});

//create employee hadnler
app.post('/CREATE-EMPLOYEE', function (req, res) {
  console.log('Received request for CREATE-EMPLOYEE:');
  console.log(req.body);


  var password = encrypt(req.body.password);

  //store variables
  var employee_uid = "2" + UID(req.body.username);
  //create UID (2 for employee)
  console.log("UID generated:");
  console.log(employee_uid);
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var email = req.body.username;
  var company = req.body.company;
  var location = req.body.location;
  var description = req.body.description;
  var facebook = req.body.facebook;
  var linkedin = req.body.linkedin;
  var twitter = req.body.twitter;

  create.createEmployee(employeeRef, companyRef, employee_uid, firstName, lastName, password, email, company, location, description, facebook, linkedin, twitter);
  create.addEmployeeToCompanyChat(companyChatRoomRef,employeeRef, company, location, employee_uid);
  update.updateEmployeeChatDetails(chatroomRef, employeeRef, employee_uid);
  //create.createEmployee(employeeRef, employee_uid, req.body.password);
  res.json({
    "userID": employee_uid,
    "status": true
  });
});

//create employee hadnler
app.post('/UPDATE-EMPLOYEE', function (req, res) {
  console.log('Received request for UPDATE-EMPLOYEE:');
  console.log(req.body);

  //store variables
  var employee_uid = req.body.userID;
  //create UID (2 for employee)
  console.log("UID generated:");
  console.log(employee_uid);
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var email = req.body.username;
  var company = req.body.company;
  var location = req.body.location;
  var description = req.body.description;
  var facebook = req.body.facebook;
  var linkedin = req.body.linkedin;
  var twitter = req.body.twitter;

  read.verifyUserExists(employeeRef, employee_uid, (x) => {
    if(x) {
      update.updateEmployee(employeeRef, employee_uid, firstName, lastName, location, description, facebook, linkedin, twitter);
      res.json({
        "userID": employee_uid,
        "status": true
      });
    } else {
      res.json({
        "status": false,
        "error": "UID does not exist"
      })
    }
  })
  update.updateEmployeeChatDetails(chatroomRef, employeeRef, employee_uid);
  //create.createEmployee(employeeRef, employee_uid, req.body.password);

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
  var endDate = req.body.endDate;
  var startDate = req.body.startDate;
  create.createIntern(internRef, uid, req.body.username, company, endDate, startDate, location);
  create.createBasicPreferences(internRef, uid, "undefined", "undefined", "undefined", "undefined", "undefined", "undefined");
  create.createRoommatePreferences(internRef, uid, "undefined", "undefined", "undefined", "undefined", "undefined", "undefined", "undefined", "undefined", "undefined", "undefined");
  create.createHousingPreferences(internRef, uid, "undefined", "undefined", "undefined", "undefined");
  create.addToLocationChat(locationChatRoomRef, internRef, location, uid);
  create.addInternToCompanyChat(companyChatRoomRef,internRef, company, location, uid);
  res.json({
    "userID": uid,
    "status": true
  });
});

//initial create company
app.post('/CREATE-COMPANY', function (req, res) {
  console.log('Received request for CREATE-COMPANY:');
  console.log(req.body);

  //create UID (0 for interns)
  var name = req.body.companyName;
  var listOfLocations = req.body.locations;
  var listOfEmployees = req.body.employees;
  var email = req.body.email;
  var password = encrypt(req.body.password);
  create.createCompany(adminRef, companyRef, name, email, password, listOfLocations, listOfEmployees);
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
  update.updateInternChatDetails(chatroomRef, internRef, uid);
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
  update.updateInternChatDetails(chatroomRef, internRef, uid);
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

  create.createHousingPreferences(internRef, intern_uid, req.body.desiredPrice, req.body.desiredRoommate, req.body.desiredDistance, req.body.desiredDuration);
  update.updateInternChatDetails(chatroomRef, internRef, uid);
  res.json({
    "status": true
  });
});

//check if user exists
app.post('/VERIFY-USER-EXISTS', function(req,res) {
  console.log("Received request for VERIFY-USER-EXISTS:");
  console.log(req.body);
  var uid = req.body.userID;
  if(uid.charAt(0) == '1')
  {
    read.verifyUserExists(internRef,uid, (x) =>{
      if(x == true)
      {
        res.json({
          "status": true
        });
      }
      else {
        {
          res.json({
            "status": false
          });
        }
      }
    });
  }
  else if(uid.charAt(0) == 2)
  {
    read.verifyUserExists(employeeRef,uid, (x) =>{
      if(x == true)
      {
        res.json({
          "status": true
        });
      }
      else {
        {
          res.json({
            "status": false
          });
        }
      }
    });
  }
});

//check if email exists
app.post('/VERIFY-EMAIL-EXISTS', function(req,res) {
  console.log("Received request for VERIFY-EMAIL-EXISTS:");
  console.log(req.body);
  var uid = UID(req.body.username);
  read.verifyUserExists(internRef,"1" + uid, (x) =>{
    if(x == true) {
      res.json({
        "status": true,
        "userID": "1" + uid
      });
    }
    else {
      read.verifyUserExists(employeeRef,"2" + uid, (y) =>{
        if(y == true) {
          res.json({
            "userID": "2" + uid,
            "status": true
          });
        }
        else {
          res.json({
            "status": false
          });
        }
      });
    }
  });
});

//get email back from uid
app.post('/GET-EMAIL', function (req, res) {
  console.log('Received request for /GET-EMAIL:');
  console.log(req.body);

  //create UID (0 for interns)
  console.log("uid received:");
  var uid = req.body.userID;
  //uid = uid.substring(1,uid.length);
  //var email = revUID(uid);

  //create intern uid
  if(uid.charAt(0) == '1') {
    read.verifyUserExists(internRef,uid, (x) =>{
      if(x)
      {
        read.getIntern(internRef, uid, (y) => {
        console.log(y);
        res.json({
          "email": y.email,
          "status": true
        });
      });
    }
    else {
      res.json({
        "status":false,
        "email": null
      });
    }
    });
  }
  else if(uid.charAt(0) == 2){
    read.verifyUserExists(employeeRef,uid, (y) =>{
      if(y)
      {
        read.getEmployee(employeeRef, uid, (x) => {
          console.log(x);
          res.json({
            "email": x.email,
            "status": true
          });
        });
      }
      else {
        res.json({
          "status": false,
          "email": null
        });
      }
    });
    }
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
  if(uid.charAt(0) == '1') {
    read.verifyUserExists(internRef, uid, (y) => {
      if(y) {
        read.getIntern(internRef, uid, (x) => {
          console.log(x);
          res.send(x);
        });
      }
      else {
        res.json({
          "status": false,
          "error": "user does not exists"
        })
      }
    });
  }
  else {
    res.json({
      "status": false
    })
  }
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

//initial get employee request handler
app.post('/GET-EMPLOYEE', function (req, res) {
  console.log('Received request for EMPLOYEE:');
  console.log(req.body);

  //create UID (0 for interns)
  console.log("UID received:");
  var uid = req.body.userID;
  console.log(uid);

  if(uid.charAt(0) == '2') {
    read.verifyUserExists(employeeRef, uid, (y) => {
      if(y) {
        read.getEmployee(employeeRef, uid, (x) => {
          console.log(x);
          res.send(x);
        });
      }
      else {
        res.json({
          "status": false,
          "error": "user does not exists"
        })
      }
    });
  }
  else {
    res.json({
      "status": false
    });
  }
});

//master list handler
app.post('/GET-MASTER-LIST', function (req, res) {
  console.log("Master list request received");
  console.log(req.body);
  console.log("Done printing out request");
  //check for authority
  //if(authority)
  //get appropriate master list
  if (req.body.userID.charAt(0) == '1') {
    res.json({
      "status": false,
      "error": "intern can't get master list"
    });
    return;
  }
  else {
    read.getEmployee(employeeRef, req.body.userID, (x) => {
      //console.log(x);
      read.getMasterListOfInterns(internRef, x.company, (y) => {
        console.log(y);
        console.log("Master list printed");
        res.send(y);
      }

      );
    });

  }
});

//get employee
app.post('/GET-EMPLOYEE', function (req, res) {
  console.log('Received request for /GET-EMPLOYEE:');
  console.log(req.body);

  //create UID (0 for interns)
  console.log("UID received:");
  var uid = req.body.userID;
  //uid = uid.substring(1,uid.length);
  //var email = revUID(uid);

  //create intern uid
  read.getEmployee(employeeRef, uid, (x) => {
    console.log(x);
    res.send(x);
  });
});

//get correctRef for ChatRooms
function findCorrectRef(chatroomName) {
  //first char
  //1 - company
  //2 - location
  //3 - group
  //4 - private
  //get messages for a chatroom:
  if(chatroomName.charAt(0) == '1') {
    return companyChatRoomRef;
  }
  else if(chatroomName.charAt(0) == '2') {
    return locationChatRoomRef;
  }
  else if(chatroomName.charAt(0) == '3') {
    return groupChatRoomRef;
  }
  else if(chatroomName.charAt(0) == '4') {
    return privateChatRoomRef;
  }
  else {
    return null;
  }
}

//get messages for chatroom name
app.post('/GET-MESSAGES', function (req, res) {
  console.log("Get Messages request received");
  console.log(req.body);
  console.log("Done printing out request");
  //var correctRef = chatRoomRef;
  var chatroomName = req.body.chatroomName;
  var uid = req.body.userID;
  correctRef = findCorrectRef(chatroomName);
  //console.log("correctRef=");
  //console.log(correctRef);
  if(correctRef == null)
  {
    res.json({
      "status":false,
      "error":"weird chat name bro"
    });
  }
  else {
    read.verifyUserChatroom(correctRef, uid, req.body.chatroomName, (y) => {
      if (!y) {
        res.json({
          "status": false,
          "error": "user not in chatroom"
        });
      }
      else {
        read.getMessages(correctRef, req.body.chatroomName, (x) => {
          res.send(x);
        });
      }
    });
  }
});

//compare two interns
app.post('/COMPARE-INTERNS', function (req, res) {
  console.log("compare interns request received");
  console.log(req.body);
  console.log("Done printing out request");
  var uid1 = req.body.userID1;
  var uid2 = req.body.userID2;
  read.compareInterns(internRef, uid1, uid2, (x) => {
    res.json({
      "score": x,
      "status": true
    });
  });
});

//get image:
app.post('/GET-IMAGE', function (req, res) {
  console.log("Get Image request received");
  console.log(req.body);
  console.log("Done printing out request");
  read.getImage(internRef, req.body.userID, (x) => {
    res.send(x);
  });
});

//create Profile Picture:
app.post('/CREATE-PROFILE-PICTURE', function (req, res) {
  console.log("Create Profile picture request received");
  console.log(req.body);
  console.log("Done printing out request");
  var image = req.body.image;
  var userID = req.body.userID;
  create.createProfilePicture(storageRef,internRef, userID, image);
  res.json({
    "status": true
  });
});

//create Group Chat:
app.post('/CREATE-GROUP-CHAT', function (req, res) {
  console.log("Create group request received");
  console.log(req.body);
  console.log("Done printing out request");
  var name = req.body.chatroomName;
  var uid = req.body.userID;
  create.createGroupChat(groupChatRoomRef, internRef, uid, name, (x) => {
    if(x) {
      res.json({
        "status": true
      });
    }
    else {
      res.json({
        "status": false,
        "error": "chat name exists"
      });
    }
  });
});

//add people to Group Chat:
app.post('/ADD-TO-GROUP-CHAT', function (req, res) {
  console.log("add to group request received");
  console.log(req.body);
  console.log("Done printing out request");
  var name = req.body.chatroomName;
  var uid = req.body.userID;
  create.addToGroupChat(groupChatRoomRef, internRef, uid, name);
  res.json({
    "status": true
  });
});

//send messages:
app.post('/SEND-MESSAGE', function (req, res) {
  console.log("SEND MESSAGE request received");
  console.log(req.body);
  console.log("Done printing out request");
  var name = req.body.chatroomName;
  var uid = req.body.userID;
  var message = req.body.message;
  var image = req.body.image;
  var correctRef = findCorrectRef(name);
  if(correctRef == null){
    res.json({
      "status": false,
      "error": "chatroom name is incorrect"
    });
  }
  else {
    if(uid.charAt(0) == '1') {
      read.getIntern(internRef, uid, (x) =>{
        console.log("printing out intern");
        console.log(x);
        message = uid + "$:$" + x.firstName + " " + x.lastName + "$:$" +image + "$:$" + message;
        create.addMessageToChat(correctRef, name, message);
        res.json({
          "status": true
        });
      });
    }
    else if(uid.charAt(0) == '2') {
      read.getEmployee(employeeRef, uid, (x) =>{
        message = uid + "$:$" + x.firstName + " " + x.lastName + "$:$" + image + "$:$" + message;
        create.addMessageToChat(correctRef, name, message);
        res.json({
          "status": true
        });
      });
    }
    else {
      res.json({
        "status": false,
        "error": "incorrect userID"
      });
    }
  }
});

//create Private Chat:
app.post('/CREATE-PRIVATE-CHAT', function (req, res) {
  console.log("Create private chat request received");
  console.log(req.body);
  console.log("Done printing out request");
  var name = req.body.chatroomName;
  var uid1 = req.body.userID1;
  var uid2 = req.body.userID2;
  create.createPrivateChat(privateChatRoomRef, internRef, uid1, uid2, name, (x) => {
    if(x) {
      res.json({
        "status": true
      });
    }
    else {
      res.json({
        "status": false,
        "error": "chat exists"
      });
    }
  });
});

//get chatroom:
app.post('/GET-CHATROOM', function (req, res) {
  console.log("Get chatroom request received");
  console.log(req.body);
  console.log("Done printing out request");
  var uid = req.body.userID;
  if(uid.charAt(0) == '1'){
    read.getChatRooms(internRef, req.body.userID, (x) => {
      res.send(x);
    });
  }
  else {
    read.getChatRooms(employeeRef, req.body.userID, (x) => {
      res.send(x);
    });
  }
});

//get USERS in chat:
app.post('/GET-USERS-IN-CHATROOM', function (req, res) {
  console.log("Get users in chat request received");
  console.log(req.body);
  console.log("Done printing out request");
  var uid = req.body.userID;
  var correctRef = findCorrectRef(req.body.chatroomName);
  if(correctRef == null){
    res.json({
      "status": false,
      "error": "incorrect chatroom name bro"
    });
  }
  else {
    read.verifyUserChatroom(correctRef, uid, req.body.chatroomName, (x) => {
      if(x) {
        read.getUsersInChatRoom(correctRef, req.body.chatroomName, (y) => {
          res.send(y);;
        });
      }
      else {
        res.json({
          "status": false,
          "error": "not in chatroom"
        });
      }
    });
  }
});

//get MODS in chat:
app.post('/GET-MODS-IN-CHATROOM', function (req, res) {
  console.log("Get users in chat request received");
  console.log(req.body);
  console.log("Done printing out request");
  var correctRef = findCorrectRef(req.body.chatroomName);
  var uid = req.body.userID;
  if(correctRef == null || correctRef != companyChatRoomRef){
    res.json({
      "status": false,
      "error": "incorrect chatroom name bro"
    });
  }
  else {
    read.verifyUserChatroom(correctRef, uid, req.body.chatroomName, (x) => {
      if(x) {
        read.getModsInChatRoom(correctRef, req.body.chatroomName, (y) => {
          res.send(y);;
        });
      }
      else {
        res.json({
          "status": false,
          "error": "not in chatroom"
        });
      }
    });
  }
});

//remove from chat handler:
app.post('/REMOVE-FROM-CHAT', function (req, res) {
  console.log("remove from chat request received");
  console.log(req.body);
  console.log("Done printing out request");
  var name = req.body.chatroomName;
  var uid = req.body.userID;
  var correctRef = findCorrectRef(name);
  if(correctRef == null){
    res.json({
      "status": false,
      "error": "fucked up chatroom name bro"
    });
  }
  else
  {
    update.removeFromChat(correctRef, internRef, name, uid);
    read.getIntern(internRef, uid, (x) => {
      create.addNotification(correctRef, internRef, name, x.firstName + " " + x.lastName + " has left " + name.substring(1) + " chat.", uid);
    })

    res.json({
      "status": true
    });
  }
});

//ban from chat handler:
app.post('/BAN-INTERN', function (req, res) {
  console.log("ban intern request received");
  console.log(req.body);
  console.log("Done printing out request");
  var uid = req.body.userID;
  update.banIntern(internRef, uid);
  res.json({
    "status": true
  });
});

//unban from chat handler:
app.post('/UNBAN-INTERN', function (req, res) {
  console.log("unban intern request received");
  console.log(req.body);
  console.log("Done printing out request");
  var uid = req.body.userID;
  update.unbanIntern(internRef, uid);
  res.json({
    "status": true
  });
});

//get company from name
app.post('/GET-COMPANY-FROM-NAME', function (req,res) {
  console.log("recevied request for get company from name");
  console.log(req.body);
  var name = req.body.name;
  read.getCompanyFromName(companyRef, name, (x) => {
    res.send(x);
  })
})

//create complaint
app.post('/CREATE-COMPLAINT', function(req,res) {
  console.log('Request for create complaint recevied');
  console.log(req.body);
  var id = req.body.modID;
  var id2 = req.body.userID;
  var complaint = req.body.complaint;
  var from = req.body.from;
  var to = req.body.to;
  if(id.charAt(0) == '4') {
    create.createComplaint(adminRef, id, complaint, to, from, id2)
    res.json({
      "status": true
    });
  }
  else {
    create.createComplaint(employeeRef, id, complaint, to, from, id2)
    res.json({
      "status": true
    });
  }
});

//remove complaint
app.post('/REMOVE-COMPLAINT', function(req,res) {
  console.log('Request for create complaint recevied');
  console.log(req.body);
  var id = req.body.userID;
  var complaint = req.body.complaint;
  update.removeComplaint(employeeRef, id, complaint);
  res.json({
    "status": true
  })
});

//update company
app.post('/UPDATE-COMPANY', function (req, res) {
  console.log('Received request for UPDATE-COMPANY:');
  console.log(req.body);

  //create UID (0 for interns)
  var name = req.body.companyName;
  var listOfLocations = req.body.locations;
  var listOfEmployees = req.body.employees;
  update.updateCompany(companyRef, name, listOfEmployees, listOfLocations);
  res.json({
    "status": true
  });
});

//master list for companies
app.post('/GET-MASTER-LIST-COMPANY', function (req, res) {
  console.log("Master list request received");
  console.log(req.body);
  console.log("Done printing out request");
  read.getMasterListOfInterns(internRef, req.body.companyName, (y) => {
    console.log(y);
    console.log("Master list printed");
    res.send(y);
  });
});

//get intern
app.post('/GET-ADMIN', function(req, res) {
  console.log("get admin received");
  read.getAdmin(adminRef, (x) => {
    res.send(x);
  });
});

//remove complaint admin
app.post('/REMOVE-COMPLAINT-ADMIN', function(req, res) {
  console.log("remove complaint admin received");
  var complaint = req.body.complaint;
  update.removeComplaint(adminRef, 4000, complaint);
  res.json({
    "status": true
  })
});

//get invites for chatroom name
app.post('/GET-INVITES', function (req, res) {
  console.log("Get invites request received");
  console.log(req.body);
  console.log("Done printing out request");
  //var correctRef = chatRoomRef;
  var chatroomName = req.body.chatroomName;
  var uid = req.body.userID;
  correctRef = findCorrectRef(chatroomName);
  //console.log("correctRef=");
  //console.log(correctRef);
  if(correctRef == null)
  {
    res.json({
      "status":false,
      "error":"weird chat name bro"
    });
  }
  else {
    read.verifyUserChatroom(correctRef, uid, req.body.chatroomName, (y) => {
      if (!y) {
        res.json({
          "status": false,
          "error": "user not in chatroom"
        });
      }
      else {
        read.getInvite(correctRef, req.body.chatroomName, uid, (x) => {
          console.log(x);
          res.json({
            "invite_status": x
          });
        });
      }
    });
  }
});

//create employee chat
app.post('/CREATE-EMPLOYEE-CHAT', function (req, res) {
  console.log("create employee request received");
  console.log(req.body);
  console.log("Done printing out request");
  //var correctRef = chatRoomRef;
  var chatroomName = req.body.chatroomName;
  var internUid = req.body.InternUserID;
  var employeeUid = req.body.EmployeeUserID;
  if(employeeUid.charAt(0) != '2') {
    res.json({
      "status": false,
      "error": "employee is not employee"
    });
  }
  else if(internUid.charAt(0) != '1') {
    res.json({
      "status": false,
      "error": "intern is not employee"
    });
  }
  else {
    create.createEmployeeChat(privateChatRoomRef, internRef, employeeRef, internUid, employeeUid, chatroomName, (x) => {
      if(x) {
        res.json({
          "status": true
        });
      }
      else {
        res.json({
          "status": false,
          "error": "chat name exists"
        })
      }
    });
  }
  correctRef = privateChatRoomRef;
  //console.log("correctRef=");
  //console.log(correctRef);
});

//accept invite:
app.post('/ACCEPT-INVITE', function(req, res) {
  console.log('ACCEPT INVITE request received');
  console.log(req.body);
  var chatroomName = req.body.chatroomName;
  var uid = req.body.userID;
  var correctRef = findCorrectRef(chatroomName);
  if(correctRef == null){
    res.json({
      "status": false,
      "error": "chatroom name is incorrect"
    });
  }
  else {
    update.acceptInvite(correctRef, chatroomName, uid);
    res.json({
      "status": true
    })
  }
});

//accept company
app.post('/ACCEPT-COMPANY', function (req, res) {
  console.log('Request recieved for accept company');
  console.log(req.body);
  var name = req.body.name;
  update.acceptCompany(adminRef, companyRef, name);
  res.json({
    "status": true
  });
});

//deny company
app.post('/DENY-COMPANY', function (req, res) {
  console.log('request received for denying company');
  console.log(req.body);
  var name = req.body.name;
  update.denyCompany(companyRef, name);
  res.json({
    "status": true
  })
});

//get admin companies
app.post('/GET-ADMIN-COMPANIES', function (req, res) {
  console.log("Get admin companies request received");
  console.log(req.body);
  read.getAdminCompanies(adminRef, (x) => {
    console.log(x);
    res.send(x);
  });
});

//get notifications
app.post('/GET-NOTIFICATIONS', function (req, res) {
  console.log("Get notifications request received");
  console.log(req.body);
  var uid = req.body.userID;
  read.getNotifications(internRef, uid, (x) => {
    console.log(x);
    res.send(x);
  });
});

//get zillow results
app.post('/GET-ZILLOW-RESULTS', function (req, res) {
  console.log("Get zillow requests request received");
  console.log(req.body);
  var address = req.body.address;
  var zip = req.body.zip;
  var params = {
    "address": address,
    "citystatezip": zip
  };
  console.log("params made");
  console.log(params);
  zillow.get('GetDeepSearchResults', params).then((response) => {
    console.log(response.response.results.result[0].zestimate[0].amount[0]._);
    res.send(response);
  })
});

//create houses
app.post('/CREATE-HOUSE', function (req, res) {
  console.log('Create a house request received');
  console.log(req.body);
  var address = req.body.address;
  var price = req.body.price;
  var sqft = req.body.sqft;
  var bedrooms = req.body.bedroom;
  var bathrooms = req.body.bathroom;
  var url = req.body.url;
  var zip = req.body.zip;
  var state = req.body.state;
  var image = req.body.image;
  create.createHouse(houseRef, address, state, zip, price, sqft, bedrooms, bathrooms, url, image);
  res.json({
    "status": true
  })
})

//write review
app.post('/WRITE-REVIEW', function (req, res) {
  console.log("request received for writing review");
  console.log(req.body);
  var house = req.body.house;
  var review = req.body.review;
  create.writeReview(houseRef, house, review);
  res.json({
    "status": true
  })
});

//add notification
app.post('/ADD-NOTIFICATION', function (req, res) {
  console.log("request received for add notifications");
  console.log(req.body);
  var name = req.body.name;
  var notification = req.body.notification;
  create.addNotification(groupChatRoomRef,houseRef, internRef, name, notification, 0000);
  res.json({
    "status": true
  })
});

//add house
app.post('/ADD-HOUSE', function (req, res) {
  console.log("request received for adding house");
  console.log(req.body);
  var house = req.body.house;
  var name = req.body.name;
  var ID = req.body.userID;
  create.addHouse(groupChatRoomRef, houseRef, internRef, name, ID, house);
  res.json({
    "status": true
  })
});

//like house
app.post('/LIKE-HOUSE', function (req, res) {
  console.log("request received for liking house");
  console.log(req.body);
  var house = req.body.house;
  var name = req.body.name;
  var uid = req.body.userID;
  update.likeHouse(groupChatRoomRef, name, house, uid, (x) => {
    res.json({
      "status": true,
      "liked": x
    })
  });
});

//get reviews:
app.post('/GET-REVIEWS', function (req, res) {
  console.log("request received for getting");
  console.log(req.body);
  var house = req.body.house;
  read.getReviews(houseRef, house, (x) => {
    res.send(x);
  });
});

//get houses
app.post('/GET-HOUSES', function (req, res) {
  console.log("request received for getting house");
  console.log(req.body);
  var state = req.body.state;
  var offsetString = req.body.offset;
  var offset = parseInt(offsetString, 10);

  var temp = {};
  temp["number"] = houses[state]["number"];

  var max = 20;
  var start = offset*20 + 1;

  if (start > temp["number"]) {
    res.json({
      "status": false,
      "error": "Start number too high..."
    });
  }
  else {
    if ((start + 20) > temp["number"]) {
      max = temp["number"] - start;
    }

    console.log("start:");
    console.log(start);
    console.log("number:");
    console.log(max);

    var j = 1;
    for (var i = start; i < (start+max); i++) {
      temp[j] = houses[state][i];
      j++;
    }
    temp["included"] = j-1;
    res.send(temp);
  }
});

//get all addresses
app.post('/GET-ALL-ADDRESSES', function (req, res) {
  console.log("request recieved");
  console.log(req.body);
  res.send(addresses);
});

//filter houses
app.post('/GET-FILTERED-HOUSES', function (req, res) {
  console.log("request received for getting filtered house");
  console.log(req.body);
  var state = req.body.state;
  var offsetString = req.body.offset;
  var minsqft = req.body.minsqft;
  var maxsqft = req.body.maxsqft;
  var minPrice = req.body.minPrice;
  var maxPrice = req.body.maxPrice;
  var minBedrooms = req.body.minBedrooms;
  var maxBedrooms = req.body.maxBedrooms;
  var minBathrooms = req.body.minBathrooms;
  var maxBathrooms = req.body.maxBathrooms;

  var flag = true;

  var currFilters = {
    "minsqft": minsqft,
    "maxsqft": maxsqft,
    "minPrice": minPrice,
    "maxPrice": maxPrice,
    "minBedrooms": minBedrooms,
    "maxBedrooms": maxBedrooms,
    "minBathrooms": minBathrooms,
    "maxBathrooms": maxBathrooms,
    "state": state
  };

  if(!objectEquals(currFilters, prevFilters)) {
    flag = false;
    prevFilters = currFilters;
    console.log("prevFilters != currFilters");
  }

  if(flag) {
    var offset = parseInt(offsetString, 10);

    var temp = {};
    temp["number"] = filteredHouses["number"];

    var max = 20;
    var start = offset*20 + 1;

    if (start > temp["number"]) {
      res.json({
        "status": false,
        "error": "Start number too high..."
      });
    }
    else {
      if ((start + 20) > temp["number"]) {
        max = temp["number"] - start;
      }

      console.log("start:");
      console.log(start);
      console.log("number:");
      console.log(max);

      var j = 1;
      for (var i = start; i < (start+max); i++) {
        temp[j] = filteredHouses[i];
        j++;
      }
      temp["included"] = j-1;
      res.send(temp);
    }
  }
  else {
      var j = 1;
      console.log("start filtering once");
      for (var i = 1; i < houses[state]["number"]; i++) {
        //checking filters
        //console.log("Printing ith house");
        //console.log(houses[state][i]);
        if(checkFilters(houses[state][i], currFilters)) {
          filteredHouses[j] = houses[state][i];
          j++;
          //console.log(j);
        }
        filteredHouses["number"] = (j-1);
      }

      var offset = parseInt(offsetString, 10);

      var temp = {};
      //console.log("hahahahahahahaha");
      temp["number"] = filteredHouses["number"];

      var max = 20;
      var start = offset*20 + 1;

      if (start > temp["number"]) {
        res.json({
          "status": false,
          "error": "Start number too high..."
        });
      }
      else {
        if ((start + 20) > temp["number"]) {
          max = temp["number"] - start;
        }

        console.log("start:");
        console.log(start);
        console.log("number:");
        console.log(max);

        var j = 1;
        for (var i = start; i < (start+max); i++) {
          console.log("returning house:");
          console.log(filteredHouses[i]);
          temp[j] = filteredHouses[i];
          j++;
        }
        temp["included"] = j-1;
        res.send(temp);
    }
  }
});

// remove a saved house:
app.post('/REMOVE-HOUSE', function (req, res) {
  console.log("request received for removing house");
  console.log(req.body);
  var house = req.body.house;
  var name = req.body.name;
  var uid = req.body.userID;
  update.removeHouse(groupChatRoomRef, houseRef, internRef, name, uid, house);
  res.json({
    "status": true
  })
});

// get blocked users
app.post('/GET-BLOCKED-USERS', function (req, res) {
  console.log('Recieved request for getting blocked users');
  console.log(req.body);
  var uid = req.body.userID;
  read.getBlockedUsers(internRef, uid, (x) => {
    res.send(x);
  });
})

// get a list of saved houses:
app.post('/GET-SAVED-HOUSES', function (req, res) {
  console.log('Received request for getting saved houses');
  console.log(req.body);
  var name = req.body.name;
  read.getSavedHouses(groupChatRoomRef, houseRef, name, (x) => {
    // res.send(x);
    var arr = [];
    var i = 0;
    for (var addr in x) {
      arr[i] = x[addr];
      arr[i]["addressTemp"] = addr;
      i = i + 1;
    }
    arr.sort( function (a, b) {
      return -(parseInt(a.likes.likes,10) - parseInt(b.likes.likes,10));
    });
    var ordered = {};
    for (var index in arr) {
      ordered[arr[index]["addressTemp"]] = {};
      for (var attr in arr[index]) {
        ordered[arr[index]["addressTemp"]][attr] = arr[index][attr];
      }
    }
    res.send(ordered)
  });
})

//block an intern by another intern
app.post('/BLOCK-USER', function (req, res) {
  console.log('Request recieved for blocking an intern');
  console.log(req.body);
  var blocker = req.body.blocker;
  var blocking = req.body.blocking;
  create.blockUser(internRef, blocker, blocking);
  res.json({
    "status": true
  });
})

//unblock an intern
app.post('/UNBLOCK-USER', function (req, res) {
  console.log('request received for unblocking user');
  console.log(req.body);
  var blocker = req.body.blocker;
  var blocking = req.body.blocking;
  update.unblockUser(internRef, blocker, blocking);
  res.json({
    'status': true
  })
})

// check for filters
function checkFilters(house, filters) {
  if(isNaN(house.sqft) || house.sqft == "") {
    return false;
  }
  var minsqft = parseFloat(filters.minsqft);
  var maxsqft = parseFloat(filters.maxsqft);
  var minPrice = parseFloat(filters.minPrice);
  var maxPrice = parseFloat(filters.maxPrice);
  var minBedrooms = parseFloat(filters.minBedrooms);
  var maxBedrooms = parseFloat(filters.maxBedrooms);
  var minBathrooms = parseFloat(filters.minBathrooms);
  var maxBathrooms = parseFloat(filters.maxBathrooms);

  var bedroom = parseFloat(house.bedrooms);
  var bathroom = parseFloat(house.bathrooms);
  var sqft = parseFloat(house.sqft);
  var price = parseFloat(house.price);

  if (bedroom < minBedrooms || bedroom > maxBedrooms) {
    // console.log("bedrooms");
    return false;
  }
  if (bathroom < minBathrooms || bathroom > maxBathrooms) {
    // console.log("bathrooms");
    return false;
  }
  if (sqft < minsqft || sqft > maxsqft) {
    // console.log("sqft");
    return false;
  }
  if (price < minPrice || price > maxPrice) {
    /* console.log("\nprice");
    console.log("minPrice:");
    console.log(minPrice);
    console.log("maxPrice");
    console.log(maxPrice);
    console.log("price");
    console.log(price);*/
    return false;
  }

  return true;
}

//parse houses
function parseHouses(state) {
  read.getHouses(houseRef, state, (x) => {
    var number = 1;
    //have a foreach loop to go through all the states:
    for (var zip in x) {

      //have a loop that goes through all address in a ZIP
      for (var addr in x[zip]) {
        houses[state][number] = {
            "address": addr
        }
          //get all attributes in the house
          for (var attributes in x[zip][addr]) {
          houses[state][number][attributes] = x[zip][addr][attributes];
        }
          number++;
      }
    }
    houses[state]["number"] = number;
  });
}

//parse all addresses
function parseAddresses(states) {
  for (var i in states) {
    var state = states[i];
    var number = 1;
    read.getHouses(houseRef, state, (x) => {
      for (var zip in x) {
        for (var address in x[zip]) {
          addresses[number] = address;
          number++;
        }
      }
    });
  }
}

//test zillow
function  testZillow() {
  var parameters = {
    zpid: "50633081",
    address: "10586 Roundwood Glen Ct Jacksonville, FL",
    citystatezip: "32256"
  };
  zillow.get('GetSearchResults', parameters).then((response) => {
    console.log(response.response.results.result[0].zestimate[0].amount[0]._);
  })
}

//empty jsons
function isEmptyObject(obj) {
  return !Object.keys(obj).length;
}

//check if any two objcts are equal:
function objectEquals(x, y) {

  // if both are function
  if (x instanceof Function) {
      if (y instanceof Function) {
          return x.toString() === y.toString();
      }
      return false;
  }
  if (x === null || x === undefined || y === null || y === undefined) { return x === y; }
  if (x === y || x.valueOf() === y.valueOf()) { return true; }

  // if one of them is date, they must had equal valueOf
  if (x instanceof Date) { return false; }
  if (y instanceof Date) { return false; }

  // if they are not function or strictly equal, they both need to be Objects
  if (!(x instanceof Object)) { return false; }
  if (!(y instanceof Object)) { return false; }
    var p = Object.keys(x);
  return Object.keys(y).every(function (i) { return p.indexOf(i) !== -1; }) ?
  p.every(function (i) { return objectEquals(x[i], y[i]); }) : false;
}

//actual main function
app.listen(port, function () {

  //call test
  console.log("SERVER STARTS");
  console.log('Testing begins, check database');
  //test();
  //testZillow();
  console.log('Testing done');

  //strart parsing houses:
  console.log("Begin parsing CA");
  parseHouses("CA");
  console.log("End parsing CA");

  console.log("Begin parsing NY");
  parseHouses("NY");
  console.log("End parsing NY");

  console.log("Begin parsing TX");
  parseHouses("TX");
  console.log("End parsing TX");

  console.log("Done parsing houses");

  console.log("Parse all addresses");
  states = ["CA", "TX", "NY"];
  parseAddresses(states);
  console.log("Done parsing addresses");


  console.log('Database setup done');
  console.log('App listening on port: ' + port + '!');
});

//error handler
app.use(function (err, req, res, next) {
  console.error(err);
  res.json({
    "status": false,
    "error": 'Something failed, plz check server for more details',
    "details": err
  });
});
