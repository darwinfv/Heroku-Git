
	module.exports = {
		getMasterListOfInterns,
		getCompany,
		getEmployee,
		getIntern,
		getBasicPreferences,
		getHousingPreferences,
		getRoommatePreferences,
		verifyUser,
		verifyUserExists,
		getMessages,
		getChatRooms,
		getUsersInChatRoom,
		getModsInChatRoom,
		compareInterns,
		getImage
	}

	function getMasterListOfInterns(internRef, company, callback) {
		var master = {};
		internRef.once("value").then(function(snapshot) {
			snapshot.forEach(function(childSnapshot) {
    			if(childSnapshot.val().company == company) {
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

	function getMessages(chatRoomRef, name, callback) {
		var ref = chatRoomRef.child(name).child("listOfMessages");
		var list = {};
		ref.once("value").then(function(snapshot) {
			list = snapshot.val();
			callback(list);
		});
	}

	function getChatRooms(relevantRef, ID, callback) {
		var list = {};
		var i = 0;
		relevantRef.child(ID).child("listOfChatRooms").once("value").then(function(snapshot) {
			snapshot.forEach(function(childSnapshot) {
				list[i] = childSnapshot.val();
				i++;
			});
			callback(list);
		});
	}

	function getUsersInChatRoom(relevantRef, name, callback) {
		var list = {};
		var i = 0;
		relevantRef.child(name).child("listOfUsers").once("value").then(function(snapshot) {
			snapshot.forEach(function(childSnapshot) {
				list[i] = childSnapshot.val();
				i++;
			});
			callback(list);
		});
	}

	function getModsInChatRoom(companyChatRoomRef, name, callback) {
		var list = {};
		var i = 0;
		companyChatRoomRef.child(name).child("listOfMods").once("value").then(function(snapshot) {
			snapshot.forEach(function(childSnapshot) {
				list[i] = childSnapshot.val();
				i++;
			});
			callback(list);
		});
	}

	function compareInterns(internRef, ID1, ID2, callback) {
		var score = 0;
		var housing1 = getHousingPreferences(internRef, ID1, function(housing1) {
      // document.write(JSON.stringify(housing1));
			// document.write(housing1["desiredPrice"]);
			var housing2 = getHousingPreferences(internRef, ID2, function(housing2) {
      	// document.write(JSON.stringify(housing2));
				// Code below is executed before housing1 and housing2 values are retrieved
				// document.write(housing1["desiredPrice"]);
				// document.write(housing1["desiredPrice"]);
				if (housing1["desiredDuration"] === housing2["desiredDuration"])
					score += 15;
				// document.write(score);
				score += 10 - Math.abs(parseInt(housing1["desiredPrice"]) - parseInt(housing2["desiredPrice"]));
				score += 10 - Math.abs(parseInt(housing1["desiredDistance"]) - parseInt(housing2["desiredDistance"]));
				score += 10 - Math.abs(parseInt(housing1["desiredRoommate"]) - parseInt(housing2["desiredRoommate"]));
				// document.write(score + "!\n");
    		});
  		});

    	var roommate1 = getRoommatePreferences(internRef, ID1, function(roommate1) {
      		// document.write(JSON.stringify(roommate1));
      		var roommate2 = getRoommatePreferences(internRef, ID2, function(roommate2) {
      			//document.write(JSON.stringify(roommate2));
      			// Code below is executed before roommate1 and roommate2 values are retrieved
				score += (24 - Math.abs(parseInt(roommate1["bedtime"]) - parseInt(roommate2["bedtime"])))/4;
				// document.write(score + "!\n");
				score += (24 - Math.abs(parseInt(roommate1["waketime"]) - parseInt(roommate2["waketime"])))/4;
				score += 5 - Math.abs(parseInt(roommate1["lights"]) - parseInt(roommate2["lights"]));
				score += (5 - Math.abs(parseInt(roommate1["clean"]) - parseInt(roommate2["clean"]))) * 2;
				score += 5 - Math.abs(parseInt(roommate1["sharing"]) - parseInt(roommate2["sharing"]));
				score += 3 - Math.abs(parseInt(roommate1["smoke"]) - parseInt(roommate2["smoke"]));
				score += 5 - Math.abs(parseInt(roommate1["youpet"]) - parseInt(roommate2["youpet"]));
				if (roommate1["themguest"] === roommate2["themguest"])
					score += 5;
				if (roommate1["youpet"] === roommate2["thempet"])
					score += 5;
				if (roommate2["youpet"] === roommate1["thempet"])
					score += 5;
				//document.write(score);
				callback(score);
    		});
    	});
	}

	function getImage(internRef, ID, callback) {
		internRef.child(ID).child("images").once("value").then(function(snapshot) {
			callback(snapshot.val());
		});
	}
