/**
 * - Start of getCompany
 * - Start of getDirectors
 * - Start of getOfficers
 */



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


function getOfficers(callback) {
    var settings = {
        "url": "http://10.0.0.208:8090/api/dataTables",
        "method": "POST",
        "timeout": 0,
        "headers": {
          "Content-Type": "application/json"
        },
        "data": JSON.stringify({
          "cmd": 103
        }),
      };
      
      $.ajax(settings).done(function (response) {
        var officers = response.result[0].Data;
        console.log(officers);
        if (callback) {
            callback(officers);
          }
      });
  }


  function getOfficersRI(callback) {
    var settings = {
        "url": "http://10.0.0.208:8090/api/dataTables",
        "method": "POST",
        "timeout": 0,
        "headers": {
          "Content-Type": "application/json"
        },
        "data": JSON.stringify({
          "cmd": 104
        }),
      };
      
      $.ajax(settings).done(function (response) {
        var officersRI = response.result[0].Data;
        console.log(officersRI);
        if (callback) {
            callback(officersRI);
          }
      });
  }
    
  
  module.exports = { 
        getCompany,
        getDirectors,
        getOfficers,
        getOfficersRI };
  