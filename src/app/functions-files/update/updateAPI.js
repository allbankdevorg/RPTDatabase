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
                    "managing_company": formData.managing_company
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
}