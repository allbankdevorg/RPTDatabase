import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CoreService } from '../../services/core/core.service';
import Swal from 'sweetalert2';


// Functions Imports
import {getManagingCompany} from '../../functions-files/getFunctions';
// import {getCompany, getDirectors} from '../../../functions-files/getFunctions'
import {createAffil, cisLookUP} from '../../functions-files/add/postAPI.js'
import {deleteDosri, deleteDirector, deleteRelationship} from '../../functions-files/delFunctions'

// Audit Trail
import { AuditTrailService } from '../../services/auditTrail/audit-trail.service';
import {AuditTrail} from '../../model/audit-trail.model';

// Services
import {AddServicesService} from '../../services/add/add-services.service';
import { AffiliatesService } from 'src/app/services/affiliates/affiliates.service';
import { FetchDataService } from 'src/app/services/fetch/fetch-data.service';


@Component({
  selector: 'app-other-rpmodal',
  templateUrl: './other-rpmodal.component.html',
  styleUrls: ['./other-rpmodal.component.scss']
})
export class OtherRPModalComponent implements OnInit {
  affForm: FormGroup;
  commandGroups: any[] = [];
  compData: any = [];


  constructor(
    private formBuilder: FormBuilder,
    private _dosriService: AddServicesService,
    private dataService: AffiliatesService,
    private _dialogRef: MatDialogRef<OtherRPModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _coreService: CoreService,
    private auditTrailService: AuditTrailService,
    private get: FetchDataService) {
    this.affForm = this.formBuilder.group({
      aff_com_cis_number: ['', [Validators.required]],
      aff_com_account_name: ['', [Validators.required]],
      aff_com_company_name: ['', [Validators.required]],
      commandControl: ['']
      });
      _dialogRef.disableClose = true;
  }



  ngOnInit(): void {
    console.log('Data received in DosriModalComponent:', this.data);
    this.getParentCompany();//load dropdown Company list
  // Attempt to patch the form
  this.affForm.patchValue(this.data);

  // Log the form control values
  console.log('Form controls after patching:', this.affForm.value);

  }


  onSubmit() {
    const moduleV = this.dataService.getmoduleV();

    if (this.affForm.valid) {
      const formData = this.affForm.value;
      console.log(formData);
      // Call the JavaScript function with form data
      createAffil(formData, moduleV) // Pass the entire formData object
      .then((response) => {
        // Log the response when the promise is resolved
          this.ngOnInit();
          this.logAction('Add', 'Added Affiliates', true, 'Affiliates');
          this.close();
      })
      .catch((error) => {
        // Handle errors when the promise is rejected
        console.error(error.result[0].status);
        // Swal.fire('Error occurred', '', 'error');
      });
      
      // console.log(createAffil());
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
              console.error(err);
            },
          });
      } else {
        this._dosriService.createDosri(formData).subscribe({
          next: (val: any) => {
            this._coreService.openSnackBar('Employee added successfully');
            this._dialogRef.close(true);
          },
          error: (err: any) => {
            console.error(err);
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
  
    console.log(dataLookup.aff_com_cis_number);
    if (dataLookup.aff_com_cis_number) {
      let cis = dataLookup.aff_com_cis_number;
      cisLookUP(cis)
        .then((response) => {
          
          // if (response.length < 1) {
            console.log(response[0].name);
          let accName = response[0].name;
            this.affForm.patchValue({
              aff_com_account_name: accName,
              aff_com_company_name: accName // Assuming you have company_name in the response
              
            });
    
            // Log the form control values
            console.log('Form controls after patching:', this.affForm.value);
          
          })
        .catch((error) => {
          Swal.fire({
                icon: 'error',
                title: 'No CIS Found!',
                // text: 'Invalid username or password',
              });
        });
    }
  }



  getParentCompany() {
    this.get.getOtherCompany((OtherComp) => {
      this.compData = OtherComp;
    this.commandGroups = []; // Clear the existing commandGroups
    

      if (OtherComp) {
        const data = OtherComp;
        
        data.forEach(item => {
          // Create a commandGroup item with value and viewValue
          const commandGroup = {
            value: item.aff_com_cis_number,
            viewValue: item.aff_com_company_name,
          };

          // Add the command group to the array
          this.commandGroups.push(commandGroup);
        });
      }
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
  console.log('Audit trail entry logged successfully.');
});
// console.log('Audit trail entry logged successfully.');
}

}