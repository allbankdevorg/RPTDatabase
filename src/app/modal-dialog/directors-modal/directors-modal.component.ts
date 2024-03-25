import { Component, Inject, OnInit, OnDestroy, NgZone } from '@angular/core';

import { AbstractControl, FormControl, ValidationErrors, ValidatorFn, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
// Imports for Functions
import {createDirectors, cisLookUP, addPNData} from '../../functions-files/add/postAPI';
import {createRelatedInterest} from '../../functions-files/add/postAPI';

// Audit Trail
import { AuditTrailService } from '../../services/auditTrail/audit-trail.service';
import {AuditTrail} from '../../model/audit-trail.model';

// Services
import { DataTransferService } from '../../services/data-transfer.service';
import { SharedService } from '../../../app/views/dosri/dataintegration/shared.service';
import {DirRIService} from '../../services/dirRI/dir-ri.service'; //Service to set the value of the DirCIS and buttonID in adding RI of Directors


@Component({
  selector: 'app-directors-modal',
  templateUrl: './directors-modal.component.html',
  styleUrls: ['./directors-modal.component.scss']
})
export class DirectorsModalComponent implements OnInit{
  
  drctrForm: FormGroup;
  selectedDirCisNumber: number = 0;
  cisLookUpResult: [] = [];
  isReadOnly: boolean = true;
  // selectedCompCISNumber: number = 0;

  // / Subscription variables
   private buttonIdSubscription: Subscription = new Subscription();
   private selectedDirCisNumberSubscription: Subscription = new Subscription();
 
  constructor(private formBuilder: FormBuilder, 
      private sharedService: SharedService,
      private dataService: DirRIService,
      private _dialogRef: MatDialogRef<DirectorsModalComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private changeDetectorRef: ChangeDetectorRef,
      private ngZone: NgZone,
      private auditTrailService: AuditTrailService)
  {
      this.drctrForm = this.formBuilder.group({
        cisNumber: ['', [Validators.pattern(/^[A-Za-z\d]+$/)]],
        dFirstName: ['', [Validators.required, Validators.pattern(/\S+/)]],
        dMiddleName: ['', [Validators.pattern(/\S+/)]],
        dLastName: ['', [Validators.required, Validators.pattern(/\S+/)]],
        dPosition: ['', [Validators.required, Validators.pattern(/\S+/)]],
      });
      
  _dialogRef.disableClose = true;
  }


  ngOnInit(): void {
    // Attempt to patch the form
    this.drctrForm.patchValue(this.data);
    
    }

  // Adding Directors
  onDSubmit() {
 
    if (this.drctrForm.valid) {
      const directData = this.drctrForm.value;
      const directorId = this.sharedService.getDirectorId();
      const companyName = this.sharedService.getCompName();
      const session = sessionStorage.getItem('sessionID')?.replaceAll("\"","");
      const userID = sessionStorage.getItem('userID')?.replaceAll("\"","");
      const comp_CIS = this.dataService.getCompCIS();
      const holdOUT = directData.depoHoldOut;

    
      // Call the JavaScript function with form data
      createDirectors(directData, comp_CIS, session, userID)
      .then((response) => {

        this.ngOnInit();
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
      
      }); // Pass the entire formData object
      
      
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
    const dataLookup = this.drctrForm.value;
  
    if (dataLookup.cisNumber) {
      let cis = dataLookup.cisNumber;
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
    this.drctrForm.patchValue({
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
