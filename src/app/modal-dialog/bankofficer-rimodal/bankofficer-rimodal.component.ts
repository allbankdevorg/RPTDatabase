import { Component, Inject, OnInit, OnDestroy, NgZone } from '@angular/core';

import { AbstractControl, FormControl, ValidationErrors, ValidatorFn, FormBuilder, FormGroup, Validators } from '@angular/forms';


import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';


import Swal from 'sweetalert2';
// Imports for Functions
import {createBankOfficerRelationship, cisLookUP, addPNData} from '../../functions-files/add/postAPI';


// Audit Trail
import { AuditTrailService } from '../../services/auditTrail/audit-trail.service';
import {AuditTrail} from '../../model/audit-trail.model';

// Services
import { DataTransferService } from '../../services/data-transfer.service';
import { SharedService } from '../../../app/views/dosri/dataintegration/shared.service';
import {BoRIService} from '../../services/bankOfficerRI/bo-ri.service'; //Service to set the value of the DirCIS and buttonID in adding RI of Directors

@Component({
  selector: 'app-bankofficer-rimodal',
  templateUrl: './bankofficer-rimodal.component.html',
  styleUrls: ['./bankofficer-rimodal.component.scss']
})
export class BankofficerRIModalComponent implements OnInit{

  boRIForm: FormGroup;
  selectedDirCisNumber: number = 0;
  selectedCompCISNumber: number = 0;
  
  isReadOnly: boolean = true;
  cisLookUpResult: [] = [];

  constructor(private formBuilder: FormBuilder, 
    private sharedService: SharedService,
    private dataService: BoRIService,
    private _dialogRef: MatDialogRef<BankofficerRIModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private changeDetectorRef: ChangeDetectorRef,
    private ngZone: NgZone,
    private auditTrailService: AuditTrailService)
    {
      this.boRIForm = this.formBuilder.group({
        boRICisNumber: ['', [Validators.pattern(/^[A-Za-z\d]+$/)]],
        boRIFirstName: ['', [Validators.required, Validators.pattern(/\S+/)]],
        boRIMiddleName: ['', [Validators.pattern(/\S+/)]],
        boRILastName: ['', [Validators.required, Validators.pattern(/\S+/)]],
    });
    _dialogRef.disableClose = true;
    }



    ngOnInit(): void {
      // Attempt to patch the form
      this.boRIForm.patchValue(this.data);
    
    }


    onBORISubmit() {
      const buttonId = this.dataService.getButtonId();
      const selectedBOCisNumber = this.dataService.getboCIS();

      if (this.boRIForm.valid) {
        const boRIData = this.boRIForm.value; 
        const session = localStorage.getItem('sessionID')?.replaceAll("\"","");
        const userID = localStorage.getItem('userID')?.replaceAll("\"","");
    
        // Call the JavaScript function with form data
        createBankOfficerRelationship(boRIData, buttonId, selectedBOCisNumber, session, userID)
        .then((response) => {
          // this.logAction('Add Bank Officer Related Interest', 'Successfuly Added Related Interest', true, 'bankofficer');
          this.logAction('Add', 'Successfuly Added Related Interest', true, 'Bank Officer');
          this.close();

          const resultData = this.cisLookUpResult;
          addPNData(resultData, session, userID)
          .then((response) => {

          })
          .catch((error) => {

          });

        })
        .catch((error) => {
          // this.logAction('Add Bank Officer Related Interest', 'Failed Adding Related Interest', false, 'bankofficer');
         
        }) // Pass the entire formData object
      }
    }




    close() {
      this._dialogRef.close(true); 
    }



    CISlookup() {
      const dataLookup = this.boRIForm.value;
    
      if (dataLookup.boRICisNumber) {
        let cis = dataLookup.boRICisNumber;
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
      this.boRIForm.patchValue({
        boRIFirstName: accName,
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
