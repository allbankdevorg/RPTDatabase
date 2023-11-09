function createBankOfficerRelationship(boRIData, buttonId, selectedcomCisNumber) {
    console.log(boRIData)
    console.log(buttonId)
    console.log(selectedcomCisNumber)
    // Implement code to insert a new director into the database
    var settings = {
      "url": "http://10.232.236.15:8092/api/addData",
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
          "off_related": selectedcomCisNumber,
          "relation": buttonId
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