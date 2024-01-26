import { Component, Inject, OnInit, OnDestroy, NgZone } from '@angular/core';

import { AbstractControl, FormControl, ValidationErrors, ValidatorFn, FormBuilder, FormGroup, Validators } from '@angular/forms';


import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

// Imports for Functions
import {createDirectors} from '../../functions-files/add/postAPI';
import {createRelatedInterest, cisLookUP, addPNData} from '../../functions-files/add/postAPI';

// Audit Trail
import { AuditTrailService } from '../../services/auditTrail/audit-trail.service';
import {AuditTrail} from '../../model/audit-trail.model';

// Services
import { DataTransferService } from '../../services/data-transfer.service';
import { SharedService } from '../../../app/views/dosri/dataintegration/shared.service';
import {DirRIService} from '../../services/dirRI/dir-ri.service'; //Service to set the value of the DirCIS and buttonID in adding RI of Directors

@Component({
  selector: 'app-directors-ri-modal',
  templateUrl: './directors-ri-modal.component.html',
  styleUrls: ['./directors-ri-modal.component.scss']
})
export class DirectorsRIModalComponent implements OnInit {

  
  riForm: FormGroup;
  selectedDirCisNumber: number = 0;
  selectedCompCISNumber: number = 0;
  isReadOnly: boolean = true;
  cisLookUpResult: [] = [];

   // Subscription variables
   private buttonIdSubscription: Subscription = new Subscription();
   private selectedDirCisNumberSubscription: Subscription = new Subscription();
 
  constructor(private formBuilder: FormBuilder, 
      private sharedService: SharedService,
      private dataService: DirRIService,
      private _dialogRef: MatDialogRef<DirectorsRIModalComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private changeDetectorRef: ChangeDetectorRef,
      private ngZone: NgZone,
      private auditTrailService: AuditTrailService)
  {
      this.riForm = this.formBuilder.group({
        riCisNumber: [''],
        riFirstName: ['', [Validators.required]],
        riMiddleName: [''],
        riLastName: ['', [Validators.required]],
      });
      _dialogRef.disableClose = true;
      // Subscribe to changes in buttonId and selectedDirCisNumber
    //  ?\ this.buttonId = this.dataService.getButtonId();
      // this.selectedDirCisNumber = this.dataService.getDirCIS();
  }

  
  


  ngOnInit(): void {
  // Attempt to patch the form
  this.riForm.patchValue(this.data);

  }



  // Functions
  //Adding Related Interest 
  onRISubmit() {
   const buttonId = this.dataService.getButtonId();
   const selectedDirCisNumber = this.dataService.getDirCIS();
    const directorId = this.sharedService.getDirectorId();
    const companyName = this.sharedService.getCompName();
    
    
    if (this.riForm.valid) {
      const riData = this.riForm.value;
      const session = sessionStorage.getItem('sessionID')?.replaceAll("\"","");
      const userID = sessionStorage.getItem('userID')?.replaceAll("\"","");
      const holdOUT = riData.depoHoldOut;

      // Call the JavaScript function with form data
      createRelatedInterest(riData, buttonId, selectedDirCisNumber, session, userID) // Pass the entire formData object
      .then((response) => {
        
        this.logAction('Add', 'Successfuly Added Related Interest', true, 'directorsrelated');
        this.close();

        const resultData = this.cisLookUpResult;
          addPNData(resultData, holdOUT, session, userID)
          .then((response) => {

          })
          .catch((error) => {

          });
        // this.updateTableData();
      })
      .catch((error) => {
        this.logAction('Add', 'Failed Adding Related Interest', false, 'directorsrelated');
        // this.updateTableData();
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
    const dataLookup = this.riForm.value;
  
    if (dataLookup.riCisNumber) {
      let cis = dataLookup.riCisNumber;
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
            this.riForm.patchValue({
              riFirstName: accName,
              // com_company_name: accName // Assuming you have company_name in the response
              // Add other form controls if needed
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'No CIS Found!',
              text: 'Please Enter the First Name, Middle Name and Last Name',
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
