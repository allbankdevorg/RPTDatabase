function updateManagingCompany(formData) {
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
                "request": {
                    "cis_number": formData.aff_com_cis_number,
                    "managing_company": formData.managing_company,
                    "account_name": formData.aff_com_comp_name,
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


function updateCompany(formData) {
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


function updateHoldOut(formData) {
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
                "request": {
                    "pn_no": formData.loan_no,
                    "hold_out": formData.deposit_holdout   
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



module.exports = {
    updateManagingCompany,
    updateCompany,
    updateHoldOut
}