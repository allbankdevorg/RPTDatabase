
// function createDosri(formData) {
//     var settings = {
//       "url": "http://10.232.236.15:8092/api/addData",
//       "method": "POST",
//       "timeout": 0,
//       "headers": {
//         "Content-Type": "application/json"
//       },
//       "data": JSON.stringify({
//         "cmd": 1,
//         "request": {
//               "cis_number": formData.cisNumber,       // Use form data
//               "account_name": formData.accountName,   // Use form data
//               "company_name": formData.companyName    // Use form data
//             }
//       }),
//     };

    
//     $.ajax(settings).done(function (response) {
//       Swal.fire(`${response.result[0].message}`, ``, `${response.result[0].status}`);
//     });

//   }

//   // Export your functions
//   module.exports = {
//     createDosri
//   };