import { Component, Inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


import Swal from 'sweetalert2';
// Functions Import
import {createBankOfficer, cisLookUP, addPNData} from '../../functions-files/add/postAPI';
import {deleteDOSRIOfficer, deleteDOSRIOfficerRI} from '../../functions-files/delFunctions'
import { FetchDataService } from 'src/app/services/fetch/fetch-data.service';


// Audit Trail
import { AuditTrailService } from '../../services/auditTrail/audit-trail.service';
import {AuditTrail} from '../../model/audit-trail.model';

@Component({
  selector: 'app-bankofficer-modal',
  templateUrl: './bankofficer-modal.component.html',
  styleUrls: ['./bankofficer-modal.component.scss']
})
export class BankofficerModalComponent implements OnInit{

  boForm: FormGroup;
  isReadOnly: boolean = true;
  cisLookUpResult: [] = [];

  constructor(private formBuilder: FormBuilder,
    private _dialogRef: MatDialogRef<BankofficerModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private auditTrailService: AuditTrailService) {
      
        this.boForm = this.formBuilder.group({
          boCisNumber: ['',[Validators.required]],
          boFirstName: ['', [Validators.required]],
          boMiddleName: [''],
          boLastName: ['', [Validators.required]],
          boPosition: ['', [Validators.required]],
      });
    _dialogRef.disableClose = true;
  }



  ngOnInit(): void {
  // Attempt to patch the form
  this.boForm.patchValue(this.data);
  }




  // Functions
  




  onBOSubmit() {
 
    if (this.boForm.valid) {
      const boData = this.boForm.value;
      
      
      const session = sessionStorage.getItem('sessionID')?.replaceAll("\"","");
      const userID = sessionStorage.getItem('userID')?.replaceAll("\"","");
      // Call the JavaScript function with form data
      createBankOfficer(boData, session, userID)
      .then((response) => {
        // this.updateTableData();
        this.logAction('Add Bank Officer', 'Successfuly Added Bank Officer', true, 'bankofficer');
        this.close();

        const resultData = this.cisLookUpResult;
          addPNData(resultData, session, userID)
          .then((response) => {

          })
          .catch((error) => {

          });
      })
      .catch((error) => {
        this.logAction('Add Bank Officer', 'Failed Adding Bank Officer', false, 'bankofficer');
        // this.updateTableData();
      }) // Pass the entire formData object
    }
    
  }




  close() {
    this._dialogRef.close(true); 
  }


  CISlookup() {
    const dataLookup = this.boForm.value;
    if (dataLookup.boCisNumber) {
      let cis = dataLookup.boCisNumber;
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
            this.boForm.patchValue({
              boFirstName: accName,
              // Assuming you have company_name in the response
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
