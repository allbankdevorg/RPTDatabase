function deleteDosri(dosriId) {
    Swal.fire({
        title: 'Are you sure?',
        text: "Do you want to Delete this DOSRI?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes!'
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire(
            'Deleted!',
            'Related Interest has been deleted.',
            'success'
          )
        }
      })
    // var settings = {
        
    //   };

    // $.ajax(settings).done(function (response) {
    //     // Assuming response.result[0].status indicates success
    //     if (response.result[0].status === "success") {
    //         Swal.fire({
    //             title: 'Confirmation',
    //             text: response.result[0].message,
    //             icon: 'success',
    //             showCancelButton: true,
    //             confirmButtonText: 'Yes',
    //             cancelButtonText: 'No'
    //         }).then((result) => {
    //             if (result.isConfirmed) {
    //                 // User clicked 'Yes', perform additional actions if needed
    //                 console.log('User clicked Yes');
    //             } else {
    //                 // User clicked 'No', perform additional actions if needed
    //                 console.log('User clicked No');
    //             }
    //         });
    //     } else {
    //         Swal.fire(`${response.result[0].message}`, ``, `${response.result[0].status}`);
    //     }
    // });
    
}

function deleteDOSRIDirector(directorId) {
    // Implement code to delete a director from the database
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to Delete this Director?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Deleted!',
          'Related Interest has been deleted.',
          'success'
        )
      }
    })
}

function deleteDOSRIDirRelationship(relationshipId) {
      Swal.fire({
        title: 'Are you sure?',
        text: "Do you want to Delete this Related Interest?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes!'
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire(
            'Deleted!',
            'Related Interest has been deleted.',
            'success'
          )
        }
      })
}

function deleteDOSRIOfficer(directorId) {
    // Implement code to delete a DOSRI officer from the database
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to Delete this Bank Officer?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Deleted!',
          'Related Interest has been deleted.',
          'success'
        )
      }
    })

}

function deleteDOSRIOfficerRI(directorId) {
    // Implement code to delete a director from the database
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to Delete this Relationship?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Deleted!',
          'Relationship has been deleted.',
          'success'
        )
      }
    })
}

function deleteAffiliates(directorId) {
  // Implement code to delete a director from the database
  Swal.fire({
    title: 'Are you sure?',
    text: "Do you want to Delete this Affiliates?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes!'
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire(
        'Deleted!',
        'Relationship has been deleted.',
        'success'
      )
    }
  })
}

function deleteAffilDir(directorId) {
  // Implement code to delete a director from the database
  Swal.fire({
    title: 'Are you sure?',
    text: "Do you want to Delete this Affiliate's Director?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes!'
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire(
        'Deleted!',
        'Relationship has been deleted.',
        'success'
      )
    }
  })
}

function deleteAffilDirRI(directorId) {
  // Implement code to delete a director from the database
  Swal.fire({
    title: 'Are you sure?',
    text: "Do you want to Delete this Director's Relationship?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes!'
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire(
        'Deleted!',
        'Relationship has been deleted.',
        'success'
      )
    }
  })
}


function deleteAffilOff(directorId) {
  // Implement code to delete a director from the database
  Swal.fire({
    title: 'Are you sure?',
    text: "Do you want to Delete this Affiliate's Officer?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes!'
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire(
        'Deleted!',
        'Relationship has been deleted.',
        'success'
      )
    }
  })
}


function deleteAffilOffRI(directorId) {
  // Implement code to delete a director from the database
  Swal.fire({
    title: 'Are you sure?',
    text: "Do you want to Delete this Affiliate's Officer Relationship?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes!'
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire(
        'Deleted!',
        'Relationship has been deleted.',
        'success'
      )
    }
  })
}



module.exports = {
    deleteDosri,
    deleteDOSRIDirector,
    deleteDOSRIDirRelationship,
    deleteDOSRIOfficer,
    deleteDOSRIOfficerRI,
    deleteAffiliates,
    deleteAffilDir,
    deleteAffilOff,
    deleteAffilDirRI,
    deleteAffilOffRI
  };