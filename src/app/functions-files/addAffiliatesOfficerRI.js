function createAffilOffRI(OffriData, buttonId, selectedOffCisNumber) {
    console.log(OffriData)
    console.log(buttonId)
    console.log(selectedOffCisNumber)
    var settings = {
      "url": "http://10.232.236.15:8092/api/addData",
      "method": "POST",
      "timeout": 0,
      "headers": {
        "Content-Type": "application/json"
      },
      "data": JSON.stringify({
        "cmd": 9,
        "request": {
          "cis_number": OffriData.riCisNumber,
          "fname": OffriData.riFirstName,
          "mname": OffriData.riMiddleName,
          "lname": OffriData.riLastName,
          "off_related": selectedOffCisNumber,
          "relation": buttonId
        }
      }),
    };
    
    $.ajax(settings).done(function (response) {
      Swal.fire(`${response.result[0].message}`, ``, `${response.result[0].status}`);
    });

 }

 module.exports = {
    createAffilOffRI,
    // readDosri,
    // updateDosri,
    // deleteDosri,
  };