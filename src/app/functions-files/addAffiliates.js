function createAffil(formData) {
    console.log(formData)
   var settings = {
     "url": "http://10.0.0.208:8090/api/addData",
     "method": "POST",
     "timeout": 0,
     "headers": {
       "Content-Type": "application/json"
     },
     "data": JSON.stringify({
       "cmd": 6,
       "request": {
             "cis_number": formData.affilCisNumberM,       // Use form data
             "account_name": formData.accountName,   // Use form data
             "company_name": formData.companyName    // Use form data
           }
     }),
   };

   
   $.ajax(settings).done(function (response) {
     Swal.fire(`${response.result[0].message}`, ``, `${response.result[0].status}`);
   });

 }

 module.exports = {
    createAffil,
    // readDosri,
    // updateDosri,
    // deleteDosri,
  };