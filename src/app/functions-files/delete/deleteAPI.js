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
function delDosri(cis_id) {
    return Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to Delete this DOSRI Company?",
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
  



  module.exports = {
    delDosri,
  }