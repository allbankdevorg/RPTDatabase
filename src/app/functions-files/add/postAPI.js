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
    });
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
    });
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
    });
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
          "cis_number": boData.boCisNumber,
          "fname": boData.boFirstName,
          "mname": boData.boMiddleName,
          "lname": boData.boLastName,
          "position": boData.boPosition,
          "com_cisnumber": "1111111"
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
    });
  });
}


/**
 * Creates an affiliate.
 * @param {any} formData - The form data containing affiliate information.
 * @param {any} moduleV - The module information.
*/
function createAffil(formData, moduleV, session, userID) {
    return new Promise((resolve, reject) => {

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
            "manager": formData.managing_company,
            "depositholdout": formData.depoHoldOut,
            "module": moduleV,
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
                "cis_number": directData.affildcisNumber,       // Use form data
                "fname": directData.affildFirstName, 
                "mname": directData.affildMiddleName, 
                "lname": directData.affildLastName,
                "position": directData.affildPosition,    // Use form data
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
      });
    });
}


/**
 * Creates an affiliate officer.
 * @param {any} offData - The data for the affiliate officer.
 * @param {any} compId - The company ID.
*/
function createAffilOff(offData, comp_CIS, session, userID) {
  return new Promise((resolve, reject) => {
    console.log(offData);
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
              "cis_number": offData.affildcisNumber,       // Use form data
              "fname": offData.affildFirstName, 
              "mname": offData.affildMiddleName, 
              "lname": offData.affildLastName,
              "position": offData.affildPosition,    // Use form data
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
    });
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
    });
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
      });
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
    // console.log(formData)
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
    });
  });
}


/**
 * Login.
 * @param {any} username - The username of the user.
 * @param {any} password - The password of the user.
 * @param {any} sessionID - The session ID of the user when the login process is successful.
*/
function Loginuser(username, password, sessionId, otpGen, userID) {
    return new Promise((resolve, reject) => {
        
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
                // "role": 1,
                "session": sessionId,
                "otp": otpGen,
            }
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
        if (response != null ) {
          resolve(response);
        } else {
          reject(response);
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
function addPNData(resultData, session, userID) {
    
  return new Promise((resolve, reject) => {
    // console.log(resultData)

    if (Array.isArray(resultData)) {
      const totalItems = resultData.length;
      let successfulInsertions = 0;
      
      resultData.forEach((item) => {
        console.log(item.loan_no);
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
                "loan_security": item.loan_security
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
      console.error("Invalid resultData format");
      reject("Invalid resultData format");
    }
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
    addPNData
 }