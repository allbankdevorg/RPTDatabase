/**
 * - 100 Start of getCompany                      => Fetch DOSRI Company
 * - 101 Start of getDirectors                    => Fetch DIrectors Related Interes
 * - 103 Start of getOfficers                     => Fetch Bank Officers
 * - 104 Start of getOfficersRI                   => Fetch 
 * - 105 Start of getAffiliatesCompany            => Fetch Affiliates and the number of its Directors
 * - 106 Start of getAffiliatesDirectors          => Fetch
 * - 107 Start of getAffiliatesOfficer            => Fetch
 * - 108 Start of getAffiliatesCompanyOfficers    => Fetch
 * - 109 Start of getManagingCompany              => Fetch Feth Companies with Module = ORP
 * - 110 Start of getOtherCompany      
 * - 111 Start of getNav                          => Fetch Navigation Menu
 * - 901 Start of getAuditLogs                    => Fetch Audit Logs Data
 */



// Function to make a GET request using jQuery's $.ajax
function getCompany(callback) {
    // console.log("100");
    var settings = {
        "url": "http://10.232.236.15:8092/api/dataTables",
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
        if (response && response.result && response.result.length > 0 && response.result[0].Data) {
              var compData = response.result[0].Data;
              //console.log(compData);
              if (callback) {
                  callback(compData);
              }
        } else {
            // Handle the case where there is no data or it doesn't have the expected structure
            // console.log("No Company Data");
            if (callback) {
                // You can choose to call the callback with some default value or handle it as needed
                callback(null);
            }
        }
      });
    }


function getDirectors(callback) {
  // console.log("101");
    var settings = {
        "url": "http://10.232.236.15:8092/api/dataTables",
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
        if (response && response.result && response.result.length > 0 && response.result[0].Data) {
          var dirData = response.result[0].Data;
          //console.log(compData);
          if (callback) {
              callback(dirData);
            }
        } else {
            // Handle the case where there is no data or it doesn't have the expected structure
            // console.log("No Directors Data");
            if (callback) {
                // You can choose to call the callback with some default value or handle it as needed
                callback(null);
            }
        }
      });

      
    }


