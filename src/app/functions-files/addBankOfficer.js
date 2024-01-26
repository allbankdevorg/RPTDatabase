// function createBankOfficer(boData) {
//     // Implement code to insert a new director into the database
//     var settings = {
//       "url": "http://10.232.236.15:8092/api/addData",
//       "method": "POST",
//       "timeout": 0,
//       "headers": {
//         "Content-Type": "application/json"
//       },
//       "data": JSON.stringify({
//         "cmd": 4,
//         "request": {
//           "cis_number": boData.boCisNumber,
//           "fname": boData.boFirstName,
//           "mname": boData.boMiddleName,
//           "lname": boData.boLastName,
//           "position": boData.boPosition,
//           "com_cisnumber": "1111111"
//         }
//       }),
//     };
    
//     $.ajax(settings).done(function (response) {
//       Swal.fire(`${response.result[0].message}`, ``, `${response.result[0].status}`);
//     });
//   }


//   module.exports = {
//     createBankOfficer,
//   };