/**
 *  - delDosri                            => Remove Company
 *  - delDosriDIR                         => Unlink Director
 *  - delDosriDRI                         => Unlink Director's Related Interest
 *  - delBankOff                          => Remove Bank Officers
 * 
 *  - delBankOffRI                        => Unlink Bank Officer's Related Interest
 */
 


/**
 * Remove a DOSRI Company
 * @param {any} cis_id - Contain the cisNumber as reference for the removimg
 */
function delDosri(cis_id) {
    return Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to Remove this DOSRI Company?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!'
    }).then((result) => {
      if (result.isConfirmed) {
        // Returning the promise here
        return new Promise((resolve, reject) => {
          console.log(cis_id);
          var settings = {
            "url": "http://10.232.236.15:8092/api/updateData",
            "method": "POST",
            "timeout": 0,
            "headers": {
              "Content-Type": "application/json"
            },
            "data": JSON.stringify({
              "cmd": 1,
              "request": {
                "cis_number": cis_id
              }
            }),
          };
          
  
          $.ajax(settings).done(function (response) {
            console.log(response.result[0].status);
  
            Swal.fire(`${response.result[0].message}`, ``, `${response.result[0].status}`);
            if (response.result[0].status === 'success') {
              resolve(response);
            } else {
              reject(response);
            }
          });
        });
      }
    });
  }


/**
 * Unlink a DOSRI Company DIrector
 * @param {any} cis_id - Contain the cisNumber as reference for the unlinking
 */
function delDosriDIR(cis_id) {
  return Swal.fire({
    title: 'Are you sure?',
    text: "Do you want to Unlink this DOSRI Company Director?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes!'
  }).then((result) => {
    if (result.isConfirmed) {
      // Returning the promise here
      return new Promise((resolve, reject) => {
        console.log(cis_id);
        var settings = {
          "url": "http://10.232.236.15:8092/api/updateData",
          "method": "POST",
          "timeout": 0,
          "headers": {
            "Content-Type": "application/json"
          },
          "data": JSON.stringify({
            "cmd": 2,
            "request": {
              "cis_number": cis_id
            }
          }),
        };
        

        $.ajax(settings).done(function (response) {
          console.log(response.result[0].status);

          Swal.fire(`${response.result[0].message}`, ``, `${response.result[0].status}`);
          if (response.result[0].status === 'success') {
            resolve(response);
          } else {
            reject(response);
          }
        });
      });
    }
  });
}


/**
 * Unlink a Director's Related Interest
 * @param {any} cis_id - Contain the cisNumber as reference for the unlinking
 */
function delDosriDRI(cis_id) {
  return Swal.fire({
    title: 'Are you sure?',
    text: "Do you want to Unlink this Related Interest?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes!'
  }).then((result) => {
    if (result.isConfirmed) {
      // Returning the promise here
      return new Promise((resolve, reject) => {
        console.log(cis_id);
        var settings = {
          "url": "http://10.232.236.15:8092/api/updateData",
          "method": "POST",
          "timeout": 0,
          "headers": {
            "Content-Type": "application/json"
          },
          "data": JSON.stringify({
            "cmd": 3,
            "request": {
              "cis_number": cis_id
            }
          }),
        };
        

        $.ajax(settings).done(function (response) {
          console.log(response.result[0].status);

          Swal.fire(`${response.result[0].message}`, ``, `${response.result[0].status}`);
          if (response.result[0].status === 'success') {
            resolve(response);
          } else {
            reject(response);
          }
        });
      });
    }
  });
}


/**
 * Remove Bank Officer
 * @param {any} cis_id - Contain the cisNumber as reference for the unlinking
 */
function delBankOff(cis_id) {
  return Swal.fire({
    title: 'Are you sure?',
    text: "Do you want to Remove this Officer?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes!'
  }).then((result) => {
    if (result.isConfirmed) {
      // Returning the promise here
      return new Promise((resolve, reject) => {
        console.log(cis_id);
        var settings = {
          "url": "http://10.232.236.15:8092/api/updateData",
          "method": "POST",
          "timeout": 0,
          "headers": {
            "Content-Type": "application/json"
          },
          "data": JSON.stringify({
            "cmd": 4,
            "request": {
              "cis_number": cis_id
            }
          }),
        };
        

        $.ajax(settings).done(function (response) {
          console.log(response.result[0].status);

          Swal.fire(`${response.result[0].message}`, ``, `${response.result[0].status}`);
          if (response.result[0].status === 'success') {
            resolve(response);
          } else {
            reject(response);
          }
        });
      });
    }
  });
}


/**
 * Remove Bank Officer Copy
 * @param {any} cis_id - Contain the cisNumber as reference for the unlinking
 */
// function delBankOff(cis_id) {
//   return Swal.fire({
//     title: 'Are you sure?',
//     text: "Do you want to Remove this Officer?",
//     icon: 'warning',
//     showCancelButton: true,
//     confirmButtonColor: '#3085d6',
//     cancelButtonColor: '#d33',
//     confirmButtonText: 'Yes!'
//   }).then((result) => {
//     if (result.isConfirmed) {
//       // Returning the promise here
//       return new Promise((resolve, reject) => {
//         console.log(cis_id);
//         var settings = {
//           "url": "http://10.232.236.15:8092/api/updateData",
//           "method": "POST",
//           "timeout": 0,
//           "headers": {
//             "Content-Type": "application/json"
//           },
//           "data": JSON.stringify({
//             "cmd": 5,
//             "request": {
//               "cis_number": cis_id
//             }
//           }),
//         };
        

//         $.ajax(settings).done(function (response) {
//           console.log(response.result[0].status);

//           Swal.fire(`${response.result[0].message}`, ``, `${response.result[0].status}`);
//           if (response.result[0].status === 'success') {
//             resolve(response);
//           } else {
//             reject(response);
//           }
//         });
//       });
//     }
//   });
// }


/**
 * Remove Bank Officer Related Interest
 * @param {any} cis_id - Contain the cisNumber as reference for the unlinking
 */
function delBankOffRI(cis_id) {
  return Swal.fire({
    title: 'Are you sure?',
    text: "Do you want to Remove this Officer's Related Interest?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes!'
  }).then((result) => {
    if (result.isConfirmed) {
      // Returning the promise here
      return new Promise((resolve, reject) => {
        console.log(cis_id);
        var settings = {
          "url": "http://10.232.236.15:8092/api/updateData",
          "method": "POST",
          "timeout": 0,
          "headers": {
            "Content-Type": "application/json"
          },
          "data": JSON.stringify({
            "cmd": 5,
            "request": {
              "cis_number": cis_id
            }
          }),
        };
        

        $.ajax(settings).done(function (response) {
          console.log(response.result[0].status);

          Swal.fire(`${response.result[0].message}`, ``, `${response.result[0].status}`);
          if (response.result[0].status === 'success') {
            resolve(response);
          } else {
            reject(response);
          }
        });
      });
    }
  });
}
  



  module.exports = {
    delDosri,
    delDosriDIR,
    delDosriDRI,
    delBankOff,
    
    delBankOffRI
  }