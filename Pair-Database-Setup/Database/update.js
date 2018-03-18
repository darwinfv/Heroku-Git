
  module.exports = {
      getSnapshot,
      updateCompany,
      updateEmployee,
      updateIntern,
      updatePassword,
      removeIntern,
      removeFromChat,
			banIntern,
			unbanIntern
  }

var update = require("./update.js")
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

  function removeIntern(internRef, ID) {
  	internRef.child(ID).remove();
      return true;
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

  function updateImage(internRef, ID, base64image) {
    //internRef.child(ID).putString(base64image, 'data_url');
    internRef.child(ID).update({
      "image": base64image
    });
  }

	function banIntern(internRef, ID) {
        internRef.child(ID).child("listOfChatRooms").update({
            "ban": true
        });
    }

	function unbanIntern(internRef, ID) {
        internRef.child(ID).child("listOfChatRooms").update({
            "ban": false
        });
    }
