function createRelatedInterest(riData, buttonId, selectedDirCisNumber) {

    console.log(buttonId)
    console.log(selectedDirCisNumber)
    console.log(riData)
    var settings = {
      "url": "http://10.0.0.208:8090/api/addData",
      "method": "POST",
      "timeout": 0,
      "headers": {
        "Content-Type": "application/json"
      },
      "data": JSON.stringify({
        "cmd": 3,
        "request": {
          "cis_number": riData.riCisNumber,
          "fname": riData.riFirstName,
          "mname": riData.riMiddleName,
          "lname": riData.riLastName,
          "dir_related": selectedDirCisNumber,
          "relation": buttonId
        }
      }),
    };
    
    $.ajax(settings).done(function (response) {
      Swal.fire(`${response.result[0].message}`, ``, `${response.result[0].status}`);
    });
    // Implement code to insert a new director into the database
  }


  module.exports = {
    createRelatedInterest,
  };