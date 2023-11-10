function createRPDIrectorsRelatedInterest(riData, buttonId, selectedOffCisNumber) {

    console.log(buttonId)
    console.log(selectedOffCisNumber)
    console.log(riData)
    var settings = {
      "url": "http://10.232.236.15:8092/api/addData",
      "method": "POST",
      "timeout": 0,
      "headers": {
        "Content-Type": "application/json"
      },
      "data": JSON.stringify({
        "cmd": 10,
        "request": {
          "cis_number": riData.riCisNumber,
          "fname": riData.riFirstName,
          "mname": riData.riMiddleName,
          "lname": riData.riLastName,
          "dir_related": selectedOffCisNumber,
          "relation": buttonId
        }
      }),
    };
    
    $.ajax(settings).done(function (response) {
      Swal.fire(`${response.result[0].message}`, ``, `${response.result[0].status}`);
      console.log(response);
    });
    // Implement code to insert a new director into the database
  }


  module.exports = {
    createRPDIrectorsRelatedInterest,
  };