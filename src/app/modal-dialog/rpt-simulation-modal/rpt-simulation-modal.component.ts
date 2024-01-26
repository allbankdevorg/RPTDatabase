import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CoreService } from '../../services/core/core.service';
import Swal from 'sweetalert2';


// Functions Imports
import {getManagingCompany} from '../../functions-files/getFunctions';
// import {getCompany, getDirectors} from '../../../functions-files/getFunctions'
import {addSimulatedPNData, cisLookUP} from '../../functions-files/add/postAPI.js'
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
  currentSttl: any;                 // => Current Sub total 
  currentRptTTL: any;               // => Current Rpt Total
  simulatedSttl: any;               // => Simulated Sub total
  simulatedRptTTL: any;             // => Simulated Rpt Total
  unimpairedCap: number = 1214764186.16;   //Unimpaired Capital
  availBal: any;    // => Remaining Balance of Possible Loan Amount
  rptBal: any;      // => RPT Balance (Net of Hold-out)
  approvedCapital: any;  // => the Loan approved Limit
 
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
  this.rptSimulateForm.patchValue(this.data);
  this.updateTableData();
  }


  onSubmit() {
    const session = sessionStorage.getItem('sessionID')?.replaceAll("\"","");
    const userID = sessionStorage.getItem('userID')?.replaceAll("\"","");

    if (this.rptSimulateForm.valid) {
      const sPNData = this.rptSimulateForm.value;

      if (this.simulatedRptTTL <= this.availBal) {
        addSimulatedPNData(sPNData, session, userID)
          .then((response) => {
            this.logAction('Add', 'Successfuly Added RPT PN Data', true, 'rpofficer-ri');
            this.close();
          })
          .catch((error) => {

          });
      }
      else {
        Swal.fire({
          icon: 'error',
          title: 'Loan Breached!',
          text: 'Please Enter Amount not Greater than the Available Balance',
        });
      }
      
    }
  }

  simulateRPT() {
    if (this.rptSimulateForm.valid) {
      this.ngOnInit();
      const dataLookup = this.rptSimulateForm.value;
  
      // Convert the values to numbers using parseFloat or the unary + operator
      const currentSttlValue = parseFloat(this.currentSttl) || 0;
      const amountValue = parseFloat(dataLookup.amount) || 0;
  
      // Perform the addition
      this.simulatedSttl = currentSttlValue + amountValue;
      this.simulatedRptTTL = amountValue;
      this.logAction('Add', 'Added Affiliates', true, 'Affiliates');
    }
  }


  close() {
    this._dialogRef.close(true); 
  }


  get amountControl() {
    return this.rptSimulateForm.get('amount');
  }

  CISlookup() {
    const dataLookup = this.rptSimulateForm.value;
  
    // Check if com_cis_number is present and not empty
    if (dataLookup.com_cis_number) {
      let cis = dataLookup.com_cis_number;
  
      cisLookUP(cis)
        .then((response) => {
  
          if (response.length > 0) {
            // Use the first element of the response array
            let accName = response[0].name;
  
            // Update form controls with new values
            this.rptSimulateForm.patchValue({
              com_account_name: accName,
              // Add other form controls if needed
            });
  
            if (Array.isArray(response)) {
              // Initialize sumPrincipal outside the loop
              let sumPrincipal = { principal: 0, principal_bal: 0 };
  
              response.forEach((item) => {
                // Calculate the sum for each item
                sumPrincipal.principal += parseFloat(item.principal) || 0;
                sumPrincipal.principal_bal += parseFloat(item.principal_bal) || 0;
              });
  
              // Assign the sum to the class variables
              this.currentSttl = sumPrincipal.principal;
              this.currentRptTTL = sumPrincipal.principal_bal;
            } else {
              console.error("Invalid resultData format");
            }
          } else {
            // Display an error message if no CIS is found
            Swal.fire({
              icon: 'error',
              title: 'No CIS Found!',
              text: 'Please Enter the Account and Company Name',
            });
            this.toggleInputReadOnly();
          }
        })
        .catch((error) => {
          // Display an error message if an error occurs
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'An error occurred while fetching data.',
          });
          this.toggleInputReadOnly();
        });
    }
  }


  updateTableData(): void {
    this.get.getPNData((PNData) => {
      if (PNData) {
        // Use reduce to calculate the sum of "principal" values
        const sumPrincipal = PNData.reduce((acc, obj) => {
          acc.principal += parseFloat(obj.principal) || 0;
          acc.principal_bal += parseFloat(obj.principal_bal) || 0;
          acc.deposit_holdout += parseFloat(obj.deposit_holdout) || 0;
          return acc;
        }, { principal: 0, principal_bal: 0, deposit_holdout: 0 });

        this.rptBal = sumPrincipal.principal_bal - sumPrincipal.deposit_holdout;
        this.approvedCapital = this.unimpairedCap * 0.5;
        this.availBal = this.approvedCapital - this.rptBal;
      } else {

      }
    });
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

  });
  
  }

}
