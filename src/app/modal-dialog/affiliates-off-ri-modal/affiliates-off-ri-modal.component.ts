import { Component, Inject, OnInit, OnDestroy, NgZone } from '@angular/core';

import { AbstractControl, FormControl, ValidationErrors, ValidatorFn, FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';

// Imports for Functions
import {createAffilOffRI, cisLookUP, addPNData} from '../../functions-files/add/postAPI';
import {createRelatedInterest} from '../../functions-files/add/postAPI';

// Audit Trail
import { AuditTrailService } from '../../services/auditTrail/audit-trail.service';
import {AuditTrail} from '../../model/audit-trail.model';

// Services
import { DataTransferService } from '../../services/data-transfer.service';
import { SharedService } from '../../../app/views/dosri/dataintegration/shared.service';
import {AffiliatesService} from '../../services/affiliates/affiliates.service'; //Service to set the value of the DirCIS and buttonID in adding RI of Directors

@Component({
  selector: 'app-affiliates-off-ri-modal',
  templateUrl: './affiliates-off-ri-modal.component.html',
  styleUrls: ['./affiliates-off-ri-modal.component.scss']
})
export class AffiliatesOffRIModalComponent implements OnInit{

  affilOfficerRIForm: FormGroup;
  isReadOnly: boolean = true;
  cisLookUpResult: [] = [];


  constructor(
    private formBuilder: FormBuilder, 
    private sharedService: SharedService,
    private dataService: AffiliatesService,
    private dataTransferService: DataTransferService,
    private _dialogRef: MatDialogRef<AffiliatesOffRIModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private changeDetectorRef: ChangeDetectorRef,
    private ngZone: NgZone,
    private auditTrailService: AuditTrailService)
    {
      this.affilOfficerRIForm = this.formBuilder.group({
        riCisNumber: [''],
        riFirstName: ['', [Validators.required]],
        riMiddleName: [''],
        riLastName: ['', [Validators.required]],
      });
    }


    async  ngOnInit() {
      this.affilOfficerRIForm.patchValue(this.data);
    }


    // Functions
    //Adding Related Interest 
  onRISubmit() {
    const buttonId = this.dataService.getButtonId();
     const selectedOffCisNumber = this.dataService.getDirCIS();
    
    if (this.affilOfficerRIForm.valid) {
      const riData = this.affilOfficerRIForm.value;
      const session = sessionStorage.getItem('sessionID')?.replaceAll("\"","");
      const userID = sessionStorage.getItem('userID')?.replaceAll("\"","");
      const holdOUT = riData.depoHoldOut;

      // Call the JavaScript function with form data
      createAffilOffRI(riData, buttonId, selectedOffCisNumber, session, userID)
      .then((response) => {
        
        this.logAction('Add', 'Successfuly Added Affiliates Officers', true, 'rpofficer-ri');
        this.close();
        
        const resultData = this.cisLookUpResult;
          addPNData(resultData, holdOUT, session, userID)
          .then((response) => {

          })
          .catch((error) => {

          });
      })
      .catch((error) => {
        this.logAction('Add', 'Failed Adding Related Interest', false, 'directorsrelated');
   
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
      const dataLookup = this.affilOfficerRIForm.value;
      
    
      if (dataLookup.riCisNumber) {
        let cis = dataLookup.riCisNumber;
        cisLookUP(cis)
          .then((response) => {
            if (Array.isArray(response.data)) {
              if (response.data.length > 0) {
                // If response.data is an array and not empty, use the first element
                const firstElement = response.data[0];
                this.cisLookUpResult = response.data;
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
              title: 'No CIS Found!',
              text: 'CIS Does Not Exist!',
            });
            this.toggleInputReadOnly();
          });
      }
    }
    
    // Function to update form controls
    updateFormControls(accName: string) {
      this.affilOfficerRIForm.patchValue({
        riFirstName: accName,
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
