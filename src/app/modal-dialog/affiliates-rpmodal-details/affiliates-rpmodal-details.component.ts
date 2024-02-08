import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CoreService } from '../../services/core/core.service';
import Swal from 'sweetalert2';


// Functions Imports
import {getManagingCompany} from '../../functions-files/getFunctions';
// import {getCompany, getDirectors} from '../../../functions-files/getFunctions'
import {createAffil, cisLookUP, addPNData, checkHoldOutValue} from '../../functions-files/add/postAPI.js'
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
  selector: 'app-affiliates-rpmodal-details',
  templateUrl: './affiliates-rpmodal-details.component.html',
  styleUrls: ['./affiliates-rpmodal-details.component.scss']
})
export class AffiliatesRpmodalDetailsComponent {
  affForm: FormGroup;
  commandGroups: any[] = [];
  cisLookUpResult: [] = [];
  compData: any = [];
  isReadOnly: boolean = true;

  holdOut: any;

  
  constructor(
    private formBuilder: FormBuilder,
    private _dosriService: AddServicesService,
    private dataService: AffiliatesService,
    private _dialogRef: MatDialogRef<AffiliatesRpmodalDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _coreService: CoreService,
    private auditTrailService: AuditTrailService,
    private get: FetchDataService) {
    this.affForm = this.formBuilder.group({
      aff_com_cis_number: [''],
      aff_com_comp_name: [''],
      managing_company: [{value: '', disabled: true}],
      // commandControl: [''],
      deposit_holdout: ['']
      });
      _dialogRef.disableClose = true;
  }


  ngOnInit(): void {
    this.getParentCompany();//load dropdown Company list

  // Attempt to patch the form
    this.affForm.patchValue({ aff_com_cis_number: this.data.selectedData.aff_com_cis_number,
    aff_com_comp_name: this.data.selectedData.aff_com_comp_name, managing_company: this.data.selectedData.managing_company,
    deposit_holdout: this.data.totalHoldOut})
  
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
          createAffil(formData, moduleV, session, userID) // Pass the entire formData object
          .then((response) => {
            // Log the response when the promise is resolved
              this.ngOnInit();
              this.logAction('Add', 'Added Affiliates', true, 'Affiliates');
              this.close();


              const resultData = this.cisLookUpResult;
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
            },
          });
      } else {
        this._dosriService.createDosri(formData).subscribe({
          next: (val: any) => {
            this._coreService.openSnackBar('Employee added successfully');
          },
          error: (err: any) => {
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
  
    if (dataLookup.com_cis_number) {
      let cis = dataLookup.com_cis_number;
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
    this.affForm.patchValue({
      com_account_name: accName,
      com_company_name: accName // Assuming you have company_name in the response
      // Add other form controls if needed
    });
  }
  
  toggleInputReadOnly() {
    this.isReadOnly = !this.isReadOnly;
  }

 


  getParentCompany() {
    const moduleV = this.dataService.getmoduleV();

    if (moduleV === "ORP") {
      this.get.getManagingCompany((mngComp) => {
        this.compData = mngComp;
        this.commandGroups = []; // Clear the existing commandGroups
  
        // if (mngComp) {
          const data = mngComp;
          data.forEach(item => {
            
            // Create a commandGroup item with value and viewValue
            const commandGroup = {
              value: item.aff_com_cis_number,
              viewValue: item.aff_com_company_name,
            };
            
            
            // Add the command group to the array
            this.commandGroups.push(commandGroup);
          });
      })
    }
    else if (moduleV === "JMN") {
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
      })
    }
    else if (moduleV === "PAVI") {
      this.get.getPavi((PaviComp) => {
        this.compData = PaviComp;
      this.commandGroups = []; // Clear the existing commandGroups
      
  
        if (PaviComp) {
          const data = PaviComp;
          
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
      })
    }
    
    
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
