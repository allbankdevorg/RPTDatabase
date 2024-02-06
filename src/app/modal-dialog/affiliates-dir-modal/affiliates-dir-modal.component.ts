import { Component, Inject, OnInit, OnDestroy, NgZone } from '@angular/core';

import { AbstractControl, FormControl, ValidationErrors, ValidatorFn, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';

// Imports for Functions
import {createAffilDir, cisLookUP, addPNData} from '../../functions-files/add/postAPI';

import Swal from 'sweetalert2';
// Audit Trail
import { AuditTrailService } from '../../services/auditTrail/audit-trail.service';
import {AuditTrail} from '../../model/audit-trail.model';

// Services
import { DataTransferService } from '../../services/data-transfer.service';
import { SharedService } from '../../../app/views/dosri/dataintegration/shared.service';
import {AffiliatesService} from '../../services/affiliates/affiliates.service'; //Service to set the value of the DirCIS and buttonID in adding RI of Directors


@Component({
  selector: 'app-affiliates-dir-modal',
  templateUrl: './affiliates-dir-modal.component.html',
  styleUrls: ['./affiliates-dir-modal.component.scss']
})
export class AffiliatesDirModalComponent implements OnInit{

  affilDrctrForm: FormGroup;
  compId: any;
  
  isReadOnly: boolean = true;
  cisLookUpResult: [] = [];

  constructor(
    private formBuilder: FormBuilder, 
    private sharedService: SharedService,
    private dataService: AffiliatesService,
    private dataTransferService: DataTransferService,
    private _dialogRef: MatDialogRef<AffiliatesDirModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private changeDetectorRef: ChangeDetectorRef,
    private ngZone: NgZone,
    private auditTrailService: AuditTrailService)
    {
        this.affilDrctrForm = this.formBuilder.group({
          affildcisNumber: [''],
          affildFirstName: ['', [Validators.required]],
          affildMiddleName: [''],
          affildLastName: ['', [Validators.required]],
          affildPosition: ['', [Validators.required]],
        });
    }


    async  ngOnInit() {
      this.affilDrctrForm.patchValue(this.data);
    }



    // Functions

    // Adding Affiliated Company Directors
 onAffilDSubmit() {
  if (this.affilDrctrForm.valid) {
    const directData = this.affilDrctrForm.value;
    const directorId = this.sharedService.getDirectorId();
    const companyName = this.sharedService.getCompName();
    const session = sessionStorage.getItem('sessionID')?.replaceAll("\"","");
    const userID = sessionStorage.getItem('userID')?.replaceAll("\"","");
    const comp_CIS = this.dataService.getCompCIS();
    const holdOUT = directData.depoHoldOut;
    
    // Call the JavaScript function with form data
    createAffilDir(directData, comp_CIS, session, userID)
      .then((response) => {
        this.logAction('Add', 'Successfuly Added Director', true, 'directorsrelated');
        this.close();

        const resultData = this.cisLookUpResult;
        addPNData(resultData, holdOUT, session, userID)
        .then((response) => {

        })
        .catch((error) => {

        });
      })
      .catch((error) => {
        this.logAction('Add', 'Failed Adding Director', false, 'directorsrelated');
      
      });

    
  }

  this.ngZone.run(() => {
    // this.dataSource.data = this.tableData;
  });

    // Trigger change detection
  this.changeDetectorRef.detectChanges();
}


close() {
  this._dialogRef.close(true); 
}



CISlookup() {
  const dataLookup = this.affilDrctrForm.value;

  if (dataLookup.com_cis_number) {
    let cis = dataLookup.com_cis_number;
    cisLookUP(cis)
      .then((response) => {
        if (Array.isArray(response.data)) {
          if (response.data.length > 0) {
            // If response.data is an array and not empty, use the first element
            const firstElement = response.data[0];
            this.cisLookUpResult = response.data;
            console.log(this.cisLookUpResult);
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
        console.log(error);
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
  this.affilDrctrForm.patchValue({
    com_account_name: accName,
    com_company_name: accName // Assuming you have company_name in the response
    // Add other form controls if needed
  });
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
