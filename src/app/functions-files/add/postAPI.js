/**
 *  - createDosri
 *  - createStockHolders
 *  - createDirectors
 *  - createRelatedInterest
 *  - createBankOfficer
 *  - createBankOfficerRelationship
 *  - createAffil
 *  - createAffilDir
 *  - createAffilOff
 *  - createAffilOffRI
 *  - createAffilDirectorsRelatedInterest
 *  - Loginuser
 *  - sendOTP
 *  - checkOTP
 *  - cisLookUP
 *  - createStockHolders
 *  - createUser
 *  - userAccess
 *  - addPNData
 *  - checkHoldOutValue
 *  - rptLookup
 *  - rptIndividualLookup
 *  - rptCompanyLookup
 *  - rptTransactionLookup
 */
 


/**
 * Creates a DOSRI (Directors, Officers, Stockholders, and their Related Interests).
 * @param {any} formData - The form data containing cisNumber, accountName, and companyName.
 */
function createDosri(formData, session, userID) {
  return new Promise((resolve, reject) => {
    
    var settings = {
      "url": "http://10.232.236.15:8092/api/addData",
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
              "cis_number": formData.com_cis_number,       // Use form data
              "account_name": formData.com_account_name,   // Use form data
              "company_name": formData.com_company_name    // Use form data
            }
      }),
    };
 

    $.ajax(settings).done(function (response) {
      
      // Check the status and resolve/reject the promise accordingly
      Swal.fire(`${response.result[0].message}`, ``, `${response.result[0].status}`);
      if (response.result[0].status === 'success') {
        resolve(response);
      } else {
        reject(response);
      }
    })
  });

}


 
/**
 * Creates DOSRI directors.
 * @param {any} directData - The data for the DOSRI director.
 * @param {any} selectedCompCISNumber - The selected company's CIS number.
 */
 function createDirectors(directData, comp_CIS, session, userID) {
  return new Promise((resolve, reject) => {
    
    var settings = {
      "url": "http://10.232.236.15:8092/api/addData",
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
          "cis_number": directData.cisNumber,
          "fname": directData.dFirstName,
          "mname": directData.dMiddleName,
          "lname": directData.dLastName,
          "position": directData.dPosition,
          "com_cisnumber": comp_CIS
        }
      }),
    };

    $.ajax(settings).done(function (response) {
      
      // Check the status and resolve/reject the promise accordingly
      Swal.fire(`${response.result[0].message}`, ``, `${response.result[0].status}`);
      if (response.result[0].status === 'success') {
        resolve(response);
      } else {
        reject(response);
      }
    })
  });
}


/**
 * Creates Directors related interest.
 * @param {any} riData - The data for the related interest.
 * @param {any} buttonId - The button ID.
 * @param {any} selectedDirCisNumber - The selected director's CIS number.
*/
function createRelatedInterest(riData, buttonId, selectedDirCisNumber, session, userID) {
  return new Promise((resolve, reject) => {
    

    var settings = {
      "url": "http://10.232.236.15:8092/api/addData",
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
          "cis_number": riData.riCisNumber,
          "fname": riData.riFirstName,
          "mname": riData.riMiddleName,
          "lname": riData.riLastName,
          "dir_related": selectedDirCisNumber,
          "relation": buttonId
        }
      }),
    };
 

    $.ajax(settings).done(function (response) {
      // Log the response
      
      // Check the status and resolve/reject the promise accordingly
      Swal.fire(`${response.result[0].message}`, ``, `${response.result[0].status}`);
      if (response.result[0].status === 'success') {
        resolve(response);
      } else {
        reject(response);
      }
    })
  });
}


/**
 * Creates a bank officer.
 * @param {any} boData - The data for the bank officer.
 */
function createBankOfficer(boData, session, userID) {
  return new Promise((resolve, reject) => {
    // Implement code to insert a new director into the database
  
  var settings = {
      "url": "http://10.232.236.15:8092/api/addData",
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
          "cis_number": boData.cis_num,
          "fname": boData.fname,
          "mname": boData.mname,
          "lname": boData.lname,
          "position": boData.Position,
          "com_cisnumber": "1480013726"
        }
      }),
    };

    $.ajax(settings).done(function (response) {
      
      // Check the status and resolve/reject the promise accordingly
      Swal.fire(`${response.result[0].message}`, ``, `${response.result[0].status}`);
      if (response.result[0].status === 'success') {
        resolve(response);
      } else {
        reject(response);
      }
    })
  });

}


