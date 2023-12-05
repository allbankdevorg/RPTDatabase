function addUsers(formData) {
    console.log(formData);
    
    //   var settings = {
    //     "url": "http://10.232.236.15:8092/api/addData",
    //     "method": "POST",
    //     "timeout": 0,
    //     "headers": {
    //       "Content-Type": "application/json"
    //     },
    //     "data": JSON.stringify({
    //       "cmd": 2,
    //       "request": {
    //         "cis_number": directData.cisNumber,
    //         "fname": directData.dFirstName,
    //         "mname": directData.dMiddleName,
    //         "lname": directData.dLastName,
    //         "position": directData.dPosition,
    //         "com_cisnumber": selectedCompCISNumber
    //       }
    //     }),
    //   };
      
    //   $.ajax(settings).done(function (response) {
    //     Swal.fire(`${response.result[0].message}`, ``, `${response.result[0].status}`);
    //   });
    }
  
  
    module.exports = {
        addUsers,
    };