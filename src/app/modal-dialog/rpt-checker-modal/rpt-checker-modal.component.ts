import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CoreService } from '../../services/core/core.service';
import Swal from 'sweetalert2';

// Import for Simulation Modal
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { RPTSimulationModalComponent } from 'src/app/modal-dialog/rpt-simulation-modal/rpt-simulation-modal.component';
import {rptLookup} from '../../functions-files/add/postAPI.js'


@Component({
  selector: 'app-rpt-checker-modal',
  templateUrl: './rpt-checker-modal.component.html',
  styleUrls: ['./rpt-checker-modal.component.scss']
})
export class RptCheckerModalComponent {

  checkRPTForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public _dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,) {
      this.checkRPTForm = this.formBuilder.group({
          firstName: ['', [Validators.required]],
          lastName: ['', [Validators.required]]
        });

  }



  

  rptCheck() {
    const rpt = this.checkRPTForm.value;

    rptLookup(rpt)
        .then((response) => {
            // Show success or error modal based on the response
            if (response.result && response.result.length > 0) {
                const data = response.result[0].Data;
                if (data && data.length > 0) {
                    const officerRelated = data[0].officer_related;
                    if (officerRelated.startsWith("148")) {
                        // Show success message for RPT
                        Swal.fire({
                            icon: 'success',
                            title: 'RPT!',
                            text: 'This is RPT',
                            showCancelButton: true,
                            confirmButtonText: 'Simulate'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                // Handle the user's confirmation
                                this.openSimulation();
                                // Optionally, perform any actions based on the user's confirmation
                            } else {
                                // Handle the user's cancellation (if necessary)
                                console.log('User cancelled.');
                                // Optionally, perform any actions based on the user's cancellation
                            }
                        });
                    } else {
                        // Show error message for non-RPT
                        Swal.fire({
                            icon: 'error',
                            title: 'Not RPT!',
                            text: '',
                            showCancelButton: true,
                            confirmButtonText: 'Simulate'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                // Handle the user's confirmation
                                this.openSimulation();
                                // Optionally, perform any actions based on the user's confirmation
                            } else {
                                // Handle the user's cancellation (if necessary)
                                console.log('User cancelled.');
                                // Optionally, perform any actions based on the user's cancellation
                            }
                        });
                    }
                } else {
                  Swal.fire({
                    icon: 'error',
                    title: 'Not RPT!',
                    text: '',
                    showCancelButton: true,
                    confirmButtonText: 'Simulate'
                }).then((result) => {
                    if (result.isConfirmed) {
                        // Handle the user's confirmation
                        this.openSimulation();
                        // Optionally, perform any actions based on the user's confirmation
                    } else {
                        // Handle the user's cancellation (if necessary)
                        console.log('User cancelled.');
                        // Optionally, perform any actions based on the user's cancellation
                    }
                });
                }
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Not RPT!',
                text: '',
                showCancelButton: true,
                confirmButtonText: 'Simulate'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Handle the user's confirmation
                    this.openSimulation();
                    // Optionally, perform any actions based on the user's confirmation
                } else {
                    // Handle the user's cancellation (if necessary)
                    console.log('User cancelled.');
                    // Optionally, perform any actions based on the user's cancellation
                }
            });
            }
        })
        .catch((error) => {
            // Show error modal based on error
            Swal.fire({
                icon: 'error',
                title: 'Not RPT!',
                text: 'This is Not RPT'
            });
        });
}






  openSimulation() {
    const dialogRef = this._dialog.open(RPTSimulationModalComponent, {
      width: '50%', // Set the width as per your requirement
      // Other MatDialog options can be specified here
    });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          // this.ngOnInit();
          
          // this.calculateSimulatedData(this.dataSource.data);
        }
      },
    });
  }
}
