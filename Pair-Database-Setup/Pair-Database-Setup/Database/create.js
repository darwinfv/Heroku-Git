	
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

    function pad(n, width, z) {
	  z = z || '0';
	  n = n + '';
	  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
	}

	function hashCode(s) {
		return s.substring(0, s.indexOf("@"));
	};

    function getID(length) {
    	var characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
		var size = 5;
		var id = '';
		for (var i = 0; i < size; i++) {
		    id += characters.charAt(Math.floor(Math.random() * characters.length));
		}
		length = pad(length, 4);
		id += length;
		return(id);
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

    function createEmployee(employeeRef, id, firstName, lastName, password, email, company, location, description, facebook, linkedin, twitter) {
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
    }

    function createPassword(internRef, ID, password) {
    	internRef.child(ID).update({
    		"password": password
    	})
    }

    function createPreferences(internRef, ID, options) {
    	internRef.child(ID).update({
    		"options": options
    	});
    	/*for (var i = 0; i < options.length; i++) {
    		var name = "option" + i;
    		internRef.child(ID).child("options").update({
    			[name]: options[i]
    		});
    	}*/
    }