/**
 * Creates a bank officer related interest.
 * @param {any} boRIData - The data for the bank officer related interest.
 * @param {any} buttonId - The button ID.
 * @param {any} selectedcomCisNumber - The selected company's CIS number.
*/
function createBankOfficerRelationship(boRIData, buttonId, selectedcomCisNumber, session, userID) {
  return new Promise((resolve, reject) => {
    
    // Implement code to insert a new director into the database
    var settings = {
      "url": "http://10.232.236.15:8092/api/addData",
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
          "cis_number": boRIData.boRICisNumber,
          "fname": boRIData.boRIFirstName,
          "mname": boRIData.boRIMiddleName,
          "lname": boRIData.boRILastName,
          "off_related": selectedcomCisNumber,
          "relation": buttonId
        }
      }),
    };
    

    $.ajax(settings).done(function (response) {
      
      // Check the status and resolve/reject the promise accordingly
      Swal.fire(`${response.result[0].message}`, ``, `${response.result[0].status}`);
      if (response.result[0].status === 'success') {
        resolve(response);
      } else {
        reject(response);
      }
    })
  });
}


/**
 * Creates an affiliate.
 * @param {any} formData - The form data containing affiliate information.
 * @param {any} moduleV - The module information.
*/
function createAffil(formData, moduleV, session, userID) {
  return new Promise((resolve, reject) => {
    // Check if hold_out is null, if so, assign 0
    const holdOutValue = formData.hold_out !== '' ? formData.hold_out : 0;
    
    var settings = {
      "url": "http://10.232.236.15:8092/api/addData",
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
          "cis_number": formData.aff_com_cis_number,
          "account_name": formData.aff_com_account_name,
          "company_name": formData.aff_com_company_name,
          "manager": formData.parent_company,
          "module": moduleV,
          "hold_out": holdOutValue, // Use the modified holdOutValue here
        }
      }),
    };

    $.ajax(settings).done(function (response) {
      // Check the status and resolve/reject the promise accordingly
      Swal.fire(`${response.result[0].message}`, ``, `${response.result[0].status}`);
      if (response.result[0].status === 'success') {
        resolve(response);
      } else {
        reject(response);
      }
    });
  });
}


/**
 * Creates an affiliate director.
 * @param {any} directData - The data for the affiliate director.
 * @param {any} compId - The company ID.
*/
function createAffilDir(directData, comp_CIS, session, userID) {
    return new Promise((resolve, reject) => {

      var settings = {
        "url": "http://10.232.236.15:8092/api/addData",
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
                "cis_number": directData.dir_CisNumber,       // Use form data
                "fname": directData.off_fname, 
                "mname": directData.off_mname, 
                "lname": directData.off_lname,
                "position": directData.Position,    // Use form data
                "com_cisnumber": comp_CIS    // Use form data
              }
        }),
      };
  
      $.ajax(settings).done(function (response) {
        
        // Check the status and resolve/reject the promise accordingly
        Swal.fire(`${response.result[0].message}`, ``, `${response.result[0].status}`);
        if (response.result[0].status === 'success') {
          resolve(response);
        } else {
          reject(response);
        }
      })
    });
}


/**
 * Creates an affiliate officer.
 * @param {any} offData - The data for the affiliate officer.
 * @param {any} compId - The company ID.
*/
function createAffilOff(offData, comp_CIS, session, userID) {
  return new Promise((resolve, reject) => {
    // Implement code to insert a new director into the database

    var settings = {
      "url": "http://10.232.236.15:8092/api/addData",
      "method": "POST",
      "timeout": 0,
      "headers": {
        "Content-Type": "application/json"
      },
      "data": JSON.stringify({
        "cmd": 8,
        "session": session,
        "userid": userID,
        "request": {
              "cis_number": offData.off_CisNumber,       // Use form data
              "fname": offData.off_fname, 
              "mname": offData.off_mname, 
              "lname": offData.off_lname,
              "position": offData.Position,    // Use form data
              "com_cisnumber": comp_CIS    // Use form data
            }
      }),
    };
    

    $.ajax(settings).done(function (response) {
      
      // Check the status and resolve/reject the promise accordingly
      Swal.fire(`${response.result[0].message}`, ``, `${response.result[0].status}`);
      if (response.result[0].status === 'success') {
        resolve(response);
      } else {
        reject(response);
      }
    })
  });

}


