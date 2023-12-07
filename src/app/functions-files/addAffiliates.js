// function createAffil(formData, moduleV) {
//   return new Promise((resolve, reject) => {
//     console.log(formData)
//     console.log(moduleV);
//     var settings = {
//       "url": "http://10.232.236.15:8092/api/addData",
//       "method": "POST",
//       "timeout": 0,
//       "headers": {
//         "Content-Type": "application/json"
//       },
//       "data": JSON.stringify({
//         "cmd": 6,
//         "request": {
//           "cis_number": formData.affilCisNumberM,
//           "account_name": formData.accountName,
//           "company_name": formData.companyName,
//           "manager": formData.commandControl,
//           "module": moduleV,
//         }
//       }),
//     };

//     $.ajax(settings).done(function (response) {
//       // Log the response
//       console.log(response.result[0].status);
      
//       // Check the status and resolve/reject the promise accordingly
//       Swal.fire(`${response.result[0].message}`, ``, `${response.result[0].status}`);
//       if (response.result[0].status === 'success') {
//         resolve(response);
//       } else {
//         reject(response);
//       }
//     });
//   });
   
//   //  $.ajax(settings).done(function (response) {
//   //    Swal.fire(`${response.result[0].message}`, ``, `${response.result[0].status}`);
//   //    console.log(response.result[0].status);
//   //    return response;
//   //   //  console.log(response);
//   //  });

   

   

//  }

//  module.exports = {
//     createAffil,
//     // readDosri,
//     // updateDosri,
//     // deleteDosri,
//   };