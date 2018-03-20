
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
	addMessageToChat
}

var update = require('./update.js');
var create = require('./create.js');

function createCompany(companyRef, companyName, listOfLocations = "novalue", listOfEmployees = "novalue") {
		companyRef.update({
			[companyName]: "novalue"
		});
		var pin = Math.floor(Math.random() * 9000) + 1000;
		companyRef.child(companyName).update({
			"pin": pin,
			"listOfLocations": listOfLocations,
			"listOfEmployees": listOfEmployees
		});
	}

function createIntern(internRef, id, email, company, location = "novalue") {
		internRef.update({
			[id]:"novalue"
		});
		internRef.child(id).update({
			"email": email,
			"company": company,
			"location": location,
			"listOfChatRooms": [2 + location, 1 + company + ", " + location]
		});
		internRef.child(id).child("listOfChatRooms").update({
			"ban": 0
		})
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
		update.updateCompany(companyRef, company, firstName + " " + lastName);
	}

function createPassword(internRef, ID, password) {
		internRef.child(ID).update({
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

function createProfilePicture(storageRef,internRef, ID, image) {
	var filename = [ID]; // image's name would be the intern's ID
	var storageRef = firebase.storage().ref('/ProfilePictures' + filename);
	var uploadTask = storageRef.put(image);
	uploadTask.on('state_changed', function(snapshot) {
	}, function() {
		var downloadURL = uploadTask.snapshot.downloadURL;
		internRef.child(ID).update({
				"ProfilePicture": downloadURL
			});
		})
}

/*
	/ @brief this function adds users to the area/city
	/        chat room
	/
	/ @usage call this function after createIntern to add
	/        them to the area/city chat room
*/

function addToLocationChat(locationChatRoomRef, location, user) {
	update.getSnapshot(locationChatRoomRef, 2 + location, "listOfUsers", user);
}

function addEmployeeToCompanyChat(companyChatRoomRef, company, location, listOfEmployees) {
	update.getSnapshot(companyChatRoomRef, 1 + company + ", " + location, "listOfMods", listOfEmployees);
}

function addInternToCompanyChat(companyChatRoomRef, company, location, user) {
	update.getSnapshot(companyChatRoomRef, 1 + company + ", " + location, "listOfUsers", user);
}

function createGroupChat(groupChatRoomRef, internRef, ID, name, callback) {
	groupChatRoomRef.child(3 + name).once("value").then(function(snapshot) {
		if(snapshot.exists()) {
			callback(false);
		}
		else {
			groupChatRoomRef.child(3 + name).update({
				"listOfUsers": [ID]
			});
			update.getSnapshot(internRef, ID, "listOfChatRooms", 3 + name);
			callback(true);
		}
	});
}

function addToGroupChat(groupChatRoomRef, internRef, ID, name) {
	update.getSnapshot(groupChatRoomRef, name, "listOfUsers", ID);
	update.getSnapshot(internRef, ID, "listOfChatRooms", name);
}

//incomplete function, do not use it
function createPrivateChat(privateChatRoomRef, internRef, ID1, ID2, name, callback) {
	privateChatRoomRef.child(4 + name).once("value").then(function(snapshot) {
		if(snapshot.exists()) {
			callback(false);
		}
		else {
			groupChatRoomRef.child(3 + name).update({
				"listOfUsers": [ID]
			});
			update.getSnapshot(internRef, ID, "listOfChatRooms", 3 + name);
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