/**
 * Creates an affiliate officer related interest.
 * @param {any} OffriData - The data for the affiliate officer related interest.
 * @param {any} buttonId - The button ID.
 * @param {any} selectedOffCisNumber - The selected officer's CIS number.
*/
function createAffilOffRI(OffriData, buttonId, selectedOffCisNumber, session, userID) {
  return new Promise((resolve, reject) => {
    // Implement code to insert a new director into the database

    var settings = {
      "url": "http://10.232.236.15:8092/api/addData",
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
      
      // Check the status and resolve/reject the promise accordingly
      Swal.fire(`${response.result[0].message}`, ``, `${response.result[0].status}`);
      if (response.result[0].status === 'success') {
        resolve(response);
      } else {
        reject(response);
      }
    })
  });
 }

/**
 * Creates RP directors related interest.
 * @param {any} riData - The data for the DOSRI director related interest.
 * @param {any} buttonId - The button ID.
 * @param {any} selectedDirCisNumber - The selected director's CIS number.
*/
function createAffilDirectorsRelatedInterest(riData, buttonId, selectedDirCisNumber, session, userID) {
    
    return new Promise((resolve, reject) => {

      var settings = {
        "url": "http://10.232.236.15:8092/api/addData",
        "method": "POST",
        "timeout": 0,
        "headers": {
          "Content-Type": "application/json"
        },
        "data": JSON.stringify({
          "cmd": 10,
          "session": session,
          "userid": userID,
          "request": {
            "cis_number": riData.riCisNumber,
            "fname": riData.riFirstName,
            "mname": riData.riMiddleName,
            "lname": riData.riLastName,
            "dir_related": selectedDirCisNumber,
            "relation": buttonId
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
      })
    });
}



/**
 * Creates RP directors related interest.
 * @param {any} formData - The data for the DOSRI director related interest.
 * @param {any} session - The Sesison ID.
 * @param {any} userID - The Username of the user.
*/
function createStockHolders(formData, session, userID) {
    
  return new Promise((resolve, reject) => {
    
    var settings = {
      "url": "http://10.232.236.15:8092/api/addData",
      "method": "POST",
      "timeout": 0,
      "headers": {
        "Content-Type": "application/json"
      },
      "data": JSON.stringify({
        "cmd": 11,
        "session": session,
        "userid": userID,
        "request": {
          "cis_number": formData.cis_number,
          "name": formData.name,
          "shares": formData.shares,
          "amount": formData.amount,
          "percentage": formData.percentage
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
    })
  });
}


/**
 * Login.
 * @param {any} username - The username of the user.
 * @param {any} password - The password of the user.
 * @param {any} sessionID - The session ID of the user when the login process is successful.
*/
// function Loginuser(username, password, sessionId, otpGen, userID) {
//     return new Promise((resolve, reject) => {
//       Swal.fire({
//         title: 'Processing...',
//         allowOutsideClick: false,
//         didOpen: () => {
//             Swal.showLoading();
//         }
//     });

//         var settings = {
//           "url": "http://10.232.236.15:8092/api/userManagement",
//           "method": "POST",
//           "timeout": 0,
//           "headers": {
//             "Content-Type": "application/json"
//           },
//           "data": JSON.stringify({
//             "cmd": 2,
//             "session": sessionId,
//             "userid": userID,
//             "request": {
//                 "username": username,
//                 "password": password,
//                 // "role": 1,
//                 "session": sessionId,
//                 "otp": otpGen,
//             }
//           }),
//         };
    
//         $.ajax(settings).done(function (response) {
            
//             // Check the status and resolve/reject the promise accordingly
//             Swal.fire(`${response.result[0].message}`, ``, `${response.result[0].status}`);
//             if (response.result[0].message === 'success') {
//               console.log(response);
//               resolve(response);
              
//             } else {
//               reject(response);
//             }
//           })

//           .fail(function(jqXHR, textStatus, errorThrown) {
//             // Handle AJAX errors here
//             reject({
//                 message: textStatus,
//                 status: errorThrown
//             });
//         });

        
//       });
// }

function Loginuser(username, password, sessionId, otpGen, userID) {
  return new Promise((resolve, reject) => {
      Swal.fire({
          title: 'Processing...',
          allowOutsideClick: false,
          didOpen: () => {
              Swal.showLoading();
          }
      });

      var settings = {
          "url": "http://10.232.236.15:8092/api/userManagement",
          "method": "POST",
          "timeout": 0,
          "headers": {
              "Content-Type": "application/json"
          },
          "data": JSON.stringify({
              "cmd": 2,
              "session": sessionId,
              "userid": userID,
              "request": {
                  "username": username,
                  "password": password,
                  "session": sessionId,
                  "otp": otpGen
              }
          }),
      };

      $.ajax(settings).done(function (response) {
          
          if (response.result && response.result[0].message === 'success') {
              Swal.fire(`${response.result[0].message}`, ``, `${response.result[0].status}`);
              resolve(response);
          } else {
              Swal.fire('Error', response.result ? response.result[0].message : 'Unknown error', 'error');
              reject(new Error(response.result ? response.result[0].message : 'Unknown error'));
          }
      }).fail(function(jqXHR, textStatus, errorThrown) {
          Swal.fire('AJAX Error', textStatus, 'error');
          console.error("AJAX error:", textStatus, errorThrown);
          reject(new Error(textStatus === 'timeout' ? 'Request timed out' : 'Failed to connect to the server. Please try again later'));
      });
  });
}





/**
 * Send OTP.
 * @param {any} mobile - The mobile number of the user.
 * @param {any} otpGen - The otp generated.
*/
function sendOTP(mobile, otpGen, userID, session) {
  return new Promise((resolve, reject) => {
        
      var settings = {
        "url": "http://10.232.236.15:8092/api/OTP",
        "method": "POST",
        "timeout": 0,
        "headers": {
          "Content-Type": "application/json"
        },
        "data": JSON.stringify({
          "mobile": mobile,
          "otp": otpGen,
          "session": session,
          "userid": userID
        }),
      };
  
      $.ajax(settings).done(function (response) {
          
          // Check the status and resolve/reject the promise accordingly
          Swal.fire(`${response.result[0].message}`, ``, `${response.result[0].status}`);
          if (response.result[0].message === 'success') {
            resolve(response);
          } else {
            reject(response);
          }
        });
    });
}



/**
 * Send OTP.
 * @param {any} user - The mobile number of the user.
 * @param {any} enteredOTP - The otp generated.
*/
function checkOTP(user, enteredOTP, userID, session) {
  return new Promise((resolve, reject) => {
    
      var settings = {
        "url": "http://10.232.236.15:8092/api/userManagement",
        "method": "POST",
        "timeout": 0,
        "headers": {
          "Content-Type": "application/json"
        },
        "data": JSON.stringify({
          "cmd": 21,
          "session": session,
          "userid": userID,
          "request": {
            "username": user,
            "otp": enteredOTP,
          }
        }),
      };
  
      $.ajax(settings).done(function (response) {

          if (response.result && response.result[0].message === 'success') {
            Swal.fire(`${response.result[0].message}`, ``, `${response.result[0].status}`);
            resolve(response)
          }
          else {
            
            Swal.fire('Error', response.result ? response.result[0].message : 'Unknown error', 'error');
            reject(new Error(response.result ? response.result[0].message : 'Unknown error'));
          }
        }).fail(function(jqXHR, textStatus, errorThrown) {
          Swal.fire('AJAX Error', textStatus, 'error');
          console.error("AJAX error:", textStatus, errorThrown);
          reject(new Error(textStatus === 'timeout' ? 'Request timed out' : 'Failed to connect to the server. Please try again later'));
        });
    });
}


function cisLookUP(cis) {
    return new Promise((resolve, reject) => {
      
      
      var settings = {
        "url": "http://10.232.236.15:8092/api/Cis",
        "method": "POST",
        "timeout": 0,
        "headers": {
          "Content-Type": "application/json"
        },
        "data": JSON.stringify({
          "cis": cis
        }),
      };
      
      $.ajax(settings).done(function (response) {
        // Check the status and resolve/reject the promise accordingly
        // Swal.fire(`${response}`, ``, `${response}`);
        if (response.cisName === null && response.data === null) {
          reject(response);
      } else {
          resolve(response);
      }
        
      });
  });
}

/**
 * Creates User
 * @param {any} formData - The data of the User.
 * @param {any} session - The Sesison ID.
 * @param {any} userID - The Username of the user.
*/

function createUser(formData, userID, session) {
  return new Promise((resolve, reject) => {
      
    Swal.fire({
      title: 'Processing...',
      allowOutsideClick: false,
      didOpen: () => {
          Swal.showLoading();
      }
    });
    
      var settings = {
        "url": "http://10.232.236.15:8092/api/userManagement",
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
            "username": formData.userName,
            "password": formData.uPass,
            "mobile_no": formData.mobile,
            "role": formData.role,
            "inserted_by": userID
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
      })

      .fail(function(jqXHR, textStatus, errorThrown) {
        // Handle AJAX errors here
        reject({
            message: textStatus,
            status: errorThrown
        });
    });
  });
}

/**
 * UserAccess
 * @param {any} userID - The Username of the user.
*/
function userAccess(userid) {
  return new Promise((resolve, reject) => {
    
    var settings = {
      "url": "http://10.232.236.15:8092/api/dataTables",
      "method": "POST",
      "timeout": 0,
      "headers": {
        "Content-Type": "application/json"
      },
      "data": JSON.stringify({
        "cmd": 903,
        "userid": userid,
      }),
    };
    
    $.ajax(settings).done(function (response) {
      if (response.result[0].message === 'Success') {
        resolve(response);
      } else {
        reject(response);
      }
    });
});
}


/**
 * Creates RP directors related interest.
 * @param {any} formData - The data for the DOSRI director related interest.
 * @param {any} session - The Sesison ID.
 * @param {any} userID - The Username of the user.
*/
function addPNData(resultData, holdOUT, session, userID) {
  return new Promise((resolve, reject) => {

    if (Array.isArray(resultData)) {
      const totalItems = resultData.length;
      let successfulInsertions = 0;
      // const pnHoldOut = holdOUT / totalItems;
      
      resultData.forEach((item) => {
        var settings = {
            "url": "http://10.232.236.15:8092/api/addData",
            "method": "POST",
            "timeout": 0,
            "headers": {
              "Content-Type": "application/json"
            },
            "data": JSON.stringify({
              "cmd": 20,
              "session": session,
              "userid": userID,
              "request": {
                "cis_no": item.cis_no,
                "name": item.name,
                "loan_no": item.loan_no,
                "principal": item.principal,
                "principal_bal": item.principal_bal,
                "date_granted": item.date_granted,
                "created_by": item.created_by,
                "date_created": item.date_created,
                "loan_security": item.loanSecurity,
                "int_rate": item.grantedRate,
                // "MISgroup": item.MISGroup1
              }
            }),
        };

        $.ajax(settings).done(function (response) {
          if (response.result[0].status === 'success') {
            successfulInsertions++;

            if (successfulInsertions === totalItems) {
              // All items inserted successfully, show the modal
              Swal.fire(`${response.result[0].message}`, ``, `${response.result[0].status}`);
              resolve(response);
            }
          } else {
            reject(response);
          }
        });
      });
    } else {
      // If resultData is not an array, log an error or handle accordingly
      reject("Invalid resultData format");
    }
  });
}


/**
 * Creates RP directors related interest.
 * @param {any} sblData - The data for the SBL PN Data.
 * @param {any} session - The Sesison ID.
 * @param {any} userID - The Username of the user.
*/
function addSimulatedPNData(sPNData, session, userID) {
    
  return new Promise((resolve, reject) => {

    Swal.fire({
      title: 'Processing...',
      allowOutsideClick: false,
      didOpen: () => {
          Swal.showLoading();
      }
    });

        var settings = {
            "url": "http://10.232.236.15:8092/api/addData",
            "method": "POST",
            "timeout": 0,
            "headers": {
              "Content-Type": "application/json"
            },
            "data": JSON.stringify({
              "cmd": 20,
              "session": session,
              "userid": userID,
              "request": {
                "cis_no": sPNData.com_cis_number,
                "name": sPNData.com_account_name,
                "loan_no": "",
                "principal": sPNData.amount,
                "principal_bal": sPNData.amount,
                "date_granted": "",
                "created_by": "",
                "date_created": "",
                "loan_security": ""
              }
            }),
        };

        $.ajax(settings).done(function (response) {
          if (response.result[0].status === 'success') {
              // All items inserted successfully, show the modal
              Swal.fire(`${response.result[0].message}`, ``, `${response.result[0].status}`);
              resolve(response);
          } else {
              reject(response);
          }
        })

        .fail(function(jqXHR, textStatus, errorThrown) {
          // Handle AJAX errors here
          reject({
              message: textStatus,
              status: errorThrown
          });
      });
      });
}


/**
 * HoldOut
 * @param {any} userID - The Username of the user.
*/
function HoldOutValue(cis) {
  return new Promise((resolve, reject) => {
    
   
    
    var settings = {
      "url": "http://10.232.236.15:8092/api/dataTables",
      "method": "POST",
      "timeout": 0,
      "headers": {
        "Content-Type": "application/json"
      },
      "data": JSON.stringify({
        "cmd": 115,
        "com_cis": cis,
      }),
    };
    
    $.ajax(settings).done(function (response) {
      if (response.result[0].message === 'Success') {
        resolve(response);
      } else {
        reject(response);
      }
    })

    .fail(function(jqXHR, textStatus, errorThrown) {
      // Handle AJAX errors here
      reject({
          message: textStatus,
          status: errorThrown
      });
  });
});
}


function checkHoldOutValue(com_cis) {
  return new Promise((resolve, reject) => {
    var settings = {
      "url": "http://10.232.236.15:8092/api/dataTables",
      "method": "POST",
      "timeout": 0,
      "headers": {
        "Content-Type": "application/json"
      },
      "data": JSON.stringify({
        "cmd": 116,
        "cisno": com_cis,
      }),
    };
    
    $.ajax(settings).done(function (response) {
      if (response.result[0].message === 'Success') {
        resolve(response);
      } else {
        reject(response);
      }
    });
});
}


function rptLookup(rpt) {
  return new Promise((resolve, reject) => {
      var settings = {
          "url": "http://10.232.236.15:8092/api/dataTables",
          "method": "POST",
          "timeout": 0,
          "headers": {
              "Content-Type": "application/json"
          },
          "data": JSON.stringify({
              "cmd": 200,
              "fname": rpt.firstName,
              "lname": rpt.lastName
          }),
      };

      $.ajax(settings)
          .done(function (response) {
              if (response.result && response.result.length > 0) {
                  resolve(response); // Resolve the promise with the response
              } else {
                  reject("Invalid response structure");
              }
          })
          .fail(function (jqXHR, textStatus, errorThrown) {
              reject(errorThrown);
          });
  });
}


function rptIndividualLookup(rpt) {
  return new Promise((resolve, reject) => {
      var settings = {
          "url": "http://10.232.236.15:8092/api/dataTables",
          "method": "POST",
          "timeout": 0,
          "headers": {
              "Content-Type": "application/json"
          },
          "data": JSON.stringify({
              "cmd": 201,
              "fname": rpt.firstName,
              "lname": rpt.lastName
          }),
      };

      $.ajax(settings)
          .done(function (response) {
              if (response.result && response.result.length > 0) {
                  resolve(response); // Resolve the promise with the response
              } else {
                  reject("Invalid response structure");
              }
          })
          .fail(function (jqXHR, textStatus, errorThrown) {
              reject(errorThrown);
          });
  });
}


function rptCompanyLookup(rpt) {
  return new Promise((resolve, reject) => {
      var settings = {
          "url": "http://10.232.236.15:8092/api/dataTables",
          "method": "POST",
          "timeout": 0,
          "headers": {
              "Content-Type": "application/json"
          },
          "data": JSON.stringify({
              "cmd": 202,
              "companyName": rpt.companyName
          }),
      };

      $.ajax(settings)
          .done(function (response) {
              if (response.result && response.result.length > 0) {
                  resolve(response); // Resolve the promise with the response
              } else {
                  reject("Invalid response structure");
              }
          })
          .fail(function (jqXHR, textStatus, errorThrown) {
              reject(errorThrown);
          });
  });
}


function rptTransactionLookup(row, yesterdayDate) {
  return new Promise((resolve, reject) => {
      var settings = {
          "url": "http://10.232.236.15:8092/api/dataTables",
          "method": "POST",
          "timeout": 0,
          "headers": {
              "Content-Type": "application/json"
          },
          "data": JSON.stringify({
              "cmd": 203,
              "date": yesterdayDate,
              "cis_number": row.cis_number,
              "name": row.fullname
          }),
      };

      $.ajax(settings)
          .done(function (response) {
              if (response.result && response.result.length > 0) {
                  resolve(response); // Resolve the promise with the response
              } else {
                  reject("Invalid response structure");
              }
          })
          .fail(function (jqXHR, textStatus, errorThrown) {
              reject(errorThrown);
          });
  });
}


 module.exports = {
    createDosri,
    createDirectors,
    createRelatedInterest,
    createBankOfficer,
    createBankOfficerRelationship,
    createAffil,
    createAffilDir,
    createAffilOff,
    createAffilOffRI,
    createAffilDirectorsRelatedInterest,
    Loginuser,
    sendOTP,
    checkOTP,
    cisLookUP,
    createStockHolders,
    createUser,
    userAccess,
    addPNData,
    addSimulatedPNData,
    HoldOutValue,
    checkHoldOutValue,
    rptLookup,
    rptCompanyLookup,
    rptIndividualLookup,
    rptTransactionLookup
 }