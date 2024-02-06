import { Component, Inject, OnInit, OnDestroy, NgZone } from '@angular/core';

import { AbstractControl, FormControl, ValidationErrors, ValidatorFn, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';


// Imports for Functions
import {createAffilOff, cisLookUP, addPNData} from '../../functions-files/add/postAPI';
import {updateAffilOff} from '../../functions-files/update/updateAPI';

// Audit Trail
import { AuditTrailService } from '../../services/auditTrail/audit-trail.service';
import {AuditTrail} from '../../model/audit-trail.model';

// Services
import { DataTransferService } from '../../services/data-transfer.service';
import { SharedService } from '../../../app/views/dosri/dataintegration/shared.service';
import {AffiliatesService} from '../../services/affiliates/affiliates.service'; //Service to set the value of the DirCIS and buttonID in adding RI of Directors

@Component({
  selector: 'app-affiliates-off-modal',
  templateUrl: './affiliates-off-modal.component.html',
  styleUrls: ['./affiliates-off-modal.component.scss']
})
export class AffiliatesOffModalComponent implements OnInit {
  
  affilOfficerForm: FormGroup;
  cisLookUpResult: [] = [];
  isReadOnly: boolean = true;

  constructor(
    private formBuilder: FormBuilder, 
    private sharedService: SharedService,
    private dataService: AffiliatesService,
    private dataTransferService: DataTransferService,
    private _dialogRef: MatDialogRef<AffiliatesOffModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private changeDetectorRef: ChangeDetectorRef,
    private ngZone: NgZone,
    private auditTrailService: AuditTrailService)
    {
      this.affilOfficerForm = this.formBuilder.group({
        off_CisNumber: [''],
        off_fname: ['', [Validators.required]],
        off_mname: [''],
        off_lname: ['', [Validators.required]],
        Position: ['', [Validators.required]],
      });
    }


    async  ngOnInit() {
      this.affilOfficerForm.patchValue(this.data);
    }


    // Functions

    onAffilOffSubmit() {
      if (this.affilOfficerForm.valid) {
        const offData = this.affilOfficerForm.value;
        const session = sessionStorage.getItem('sessionID')?.replaceAll("\"","");
        const userID = sessionStorage.getItem('userID')?.replaceAll("\"","");
        const comp_CIS = this.dataService.getCompCIS();
        
        if (this.data) {
          const data_id = this.data.id;
          const old_cis = this.data.off_CisNumber;
          updateAffilOff(offData, data_id, old_cis)
          .then((response) => {
            this.ngOnInit();
            this.logAction('Update', 'Updated Affiliates', true, 'Affiliates');
            this.close();
          })
          .catch((error) => {

          })
      // creat
        } else {
           // Call the JavaScript function with form data
            createAffilOff(offData, comp_CIS, session, userID) // Pass the entire formData object
            .then((response) => {
              this.logAction('Add', 'Successfuly Added Affiliates Officers', true, 'rpofficer-ri');
              this.close();

              const resultData = this.cisLookUpResult;
              addPNData(resultData, session, userID)
              .then((response) => {

              })
              .catch((error) => {

              });
              // this.updateTableData();
            })
            .catch((error) => {
              if (error && error.result && error.result[0] && error.result[0].status === "error" &&
                      error.result[0].message === "Officer CISNumber already defined") {
                    this._dialogRef.close(true);
                        // Handle other error conditions 
                      this.logAction('Add', 'Failed Adding Related Interest', false, 'rpofficer-ri/:id');
            
                  
                  } else {
                    // Handle other error conditions 
                    this.logAction('Add', 'Failed Adding Related Interest', false, 'rpofficer-ri/:id');
                    // this._dialogRef.close(false);
                  }
              });
        }
       
  
      }
  
      this.ngZone.run(() => {
        // this.OffdataSource.data = this.OfftableData;
      });
  
        // Trigger change detection
      this.changeDetectorRef.detectChanges();
    }



    close() {
      this._dialogRef.close(true); 
    }
    
    
    CISlookup() {
      const dataLookup = this.affilOfficerForm.value;
      if (dataLookup.off_CisNumber) {
        let cis = dataLookup.off_CisNumber;
        cisLookUP(cis)
          .then((response) => {
            if (response.length > 0) {
              // If the array is not empty, use the first element
              
              this.cisLookUpResult = response;
              let accName = response[0].name;
              Swal.fire({
                icon: 'success',
                title: 'CIS Found!',
                text: 'CIS has Related Loan Found',
              });
              this.toggleInputReadOnly();
              // Update form controls with new values
              this.affilOfficerForm.patchValue({
                aff_com_account_name: accName,
                aff_com_company_name: accName, // Assuming you have company_name in the response
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
