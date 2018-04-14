
module.exports = {
  createCompany,
  createIntern,
  createEmployee,
  createPassword,
  createBasicPreferences,
  createRoommatePreferences,
  createHousingPreferences,
  createProfilePicture,
  addToLocationChat,
  addEmployeeToCompanyChat,
  addInternToCompanyChat,
  createGroupChat,
  addToGroupChat,
  createPrivateChat,
  createEmployeeChat,
  addMessageToChat,
  createComplaint,
  createHouse,
  addHouse,
  addNotification,
  writeReview,
  blockUser
}

var update = require('./update.js');
var create = require('./create.js');

function createCompany(adminRef, companyRef, companyName, email, password, listOfLocations = "novalue", listOfEmployees = []) {
    companyRef.update({
      [companyName]: "novalue"
    });
    var pin = Math.floor(Math.random() * 9000) + 1000;
    companyRef.child(companyName).update({
      "pin": pin,
      "email": email,
      "password": password,
      "listOfLocations": listOfLocations,
      "listOfEmployees": listOfEmployees,
      "verified": "pending"
    });
    update.getSnapshot(adminRef, 4000, "listOfCompanies", companyName);
}

function createIntern(internRef, id, email, company, endDate, location = "novalue") {
  internRef.update({
    [id]:"novalue"
  });
  internRef.child(id).update({
    "email": email,
    "company": company,
    "location": location,
    "listOfChatRooms": [2 + location, 1 + company + ", " + location],
    "endDate": endDate,
    "ban": false
  });
  internRef.child(id).child("images").update({
    "image": "undefined"
  });
}

function createEmployee(employeeRef, companyRef, id, firstName, lastName, password, email, company, location, description, facebook, linkedin, twitter) {
  employeeRef.update({
    [id]:"novalue"
  });
  employeeRef.child(id).update({
    "firstName": firstName,
    "lastName": lastName,
    "password": password,
    "email": email,
    "company": company,
    "description": description,
    "location": location,
    "links": [facebook, linkedin, twitter],
    "listOfChatRooms": [1 + company + ", " + location]
  });
  employeeRef.child(id).child("images").update({
    "image": "undefined"
  });
  update.updateCompany(companyRef, company, firstName + " " + lastName);
}

function createPassword(relevantRef, ID, password) {
  relevantRef.child(ID).update({
    "password": password
  });
}

function createBasicPreferences(internRef, ID, firstName, lastName, description, fbLink, twitterLink, linkedin) {
  internRef.child(ID).child('basic').update({
  "description": description,
  "fbLink": fbLink,
  "twitterLink": twitterLink,
  "linkedInLink": linkedin
  });
  update.updateIntern(internRef, ID, firstName, lastName, "novalue");
}

function createRoommatePreferences(internRef, ID, youguest, themguest, youpet, thempet, sharing, smoke, bedtime, waketime, lights, clean) {
  internRef.child(ID).child('roommate').update({
    "youguest": youguest,
    "themguest": themguest,
    "youpet": youpet,
    "thempet": thempet,
    "sharing": sharing,
    "smoke": smoke,
    "bedtime": bedtime,
    "waketime": waketime,
    "lights": lights,
    "clean": clean
  });
}

function createHousingPreferences(internRef, ID, price, roommates, distance, duration) {
  internRef.child(ID).child('housing').update({
    "desiredPrice": price,
    "desiredRoommate": roommates,
    "desiredDistance": distance,
    "desiredDuration": duration
  });
}

function createProfilePicture(storageRef, relevantRef, ID, image) {
  var imageRef = relevantRef.child(ID).child("images");
    storageRef.child(ID + "/").getDownloadURL().then(function(url) {
        imageRef.child("image").set(url);
  });
  var task = storageRef.child(ID + "/").putString(image, 'base64').then(function(snapshot) {
     console.log('Uploaded a base64 string!');
  });
}

function addToLocationChat(locationChatRoomRef, internRef, location, user) {
  var item = user + "$:$";
  internRef.child(user).once("value").then(function(snapshot) {
    item += snapshot.val().firstName + " " + snapshot.val().lastName + "$:$";
    internRef.child(user).child("images").once("value").then(function(childSnapshot) {
      item += childSnapshot.val().image + "$:$";
      internRef.child(user).child("basic").once("value").then(function(babySnapshot) {
        item += babySnapshot.val().description;
        update.getSnapshot(locationChatRoomRef, 2 + location, "listOfUsers", item);
      });
    });
  });
}

