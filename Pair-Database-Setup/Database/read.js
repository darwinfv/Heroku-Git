
	module.exports = {
		getMasterListOfInterns,
		getCompanyFromPin,
		getCompanyFromName,
		verifyCompany,
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
		compareTwoInterns,
		compareInterns,
		getImage,
		getAdmin,
		getAdminCompanies,
		getInvite,
		verifyUserChatroom,
		getNotifications,
		getReviews,
		getHouses,
		getSavedHouses,
		getBlockedUsers
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
    				master[key]["endDate"] = childSnapshot.val().endDate;
    			}
    		});
    		callback(master);
    	});
	}

	function getCompanyFromPin(companyRef, pin, callback) {
		var json = {};
		companyRef.once("value").then(function(snapshot) {
			snapshot.forEach(function(childSnapshot) {
				if(childSnapshot.val().pin == pin) {
					json["name"] = childSnapshot.key;
					json["pin"] = childSnapshot.val().pin;
					json["email"] = childSnapshot.val().email;
					json["locations"] = {};
					childSnapshot.child("listOfLocations").forEach(function(babySnapshot) {
						json["locations"][babySnapshot.key] = babySnapshot.val();
					});
					json["employees"] = {};
					childSnapshot.child("listOfEmployees").forEach(function(babySnapshot) {
						json["employees"][babySnapshot.key] = babySnapshot.val();
					});
					json["verified"] = snapshot.val().verified;
				}
			});
			callback(json);
		});
	}

	function getCompanyFromName(companyRef, name, callback) {
		var json = {};
		companyRef.child(name).once("value").then(function(snapshot) {
			json["name"] = snapshot.key;
			json["pin"] = snapshot.val().pin;
			json["email"] = snapshot.val().email;
			json["locations"] = {};
			snapshot.child("listOfLocations").forEach(function(childSnapshot) {
				json["locations"][childSnapshot.key] = childSnapshot.val();
			});
			json["employees"] = {};
			snapshot.child("listOfEmployees").forEach(function(childSnapshot) {
				json["employees"][childSnapshot.key] = childSnapshot.val();
			});
			json["verified"] = snapshot.val().verified;
			callback(json);
		});
	}

	function verifyCompany(companyRef, email, password, callback) {
		var correctPassword;
		var flag = 0;
		companyRef.once("value").then(function(snapshot) {
			snapshot.forEach(function(childSnapshot) {
				if(email == childSnapshot.val().email) {
					correctPassword = childSnapshot.val().password;
					if (password == correctPassword) {
						flag = 1;
						return callback(childSnapshot.key);
					}
					else {
						flag = 1;
						return callback(false);
					}
				}
			});
			if(flag == 0)
				callback(false);
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
			list["listOfComplaints"] = {};
			snapshot.child("listOfComplaints").forEach(function(childSnapshot) {
				list["listOfComplaints"][childSnapshot.key] = childSnapshot.val();
			});
			snapshot.child("images").forEach(function(childSnapshot) {
				list["image"] = childSnapshot.val();
			});
			list["listOfChatRooms"] = {};
			var i = 0;
			snapshot.child("listOfChatRooms").forEach(function(childSnapshot) {
				list["listOfChatRooms"][i] = childSnapshot.val();
				i++;
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
			list["banned"] = snapshot.val().ban;
			list["endDate"] = snapshot.val().endDate;
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
			snapshot.child("images").forEach(function(childSnapshot) {
				list["image"] = childSnapshot.val();
			});
			list["listOfChatRooms"] = {};
			var i = 0;
			snapshot.child("listOfChatRooms").forEach(function(childSnapshot) {
				list["listOfChatRooms"][i] = childSnapshot.val();
				i++;
			});
			i = 0;
			list["listOfBlockedUsers"] = {};
			snapshot.child("listOfBlockedUsers").forEach(function(childSnapshot) {
				list["listOfBlockedUsers"][i] = childSnapshot.val();
				i++;
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

	function compareTwoInterns(internRef, ID1, ID2, callback) {
		var score = 0;
		var housing1 = getHousingPreferences(internRef, ID1, function(housing1) {
			var housing2 = getHousingPreferences(internRef, ID2, function(housing2) {
				if (housing1["desiredDuration"] === housing2["desiredDuration"])
					score += 15;
				score += 10 - Math.abs(parseInt(housing1["desiredPrice"]) - parseInt(housing2["desiredPrice"]));
				score += 10 - Math.abs(parseInt(housing1["desiredDistance"]) - parseInt(housing2["desiredDistance"]));
				score += 10 - Math.abs(parseInt(housing1["desiredRoommate"]) - parseInt(housing2["desiredRoommate"]));
    		});
  		});

    	var roommate1 = getRoommatePreferences(internRef, ID1, function(roommate1) {
      		var roommate2 = getRoommatePreferences(internRef, ID2, function(roommate2) {
				score += (24 - Math.abs(parseInt(roommate1["bedtime"]) - parseInt(roommate2["bedtime"])))/4;
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
				callback(score);
    		});
    	});
	}

	function compareInterns(internRef, ID1, IDs, callback) {
		let scores = {};
		for (let i = 0, p = Promise.resolve(); i < IDs.length; i++) {
	    	p = p.then(_ => new Promise(resolve =>
		        setTimeout(function () {
					var score = compareTwoInterns(internRef, ID1, IDs[i], function(score) {
						scores[i] = score;
						if (i === IDs.length - 1) {
							callback(scores);
						}
					})
		            resolve();
		        }, 100)
	    	));
		}
	}

	function getImage(relevantRef, ID, callback) {
		relevantRef.child(ID).child("images").once("value").then(function(snapshot) {
			callback(snapshot.val());
		});
	}

	function getAdmin(adminRef, callback) {
		var list = {};
		adminRef.child(4000).child("listOfComplaints").once("value").then(function(snapshot) {
			list = snapshot.val();
			callback(list);
		});
	}

	function getAdminCompanies(adminRef, callback) {
		var list = {};
		var i = 0;
		adminRef.child(4000).child("listOfCompanies").once("value").then(function(snapshot) {
			snapshot.forEach(function(childSnapshot) {
				list[i] = childSnapshot.val();
				i++;
			});
			callback(list);
		});
	}

	function getInvite(chatRoomRef, name, ID, callback) {
		chatRoomRef.child(name).child("listOfInvites").child(ID).once("value").then(function(snapshot) {
			callback(snapshot.val());
		});
	}

	function verifyUserChatroom(relevantRef, ID, name, callback) {
	    var flag = false;
	    if(ID.charAt(0) == '1') {
			relevantRef.child(name).child("listOfUsers").once("value").then(function(snapshot) {
		    	snapshot.forEach(function(childSnapshot) {
		        	if(childSnapshot.val().startsWith(ID)) {
		            	flag = true;
		            }
		        });
				callback(flag);
			});
	    }
	    else if(ID.charAt(0) == '2' && name.charAt(0) == '1') {
			relevantRef.child(name).child("listOfMods").once("value").then(function(snapshot) {
				snapshot.forEach(function(childSnapshot) {
	            	if(childSnapshot.val().startsWith(ID)) {
						flag = true;
	            	}
	            });
	        	callback(flag);
	    	});
	    }
	    else if(ID.charAt(0) == '2' && name.charAt(0) == '4') {
			relevantRef.child(name).child("listOfUsers").once("value").then(function(snapshot) {
				snapshot.forEach(function(childSnapshot) {
	            	if(childSnapshot.val().startsWith(ID)) {
						flag = true;
	            	}
	            });
	        	callback(flag);
	    	});
	    }
	    else {
			callback(false);
	    }
	}

	function getNotifications(internRef, ID, callback) {
		var list = {};
		internRef.child(ID).child("listOfNotifications").once("value").then(function(snapshot) {
			list = snapshot.val();
			callback(list);
		});
	}

	function getReviews(houseRef, house, callback) {
		var split = house.split(" ");
    	var state = split[split.length - 2];
    	var zip = split[split.length - 1];
		var list = {};
		var i = 0;
		houseRef.child(state).child(zip).child(house).child("listOfReviews").once("value").then(function(snapshot) {
			snapshot.forEach(function(childSnapshot) {
				list[i] = childSnapshot.val();
				i++;
			});
			callback(list);
		});
	}

	function getHouses(houseRef, state, callback) {
		houseRef.child(state).once("value").then(function(snapshot) {
			callback(snapshot.val());
		});
	}

	function getSavedHouses(groupChatRoomRef, houseRef, name, callback) {
		var list = {};
		//orderByChild("likes")
		groupChatRoomRef.child(name).child("listOfHouses").once("value").then(function(snapshot) {
			list = snapshot.val();
			var size = Object.keys(list).length;
			var i = 0;
			for (var key in list) {
			    if (list.hasOwnProperty(key)) {
		    		var split = key.split(" ");
			    	var state = split[split.length - 2];
			    	var zip = split[split.length - 1];
					houseRef.child(state).child(zip).child(key).once("value").then(function(childSnapshot) {
						var likes = list[key];
						list[key] = childSnapshot.val();
						list[key]["likes"] = likes;
						i++;
						if(i == size)
							callback(list);
					});
			    }
			}
		});
	}

	function getBlockedUsers(internRef, ID, callback) {
		var list = {};
		var i = 0;
		internRef.child(ID).child("listOfBlockedUsers").once("value").then(function(snapshot) {
			snapshot.forEach(function(childSnapshot) {
				list[i] = childSnapshot.val();
				i++;
			});
			callback(list);
		});
	}
