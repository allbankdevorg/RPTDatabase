function createBankOfficerRelationship(boRIData) {
    console.log(boRIData)
    // Implement code to insert a new director into the database
    var settings = {
      "url": "http://10.0.0.208:8090/api/addData",
      "method": "POST",
      "timeout": 0,
      "headers": {
        "Content-Type": "application/json"
      },
      "data": JSON.stringify({
        "cmd": 5,
        "request": {
          "cis_number": boRIData.boRICisNumber,
          "fname": boRIData.boRIFirstName,
          "mname": boRIData.boRIMiddleName,
          "lname": boRIData.boRILastName,
          "off_related": "23213213",
          "relation": 1
        }
      }),
    };
    
    $.ajax(settings).done(function (response) {
      Swal.fire(`${response.result[0].message}`, ``, `${response.result[0].status}`);
    });
  }


  module.exports = {
    createBankOfficerRelationship,
  };