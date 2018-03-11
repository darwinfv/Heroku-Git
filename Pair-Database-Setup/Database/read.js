
module.exports = {
		getMasterListOfInterns,
		getCompany,
		getEmployee,
		getIntern,
		getBasicPreferences,
		getHousingPreferences,
		getRoommatePreferences,
		verifyUser,
		verifyUserExists
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

	function getCompany(companyRef, pin, callback) {
		var json = {};
		companyRef.once("value").then(function(snapshot) {
			snapshot.forEach(function(childSnapshot) {
				if(childSnapshot.val().pin == pin) {
					json["name"] = childSnapshot.key;
					json["pin"] = childSnapshot.val().pin;
					json["locations"] = {};
					childSnapshot.child("listOfLocations").forEach(function(babySnapshot) {
						json["locations"][babySnapshot.key] = babySnapshot.val();
					});
					json["employees"] = {};
					childSnapshot.child("listOfEmployees").forEach(function(babySnapshot) {
						json["employees"][babySnapshot.key] = babySnapshot.val();
					});
				}
			});
			callback(json);
		});
	}

	function getEmployee(employeeRef, ID, callback) {
		var list = {};
		var ref = employeeRef.child(ID);
		ref.once("value").then(function(snapshot) {
			list["firstName"] = snapshot.val().firstName;
			list["lastName"] = snapshot.val().lastName;
			list["company"] = snapshot.val().company;
			list["email"] = snapshot.val().email;
			list["location"] = snapshot.val().location;
			list["description"] = snapshot.val().description;
			list["links"] = {};
			snapshot.child("links").forEach(function(childSnapshot) {
				list["links"][childSnapshot.key] = childSnapshot.val();
			});
			callback(list);
		});
	}

	function getIntern(internRef, ID, callback) {
		var list = {};
		var ref = internRef.child(ID);
		ref.once("value").then(function(snapshot) {
			list["firstName"] = snapshot.val().firstName;
			list["lastName"] = snapshot.val().lastName;
			list["company"] = snapshot.val().company;
			list["email"] = snapshot.val().email;
			list["location"] = snapshot.val().location;
			list["phone"] = snapshot.val().phone;
			list["basic"] = {};
			snapshot.child("basic").forEach(function(childSnapshot) {
				list["basic"][childSnapshot.key] = childSnapshot.val();
			});
			list["housing"] = {};
			snapshot.child("housing").forEach(function(childSnapshot) {
				list["housing"][childSnapshot.key] = childSnapshot.val();
			});
			list["roommate"] = {};
			snapshot.child("roommate").forEach(function(childSnapshot) {
				list["roommate"][childSnapshot.key] = childSnapshot.val();
			});
			callback(list);
		});
	}

	function getBasicPreferences(internRef, ID, callback) {
		var options = {};
		var ref = internRef.child(ID).child("basic");
		ref.once("value").then(function(snapshot) {
			options["description"] = snapshot.val().description;
			options["fbLink"] = snapshot.val().fbLink;
			options["linkedInLink"] = snapshot.val().linkedInLink;
			options["twitterLink"] = snapshot.val().twitterLink;
			callback(options);
		});
	}

	function getHousingPreferences(internRef, ID, callback) {
		var options = {};
		var ref = internRef.child(ID).child("housing");
		ref.once("value").then(function(snapshot) {
			options["desiredDistance"] = snapshot.val().desiredDistance;
			options["desiredDuration"] = snapshot.val().desiredDuration;
			options["desiredPrice"] = snapshot.val().desiredPrice;
			options["desiredRoommate"] = snapshot.val().desiredRoommate;
			callback(options);
		});
	}

	function getRoommatePreferences(internRef, ID, callback) {
		var options = {};
		var ref = internRef.child(ID).child("roommate");
		ref.once("value").then(function(snapshot) {
			options["bedtime"] = snapshot.val().bedtime;
			options["clean"] = snapshot.val().clean;
			options["lights"] = snapshot.val().lights;
			options["sharing"] = snapshot.val().sharing;
			options["smoke"] = snapshot.val().smoke;
			options["themguest"] = snapshot.val().themguest;
			options["youguest"] = snapshot.val().youguest;
			options["thempet"] = snapshot.val().thempet;
			options["youpet"] = snapshot.val().youpet;
			options["waketime"] = snapshot.val().waketime;
			callback(options);
		});
	}

	function verifyUser(relevantRef, ID, password, callback) {
		var ref = relevantRef.child(ID).child("password");
		var correctPassword;
		ref.once("value").then(function(snapshot) {
			correctPassword = snapshot.val();
			if (password == correctPassword) {
				callback(true);
			}
			else {
				callback(false);
			}
		});
	}

	function verifyUserExists(relevantRef, ID, callback) {
		var ref = relevantRef.child(ID);
		ref.once("value").then(function(snapshot) {
			callback(snapshot.exists());
			});
	}