function addEmployeeToCompanyChat(companyChatRoomRef, employeeRef, company, location, user) {
  var item = user + "$:$";
  employeeRef.child(user).once("value").then(function(snapshot) {
    item += snapshot.val().firstName + " " + snapshot.val().lastName + "$:$";
    employeeRef.child(user).child("images").once("value").then(function(childSnapshot) {
      item += childSnapshot.val().image + "$:$";
      item += snapshot.val().description;
      update.getSnapshot(companyChatRoomRef, 1 + company + ", " + location, "listOfMods", item);
    });
  });
}

function addInternToCompanyChat(companyChatRoomRef, internRef, company, location, user) {
  var item = user + "$:$";
  internRef.child(user).once("value").then(function(snapshot) {
    item += snapshot.val().firstName + " " + snapshot.val().lastName + "$:$";
    internRef.child(user).child("images").once("value").then(function(childSnapshot) {
      item += childSnapshot.val().image + "$:$";
      internRef.child(user).child("basic").once("value").then(function(babySnapshot) {
        item += babySnapshot.val().description;
        update.getSnapshot(companyChatRoomRef, 1 + company + ", " + location, "listOfUsers", item);
      });
    });
  });
}

function createGroupChat(groupChatRoomRef, internRef, ID, name, callback) {
  groupChatRoomRef.child(3 + name).once("value").then(function(snapshot) {
    if(snapshot.exists()) {
      callback(false);
    }
    else {
      var item = ID + "$:$";
      internRef.child(ID).once("value").then(function(snapshot) {
        item += snapshot.val().firstName + " " + snapshot.val().lastName + "$:$";
        internRef.child(ID).child("images").once("value").then(function(childSnapshot) {
          item += childSnapshot.val().image + "$:$";
          internRef.child(ID).child("basic").once("value").then(function(babySnapshot) {
            item += babySnapshot.val().description;
            groupChatRoomRef.child(3 + name).update({
              "listOfUsers": [item]
            });
          });
        });
      });
      update.getSnapshot(internRef, ID, "listOfChatRooms", 3 + name);
      callback(true);
    }
  });
}

function addToGroupChat(groupChatRoomRef, internRef, ID, name) {
  var item = ID + "$:$";
  var flag = 0;
  groupChatRoomRef.child(name).child("listOfUsers").once("value").then(function(grandSnapshot) {
    grandSnapshot.forEach(function(parentSnapshot) {
      if(parentSnapshot.val().substring(0, 4) == ID) {
        flag = 1;
        return true;
      }
    });
    if(flag == 1)
      return;
    else {
      internRef.child(ID).once("value").then(function(snapshot) {
        item += snapshot.val().firstName + " " + snapshot.val().lastName + "$:$";
        internRef.child(ID).child("images").once("value").then(function(childSnapshot) {
          item += childSnapshot.val().image + "$:$";
          internRef.child(ID).child("basic").once("value").then(function(babySnapshot) {
            item += babySnapshot.val().description;
            update.getSnapshot(groupChatRoomRef, name, "listOfUsers", item);
          });
        });
      });
      update.getSnapshot(internRef, ID, "listOfChatRooms", name);
      groupChatRoomRef.child(name).child("listOfInvites").update({
        [ID]: false
      });
    }
  });

}

function createPrivateChat(privateChatRoomRef, internRef, ID1, ID2, name, callback) {
  privateChatRoomRef.child(4 + name).once("value").then(function(snapshot) {
    if(snapshot.exists()) {
      callback(false);
    }
    else {
      var item = ID1 + "$:$";
      var item2 = ID2 + "$:$";
      internRef.child(ID1).once("value").then(function(snapshot) {
        item += snapshot.val().firstName + " " + snapshot.val().lastName + "$:$";
        internRef.child(ID1).child("images").once("value").then(function(childSnapshot) {
          item += childSnapshot.val().image + "$:$";
          internRef.child(ID1).child("basic").once("value").then(function(babySnapshot) {
            item += babySnapshot.val().description;
            internRef.child(ID2).once("value").then(function(snapshot) {
              item2 += snapshot.val().firstName + " " + snapshot.val().lastName + "$:$";
              internRef.child(ID2).child("images").once("value").then(function(childSnapshot) {
                item2 += childSnapshot.val().image + "$:$";
                internRef.child(ID2).child("images").once("value").then(function(babySnapshot) {
                  item2 += babySnapshot.val().description;
                  privateChatRoomRef.child(4 + name).update({
                    "listOfUsers": [item, item2]
                  });
                });
              });
            });
          });
        });
      });
      update.getSnapshot(internRef, ID1, "listOfChatRooms", 4 + name);
      update.getSnapshot(internRef, ID2, "listOfChatRooms", 4 + name);
      privateChatRoomRef.child(4 + name).child("listOfInvites").update({
        [ID2]: false
      });
      callback(true);
    }
  });
}

