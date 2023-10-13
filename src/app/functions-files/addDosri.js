// exports.createDosri=function() {

// }

// function createDosri(formData) {
//   console.log(formData.cisNumber);    // Correct property name
//   console.log(formData.accountName);  // Correct property name
//   console.log(formData.companyName);  // Correct property name
// }


function createDosri(formData) {
     console.log(formData)
    var settings = {
      "url": "http://10.0.0.208:8090/api/addData",
      "method": "POST",
      "timeout": 0,
      "headers": {
        "Content-Type": "application/json"
      },
      "data": JSON.stringify({
        "cmd": 1,
        "request": {
              "cis_number": formData.cisNumber,       // Use form data
              "account_name": formData.accountName,   // Use form data
              "company_name": formData.companyName    // Use form data
            }
      }),
    };

    
    $.ajax(settings).done(function (response) {
      Swal.fire(`${response.result[0].message}`, ``, `${response.result[0].status}`);
    });

  }

//     // var settings = {
//     //   "url": "http://10.0.0.208:8090/api/addData",
//     //   "method": "POST",
//     //   "timeout": 0,
//     //   "headers": {
//     //     "Content-Type": "application/json"
//     //   },
//     //   "data": JSON.stringify({
//     //     "cmd": 1,
//     //           "request": {
//     //     "cis_number": formData.cisNumber,       // Use form data
//     //     "account_name": formData.accountName,   // Use form data
//     //     "company_name": formData.companyName    // Use form data
//     //   }

//     //   }),
//     // };
    
    
//     // document.getElementById("postForm").addEventListener("submit", function (event) {
//     //   event.preventDefault(); // Prevent the form from actually submitting.
    
//     //   const formData = new FormData(event.target);
    
//     //   const postData = {
//     //     title: formData.get("title"),
//     //     body: formData.get("body"),
//     //   };
    
//     //   fetch("https://jsonplaceholder.typicode.com/posts", {
//     //     method: "POST",
//     //     body: JSON.stringify(postData),
//     //     headers: {
//     //       "Content-type": "application/json; charset=UTF-8",
//     //     },
//     //   })
//     //     .then((response) => response.json())
//     //     .then((data) => {
//     //       console.log("Data inserted:", data);
//     //     })
//     //     .catch((error) => {
//     //       console.error("Error:", error);
//     //     });
//     // });
    
//     // Implement code to insert a new director into the database
//   }
  
//   function readDosri(dosriId) {
//     // Implement code to retrieve a director from the database
//   }
  
//   function updateDosri(dosriId, updatedData) {
//     // Implement code to update a director in the database
//   }
  
//   function deleteDosri(dosriId) {
//     // Implement code to delete a director from the database
//   }
  
  // Export your functions
  module.exports = {
    createDosri,
    // readDosri,
    // updateDosri,
    // deleteDosri,
  };