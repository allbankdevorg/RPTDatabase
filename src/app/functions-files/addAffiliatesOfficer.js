function createAffilOff(offData, compId) {
    console.log(offData)
    console.log(compId)
   var settings = {
     "url": "http://10.232.236.15:8092/api/addData",
     "method": "POST",
     "timeout": 0,
     "headers": {
       "Content-Type": "application/json"
     },
     "data": JSON.stringify({
       "cmd": 8,
       "request": {
             "cis_number": dirData.affildcisNumber,       // Use form data
             "fname": dirData.affildFirstName, 
             "mname": dirData.affildMiddleName, 
             "lname": dirData.affildLastName,
             "position": dirData.affildPosition,    // Use form data
             "com_cisnumber": compId    // Use form data
           }
     }),
   };

   
   $.ajax(settings).done(function (response) {
     Swal.fire(`${response.result[0].message}`, ``, `${response.result[0].status}`);
   });

 }

 module.exports = {
    createAffilOff,
    // readDosri,
    // updateDosri,
    // deleteDosri,
  };