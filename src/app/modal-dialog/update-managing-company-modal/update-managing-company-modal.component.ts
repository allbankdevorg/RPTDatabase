import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CoreService } from '../../services/core/core.service';
import Swal from 'sweetalert2';


// Functions Imports
import {getManagingCompany} from '../../functions-files/getFunctions';
// import {getCompany, getDirectors} from '../../../functions-files/getFunctions'
import {createAffil, cisLookUP, addPNData} from '../../functions-files/add/postAPI.js'
import {deleteDosri, deleteDirector, deleteRelationship} from '../../functions-files/delFunctions'
import {updateManagingCompany} from '../../functions-files/update/updateAPI'
// Audit Trail
import { AuditTrailService } from '../../services/auditTrail/audit-trail.service';
import {AuditTrail} from '../../model/audit-trail.model';

// Services
import {AddServicesService} from '../../services/add/add-services.service';
import { AffiliatesService } from 'src/app/services/affiliates/affiliates.service';
import { FetchDataService } from 'src/app/services/fetch/fetch-data.service';

@Component({
  selector: 'app-update-managing-company-modal',
  templateUrl: './update-managing-company-modal.component.html',
  styleUrls: ['./update-managing-company-modal.component.scss']
})
export class UpdateManagingCompanyModalComponent {

  affForm: FormGroup;
  commandGroups: any[] = [];
  cisLookUpResult: [] = [];
  compData: any = [];
  isReadOnly: boolean = true;

  
  constructor(
    private formBuilder: FormBuilder,
    private _dosriService: AddServicesService,
    private dataService: AffiliatesService,
    private _dialogRef: MatDialogRef<UpdateManagingCompanyModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _coreService: CoreService,
    private auditTrailService: AuditTrailService,
    private get: FetchDataService) {
    this.affForm = this.formBuilder.group({
      aff_com_cis_number: ['', [Validators.required]],
      aff_com_comp_name: ['', [Validators.required]],
      managing_company: [''],
      // commandControl: [''],
      depoHoldOut: ['']
      });
      _dialogRef.disableClose = true;
  }


  ngOnInit(): void {
    // console.log('Data received in DosriModalComponent:', this.data);
    this.getParentCompany();//load dropdown Company list
  // Attempt to patch the form
  this.affForm.patchValue(this.data);
  
  // console.log(commandGroup)

  // Log the form control values
  // console.log('Form controls after patching:', this.affForm.value);

  }


  onSubmit() {
    const moduleV = this.dataService.getmoduleV();

    if (this.affForm.valid) {
      const formData = this.affForm.value; 
      const session = sessionStorage.getItem('sessionID')?.replaceAll("\"", "");
      const userID = sessionStorage.getItem('userID')?.replaceAll("\"", "");
      
      if (this.data) {
        
        updateManagingCompany(formData)
          .then((response) => {
            this.ngOnInit();
            this.logAction('Update', 'Updated Affiliates', true, 'Affiliates');
            this.close();
          })
          .catch((error) => {

          })
      } else {
      // Call the JavaScript function with form data
          createAffil(formData, moduleV) // Pass the entire formData object
          .then((response) => {
            // Log the response when the promise is resolved
              this.ngOnInit();
              this.logAction('Add', 'Added Affiliates', true, 'Affiliates');
              this.close();


              const resultData = this.cisLookUpResult;
              console.log(resultData);
              addPNData(resultData, session, userID)
              .then((response) => {

              })
              .catch((error) => {

              });
          })
          .catch((error) => {
            if (error && error.result && error.result[0] && error.result[0].status === "error" &&
                  error.result[0].message === "CISNumber already define") {
                this._dialogRef.close(true);
                    // Handle other error conditions 
                this.logAction('Add', 'Adding Company Failed. CIS Number is already Define', false, 'DRI');
                
              //   const resultData = this.cisLookUpResult;
                
              //   console.log(resultData);
              //   addPNData(resultData, session, userID)
              //   .then((response) => {

              //   })
              //   .catch((error) => {

              //   });
              } else {
                // Handle other error conditions 
                this.logAction('Add', 'Adding Company Failed', false, 'affiliates-related-companies');
                // this._dialogRef.close(false);
              }
          });
      }
    }
  }



  onFormSubmit() {
    if (this.affForm.valid) {
      const formData = this.affForm.value;

      if (this.data) {
        this._dosriService
          .updateEmployee(this.data.id, this.affForm.value)
          .subscribe({
            next: (val: any) => {
              this._coreService.openSnackBar('Employee detail updated!');
              this._dialogRef.close(true);
            },
            error: (err: any) => {
              // console.error(err);
            },
          });
      } else {
        this._dosriService.createDosri(formData).subscribe({
          next: (val: any) => {
            this._coreService.openSnackBar('Employee added successfully');
          },
          error: (err: any) => {
            // console.error(err);
          },
        });
      }
    }
  }

  close() {
    this._dialogRef.close(true); 
  }



  CISlookup() {
    const dataLookup = this.affForm.value;
    console.log(dataLookup);
    // console.log(dataLookup.aff_com_cis_number);
    if (dataLookup.aff_com_cis_number) {
      let cis = dataLookup.aff_com_cis_number;
      cisLookUP(cis)
        .then((response) => {
          if (response.length > 0) {
            // If the array is not empty, use the first element
            this.cisLookUpResult = response;
            let accName = response[0].name;
            console.log(response)
            this.toggleInputReadOnly();
            // Update form controls with new values
            this.affForm.patchValue({
              aff_com_account_name: accName,
              aff_com_company_name: accName, // Assuming you have company_name in the response
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

  getParentCompany() {
    this.get.getManagingCompany((mngComp) => {
      this.compData = mngComp;
      this.commandGroups = []; // Clear the existing commandGroups
    // console.log(this.compData);

      // if (mngComp) {
        const data = mngComp;
        // console.log(data);
        data.forEach(item => {
          
          // console.log(item);
          // Create a commandGroup item with value and viewValue
          const commandGroup = {
            value: item.aff_com_cis_number,
            viewValue: item.aff_com_company_name,
          };
          
          
          // this.manager = commandGroup;
          // Add the command group to the array
          this.commandGroups.push(commandGroup);
        });
      // }
      // const data = this.compData.result[0].Data;
      // console.log(mngComp);
    })
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