import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CoreService } from '../../services/core/core.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-rpt-checker-modal',
  templateUrl: './rpt-checker-modal.component.html',
  styleUrls: ['./rpt-checker-modal.component.scss']
})
export class RptCheckerModalComponent {

  checkRPTForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
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
          console.log('User confirmed.');
          // Optionally, perform any actions based on the user's confirmation
        } else {
          // Handle the user's cancellation (if necessary)
          console.log('User cancelled.');
          // Optionally, perform any actions based on the user's cancellation
        }
    });
    
  }
}
