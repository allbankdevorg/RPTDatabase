/**
 *  - delDosri                            => Remove Company
 *  - delDosriDIR                         => Unlink Director
 *  - delDosriDRI                         => Unlink Director's Related Interest
 *  - delBankOff                          => Remove Bank Officers
 * 
 *  - delBankOffRI                        => Unlink Bank Officer's Related Interest
 *  - delAffilComp                        => Unlink Affiliates Company
 *  - delAffilComDIR                      => Unlink Affilitiates Directors
 *  - 11 delAffilOffRI                    => Unlink Affiliates Officers RI
 *  - deleteStockholder                   => Delete Stockhold
 */
 


/**
 * Remove a DOSRI Company
 * @param {any} cis_id - Contain the cisNumber as reference for the removimg
 */
function delDosri(cis_id, session, userID) {
    return Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to remove this DOSRI company?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!'
    }).then((result) => {
      if (result.isConfirmed) {
        // Returning the promise here
        return new Promise((resolve, reject) => {
          var settings = {
            "url": "http://10.232.236.15:8092/api/updateData",
            "method": "POST",
            "timeout": 0,
            "headers": {
              "Content-Type": "application/json"
            },
            "data": JSON.stringify({
              "cmd": 1,
              "session": session,
              "userid": userID,
              "request": {
                "cis_number": cis_id
              }
            }),
          };
          
  
          $.ajax(settings).done(function (response) {
  
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
function delDosriDIR(cis_id, session, userID) {
  return Swal.fire({
    title: 'Are you sure?',
    text: "Do you want to unlink this DOSRI company director?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes!'
  }).then((result) => {
    if (result.isConfirmed) {
      // Returning the promise here
      return new Promise((resolve, reject) => {
        var settings = {
          "url": "http://10.232.236.15:8092/api/updateData",
          "method": "POST",
          "timeout": 0,
          "headers": {
            "Content-Type": "application/json"
          },
          "data": JSON.stringify({
            "cmd": 2,
            "session": session,
            "userid": userID,
            "request": {
              "cis_number": cis_id
            }
          }),
        };
        

        $.ajax(settings).done(function (response) {

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
 * @param {any} data_id - Contain the cisNumber as reference for the unlinking
 */
function delDosriDRI(data_id, session, userID) {
  return Swal.fire({
    title: 'Are you sure?',
    text: "Do you want to unlink this related interest?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes!'
  }).then((result) => {
    if (result.isConfirmed) {
      // Returning the promise here
      return new Promise((resolve, reject) => {
        var settings = {
          "url": "http://10.232.236.15:8092/api/updateData",
          "method": "POST",
          "timeout": 0,
          "headers": {
            "Content-Type": "application/json"
          },
          "data": JSON.stringify({
            "cmd": 3,
            "session": session,
            "userid": userID,
            "request": {
              "data_id": data_id
            }
          }),
        };
        

        $.ajax(settings).done(function (response) {

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
function delBankOff(cis_id, session, userID) {
  return Swal.fire({
    title: 'Are you sure?',
    text: "Do you want to remove this officer?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes!'
  }).then((result) => {
    if (result.isConfirmed) {
      // Returning the promise here
      return new Promise((resolve, reject) => {
        var settings = {
          "url": "http://10.232.236.15:8092/api/updateData",
          "method": "POST",
          "timeout": 0,
          "headers": {
            "Content-Type": "application/json"
          },
          "data": JSON.stringify({
            "cmd": 4,
            "session": session,
            "userid": userID,
            "request": {
              "cis_number": cis_id
            }
          }),
        };
        

        $.ajax(settings).done(function (response) {

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
 * @param {any} data_id - Contain the cisNumber as reference for the unlinking
 */
function delBankOffRI(data_id, session, userID) {
  return Swal.fire({
    title: 'Are you sure?',
    text: "Do you want to unlink this officer's related interest?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes!'
  }).then((result) => {
    if (result.isConfirmed) {
      // Returning the promise here
      return new Promise((resolve, reject) => {
        var settings = {
          "url": "http://10.232.236.15:8092/api/updateData",
          "method": "POST",
          "timeout": 0,
          "headers": {
            "Content-Type": "application/json"
          },
          "data": JSON.stringify({
            "cmd": 5,
            "session": session,
            "userid": userID,
            "request": {
              "data_id": data_id
            }
          }),
        };
        

        $.ajax(settings).done(function (response) {

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
 * Remove Affiliates Company
 * @param {any} cis_id - Contain the cisNumber as reference for the unlinking
 */
function delAffilComp(cis_id, session, userID) {
  return Swal.fire({
    title: 'Are you sure?',
    text: "Do you want to remove this company?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes!'
  }).then((result) => {
    if (result.isConfirmed) {
      // Returning the promise here
      return new Promise((resolve, reject) => {
        var settings = {
          "url": "http://10.232.236.15:8092/api/updateData",
          "method": "POST",
          "timeout": 0,
          "headers": {
            "Content-Type": "application/json"
          },
          "data": JSON.stringify({
            "cmd": 6,
            "session": session,
            "userid": userID,
            "request": {
              "cis_number": cis_id
            }
          }),
        };
        

        $.ajax(settings).done(function (response) {

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
 * Remove Affiliates Director
 * @param {any} cis_id - Contain the cisNumber as reference for the unlinking
 */
function delAffilComDIR(cis_id, session, userID) {
  return Swal.fire({
    title: 'Are you sure?',
    text: "Do you want to unlink this director?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes!'
  }).then((result) => {
    if (result.isConfirmed) {
      // Returning the promise here
      return new Promise((resolve, reject) => {
        var settings = {
          "url": "http://10.232.236.15:8092/api/updateData",
          "method": "POST",
          "timeout": 0,
          "headers": {
            "Content-Type": "application/json"
          },
          "data": JSON.stringify({
            "cmd": 7,
            "session": session,
            "userid": userID,
            "request": {
              "cis_number": cis_id
            }
          }),
        };
        

        $.ajax(settings).done(function (response) {

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
 * Remove Affiliates Director
 * @param {any} data_id - Contain the cisNumber as reference for the unlinking
 */
function delAffilOff(data_id, session, userID) {
  return Swal.fire({
    title: 'Are you sure?',
    text: "Do you want to remove this officer's related interest?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes!'
  }).then((result) => {
    if (result.isConfirmed) {
      // Returning the promise here
      return new Promise((resolve, reject) => {
        var settings = {
          "url": "http://10.232.236.15:8092/api/updateData",
          "method": "POST",
          "timeout": 0,
          "headers": {
            "Content-Type": "application/json"
          },
          "data": JSON.stringify({
            "cmd": 71,
            "session": session,
            "userid": userID, 
            "request": {
              "cis_number": data_id
            }
          }),
        };
        

        $.ajax(settings).done(function (response) {
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
 * Remove Affiliates Officers Related Interest
 * @param {any} id - Contain the cisNumber as reference for the unlinking
 */
function delAffilOffRI(data_id, session, userID) {
  return Swal.fire({
    title: 'Are you sure?',
    text: "Do you want to unlink this officer's related interest?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes!'
  }).then((result) => {
    if (result.isConfirmed) {
      // Returning the promise here
      return new Promise((resolve, reject) => {
        var settings = {
          "url": "http://10.232.236.15:8092/api/updateData",
          "method": "POST",
          "timeout": 0,
          "headers": {
            "Content-Type": "application/json"
          },
          "data": JSON.stringify({
            "cmd": 12,
            "session": session,
            "userid": userID,
            "request": {
              "data_id": data_id
            }
          }),
        };
        

        $.ajax(settings).done(function (response) {

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


function delAffilDirRI(data_id, session, userID) {
  return Swal.fire({
    title: 'Are you sure?',
    text: "Do you want to unlink this director's related interest?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes!'
  }).then((result) => {
    if (result.isConfirmed) {
      // Returning the promise here
      return new Promise((resolve, reject) => {
        var settings = {
          "url": "http://10.232.236.15:8092/api/updateData",
          "method": "POST",
          "timeout": 0,
          "headers": {
            "Content-Type": "application/json"
          },
          "data": JSON.stringify({
            "cmd": 806,
            "session": session,
            "userid": userID,
            "request": {
              "id": data_id
            }
          }),
        };
        

        $.ajax(settings).done(function (response) {

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
 * Remove Affiliates Officers Related Interest
 * @param {any} id - Contain the cisNumber as reference for the unlinking
 */
function delStockholder(element, session, userID) {
  return Swal.fire({
    title: 'Are you sure?',
    text: "Delete this Stockholder?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes!'
  }).then((result) => {
    if (result.isConfirmed) {
      console.log(element);
      // Returning the promise here
      return new Promise((resolve, reject) => {
        var settings = {
          "url": "http://10.232.236.15:8092/api/updateData",
          "method": "POST",
          "timeout": 0,
          "headers": {
            "Content-Type": "application/json"
          },
          "data": JSON.stringify({
            "cmd": 9,
            "session": session,
            "userid": userID,
            "request": {
              "cis_number": element.cis_number,
              "name": element.name
            }
          }),
        };
        

        $.ajax(settings).done(function (response) {
          console.log(response.result);

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
    delBankOffRI,
    
    delAffilComp,
    delAffilComDIR,

    delAffilOff,
    delAffilOffRI,
    delStockholder,
    delAffilDirRI

  }