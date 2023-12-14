import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CoreService } from '../../services/core/core.service';
// import { EmployeeService } from '../services/employee.service';

// Functions Imports
import {callJSFun} from '../../functions-files/javascriptfun.js';
import {FetchDataService} from '../../services/fetch/fetch-data.service';
// import {getCompany, getDirectors} from '../../../functions-files/getFunctions'
import {createDosri} from '../../functions-files/add/postAPI.js'
import {deleteDosri, deleteDirector, deleteRelationship} from '../../functions-files/delFunctions'

// Audit Trail
import { AuditTrailService } from '../../services/auditTrail/audit-trail.service';
import {AuditTrail} from '../../model/audit-trail.model';

// Services
import {AddServicesService} from '../../services/add/add-services.service';

@Component({
  selector: 'app-dosri-modal',
  templateUrl: './dosri-modal.component.html',
  styleUrls: ['./dosri-modal.component.scss']
})
export class DosriModalComponent implements OnInit {
  
  dosriForm: FormGroup;
  education: string[] = [
    'Matric',
    'Diploma',
    'Intermediate',
    'Graduate',
    'Post Graduate',
  ];

  constructor(
    private _fb: FormBuilder,
    private _dosriService: AddServicesService,
    private _dialogRef: MatDialogRef<DosriModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _coreService: CoreService,
    private auditTrailService: AuditTrailService
  ) {
    this.dosriForm = this._fb.group({
      com_cis_number: ['', [Validators.required]],
      com_account_name: ['', [Validators.required]],
      com_company_name: ['', [Validators.required]]
      });
    _dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    console.log('Data received in DosriModalComponent:', this.data);

  // Attempt to patch the form
  this.dosriForm.patchValue(this.data);

  // Log the form control values
  console.log('Form controls after patching:', this.dosriForm.value);

  }

  onSubmit() {

    if (this.dosriForm.valid) {
      const formData = this.dosriForm.value;

      // Call the JavaScript function with form data
      createDosri(formData)
      .then((response) => {
        // Log the response when the promise is resolved
          this.ngOnInit();
          this.logAction('Add', 'Added Company', true, 'DRI');
          this.close();
      })
      .catch((error) => {
        // Handle errors when the promise is rejected
        console.error(error.result[0].status);
        this.logAction('Add', 'Adding Company Failed', false, 'DRI');
        // Swal.fire('Error occurred', '', 'error');
      }); // Pass the entire formData object
    }

    }
    


  onFormSubmit() {
    if (this.dosriForm.valid) {
      const formData = this.dosriForm.value;

      if (this.data) {
        this._dosriService
          .updateEmployee(this.data.id, this.dosriForm.value)
          .subscribe({
            next: (val: any) => {
              this._coreService.openSnackBar('Employee detail updated!');
              this._dialogRef.close(true);
            },
            error: (err: any) => {
              console.error(err);
            },
          });
      } else {
        this._dosriService.createDosri(formData).subscribe({
          next: (val: any) => {
            this._coreService.openSnackBar('Employee added successfully');
            this._dialogRef.close(true);
          },
          error: (err: any) => {
            console.error(err);
          },
        });
      }
    }
  }

  close() {
    this._dialogRef.close(true); 
  }





   // Start of Functions for Audit Trail
logAction(actionType: string, details: string, success: boolean, page: string, errorMessage?: string) {
  const auditTrailEntry = this.createAuditTrailEntry(actionType, details, success, page, errorMessage);
  this.logAuditTrail(auditTrailEntry);
}



private createAuditTrailEntry(actionType: string, details: string, success: boolean, page: string, errorMessage?: string): AuditTrail {
  return {
    userId: 'current_user_id',
    userName: 'Current_user',
    timestamp: new Date(),
    actionType,
    details,
    success,
    page, // Include the page information
    errorMessage: errorMessage || '', // Optional: Include error message if available
  };
}


private logAuditTrail(auditTrailEntry: AuditTrail) {
  this.auditTrailService.logAuditTrail(auditTrailEntry).subscribe(() => {
    console.log('Audit trail entry logged successfully.');
  });
  // console.log('Audit trail entry logged successfully.');
}


}
