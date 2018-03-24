
  module.exports = {
      getSnapshot,
      updateCompany,
      updateEmployee,
      updateIntern,
      updatePassword,
      removeIntern,
      removeEmployee,
      removeFromChat,
      banIntern,
      unbanIntern,
      removeComplaint
  }

const update = require('./update.js');

  function getSnapshot(relevantRef, childName, itemName, newValue) {
    var ref = relevantRef.child(childName).child(itemName);
    var oldlist = [];
    ref.once("value").then(function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val();
        oldlist.push(item);
      });
      var newList = oldlist.concat(newValue);
      relevantRef.child(childName).update({
        [itemName]: newList
      })
    });
  }

  function updateCompany(companyRef, companyName, employees, locations = []) {
    update.getSnapshot(companyRef, companyName, "listOfLocations", locations);
    update.getSnapshot(companyRef, companyName, "listOfEmployees", employees);
  };

  function updateEmployee(employeeRef, id, firstName, lastName, location, description, facebook, linkedin, twitter) {
    if(firstName != null)
      employeeRef.child(id).update({
        "firstName": firstName
      });
    if(lastName != null)
      employeeRef.child(id).update({
        "lastName": lastName
      });
    if(description != null)
      employeeRef.child(id).update({
        "description": description
      });
    if(location != null)
      employeeRef.child(id).update({
        "location": location
      });
    if(facebook != null)
      employeeRef.child(id).child("links").update({
        "0": facebook
      });
    if(twitter != null)
      employeeRef.child(id).child("links").update({
        "2": twitter
      });
    if(linkedin != null)
      employeeRef.child(id).child("links").update({
        "1": linkedin
      });
  }

  function updateIntern(internRef, ID, firstName, lastName, phone) {
    if(firstName != null) {
      internRef.child(ID).update({
        "firstName": firstName
      });
    }
    if(lastName != null) {
      internRef.child(ID).update({
        "lastName": lastName
      })
    }
    if(phone != null) {
      internRef.child(ID).update({
        "phone": phone
      });
    }
  }

  function updatePassword(relevantRef, ID, newPassword, oldPassword, callback) {
    var ref = relevantRef.child(ID).child("password");
    ref.once("value").then(function(snapshot) {
      var item = snapshot.val();
      if(item == oldPassword) {
        relevantRef.child(ID).update({
          "password": newPassword
              });
              callback(true);
          }
      else {
        callback(false);
          }
    });
  }

  function removeIntern(internRef, chatRoomRef, ID) {
    internRef.child(ID).child("listOfChatRooms").once("value").then(function(snapshot) {
          snapshot.forEach(function(childSnapshot) {
              var ref;
              if(childSnapshot.val()[0] == 1)
                  ref = chatRoomRef.child("Company");
              else if(childSnapshot.val()[0] == 2)
                  ref = chatRoomRef.child("Location");
              else if(childSnapshot.val()[0] == 3)
                  ref = chatRoomRef.child("Group");
              else if(childSnapshot.val()[0] == 4)
                  ref = chatRoomRef.child("Private");
              ref.child(childSnapshot.val()).child("listOfUsers").once("value").then(function(babySnapshot) {
                  var i = 0;
                  babySnapshot.forEach(function(infantSnapshot) {
                      i++;
                      if(infantSnapshot.val()[0] == ID[0] && infantSnapshot.val()[1] == ID[1] && infantSnapshot.val()[2] == ID[2] && infantSnapshot.val()[3] == ID[3]) {
                          ref.child(childSnapshot.val()).child("listOfUsers").child(infantSnapshot.key).remove();
                      }
                  });
                  if(i <= 1) {
                      ref.child(childSnapshot.val()).remove();
                  }
                  internRef.child(ID).remove();
              });
          });
      });
  }

  function removeEmployee(employeeRef, chatRoomRef, companyRef, ID) {
      employeeRef.child(ID).child("listOfChatRooms").once("value").then(function(snapshot) {
          snapshot.forEach(function(childSnapshot) {
              var ref = chatRoomRef.child("Company");
              ref.child(childSnapshot.val()).child("listOfMods").once("value").then(function(babySnapshot) {
                  babySnapshot.forEach(function(infantSnapshot) {
                      if(infantSnapshot.val()[0] == ID[0] && infantSnapshot.val()[1] == ID[1] && infantSnapshot.val()[2] == ID[2] && infantSnapshot.val()[3] == ID[3]) {
                          ref.child(childSnapshot.val()).child("listOfMods").child(infantSnapshot.key).remove();
                      }
                  });
                  employeeRef.child(ID).remove();
              });
          });
      });
  }

  function removeFromChat(chatRoomRef, internRef, name, ID) {
      chatRoomRef.child(name).child("listOfUsers").once("value").then(function(snapshot) {
          snapshot.forEach(function(childSnapshot) {
              if(childSnapshot.val() == ID) {
                  chatRoomRef.child(name).child("listOfUsers").child(childSnapshot.key).remove();
                  return true;
              }
          });
      });
      internRef.child(ID).child("listOfChatRooms").once("value").then(function(snapshot) {
          snapshot.forEach(function(childSnapshot) {
              if(childSnapshot.val() == name) {
                  internRef.child(ID).child("listOfChatRooms").child(childSnapshot.key).remove();
                  return true;
              }
          });
      });
  }

  function banIntern(internRef, ID) {
      internRef.child(ID).update({
          "ban": true
      });
  }

  function unbanIntern(internRef, ID) {
      internRef.child(ID).update({
          "ban": false
      });
  }

  function removeComplaint(employeeRef, ID, message) {
      employeeRef.child(ID).child("listOfComplaints").once("value").then(function(snapshot) {
          snapshot.forEach(function(childSnapshot) {
              if(childSnapshot.val() == message) {
                  employeeRef.child(ID).child("listOfComplaints").child(childSnapshot.key).remove();
              }
          });
      });
  }
