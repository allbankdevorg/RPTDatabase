import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CoreService } from '../../services/core/core.service';
// import { EmployeeService } from '../services/employee.service';

// Functions Imports
import {createDosri, cisLookUP, addPNData} from '../../functions-files/add/postAPI.js'

// Audit Trail
import { AuditTrailService } from '../../services/auditTrail/audit-trail.service';
import {AuditTrail} from '../../model/audit-trail.model';

// Services
import {AddServicesService} from '../../services/add/add-services.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dosri-modal',
  templateUrl: './dosri-modal.component.html',
  styleUrls: ['./dosri-modal.component.scss']
})
export class DosriModalComponent implements OnInit {
  
  isReadOnly: boolean = true;
  foodCtrl!: FormControl;
  disabled: boolean = true;
  dosriForm: FormGroup;
  cisLookUpResult: [] = [];
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
    // console.log('Data received in DosriModalComponent:', this.data);
    this.foodCtrl = new FormControl({value: '', disabled: this.disabled})

  // Attempt to patch the form
  this.dosriForm.patchValue(this.data);

  // Log the form control values
  // console.log('Form controls after patching:', this.dosriForm.value);

  }

  isFieldDisabled(): boolean {
    return true;
  }

  onSubmit() {
    if (this.dosriForm.valid) {
      const formData = this.dosriForm.value;
      const session = sessionStorage.getItem('sessionID')?.replaceAll("\"", "");
      const userID = sessionStorage.getItem('userID')?.replaceAll("\"", "");
  
      // Call the JavaScript function with form data
      createDosri(formData, session, userID)
        .then((response) => {
          // Log the response when the promise is resolved
          this.ngOnInit();
          this.logAction('Add', 'Added Company', true, 'DRI');
          this.close();

          const resultData = this.cisLookUpResult;

          addPNData(resultData, session, userID)
          .then((response) => {

          })
          .catch((error) => {

          });

        })
        .catch((error) => {
          // Handle errors when the promise is rejected
          
          // Check if the error message is "CISNumber already define"
          if (error && error.result && error.result[0] && error.result[0].status === "error" &&
              error.result[0].message === "CISNumber already define") {
            this._dialogRef.close(true);

            const resultData = this.cisLookUpResult;
            addPNData(resultData, session, userID)
            .then((response) => {
  
            })
            .catch((error) => {
  
            });
          } else {
            // Handle other error conditions 
            this.logAction('Add', 'Adding Company Failed', false, 'DRI');
            // this._dialogRef.close(false);
          }
  
         
          // Swal.fire('Error occurred', '', 'error');
        });
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
              // console.error(err);
            },
          });
      } else {
        this._dosriService.createDosri(formData).subscribe({
          next: (val: any) => {
            this._coreService.openSnackBar('Employee added successfully');
            this._dialogRef.close(true);
          },
          error: (err: any) => {
            // console.error(err);
          },
        });
      }
    }
  }

  close() {
    this._dialogRef.close(true); 
  }


  CISlookup() {
    const dataLookup = this.dosriForm.value;
  
    if (dataLookup.com_cis_number) {
      let cis = dataLookup.com_cis_number;
      cisLookUP(cis)
        .then((response) => {
          if (response.length > 0) {
            // If the array is not empty, use the first element
            this.cisLookUpResult = response;
            console.log(this.cisLookUpResult);
            let accName = response[0].name;
            console.log(response);
  
            // Update form controls with new values
            this.dosriForm.patchValue({
              com_account_name: accName,
              com_company_name: accName // Assuming you have company_name in the response
              // Add other form controls if needed
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'No CIS Found!',
              text: 'Please Enter the Account and Company Name',
            });
            this.toggleInputReadOnly();
          }
        })
        .catch((error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'An error occurred while fetching data.',
          });
          this.toggleInputReadOnly();
        });
    }
  }
  
  

  toggleInputReadOnly() {
    this.isReadOnly = !this.isReadOnly;
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
    // console.log('Audit trail entry logged successfully.');
  });
  // console.log('Audit trail entry logged successfully.');
}


}
