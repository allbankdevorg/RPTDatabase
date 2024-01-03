import { Component, Inject, OnInit, NgZone, Renderer2} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CoreService } from '../../services/core/core.service';
import { ChangeDetectorRef } from '@angular/core';
import { FormArray } from '@angular/forms';



// Functions Imports
import {callJSFun} from '../../functions-files/javascriptfun.js';
import {FetchDataService} from '../../services/fetch/fetch-data.service';
// import {getCompany, getDirectors} from '../../../functions-files/getFunctions'
import {createAffil, cisLookUP} from '../../functions-files/add/postAPI.js'
import {deleteDosri, deleteDirector, deleteRelationship} from '../../functions-files/delFunctions'

// Audit Trail
import { AuditTrailService } from '../../services/auditTrail/audit-trail.service';
import {AuditTrail} from '../../model/audit-trail.model';

// Services
import {AddServicesService} from '../../services/add/add-services.service';
import { AffiliatesService } from 'src/app/services/affiliates/affiliates.service';
import Swal from 'sweetalert2';

import {createUser} from '../../functions-files/add/postAPI';


@Component({
  selector: 'app-view-users-modal',
  templateUrl: './view-users-modal.component.html',
  styleUrls: ['./view-users-modal.component.scss']
})
export class ViewUsersModalComponent {

  userForm: FormGroup;
  isReadOnly: boolean = true;
  
  userrole = [
    {value: 1, viewValue: "Maker"},
    {value: 2, viewValue: "Reviewer"},
    {value: 3, viewValue: "Approver"},
    {value: 4, viewValue: "Admin"},
    {value: 5, viewValue: "IT"}
  ];

  buttonConfigurations = {
    maker: ['add', 'edit', 'delete'],
    reviewer: ['view'],
    // ... add more roles as needed
  };

  public addvisible = false;
  public editvisible = false;
  otpForm!: FormGroup;
  hide = true;
  editData: any = [];
  commandGroups: any[] = [];
  editUserData: any = [];
  eUserForm: any = [];
  matSelect: any;

  constructor(private formBuilder: FormBuilder,
    private _dialogRef: MatDialogRef<ViewUsersModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private auditTrailService: AuditTrailService,
    private changeDetectorRef: ChangeDetectorRef,
    private ngZone: NgZone,
    private renderer: Renderer2) 
  {
    this.userForm = this.formBuilder.group({
      fName: [{value: '', disabled: true}],
      mName: [{value: '', disabled: true}],
      lName: [{value: '', disabled: true}],
      email: [{value: '', disabled: true}],
      mobile_no: [{value: '', disabled: true}],
      role: [{value: '', disabled: true}],
      commandControl: [{value: '', disabled: true}],
      username: [{value: '', disabled: true}],
      // uPass: ['', [Validators.required]],
      // authority: this.formBuilder.group({
      //   view: [false],
      //   add: [false],
      //   update: [false],
      //   delete: [false],
      //   maker: [false],
      //   approver: [false],
      //   reviewer: [false],
      //   // Add more authority checkboxes as needed
      //   // ...
      // })
        // Add more authority checkboxes as needed
        // ...
    });
    _dialogRef.disableClose = true;
  }


  ngOnInit(): void {
  // Attempt to patch the form
  this.userForm.patchValue(this.data);

  this.renderer.listen('document', 'click', (event: MouseEvent) => {
    const targetElement = event.target as HTMLElement;
    const matSelectElement = document.querySelector('.mat-select-panel');

    if (matSelectElement && !matSelectElement.contains(targetElement)) {
      // Close the mat-select when clicking outside
      this.matSelect.close();
    }
  });
  }

   // Functions

   onUserSubmit() {
    if (this.userForm.valid) {
      const formData = this.userForm.value;
      const session = sessionStorage.getItem('sessionID')?.replaceAll("\"","");
      const userID = sessionStorage.getItem('userID')?.replaceAll("\"","");

      // Call the JavaScript function with form data
      createUser(formData, userID, session) // Pass the entire formData object
      .then((response) => {
        this.logAction('Add', 'Successfuly Added User', true, 'users');
        this.close();
      })
      .catch((error) => {
        this.logAction('Add', 'Failed Adding User', false, 'users');
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
    // console.log('Audit trail entry logged successfully.');
  });
  // console.log('Audit trail entry logged successfully.');
}

}