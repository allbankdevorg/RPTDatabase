
function updateManagingCompany(formData, session, userID) {
    return new Promise((resolve, reject) => {
            var settings = {
                "url": "http://10.232.236.15:8092/api/updateData",
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
                    "cis_number": formData.aff_com_cis_number,
                    "managing_company": formData.managing_company,
                    "account_name": formData.aff_com_account_name,
                    "company_name": formData.aff_com_comp_name,
                    "hold_out": formData.hold_out   
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


function updateCompany(formData, session, userID) {
    return new Promise((resolve, reject) => {
            var settings = {
                "url": "http://10.232.236.15:8092/api/updateData",
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
                    "cis_number": formData.aff_com_cis_number,
                    "managing_company": formData.managing_company,
                    "account_name": formData.aff_com_company_name,
                    "hold_out": formData.hold_out   
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


function updateHoldOut(formData, session, userID) {
    return new Promise((resolve, reject) => {
            var settings = {
                "url": "http://10.232.236.15:8092/api/updateData",
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
                    "pn_no": formData.loan_no,
                    "hold_out": formData.holdoutdata   
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


function updateAffilOff(offData, data_id, old_cis, session, userID) {
    return new Promise((resolve, reject) => {
            var settings = {
                "url": "http://10.232.236.15:8092/api/updateData",
                "method": "POST",
                "timeout": 0,
                "headers": {
                "Content-Type": "application/json"
                },
                "data": JSON.stringify({
                "cmd": 81,
                "session": session,
                "userid": userID,
                "request": {
                    "data_id": data_id,
                    "old_cis": old_cis,
                    "cis_number": offData.off_CisNumber,  // Use form data
                    "fname": offData.off_fname, 
                    "mname": offData.off_mname, 
                    "lname": offData.off_lname,
                    "position": offData.Position 
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


/*******************************New**************************************/


function updateDOSRI(formData, session, userID) {
    return new Promise((resolve, reject) => {
        var settings = {
            "url": "http://10.232.236.15:8092/api/updateData",
                "method": "POST",
                "timeout": 0,
                "headers": {
                "Content-Type": "application/json"
                },
                "data": JSON.stringify({
                "cmd": 801,
                "session": session,
                "userid": userID,
                "request": {
                    "cis_number": formData.com_cis_number,
                    "account_name": formData.com_account_name,
                    "company_name": formData.com_company_name
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
    })
}





function updateStocksHolder(formData, session, userID) {
    return new Promise((resolve, reject) => {
        var settings = {
            "url": "http://10.232.236.15:8092/api/updateData",
                "method": "POST",
                "timeout": 0,
                "headers": {
                "Content-Type": "application/json"
                },
                "data": JSON.stringify({
                "cmd": 802,
                "session": session,
                "userid": userID,
                "request": {
                    "cis_number": formData.cis_number,
                    "name": formData.name,
                    "shares": formData.shares,
                    "amount": formData.amount,
                    "percentage": formData.percentage,
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
    })
}


function updateAffiliates(formData, session, userID) {
    return new Promise((resolve, reject) => {
        var settings = {
            "url": "http://10.232.236.15:8092/api/updateData",
                "method": "POST",
                "timeout": 0,
                "headers": {
                "Content-Type": "application/json"
                },
                "data": JSON.stringify({
                "cmd": 803,
                "session": session,
                "userid": userID,
                "request": {
                    "cis_number": formData.aff_com_cis_number,
                    "account_name": formData.aff_com_account_name,
                    "company_name": formData.aff_com_company_name,
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
    })
}



function updateAffiliatesDir(directData, data_id, old_cis, session, userID) {
    return new Promise((resolve, reject) => {
        var settings = {
            "url": "http://10.232.236.15:8092/api/updateData",
                "method": "POST",
                "timeout": 0,
                "headers": {
                "Content-Type": "application/json"
                },
                "data": JSON.stringify({
                "cmd": 805,
                "session": session,
                "userid": userID,
                "request": {
                    "cis_number": directData.dir_CisNumber,
                    "fname": directData.off_fname,
                    "mname": directData.off_mname,
                    "lname": directData.off_lname,
                    "position": directData.Position,
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
    })
}



function updateUserAccess(data, user, session, userID) {
    return new Promise((resolve, reject) => {
        var settings = {
            "url": "http://10.232.236.15:8092/api/updateData",
                "method": "POST",
                "timeout": 0,
                "headers": {
                "Content-Type": "application/json"
                },
                "data": JSON.stringify({
                "cmd": 808,
                "session": session,
                "user_id": userID,
                "request": {
                    "userid": data.userid,
                    "nav_id": data.nav_id,
                    "add": data.add,
                    "edit": data.edit,
                    "update": data.update,
                    "delete": data.delete,
                    "view": data.view,
                    "approver": data.approver,
                    "maker": data.maker,
                    "id": data.id
                }
                }),
            };

            $.ajax(settings).done(function (response) {
                
                // Check the status and resolve/reject the promise accordingly
                // Swal.fire(`${response.result[0].message}`, ``, `${response.result[0].status}`);
                // if (response.result[0].status === 'success') {
                // resolve(response);
                // } else {
                // reject(response);
                // }
            });
    })
}


function updateUserInfo(data, user, session, userID) {
    return new Promise((resolve, reject) => {
        var settings = {
            "url": "http://10.232.236.15:8092/api/updateData",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json"
            },
            "data": JSON.stringify({
                "cmd": 809,
                "session": session,
                "userid": userID,
                "request": {
                    "username": data.username,
                    "mobile_no": data.mobile_no,
                    "role": data.role,
                    "status": data.status
                }
            }),
        };

        $.ajax(settings)
            .done(function (response, textStatus, jqXHR) {
                const statusCode = jqXHR.status;
                console.log('jqXHR Status (Success):', statusCode);

                // Handle different status codes
                if (statusCode === 200 || statusCode === 201 || statusCode === 204) {
                    Swal.fire('Request Successful', '', 'success');
                    resolve(response); // Resolve the promise if successful
                } else {
                    Swal.fire(`Request Failed: ${jqXHR.statusText}`, '', 'error');
                    reject(jqXHR.statusText); // Reject the promise if failed
                }
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
                const statusCode = jqXHR.status;

                if (statusCode === 201) {
                    Swal.fire('Request Successful', '', 'success');
                    resolve(jqXHR.responseText); // Resolve the promise if status is 201
                } else {
                    Swal.fire(`Request Failed: ${textStatus}`, errorThrown, 'error');
                    reject(errorThrown); // Reject the promise if an error occurs
                }
            });
    });
}

function updateBankOfficer(boData, data_id, old_cis, session, userID) {
    return new Promise((resolve, reject) => {
        var settings = {
            "url": "http://10.232.236.15:8092/api/updateData",
                "method": "POST",
                "timeout": 0,
                "headers": {
                "Content-Type": "application/json"
                },
                "data": JSON.stringify({
                "cmd": 810,
                "session": session,
                "userid": userID,
                "request": {
                    "id": data_id,
                    "cis_number": boData.cis_num,
                    "fname": boData.fname,
                    "mname": boData.mname,
                    "lname": boData.lname,
                    "position": boData.Position,
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
    })
}








module.exports = {
    updateManagingCompany,
    updateCompany,
    updateHoldOut,
    updateAffilOff,

    updateDOSRI,
    updateStocksHolder,
    updateAffiliates,
    updateAffiliatesDir,
    updateUserAccess,
    updateUserInfo,
    updateBankOfficer
}