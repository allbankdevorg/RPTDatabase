function Logout(Logout) {
    return new Promise((resolve, reject) => {
        console.log(formData)
        console.log(moduleV);

        Swal.fire({
            title: 'Are you sure?',
            text: "Do you want to Logout?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes!'
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire(
                'Logging Out....!',
                
                'success'
              )
            }
          })
      });
    // Code to delete a DOSRI from the database
      
}