// Function to make a GET request using jQuery's $.ajax
function getCompany(callback) {
    var settings = {
        "url": "http://10.0.0.208:8090/api/dataTables",
        "method": "POST",
        "timeout": 0,
        "headers": {
          "Content-Type": "application/json"
        },
        "data": JSON.stringify({
          "cmd": 100
        }),
      };
      
      $.ajax(settings).done(function (response) {
       var compData = response.result[0].Data;
        //console.log(compData);
        if (callback) {
            callback(compData);
          }
      });
    }


    function getDirectors(callback) {
        var settings = {
            "url": "http://10.0.0.208:8090/api/dataTables",
            "method": "POST",
            "timeout": 0,
            "headers": {
              "Content-Type": "application/json"
            },
            "data": JSON.stringify({
              "cmd": 101
            }),
          };
          
          $.ajax(settings).done(function (response) {
           var dirData = response.result[0].Data;
            //console.log(compData);
            if (callback) {
                callback(dirData);
              }
          });
        }
  
  module.exports = { 
        getCompany,
        getDirectors };
  