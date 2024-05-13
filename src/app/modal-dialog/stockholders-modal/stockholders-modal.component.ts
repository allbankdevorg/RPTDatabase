import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CoreService } from '../../services/core/core.service';
// import { EmployeeService } from '../services/employee.service';

// Functions Imports
import {createStockHolders, cisLookUP} from '../../functions-files/add/postAPI.js';
import {updateStocksHolder} from '../../functions-files/update/updateAPI';
// Audit Trail
import { AuditTrailService } from '../../services/auditTrail/audit-trail.service';
import {AuditTrail} from '../../model/audit-trail.model';

// Services
import {AddServicesService} from '../../services/add/add-services.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-stockholders-modal',
  templateUrl: './stockholders-modal.component.html',
  styleUrls: ['./stockholders-modal.component.scss']
})
export class StockholdersModalComponent {

  stockHoldersForm: FormGroup;
  isReadOnly: boolean = true;

  constructor(
    private _fb: FormBuilder,
    private _dosriService: AddServicesService,
    private _dialogRef: MatDialogRef<StockholdersModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _coreService: CoreService,
    private auditTrailService: AuditTrailService
  ) {
    this.stockHoldersForm = this._fb.group({
      cis_number: ['', [Validators.required, Validators.pattern(/^[A-Za-z\d]+$/)]],
      name: ['', [Validators.required, Validators.pattern(/\S+/)]],
      shares: ['', [Validators.required, Validators.pattern(/^[\d]+$/)]],
      amount: ['', [Validators.required, Validators.pattern(/^[\d]+$/)]],
      percentage: ['', [Validators.required, Validators.pattern(/^[\d]+(\.[\d]+)?$/)
    ]],
      });
    _dialogRef.disableClose = true;
  }


  ngOnInit(): void {

  // Attempt to patch the form
  this.stockHoldersForm.patchValue(this.data);

  }


  onSubmit() {
    if (this.stockHoldersForm.valid) {
      const formData = this.stockHoldersForm.value;
      const session = sessionStorage.getItem('sessionID')?.replaceAll("\"", "");
      const userID = sessionStorage.getItem('userID')?.replaceAll("\"", "");
  
      // Call the JavaScript function with form data
      if (this.data) {
        updateStocksHolder(formData, session, userID)
        .then((response) => {
          this.ngOnInit();
          this.logAction('Update', 'Updated Stockholders', true, 'bankstockholders');
          this.close();
        })
        .catch((error) => {

        })
      }
      else {
        createStockHolders(formData, session, userID)
        .then((response) => {
          // Log the response when the promise is resolved
          // this.ngOnInit();
          this.logAction('Add', 'Added Shareholders', true, 'bankstockholders');
          this.close();
        })
        .catch((error) => {
          // Handle errors when the promise is rejected
  
          // Check if the error message is "CISNumber already define"
          if (error && error.result && error.result[0] && error.result[0].status === "error" &&
              error.result[0].message === "CISNumber already define")
               {
            this._dialogRef.close(true);
          } else {
            // Handle other error conditions 
            this.logAction('Add', 'Adding Stock Holders Failed', false, 'bankstockholders');
            // this._dialogRef.close(false);
          }
  
         
          // Swal.fire('Error occurred', '', 'error');
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
    
  });
  
}


CISlookup() {
  const dataLookup = this.stockHoldersForm.value;
  if (dataLookup.cis_number) {
    let cis = dataLookup.cis_number;
    cisLookUP(cis)
      .then((response) => {
        if (Array.isArray(response.data)) {
          if (response.data.length > 0) {
            // If response.data is an array and not empty, use the first element
            const firstElement = response.data[0];
            // this.cisLookUpResult = response.data;
            let accName = firstElement.name;

            this.updateFormControls(accName);
          } else {
            // Handle the case when response.data is an empty array
            const accName = response.cisName || '';
            this.updateFormControls(accName);
            this.toggleInputReadOnly();
          }
        } else {
          // Handle the case when response.data is not an array
          const accName = response.cisName || '';
          this.updateFormControls(accName);
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

// Function to update form controls
updateFormControls(accName: string) {
  this.stockHoldersForm.patchValue({
    name: accName,
    com_company_name: accName // Assuming you have company_name in the response
    // Add other form controls if needed
  });
}


toggleInputReadOnly() {
  this.isReadOnly = !this.isReadOnly;
}

}
