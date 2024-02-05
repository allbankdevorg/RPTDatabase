import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CoreService } from '../../services/core/core.service';


// Functions Imports
import {callJSFun} from '../../functions-files/javascriptfun.js';
import {FetchDataService} from '../../services/fetch/fetch-data.service';
// import {getCompany, getDirectors} from '../../../functions-files/getFunctions'
import {createAffil, cisLookUP, addPNData} from '../../functions-files/add/postAPI.js'
import {deleteDosri, deleteDirector, deleteRelationship} from '../../functions-files/delFunctions'

// Audit Trail
import { AuditTrailService } from '../../services/auditTrail/audit-trail.service';
import {AuditTrail} from '../../model/audit-trail.model';

// Services
import {AddServicesService} from '../../services/add/add-services.service';
import { AffiliatesService } from 'src/app/services/affiliates/affiliates.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-affiliates-modal',
  templateUrl: './affiliates-modal.component.html',
  styleUrls: ['./affiliates-modal.component.scss']
})
export class AffiliatesModalComponent implements OnInit {
  affForm: FormGroup;
  moduleV: any;
  isReadOnly: boolean = true;
  cisLookUpResult: [] = [];

  constructor(
    private formBuilder: FormBuilder,
    private _dosriService: AddServicesService,
    private dataService: AffiliatesService,
    private _dialogRef: MatDialogRef<AffiliatesModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _coreService: CoreService,
    private auditTrailService: AuditTrailService) {
    this.affForm = this.formBuilder.group({
      aff_com_cis_number: [''],
      aff_com_account_name: ['', [Validators.required]],
      aff_com_company_name: ['', [Validators.required]],
      // commandControl: ['', [Validators.required]]
      });
      _dialogRef.disableClose = true;
  }


  ngOnInit(): void {

  // Attempt to patch the form
  this.affForm.patchValue(this.data);
  }


  onSubmit() {
    const moduleV = this.dataService.getmoduleV();
    

    if (this.affForm.valid) {
      const formData = this.affForm.value;
      const session = sessionStorage.getItem('sessionID')?.replaceAll("\"","");
      const userID = sessionStorage.getItem('userID')?.replaceAll("\"","");
      const holdOUT = formData.depoHoldOut;

      createAffil(formData, moduleV, session, userID)
      .then((response) => {
        this.ngOnInit();
        this.logAction('Add', 'Added Affiliates', true, 'Affiliates');
        this.close();

        const resultData = this.cisLookUpResult;
          addPNData(resultData, holdOUT, session, userID)
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
        } else {
          // Handle other error conditions 
          this.logAction('Add', 'Adding Affiliates Failed', false, 'Affiliates');
          // this._dialogRef.close(false);
        }

       
        // Swal.fire('Error occurred', '', 'error');
      });
    }
  }
  
  
    onFormSubmit() {
      if (this.affForm.valid) {
        const formData = this.affForm.value;
  
        if (this.data) {
          this._dosriService
            .updateEmployee(this.data.id, this.affForm.value)
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
      const dataLookup = this.affForm.value;
      
      if (dataLookup.aff_com_cis_number) {
        let cis = dataLookup.aff_com_cis_number;
        cisLookUP(cis)
          .then((response) => {
            if (response.length > 0) {
              // If the array is not empty, use the first element
              let accName = response[0].name;
              this.toggleInputReadOnly();
              // Update form controls with new values
              this.affForm.patchValue({
                aff_com_account_name: accName,
                aff_com_company_name: accName // Assuming you have company_name in the response
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
    
  });
  
}

}
