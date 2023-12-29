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
  selector: 'app-rpt-simulation-modal',
  templateUrl: './rpt-simulation-modal.component.html',
  styleUrls: ['./rpt-simulation-modal.component.scss']
})
export class RPTSimulationModalComponent implements OnInit{
  rptSimulateForm: FormGroup;
  isReadOnly: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private _dosriService: AddServicesService,
    private dataService: AffiliatesService,
    private _dialogRef: MatDialogRef<RPTSimulationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _coreService: CoreService,
    private auditTrailService: AuditTrailService,
    private get: FetchDataService) {
    this.rptSimulateForm = this.formBuilder.group({
      com_cis_number: ['', [Validators.required]],
      com_account_name: ['', [Validators.required]],
      amount: ['', [Validators.required]]
      });
      _dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    // console.log('Data received in DosriModalComponent:', this.data);
    // this.getParentCompany();//load dropdown Company list
  // Attempt to patch the form
  this.rptSimulateForm.patchValue(this.data);

  // Log the form control values
  // console.log('Form controls after patching:', this.affForm.value);

  }


  onSubmit() {
    const moduleV = this.dataService.getmoduleV();

    if (this.rptSimulateForm.valid) {
      const formData = this.rptSimulateForm.value;
      // console.log(formData);
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
        // console.error(error.result[0].status);
        // Swal.fire('Error occurred', '', 'error');
      });
      
      // console.log(createAffil());
    }
  }


  close() {
    this._dialogRef.close(true); 
  }


  CISlookup() {
    const dataLookup = this.rptSimulateForm.value;
  
    // console.log(dataLookup.aff_com_cis_number);
    if (dataLookup.com_cis_number) {
      let cis = dataLookup.aff_com_cis_number;
      cisLookUP(cis)
        .then((response) => {
          if (response.length > 0) {
            // If the array is not empty, use the first element
            let accName = response[0].name;
            console.log("success")
            // Update form controls with new values
            this.rptSimulateForm.patchValue({
              com_account_name: accName,// Assuming you have company_name in the response
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
