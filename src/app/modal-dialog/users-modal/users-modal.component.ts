import { Component, Inject, OnInit, ViewChild, NgZone, Renderer2} from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators, ValidatorFn } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CoreService } from '../../services/core/core.service';
import { ChangeDetectorRef } from '@angular/core';
import { FormArray } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';


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
import {EditUserAccessService} from '../../services/editUserAccess/edit-user-access.service';
import {AddServicesService} from '../../services/add/add-services.service';
import { AffiliatesService } from 'src/app/services/affiliates/affiliates.service';
import Swal from 'sweetalert2';

import {createUser} from '../../functions-files/add/postAPI';
import {updateUserAccess, updateUserInfo} from '../../functions-files/update/updateAPI';
import { userAccess} from '../../functions-files/add/postAPI';


export  interface Permissions {
  view: boolean;
  add: boolean;
  edit: boolean;
  delete: boolean;
  maker: boolean;
  approver: boolean;
  reviewer: boolean;
  update: boolean;
  // Add the 'navigation_name' property
  navigation_name: string;
}

@Component({
  selector: 'app-users-modal',
  templateUrl: './users-modal.component.html',
  styleUrls: ['./users-modal.component.scss']
})
export class UsersModalComponent {

  userForm: FormGroup;
  stateText: string = 'Active';
  isChecked: any = '';

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

  
  DdisplayedColumns: string[] = ['navigation_name', 'view', 'add', 'edit', 'delete', 'update', 'maker', 'approver', 'reviewer'];
  permissionDataSource = new MatTableDataSource<Permissions>();
  userAccess: [] = [];

  
  @ViewChild(MatPaginator) paginator1!: MatPaginator;

  constructor(private formBuilder: FormBuilder,
    private _dialogRef: MatDialogRef<UsersModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private auditTrailService: AuditTrailService,
    private changeDetectorRef: ChangeDetectorRef,
    private ngZone: NgZone,
    private renderer: Renderer2,
    private userAccessService: EditUserAccessService,) 
  {
    this.userForm = this.formBuilder.group({
      // fName: ['', [Validators.required]],
      // mName: ['', [Validators.required]],
      // lName: ['', [Validators.required]],
      // email: ['', [Validators.required, Validators.email]],
      mobile_no: ['', [Validators.required, this.mobileNumValidator()]],
      role: ['', [Validators.required]],
      commandControl: [''],
      username: [''],
      status: [],
    });
    _dialogRef.disableClose = true;
  }


  
  editdata: any;

  ngOnInit(): void {
  // Attempt to patch the form
  // this.userForm.patchValue(this.data);
  if (this.data != '' && this.data != null) {
  this.userForm.patchValue(this.data);
  }
  this.getUserAccess();

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
      const user = this.data.id;
      const session = localStorage.getItem('sessionID')?.replaceAll("\"","");
      const userID = localStorage.getItem('userID')?.replaceAll("\"","");

      if (this.data) {
        updateUserInfo(formData, user, session, userID)
        .then((jqXHR) => {
          // Assuming your Angular component code looks like this
          if (jqXHR) {
            // If response is not empty, process the response
            this.ngOnInit();
            this.logAction('Update', 'Updated User', true, 'Users');
            this.close();
          } else {
            // If response is empty, handle accordingly
            Swal.fire('Success', 'Update Successfull', 'success');
            this.ngOnInit();
            this.logAction('Update', 'Updated User', true, 'Users');
            this.close();
          }
        })
        .catch((error) => {
          // Handle errors
          Swal.fire(`Update Failed: ${error.status}`, error.error, 'error');
        });



        // let userAccesUpdate = [this.permissionDataSource.data];
        // console.log(userAccesUpdate);
        // updateUserInfo(formData, user, session, userID)
        //   .then((response) => {
        //     this.ngOnInit();
        //     this.logAction('Update', 'Updated User', true, 'Users');
        //     this.close();
        //   })
        //   .catch((error) => {

        //   })
      }
      else {
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

      }

      this.ngZone.run(() => {
        // this.dataSource.data = this.tableData;
      });
    
        // Trigger change detection
      this.changeDetectorRef.detectChanges();
  }


  getUserAccess(): void {
    const userid = this.userAccessService.getUserID();
  
    userAccess(userid)
      .then((response) => {
        this.userAccess = response.result[0].user_access;
        this.permissionDataSource.data = [...this.userAccess]; // Ensure that you are copying the data
      })
      .catch((error) => {
        // Handle Eror here
      });
  }
  

  close() {
    this._dialogRef.close(true); 
  }

  // updateDatabase(permission: Permissions, propertyName: any) {}


  // Update User Access and Show user Status
  
  toggleStatus(event: any): void {
    
    let statusValue = event.checked ? 0 : 1; // Invert the value for true and false
    this.isChecked = statusValue;
    this.stateText = this.isChecked ? 'Disabled' : 'Active';
    this.userForm.patchValue({ status: this.isChecked}); // Patch only the status control
    
    
}

  updateCheckboxValue(event: any, controlName: string, access: any): void {
    const user = this.data.id;
    const session = localStorage.getItem('sessionID')?.replaceAll("\"","");
    const userID = localStorage.getItem('userID')?.replaceAll("\"","");
    
    access[controlName] = event.checked ? 1 : 0;
    
    const data = {
      userid: access.userid,
      nav_id: access.nav_id,
      add: access.add,
      edit: access.edit,
      update: access.update,
      delete: access.delete,
      view: access.view,
      approver: access.approver,
      maker: access.maker,
      id: access.id
  };

  updateUserAccess(data, user, session, userID)
          .then((response) => {
            console.log(session);
            console.log(userID);
    
            // this.ngOnInit();
            this.logAction('Update', 'Updated User', true, 'Users');
            // this.close();
          })
          .catch((error) => {

          })

  }





  mobileNumValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value: string = control.value;
  
      if (value && value.length > 0) {
        // Check for the exact length (11 characters)
        if (value.length !== 11) {
          return { 'length': true };
        }
  
        // Check if it starts with "09"
        const startsWith09Regex = /^09/;
        if (!startsWith09Regex.test(value)) {
          return { 'startsWith09': true };
        }
  
        // Check if it contains only numbers
        const numberOnlyRegex = /^\d+$/;
        if (!numberOnlyRegex.test(value)) {
          return { 'numberOnly': true };
        }
      }
  
      // Mobile number is valid
      return null;
    };
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
