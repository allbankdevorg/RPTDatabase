import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


// Functions Import
import {createBankOfficer, createBankOfficerRelationship} from '../../functions-files/add/postAPI';
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

  constructor(private formBuilder: FormBuilder,
    private _dialogRef: MatDialogRef<BankofficerModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private auditTrailService: AuditTrailService) {
      {
        this.boForm = this.formBuilder.group({
          boCisNumber: ['',[Validators.required]],
          boFirstName: ['', [Validators.required]],
          boMiddleName: [''],
          boLastName: ['', [Validators.required]],
          boPosition: ['', [Validators.required]],
      });
    }
    _dialogRef.disableClose = true;
  }



  ngOnInit(): void {
    console.log('Data received in DosriModalComponent:', this.data);

  // Attempt to patch the form
  this.boForm.patchValue(this.data);

  // Log the form control values
  console.log('Form controls after patching:', this.boForm.value);

  }




  // Functions
  




  onBOSubmit() {
 
    if (this.boForm.valid) {
      const boData = this.boForm.value;
  
      // Call the JavaScript function with form data
      console.log(boData);
      createBankOfficer(boData)
      .then((response) => {
        // this.updateTableData();
        this.ngOnInit();
        this.logAction('Add Bank Officer', 'Successfuly Added Bank Officer', true, 'bankofficer');
        this.close();

        
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
      console.log('Audit trail entry logged successfully.');
    });
    // console.log('Audit trail entry logged successfully.');
  }

}
