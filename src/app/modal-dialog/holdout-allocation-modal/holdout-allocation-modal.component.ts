import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuditTrail } from 'src/app/model/audit-trail.model';
import { AuditTrailService } from 'src/app/services/auditTrail/audit-trail.service';

@Component({
  selector: 'app-holdout-allocation-modal',
  templateUrl: './holdout-allocation-modal.component.html',
  styleUrls: ['./holdout-allocation-modal.component.scss']
})
export class HoldoutAllocationModalComponent implements OnInit {

  hldOTForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    // private _dosriService: AddServicesService,
    // private dataService: AffiliatesService,
    private _dialogRef: MatDialogRef<HoldoutAllocationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    // private _coreService: CoreService,
    private auditTrailService: AuditTrailService) {
    this.hldOTForm = this.formBuilder.group({
      aff_com_cis_number: ['', [Validators.required]],
      aff_com_account_name: ['', [Validators.required]],
      aff_com_company_name: ['', [Validators.required]],
      // commandControl: ['', [Validators.required]]
      });
      _dialogRef.disableClose = true;
  }


  ngOnInit(): void {
    this.hldOTForm.patchValue(this.data);
  }

  onSubmit() {

    if (this.hldOTForm.valid) {
      const formData = this.hldOTForm.value;
      const session = sessionStorage.getItem('sessionID')?.replaceAll("\"","");
      const userID = sessionStorage.getItem('userID')?.replaceAll("\"","");

      // createAffil(formData, moduleV, session, userID)
      // .then((response) => {
      //   this.ngOnInit();
      //   this.logAction('Add', 'Added Affiliates', true, 'Affiliates');
      //   this.close();
      // })
      // .catch((error) => {
      //   // Handle errors when the promise is rejected

      //   // Check if the error message is "CISNumber already define"
      //   if (error && error.result && error.result[0] && error.result[0].status === "error" &&
      //       error.result[0].message === "CISNumber already define") {
      //     this._dialogRef.close(true);
      //   } else {
      //     // Handle other error conditions 
      //     this.logAction('Add', 'Adding Affiliates Failed', false, 'Affiliates');
      //     // this._dialogRef.close(false);
      //   }

       
      //   // Swal.fire('Error occurred', '', 'error');
      // });
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
    // console.log('Audit trail entry logged successfully.');
  });
  // console.log('Audit trail entry logged successfully.');
}
}
