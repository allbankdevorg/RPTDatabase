import { Component, Inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


import Swal from 'sweetalert2';
// Functions Import
import {createBankOfficer, cisLookUP, addPNData} from '../../functions-files/add/postAPI';
import {updateBankOfficer} from '../../functions-files/update/updateAPI';
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
    private auditTrailService: AuditTrailService,
    private get: FetchDataService,) {
      
        this.boForm = this.formBuilder.group({
          cis_num: ['', [Validators.required, Validators.pattern(/^[A-Za-z\d]+$/)]],
          fname: ['', [Validators.required, Validators.pattern(/\S+/)]],
          mname: ['', [Validators.pattern(/\S+/)]],
          lname: ['', [Validators.required, Validators.pattern(/\S+/)]],
          Position: ['', [Validators.required, Validators.pattern(/\S+/)]],
      });
    _dialogRef.disableClose = true;
  }



  ngOnInit(): void {
  // Attempt to patch the form
  this.boForm.patchValue(this.data);
    this.updateTableData();
  }



  updateTableData(): void {
    this.get.getCompany().subscribe((compData) => {
    
      if (compData) {
      }
      else {
      }
    
    })
  }



  // Functions
  




  onBOSubmit() {
 
    if (this.boForm.valid) {
      const boData = this.boForm.value;
      const session = localStorage.getItem('sessionID')?.replaceAll("\"","");
      const userID = localStorage.getItem('userID')?.replaceAll("\"","");

      if (this.data) {
        const data_id = this.data.id;
        const old_cis = this.data.cis_num;
        updateBankOfficer(boData, data_id, old_cis, session, userID)
        .then((response) => {
          this.ngOnInit();
          this.logAction('Update', 'Updated Affiliates', true, 'Affiliates');
          this.close();
        })
        .catch((error) => {

        })
      }

      else {
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
    this.boForm.patchValue({
      boFirstName: accName,
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