function createEmployeeChat(privateChatRoomRef, internRef, employeeRef, ID1, ID2, name, callback) {
  privateChatRoomRef.child(4 + name).once("value").then(function(snapshot) {
    if(snapshot.exists()) {
      callback(false);
    }
    else {
      var item = ID1 + "$:$";
      var item2 = ID2 + "$:$";
      internRef.child(ID1).once("value").then(function(snapshot) {
        item += snapshot.val().firstName + " " + snapshot.val().lastName + "$:$";
        internRef.child(ID1).child("images").once("value").then(function(childSnapshot) {
          item += childSnapshot.val().image + "$:$";
          internRef.child(ID1).child("basic").once("value").then(function(babySnapshot) {
            item += babySnapshot.val().description;
            employeeRef.child(ID2).once("value").then(function(snapshot) {
              item2 += snapshot.val().firstName + " " + snapshot.val().lastName + "$:$";
              employeeRef.child(ID2).child("images").once("value").then(function(childSnapshot) {
                item2 += childSnapshot.val().image + "$:$";
                item2 += snapshot.val().description;
                privateChatRoomRef.child(4 + name).update({
                  "listOfUsers": [item, item2]
                });
              });
            });
          });
        });
      });
      update.getSnapshot(internRef, ID1, "listOfChatRooms", 4 + name);
      update.getSnapshot(employeeRef, ID2, "listOfChatRooms", 4 + name);
      privateChatRoomRef.child(4 + name).child("listOfInvites").update({
        [ID2]: false
      });
      callback(true);
    }
  });
}

function addMessageToChat(chatRoomRef, name, message) {
  chatRoomRef.child(name).child("listOfMessages").once("value").then(function(snapshot) {
    if(snapshot.exists()) {
      var count = snapshot.val().number;
      count++;
      chatRoomRef.child(name).child("listOfMessages").update({
        "number": count,
        [count]: message,
      });
    }
    else {
      chatRoomRef.child(name).child("listOfMessages").update({
        "number": "1",
        "1": message
      });
    }
  });
}

function createComplaint(employeeRef, ID, complaint, complaintee, complainter, CID) {
  update.getSnapshot(employeeRef, ID, "listOfComplaints", CID + "$:$" + complainter + "$:$" + complaintee + "$:$" + complaint);
}

function createHouse(houseRef, address, state, zip, price, sqft, bedrooms, bathrooms, url, image) {
  houseRef.child(state).child(zip).update({
    [address]: "novalue"
  });
  houseRef.child(state).child(zip).child(address).update({
    "count": 0,
    "bedrooms": bedrooms,
    "bathrooms": bathrooms,
    "url": url,
    "price": price,
    "sqft": sqft,
    "image": image
  });
}

function addHouse(groupChatRoomRef, houseRef, internRef, name, ID, house) {
  var split = house.split(" ");
    var state = split[split.length - 2];
    var zip = split[split.length - 1];
  houseRef.child(state).child(zip).child(house).once("value").then(function(snapshot) {
    var count = snapshot.val().count;
    count++;
    houseRef.child(state).child(zip).child(house).update({
      "count": count,
      [count]: name
    });
    for(var i = 1; i < count; i++) {
      create.addNotification(groupChatRoomRef, internRef, snapshot.val()[i], "Another group \"" + snapshot.val()[i].substring(1) + "\" added " + house + " to the housing list");
    }
  });

  groupChatRoomRef.child(name).child("listOfHouses").update({
    [house]: "novalue"
  });
  groupChatRoomRef.child(name).child("listOfHouses").child(house).update({
    "likes": 0
  });
  create.addNotification(groupChatRoomRef, internRef, name, house + " was added to " + name.substring(1), ID);
}

function addNotification(groupChatRoomRef, internRef, name, notification, exception = 0000) {
  //check group exits
  groupChatRoomRef.child(name).child("listOfUsers").once("value").then(function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      if(exception == childSnapshot.val().substring(0, 4)) {}
      else {
        internRef.child(childSnapshot.val().substring(0, 4)).child("listOfNotifications").once("value").then(function(babySnapshot) {
          if(babySnapshot.exists()) {
            var count = babySnapshot.val().count;
            count++;
            internRef.child(childSnapshot.val().substring(0, 4)).child("listOfNotifications").update({
              "count": count,
              [count]: notification
            });
          }
          else {
            internRef.child(childSnapshot.val().substring(0, 4)).child("listOfNotifications").update({
              "count": 1,
              "1": notification
            });
          }
        });
      }
    });
  });
}

function writeReview(houseRef, house, review) {
  var split = house.split(" ");
  var state = split[split.length - 2];
  var zip = split[split.length - 1];
  update.getSnapshot(houseRef.child(state).child(zip), house, "listOfReviews", review);
}

function blockUser(internRef, ID, blockID) {
  getSnapshot(internRef, ID, "listOfBlockedUsers", blockID);
}
