import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CoreService } from '../../services/core/core.service';
import Swal from 'sweetalert2';

//Simulate Loan for SBL
import {SimulatedSBLDataService} from '../../services/simulatedSBLService/simulated-sbldata.service'

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
import {SblLoanSimulateService} from '../../services/sblLoanSimulate/sbl-loan-simulate.service';
import { SimulatedDataService } from '../../services/simulatedDataService/simulated-data-service.service';

//Simulate Loan for SBL


export interface Loan {
  loan_no: number,
  cis_no: number,
  name: string,
  principal: number,
  principal_bal: number,
  loan_security: string,
  deposit_holdout: number,
  date_granted: any,
  net_holdout: number,
  off_cisnumber: string,
}

export interface LoanWrapper {
  loan: Loan;
  index: number;
}


@Component({
  selector: 'app-sbl-simulation-modal',
  templateUrl: './sbl-simulation-modal.component.html',
  styleUrls: ['./sbl-simulation-modal.component.scss']
})
export class SBLSimulationModalComponent implements OnInit{

  sblSimulateForm: FormGroup;
  isReadOnly: boolean = true;
  currentSttl: any;                 // => Current Sub total 
  currentRptTTL: any;               // => Current Rpt Total
  simulatedSttl: any;               // => Simulated Sub total
  simulatedRptTTL: any;             // => Simulated Rpt Total
  unimpairedCap: number = 0;  
  sblTotalRPT: any; 
  totalLoan:  number = 0;                // => Avail Balance of SBL
  amount_Val: any;
  availBal: any;
  sblBal: any;  
  approvedCapital: any;  // => the Loan approved Limit
  temporaryLoans: LoanWrapper[] = [];
  
  UnimpairedDate: any;

  constructor(
    private formBuilder: FormBuilder,
    private _dosriService: AddServicesService,
    private dataService: AffiliatesService,
    private sblSimulateService: SblLoanSimulateService,
    private _dialogRef: MatDialogRef<SBLSimulationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _coreService: CoreService,
    private auditTrailService: AuditTrailService,
    private get: FetchDataService,
    private simulatedSBLDataService: SimulatedSBLDataService) {
    this.sblSimulateForm = this.formBuilder.group({
      cis_no: [''],
      name: [''],
      principal: ['', [Validators.required]],
      principal_bal: ['']
      });
      this.sblSimulateForm.get('principal')?.valueChanges.subscribe(principal => {
        // Update the value of principal_bal whenever principal changes
        this.sblSimulateForm.get('principal_bal')?.setValue(principal);
      });
      _dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    
  this.getUnimpairedCap();
  // Attempt to patch the form
  this.sblSimulateForm.patchValue(this.data);
  this.availBal = this.sblSimulateService.getAvailBal();
  this.updateTableData();
  }


  onSubmit() {
    
    const session = sessionStorage.getItem('sessionID')?.replaceAll("\"","");
    const userID = sessionStorage.getItem('userID')?.replaceAll("\"","");

      if (this.sblSimulateForm.valid) {
        const simulatedData = this.sblSimulateForm.value;
        if (this.amount_Val <= this.availBal) {
          // Here, you should get the index from somewhere and use it when adding temporary loans
          const index = this.getIndex(); // Assuming you have a method to get the index
          const loan: Loan = { ...simulatedData, net_holdout: simulatedData.principal_bal - simulatedData.deposit_holdout }; // Assuming you calculate net_holdout here
          const loanWrapper: LoanWrapper = {index, loan  };
          this.simulatedSBLDataService.addTemporaryLoan(index, loan);
          this.simulatedSBLDataService.setSimulationPerformed();
          this.close();
          // addSimulatedPNData(sPNData, session, userID)
          //   .then((response) => {
          //     this.logAction('Add', 'Successfuly Added SBL PN Data', true, 'rpofficer-ri');
          //     this.close();
          //   })
          //   .catch((error) => {
  
          //   });
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


  simulateSBL() {
    if (this.sblSimulateForm.valid) {
      this.ngOnInit();
      const dataLookup = this.sblSimulateForm.value;
      // Convert the values to numbers using parseFloat or the unary + operator
      const currentSttlValue = parseFloat(this.currentSttl) || 0;
      const amountValue = parseFloat(dataLookup.principal) || 0;

      this.amount_Val = amountValue;
      // Perform the addition
      this.simulatedSttl = this.totalLoan + amountValue;

      

      if (this.simulatedSttl > this.availBal ) {
        Swal.fire({
          icon: 'error',
          title: 'Loan Breached!',
          text: 'Please Enter Amount not Greater than the Available Balance',
        });
      }
      this.simulatedRptTTL = amountValue;
      this.logAction('Add', 'Added Affiliates', true, 'Affiliates');
    }
  }


  close() {
    this._dialogRef.close(true); 
  }


  
  CISlookup() {
    const dataLookup = this.sblSimulateForm.value;
    this.sblTotalRPT = this.sblSimulateService.getAvailBal();
    this.totalLoan = this.sblSimulateService.getTotalLoan();
    if (dataLookup.cis_no) {
      let cis = dataLookup.cis_no;
      cisLookUP(cis)
        .then((response) => {
          if (Array.isArray(response.data)) {
            if (response.data.length > 0) {
              let sumPrincipal = { principal: 0, principal_bal: 0 };
  
              response.data.forEach((item) => {
                // Calculate the sum for each item
                sumPrincipal.principal += parseFloat(item.principal) || 0;
                sumPrincipal.principal_bal += parseFloat(item.principal_bal) || 0;
              });

              // Assign the sum to the class variables
              this.currentSttl = sumPrincipal.principal;
              this.currentRptTTL = sumPrincipal.principal_bal;

              // If response.data is an array and not empty, use the first element
              const firstElement = response.data[0];
              let accName = firstElement.name;
  
              this.updateFormControls(accName);
            } else {
              // Handle the case when response.data is an empty array
              const accName = response.data.cisName || '';
              
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
    this.sblSimulateForm.patchValue({
      name: accName // Assuming you have company_name in the response
      // Add other form controls if needed
    });
  }


  // Method to get the index
  getIndex(): number {
    // Here you should write the logic to determine the index based on your requirements
    // For example, you could get it from a service or calculate it dynamically
    const indexValue = this.simulatedSBLDataService.getindexValue();
    // Return the index value if it's defined, otherwise return a default value (e.g., 0)
    return indexValue !== undefined ? indexValue : 0;}
  

  toggleInputReadOnly() {
    this.isReadOnly = !this.isReadOnly;
  }



  updateTableData(): void {
    let dateString: string;
    const currentDate = new Date();
    let date = currentDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
   

    this.get.getSBL((sblData) => {
      if (sblData) {
        // Use reduce to calculate the sum of "principal" values
        const sumPrincipal = sblData.reduce((acc, obj) => {
          acc.principal += parseFloat(obj.principal) || 0;
          acc.principal_bal += parseFloat(obj.principal_bal) || 0;
          acc.deposit_holdout += parseFloat(obj.deposit_holdout) || 0;
          return acc;
        }, { principal: 0, principal_bal: 0, deposit_holdout: 0 });

        this.sblBal = sumPrincipal.principal_bal - sumPrincipal.deposit_holdout;
        this.approvedCapital = this.unimpairedCap * 0.5;
      } else {

      }
    });
  }

  getUnimpairedCap(): void {
    this.get.getUnimpairedCapital((unimpairedCap) => {
        
        this.UnimpairedDate = unimpairedCap[0].date;
        this.unimpairedCap = unimpairedCap[0].impared_capital;

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
    
  });
  
  }
  
}
