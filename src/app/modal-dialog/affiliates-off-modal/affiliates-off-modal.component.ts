import { Component, Inject, OnInit, OnDestroy, NgZone } from '@angular/core';

import { AbstractControl, FormControl, ValidationErrors, ValidatorFn, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';

// Imports for Functions
import {createAffilOff} from '../../functions-files/add/postAPI';
import {createRelatedInterest} from '../../functions-files/add/postAPI';

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
        affildcisNumber: ['', [Validators.required]],
        affildFirstName: ['', [Validators.required]],
        affildMiddleName: [''],
        affildLastName: ['', [Validators.required]],
        affildPosition: ['', [Validators.required]],
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
    
        // Call the JavaScript function with form data
        createAffilOff(offData, comp_CIS, session, userID) // Pass the entire formData object
        .then((response) => {
        
          this.logAction('Add', 'Successfuly Added Affiliates Officers', true, 'rpofficer-ri');
          this.close();
          // this.updateTableData();
        })
        .catch((error) => {
          this._dialogRef.close(true);
          this.logAction('Add', 'Failed Adding Related Interest', false, 'directorsrelated');
          // this.updateTableData();
          // console.log(this.dataSource);
        });
  
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
