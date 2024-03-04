import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CoreService } from '../../services/core/core.service';
import Swal from 'sweetalert2';

// Import for Simulation Modal
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { RPTSimulationModalComponent } from 'src/app/modal-dialog/rpt-simulation-modal/rpt-simulation-modal.component';


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
