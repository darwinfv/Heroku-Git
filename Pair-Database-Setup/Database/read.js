
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
		list.push(company);
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
					//console.log(childSnapshot.val());
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
				callback(null);
			}
		});
	}
