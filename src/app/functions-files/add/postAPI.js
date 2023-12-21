/**
 *  - createDosri
 *  - createDirectors
 *  - createRelatedInterest
 *  - createBankOfficer
 *  - createBankOfficerRelationship
 *  - createAffil
 *  - createAffilDir
 *  - createAffilOff
 *  - createAffilOffRI
 *  - createRPDirectorsRelatedInterest
 */
 


/**
 * Creates a DOSRI (Directors, Officers, Stockholders, and their Related Interests).
 * @param {any} formData - The form data containing cisNumber, accountName, and companyName.
 */
function createDosri(formData) {
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
        "cmd": 1,
        "request": {
              "cis_number": formData.com_cis_number,       // Use form data
              "account_name": formData.com_account_name,   // Use form data
              "company_name": formData.com_company_name    // Use form data
            }
      }),
    };
 

    $.ajax(settings).done(function (response) {
      // Log the response
      // console.log(response.result[0].status);
      
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
 function createDirectors(directData, selectedCompCISNumber) {
  return new Promise((resolve, reject) => {
    // console.log(selectedCompCISNumber);
    var settings = {
      "url": "http://10.232.236.15:8092/api/addData",
      "method": "POST",
      "timeout": 0,
      "headers": {
        "Content-Type": "application/json"
      },
      "data": JSON.stringify({
        "cmd": 2,
        "request": {
          "cis_number": directData.cisNumber,
          "fname": directData.dFirstName,
          "mname": directData.dMiddleName,
          "lname": directData.dLastName,
          "position": directData.dPosition,
          "com_cisnumber": selectedCompCISNumber
        }
      }),
    };

    $.ajax(settings).done(function (response) {
      // Log the response
      // console.log(response.result[0].status);
      
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
function createRelatedInterest(riData, buttonId, selectedDirCisNumber) {
  return new Promise((resolve, reject) => {
    // console.log(buttonId)
    // console.log(selectedDirCisNumber)
    // console.log(riData)
    var settings = {
      "url": "http://10.232.236.15:8092/api/addData",
      "method": "POST",
      "timeout": 0,
      "headers": {
        "Content-Type": "application/json"
      },
      "data": JSON.stringify({
        "cmd": 3,
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
      // console.log(response.result[0].status);
      // console.log(response.result[0].message);
      
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
function createBankOfficer(boData) {
  return new Promise((resolve, reject) => {
    // console.log(boData)
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
      // Log the response
      // console.log(response.result[0].status);
      
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
function createBankOfficerRelationship(boRIData, buttonId, selectedcomCisNumber) {
  return new Promise((resolve, reject) => {
    
    // console.log(boRIData)
    // console.log(buttonId)
    // console.log(selectedcomCisNumber)
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
      // Log the response
      // console.log(response.result[0].status);
      
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
function createAffil(formData, moduleV) {
    return new Promise((resolve, reject) => {
      // console.log(formData)
      // console.log(moduleV);

      var settings = {
        "url": "http://10.232.236.15:8092/api/addData",
        "method": "POST",
        "timeout": 0,
        "headers": {
          "Content-Type": "application/json"
        },
        "data": JSON.stringify({
          "cmd": 6,
          "request": {
            "cis_number": formData.aff_com_cis_number,
            "account_name": formData.aff_com_account_name,
            "company_name": formData.aff_com_company_name,
            "manager": formData.commandControl,
            "module": moduleV,
          }
        }),
      };
  
      $.ajax(settings).done(function (response) {
        // Log the response
        // console.log(response.result[0].status);
        
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
 * @param {any} dirData - The data for the affiliate director.
 * @param {any} compId - The company ID.
*/
function createAffilDir(dirData, compId) {
    // console.log(dirData)
    // console.log(compId)
   var settings = {
     "url": "http://10.232.236.15:8092/api/addData",
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


/**
 * Creates an affiliate officer.
 * @param {any} offData - The data for the affiliate officer.
 * @param {any} compId - The company ID.
*/
function createAffilOff(offData, compId) {
    // console.log(offData)
    // console.log(compId)
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


/**
 * Creates an affiliate officer related interest.
 * @param {any} OffriData - The data for the affiliate officer related interest.
 * @param {any} buttonId - The button ID.
 * @param {any} selectedOffCisNumber - The selected officer's CIS number.
*/
function createAffilOffRI(OffriData, buttonId, selectedOffCisNumber) {
    // console.log(OffriData)
    // console.log(buttonId)
    // console.log(selectedOffCisNumber)
    var settings = {
      "url": "http://10.232.236.15:8092/api/addData",
      "method": "POST",
      "timeout": 0,
      "headers": {
        "Content-Type": "application/json"
      },
      "data": JSON.stringify({
        "cmd": 9,
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
      Swal.fire(`${response.result[0].message}`, ``, `${response.result[0].status}`);
    });

 }

/**
 * Creates RP directors related interest.
 * @param {any} riData - The data for the DOSRI director related interest.
 * @param {any} buttonId - The button ID.
 * @param {any} selectedDirCisNumber - The selected director's CIS number.
*/
function createRPDIrectorsRelatedInterest(riData, buttonId, selectedDirCisNumber) {

    // console.log(buttonId)
    // console.log(selectedDirCisNumber)
    // console.log(riData)
    var settings = {
      "url": "http://10.232.236.15:8092/api/addData",
      "method": "POST",
      "timeout": 0,
      "headers": {
        "Content-Type": "application/json"
      },
      "data": JSON.stringify({
        "cmd": 10,
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
      // console.log(response);
    });
    // Implement code to insert a new director into the database
}


/**
 * Login.
 * @param {any} username - The username of the user.
 * @param {any} password - The password of the user.
 * @param {any} sessionID - The session ID of the user when the login process is successful.
*/
function Loginuser(username, password, sessionId, otpGen) {
    return new Promise((resolve, reject) => {
        // console.log(username);
        // console.log(password);
        var settings = {
          "url": "http://10.232.236.15:8092/api/userManagement",
          "method": "POST",
          "timeout": 0,
          "headers": {
            "Content-Type": "application/json"
          },
          "data": JSON.stringify({
            "cmd": 2,
            "request": {
                "username": username,
                "password": password,
                // "role": 1,
                "session": sessionId,
                "otp": otpGen
            }
          }),
        };
    
        $.ajax(settings).done(function (response) {
            // Log the response
            // console.log(response.result[0].message);
            // console.log(response.result[0].status);
            
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
function sendOTP(mobile, otpGen) {
  return new Promise((resolve, reject) => {
      // console.log(mobile);
      // console.log(otpGen);
      var settings = {
        "url": "http://10.232.236.15:8092/api/OTP",
        "method": "POST",
        "timeout": 0,
        "headers": {
          "Content-Type": "application/json"
        },
        "data": JSON.stringify({
          "mobile": mobile,
          "otp": otpGen
        }),
      };
  
      $.ajax(settings).done(function (response) {
          // Log the response
          // console.log(response.result[0].message);
          // console.log(response.result[0].status);
          
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
function checkOTP(user, enteredOTP) {
  return new Promise((resolve, reject) => {
      // console.log(mobile);
      // console.log(otpGen);
      var settings = {
        "url": "http://10.232.236.15:8092/api/userManagement",
        "method": "POST",
        "timeout": 0,
        "headers": {
          "Content-Type": "application/json"
        },
        "data": JSON.stringify({
          "cmd": 21,
          "request": {
            "username": user,
            "otp": enteredOTP,
          }
        }),
      };
  
      $.ajax(settings).done(function (response) {
          // Log the response
          // console.log(response.result[0].message);
          // console.log(response.result[0].status);
          
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
        // Log the response
        // console.log(response);
        // console.log(response.result[0].status);
        
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
    createRPDIrectorsRelatedInterest,
    Loginuser,
    sendOTP,
    checkOTP,
    cisLookUP
 }