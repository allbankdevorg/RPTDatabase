import { Component, Inject, OnInit, OnDestroy, NgZone } from '@angular/core';

import { AbstractControl, FormControl, ValidationErrors, ValidatorFn, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';

// Imports for Functions
import {createDirectors} from '../../functions-files/add/postAPI';
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
  selectedCompCISNumber: number = 0;

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
        cisNumber: ['', [Validators.required]],
        dFirstName: ['', [Validators.required]],
        dMiddleName: [''],
        dLastName: ['', [Validators.required]],
        dPosition: ['', [Validators.required]],
      });
      
  _dialogRef.disableClose = true;
  }


  ngOnInit(): void {
    // Attempt to patch the form
    this.drctrForm.patchValue(this.data);
    
  
    // Log the form control values
    // console.log('Form controls after patching:', this.riForm.value);
  
    }

  // Adding Directors
  onDSubmit() {
 
    if (this.drctrForm.valid) {
      const directData = this.drctrForm.value;
      const directorId = this.sharedService.getDirectorId();
      const companyName = this.sharedService.getCompName();
    
      // Call the JavaScript function with form data
      createDirectors(directData, this.selectedCompCISNumber)
      .then((response) => {
        this.logAction('Add', 'Successfuly Added Director', true, 'directorsrelated');
   
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
    console.log(this.changeDetectorRef.detectChanges);
    // console.log(this.dataSource);
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