function getOfficers(callback) {
  // console.log("103");
    var settings = {
        "url": "http://10.232.236.15:8092/api/dataTables",
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
        if (response && response.result && response.result.length > 0 && response.result[0].Data) {
          var officers = response.result[0].Data;
          // console.log(officers);
          if (callback) {
              callback(officers);
          }
        } else {
            // Handle the case where there is no data or it doesn't have the expected structure
            // console.log("No Officers Data");
            if (callback) {
                // You can choose to call the callback with some default value or handle it as needed
                callback(null);
            }
        }
      });
  }


  function getOfficersRI(callback) {
    // console.log("104");
    var settings = {
        "url": "http://10.232.236.15:8092/api/dataTables",
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
        if (response && response.result && response.result.length > 0 && response.result[0].Data) {
            var officersRI = response.result[0].Data;
            // console.log(officersRI);
            if (callback) {
              callback(officersRI);
            }
        } else {
            // Handle the case where there is no data or it doesn't have the expected structure
            // console.log("No Officers Related Interest Data");
            if (callback) {
                // You can choose to call the callback with some default value or handle it as needed
                callback(null);
            }
        }
      });
  }


  function getAffiliatesCompany(callback) {
    // console.log("105");
    var settings = {
        "url": "http://10.232.236.15:8092/api/dataTables",
        "method": "POST",
        "timeout": 0,
        "headers": {
          "Content-Type": "application/json"
        },
        "data": JSON.stringify({
          "cmd": 105
        }),
      };
      
      $.ajax(settings).done(function (response) {
        if (response && response.result && response.result.length > 0 && response.result[0].Data) {
            var affilComp = response.result[0].Data;
            //console.log(affilComp);
            if (callback) {
                callback(affilComp);
                // console.log(affilComp)
            }
        } else {
            // Handle the case where there is no data or it doesn't have the expected structure
            // console.log("No Affiliates Company Data");
            if (callback) {
                // You can choose to call the callback with some default value or handle it as needed
                callback(null);
            }
        }
      });
  }


  function getAffiliatesDirectors(callback) {
    // console.log("106");
    var settings = {
        "url": "http://10.232.236.15:8092/api/dataTables",
        "method": "POST",
        "timeout": 0,
        "headers": {
          "Content-Type": "application/json"
        },
        "data": JSON.stringify({
          "cmd": 106
        }),
      };
      
      $.ajax(settings).done(function (response) {
        if (response && response.result && response.result.length > 0 && response.result[0].Data) {
            var affilDirData = response.result[0].Data;
            // console.log(affilDirData);
            if (callback) {
                callback(affilDirData);
            }
        } else {
            // Handle the case where there is no data or it doesn't have the expected structure
            // console.log("No Affiliates Directors Data");
            if (callback) {
                // You can choose to call the callback with some default value or handle it as needed
                callback(null);
            }
        }
    });
    }

    
  function getAffiliatesOfficers(callback) {
    // console.log("107");
    var settings = {
        "url": "http://10.232.236.15:8092/api/dataTables",
        "method": "POST",
        "timeout": 0,
        "headers": {
          "Content-Type": "application/json"
        },
        "data": JSON.stringify({
          "cmd": 107
        }),
      };
      
      $.ajax(settings).done(function (response) {
        if (response && response.result && response.result.length > 0 && response.result[0].Data) {
            var affilOffData = response.result[0].Data;
            // console.log(affilOffData);
            if (callback) {
                callback(affilOffData);
            }
        } else {
            // Handle the case where there is no data or it doesn't have the expected structure
            // console.log("No Affiliates Officers Data");
            if (callback) {
                // You can choose to call the callback with some default value or handle it as needed
                callback(null);
            }
        }
    });
    }


  function getAffiliatesCompanyOfficers(callback) {
    // console.log("108");
    var settings = {
        "url": "http://10.232.236.15:8092/api/dataTables",
        "method": "POST",
        "timeout": 0,
        "headers": {
          "Content-Type": "application/json"
        },
        "data": JSON.stringify({
          "cmd": 108
        }),
      };
      
      $.ajax(settings).done(function (response) {
        if (response && response.result && response.result.length > 0 && response.result[0].Data) {
            var affilCompOff = response.result[0].Data;
            //console.log(affilComp);
            if (callback) {
                callback(affilCompOff);
            }
        } else {
            // Handle the case where there is no data or it doesn't have the expected structure
            // console.log("No Affiliates Company Officers Data");
            if (callback) {
                // You can choose to call the callback with some default value or handle it as needed
                callback(null);
            }
        }
      });
  }


  function getManagingCompany(callback) {
    // console.log("109");
    var settings = {
        "url": "http://10.232.236.15:8092/api/dataTables",
        "method": "POST",
        "timeout": 0,
        "headers": {
          "Content-Type": "application/json"
        },
        "data": JSON.stringify({
          "cmd": 109
        }),
      };
      
      $.ajax(settings).done(function (response) {
        if (response && response.result && response.result.length > 0 && response.result[0].Data) {
            var mngComp = response.result[0].Data;
            // console.log(mngComp);
            if (callback) {
                callback(mngComp);
            }
        } else {
            // Handle the case where there is no data or it doesn't have the expected structure
            // console.log("No Affiliates Company Officers Data");
            if (callback) {
                // You can choose to call the callback with some default value or handle it as needed
                callback(null);
            }
        }
      });
  }


  function getOtherCompany(callback) {
    // console.log("110");
    var settings = {
        "url": "http://10.232.236.15:8092/api/dataTables",
        "method": "POST",
        "timeout": 0,
        "headers": {
          "Content-Type": "application/json"
        },
        "data": JSON.stringify({
          "cmd": 110
        }),
      };
      
      $.ajax(settings).done(function (response) {
        if (response && response.result && response.result.length > 0 && response.result[0].Data) {
            var OtherComp = response.result[0].Data;
            //console.log(affilComp);
            if (callback) {
                callback(OtherComp);
            }
        } else {
            // Handle the case where there is no data or it doesn't have the expected structure
            // console.log("No Affiliates Company Officers Data");
            if (callback) {
                // You can choose to call the callback with some default value or handle it as needed
                callback(null);
            }
        }
      });
  }


  function getNavi(callback) {
    // console.log("110");
    var settings = {
        "url": "http://10.232.236.15:8092/api/dataTables",
        "method": "POST",
        "timeout": 0,
        "headers": {
          "Content-Type": "application/json"
        },
        "data": JSON.stringify({
          "cmd": 111
        }),
      };
      
      $.ajax(settings).done(function (response) {
        if (response && response.result && response.result.length > 0 && response.result[0].Data) {
            var navItems = response.result[0].Data;
            //console.log(affilComp);
            if (callback) {
                callback(navItems);
            }
        } else {
            // Handle the case where there is no data or it doesn't have the expected structure
            // console.log("No Navigation Menu");
            if (callback) {
                // You can choose to call the callback with some default value or handle it as needed
                callback(null);
            }
        }
      });
  }




  // Start of getAuditLogs
  function getAuditLogs(callback) {
    // console.log("104");
    var settings = {
        "url": "http://10.232.236.15:8092/api/dataTables",
        "method": "POST",
        "timeout": 0,
        "headers": {
          "Content-Type": "application/json"
        },
        "data": JSON.stringify({
          "cmd": 901,
          "userid": "Admin"
        }),
      };
      
      $.ajax(settings).done(function (response) {
        if (response && response.result && response.result.length > 0 && response.result[0].Data) {
            console.log(response.result[0].Data);
            // console.log(officersRI);
            if (callback) {
              console.log(callback);
            }
        } else {
            // Handle the case where there is no data or it doesn't have the expected structure
            // console.log("No Officers Related Interest Data");
            if (callback) {
                // You can choose to call the callback with some default value or handle it as needed
                callback(null);
            }
        }
      });
  }


    
    
  
  module.exports = { 
        getCompany,
        getDirectors,
        getOfficers,
        getOfficersRI,
        getAffiliatesCompany,
        getAffiliatesDirectors,
        getAffiliatesOfficers,
        getAffiliatesCompanyOfficers,
        getManagingCompany,
        getOtherCompany,
        getNavi,
        getAuditLogs };
  