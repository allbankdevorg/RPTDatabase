function deleteDosri(dosriId) {
  // Code to delete a DOSRI from the database
    Swal.fire({
        title: 'Are you sure?',
        text: "Do you want to Delete this DOSRI Company?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes!'
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire(
            'Deleted!',
            'DOSRI Company has been deleted.',
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
    //             } else {
    //                 // User clicked 'No', perform additional actions if needed
    //             }
    //         });
    //     } else {
    //         Swal.fire(`${response.result[0].message}`, ``, `${response.result[0].status}`);
    //     }
    // });
    
}

function deleteDOSRIDirector(directorId) {
    // Code to delete a director from the database
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to Unassign this Director?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Deleted!',
          'Director has been Unassigned.',
          'success'
        )
      }
    })
}

function deleteDOSRIDirRelationship(relationshipId) {
  // Code to delete a director relationship from the database
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
    // Code to delete a DOSRI officer from the database
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to Unassign this Bank Officer?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Deleted!',
          'Bank Officer has been Unassigned.',
          'success'
        )
      }
    })

}

function deleteDOSRIOfficerRI(directorId) {
    // Code to delete a bank officer from the database
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
  // Code to delete a Affiliates from the database
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
        'Affiliates has been deleted.',
        'success'
      )
    }
  })
}

function deleteAffilDir(directorId) {
  // ICode to delete a Affiliate director from the database
  Swal.fire({
    title: 'Are you sure?',
    text: "Do you want to Unassign this Affiliate's Director?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes!'
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire(
        'Deleted!',
        "Affiliate's Director has been Unassigned.",
        'success'
      )
    }
  })
}

function deleteAffilDirRI(directorId) {
  // Code to delete a Affiliate director relationshi from the database
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
    text: "Do you want to Unassign this Affiliate's Officer?",
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
  // Code to delete a Affiliate Officer from the database
  Swal.fire({
    title: 'Are you sure?',
    text: "Do you want to Unlink this Affiliate's Director Related Interest?",
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