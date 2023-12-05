function Loginuser(username, password, sessionId) {
    return new Promise((resolve, reject) => {
        console.log(username)
        console.log([password]);
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
                "role": 1,
                "session": sessionId
            }
          }),
        };
    
        $.ajax(settings).done(function (response) {
            // Log the response
            console.log(response.result[0].message);
            
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


module.exports = {
    Loginuser,
    // readDosri,
    // updateDosri,
    // deleteDosri,
  };