
module.exports = {
	createCompany,
	createIntern,
	createEmployee,
	createPassword,
	createBasicPreferences,
	createRoommatePreferences,
	createHousingPreferences,
	createProfilePicture
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
			"location": location
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
			"links": [facebook, linkedin, twitter]
		});
		update.updateCompany(companyRef, company, firstName + " " + lastName);
	}

	function createPassword(internRef, ID, password) {
		internRef.child(ID).update({
			"password": password
		})
	}

	function createBasicPreferences(internRef, ID, firstName, lastName, description,fbLink, twitterLink, linkedin) {
		internRef.child(ID).child('basic').update({
		"description": description,
		"fbLink": fbLink,
		"twitterLink": twitterLink,
		"linkedInLink": linkedin
	});
	update.updateIntern(internRef, ID, firstName, lastName, "phone")
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

	function createProfilePicture(internRef, ID, image) {
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
