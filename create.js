module.exports = {
  createCompany,
  pad,
  getID,
  createIntern
}
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


  function getID(length) {
    var characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var size = 5;
    var id = '';
    for (var i = 0; i < size; i++) {
      id += characters.charAt(Math.floor(Math.random() * characters.length));
  }
}

  function createIntern(internRef,firstName, lastName, password, email, location = "novalue") {
    var newLength = 0;
    internRef.child('AAlength').once('value', function(snapshot) {
      newLength = snapshot.val();
      newLength = newLength + 1;
      internRef.update({
        "AAlength": newLength
      });
      var id = '90826'//getID(newLength);
      internRef.update({
        [id]:"novalue"
      })
      internRef.child(id).update({
        "firstName": firstName,
        "lastName": lastName,
        "email": email,
        "password": password,
        "location": location
    });
    });
  }
