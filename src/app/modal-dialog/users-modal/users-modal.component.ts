import { Component, Inject, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CoreService } from '../../services/core/core.service';


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

import {addUsers} from '../../functions-files/addUser';


@Component({
  selector: 'app-users-modal',
  templateUrl: './users-modal.component.html',
  styleUrls: ['./users-modal.component.scss']
})
export class UsersModalComponent {

  userForm: FormGroup;

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

  constructor(private formBuilder: FormBuilder,
    private _dialogRef: MatDialogRef<UsersModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private auditTrailService: AuditTrailService) 
  {
    this.userForm = this.formBuilder.group({
      fName: ['', [Validators.required]],
      mName: ['', [Validators.required]],
      lName: ['', [Validators.required]],
      email: ['', [Validators.required]],
      mobile: ['', [Validators.required]],
      commandControl: [''],
      userName: ['', [Validators.required]],
      uPass: ['', [Validators.required]]
    });
    _dialogRef.disableClose = true;
  }


  ngOnInit(): void {
  // Attempt to patch the form
  this.userForm.patchValue(this.data);


  }

   // Functions

   onUserSubmit() {
    if (this.userForm.valid) {
      const formData = this.userForm.value;
      // console.log(formData);
      // Call the JavaScript function with form data
      addUsers(formData); // Pass the entire formData object
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
    // console.log('Audit trail entry logged successfully.');
  });
  // console.log('Audit trail entry logged successfully.');
}






}
