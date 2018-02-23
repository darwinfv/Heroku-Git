module.exports = {
	getMasterListOfInterns,
	getLocations,
	getCompany,
	getEmployee,
	getIntern,
	getBasicPreferences,
	getHousingPreferences,
	getRoommatePreferences,
	verifyEmployee,
	verifyIntern
}

function getMasterListOfInterns(internRef, company, callback) {
	var master = {};
	internRef.once("value").then(function(snapshot) {
		snapshot.forEach(function(childSnapshot) {
				if(childSnapshot.val().company == company){
					var key = childSnapshot.key;
					master[key] = {};
					master[key]["firstName"] = childSnapshot.val().firstName;
					master[key]["lastName"] = childSnapshot.val().lastName;
					master[key]["email"] = childSnapshot.val().email;
					master[key]["location"] = childSnapshot.val().lcoation;
					master[key]["phone"] = childSnapshot.val().phone;
				}
			});
			callback(master);
		});
}

function getLocations(companyRef, company, callback) {
	var list = [];
	companyRef.child(company).child("listOfLocations").once("value").then(function(snapshot) {
		snapshot.forEach(function(childSnapshot) {
					var item = childSnapshot.val();
					list.push(item);
				});
				callback(list);
	});
}

function getCompany(companyRef, pin, callback) {
	companyRef.once("value").then(function(snapshot) {
		snapshot.forEach(function(childSnapshot) {
			if(childSnapshot.val().pin == pin) {
				getLocations(companyRef, childSnapshot.key, (list) => {
					callback(list);
				});
			}
		});
		callback(null);
	});
}

function getEmployee(employeeRef, ID, callback) {
	var list = [];
	var ref = employeeRef.child(ID);
	ref.once("value").then(function(snapshot) {
		snapshot.forEach(function(childSnapshot) {
			var data = childSnapshot.val();
			list.push(data);
		});
		callback(list);
	});
}

function getIntern(internRef, ID, callback) {
	var list = [];
	var ref = internRef.child(ID);
	ref.once("value").then(function(snapshot) {
		snapshot.forEach(function(childSnapshot) {
			var data = childSnapshot.val();
			list.push(data);
		});
		callback(list);
	});
}

function getBasicPreferences(internRef, ID, callback) {
	var options = {};
	var ref = internRef.child(ID).child("basic");
	ref.once("value").then(function(snapshot) {
		snapshot.forEach(function(childSnapshot) {
			options["description"] = childSnapshot.val().description;
			options["fbLink"] = childSnapshot.val().fbLink;
			options["firstName"] = childSnapshot.val().firstName;
			options["lastName"] = childSnapshot.val().lastName;
			options["linkedInLink"] = childSnapshot.val().linkedInLink;
			options["twitterLink"] = childSnapshot.val().twitterLink;
		});
		callback(options);
	});
}

function getHousingPreferences(internRef, ID, callback) {
	var options = {};
	var ref = internRef.child(ID).child("basic");
	ref.once("value").then(function(snapshot) {
		snapshot.forEach(function(childSnapshot) {
			options["desiredDistance"] = childSnapshot.val().desiredDistance;
			options["desiredDuration"] = childSnapshot.val().desiredDuration;
			options["desiredPrice"] = childSnapshot.val().desiredPrice;
			options["desiredRoommate"] = childSnapshot.val().desiredRoommate;
		});
		callback(options);
	});
}

function getRoommatePreferences(internRef, ID, callback) {
	var options = {};
	var ref = internRef.child(ID).child("basic");
	ref.once("value").then(function(snapshot) {
		snapshot.forEach(function(childSnapshot) {
			options["bedtime"] = childSnapshot.val().bedtime;
			options["clean"] = childSnapshot.val().clean;
			options["lights"] = childSnapshot.val().lights;
			options["sharing"] = childSnapshot.val().sharing;
			options["smoke"] = childSnapshot.val().smoke;
			options["themguest"] = childSnapshot.val().themguest;
			options["youguest"] = childSnapshot.val().youguest;
			options["thempet"] = childSnapshot.val().thempet;
			options["youpet"] = childSnapshot.val().youpet;
			options["waketime"] = childSnapshot.val().waketime;
		});
		callback(options);
	});
}

function verifyEmployee(employeeRef, ID, password, callback) {
	var ref = employeeRef.child(ID).child("password");
	var correctPassword;
	ref.once("value").then(function(snapshot) {
		correctPassword = snapshot.val();
		if (password == correctPassword) {
			callback(ID);
		}
		else {
			callback(null);
		}
	});
}

function verifyIntern(internRef, ID, password, callback) {
	var ref = internRef.child(ID).child("password");
	var correctPassword;
	ref.once("value").then(function(snapshot) {
		correctPassword = snapshot.val();
		if (password == correctPassword) {
			callback(ID);
		}
		else {
			callback("SHIIIIIT");
		}
	});
}
