
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
      removeComplaint,
      updateInternChatDetails,
      updateEmployeeChatDetails,
      acceptInvite
  }

   var update = require('./update.js');

/*
  / @brief this function retrieves the already existent
  /        items from a list and adds the new ones to it
  /        can be used to update lists and arrays
  /
  / @param relevantRef a reference to the appropriate object header
  / @param childName the name of the object you want to update
  / @param itemName the item you want to update
  / @param newValue the values you want to add
  */
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
    console.log(employees);
    console.log(locations);
    console.log();
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
    var rooms = [];
		internRef.child(ID).child("listOfChatRooms").once("value").then(function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                rooms.push(childSnapshot.val());
            });
            internRef.child(ID).remove();
            var ref;
            rooms.forEach(function(entry) {
                if(entry[0] == 1)
                    ref = chatRoomRef.child("Company");
                else if(entry[0] == 2)
                    ref = chatRoomRef.child("Location");
                else if(entry[0] == 3)
                    ref = chatRoomRef.child("Group");
                else if(entry[0] == 4)
                    ref = chatRoomRef.child("Private");
                ref.child(entry).child("listOfInvites").child(ID).remove();
                ref.child(entry).child("listOfUsers").once("value").then(function(babySnapshot) {
                    var j = 0;
                    babySnapshot.forEach(function(infantSnapshot) {
                        j++;
                        if(infantSnapshot.val().startsWith(ID)) {
                            ref.child(entry).child("listOfUsers").child(infantSnapshot.key).remove();
                        }
                    });
                    if(j <= 1) {
                        ref.child(entry).remove();
                    }
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
              if(childSnapshot.val().substring(0, 4) == ID) {
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

  function updateInternChatDetails(chatRoomRef, internRef, ID) {
      item = ID + "$:$";
      internRef.child(ID).once("value").then(function(snapshot) {
          item += snapshot.val().firstName + " " + snapshot.val().lastName + "$:$";
          internRef.child(ID).child("images").once("value").then(function(childSnapshot) {
              item += childSnapshot.val().image + "$:$";
              internRef.child(ID).child("basic").once("value").then(function(babySnapshot) {
                  item += babySnapshot.val().description;
                  internRef.child(ID).child("listOfChatRooms").once("value").then(function(infantSnapshot) {
                      infantSnapshot.forEach(function(grandSnapshot) {
                          var ref;
                          if(grandSnapshot.val()[0] == 1)
                              ref = chatRoomRef.child("Company").child(grandSnapshot.val());
                          else if(grandSnapshot.val()[0] == 2)
                              ref = chatRoomRef.child("Location").child(grandSnapshot.val());
                          else if(grandSnapshot.val()[0] == 3)
                              ref = chatRoomRef.child("Group").child(grandSnapshot.val());
                          else if(grandSnapshot.val()[0] == 4)
                              ref = chatRoomRef.child("Private").child(grandSnapshot.val());
                          ref.child("listOfUsers").once("value").then(function(parentSnapshot) {
                              parentSnapshot.forEach(function(adultSnapshot) {
                                  if(adultSnapshot.val().substring(0, 4) == ID) {
                                      ref.child("listOfUsers").update({
                                          [adultSnapshot.key]: item
                                      });
                                      return true;
                                  }
                              });
                          });
                      });
                  });
              });
          });
      });
  }

  function updateEmployeeChatDetails(chatRoomRef, employeeRef, ID) {
      item = ID + "$:$";
      employeeRef.child(ID).once("value").then(function(snapshot) {
          item += snapshot.val().firstName + " " + snapshot.val().lastName + "$:$";
          employeeRef.child(ID).child("images").once("value").then(function(childSnapshot) {
              item += childSnapshot.val().image + "$:$";
              item += snapshot.val().description;
              employeeRef.child(ID).child("listOfChatRooms").once("value").then(function(infantSnapshot) {
                  infantSnapshot.forEach(function(grandSnapshot) {
                      var ref;
                      if(grandSnapshot.val()[0] == 1)
                          ref = chatRoomRef.child("Company").child(grandSnapshot.val());
                      else if(grandSnapshot.val()[0] == 4)
                          ref = chatRoomRef.child("Private").child(grandSnapshot.val());
                      ref.child("listOfMods").once("value").then(function(parentSnapshot) {
                          parentSnapshot.forEach(function(adultSnapshot) {
                              console.log(adultSnapshot.val())
                              if(adultSnapshot.val().substring(0, 4) == ID) {
                                  ref.child("listOfMods").update({
                                      [adultSnapshot.key]: item
                                  });
                                  return true;
                              }
                          });
                      });
                  });
              });
          });
      });
  }

  function acceptInvite(chatRoomRef, name, ID) {
      chatRoomRef.child(name).child("listOfInvites").update({
          [ID]: true
      });
  }
