function createAffilDir(dirData, compId) {
    console.log(dirData)
    console.log(compId)
   var settings = {
     "url": "http://10.0.0.208:8090/api/addData",
     "method": "POST",
     "timeout": 0,
     "headers": {
       "Content-Type": "application/json"
     },
     "data": JSON.stringify({
       "cmd": 7,
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
    createAffilDir,
    // readDosri,
    // updateDosri,
    // deleteDosri,
  };