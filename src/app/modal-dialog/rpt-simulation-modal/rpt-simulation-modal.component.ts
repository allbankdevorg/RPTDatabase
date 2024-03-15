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
import { SimulatedDataService } from '../../services/simulatedDataService/simulated-data-service.service';


// export interface Loan {
//   loan_no: number,
//   cis_no: number,
//   name: string,
//   principal: number,
//   principal_bal: number,
//   loan_security: string,
//   deposit_holdout: number,
//   date_granted: any,
//   // netBal: number
// }

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
  unimpairedCap: number = 0;   //Unimpaired Capital
  availBal: any;    // => Remaining Balance of Possible Loan Amount
  rptBal: any;      // => RPT Balance (Net of Hold-out)
  approvedCapital: any;  // => the Loan approved Limit
  // temporaryLoans?: Loan[];
  
  UnimpairedDate: any;
  currentLoan: any;
  receivedData: any;

  constructor(
    private formBuilder: FormBuilder,
    private _dosriService: AddServicesService,
    private dataService: AffiliatesService,
    private _dialogRef: MatDialogRef<RPTSimulationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _coreService: CoreService,
    private auditTrailService: AuditTrailService,
    private get: FetchDataService,
    private simulatedDataService: SimulatedDataService) {
    this.rptSimulateForm = this.formBuilder.group({
      cis_no: [''],
      name: [''],
      principal: ['', [Validators.required]],
      principal_bal: ['']
      });
      this.rptSimulateForm.get('principal')?.valueChanges.subscribe(principal => {
        // Update the value of principal_bal whenever principal changes
        this.rptSimulateForm.get('principal_bal')?.setValue(principal);
      });

      this.simulatedDataService.data$.subscribe(data => {
        this.receivedData = data;
        // Handle the received data as needed
        // this.ngOnInit(); // Call your ngOnInit method
        // this.calculateSimulatedData(this.dataSource.data); // Call your calculateSimulatedData method
      });
      _dialogRef.disableClose = true;
  }

  ngOnInit(): void {
  this.updateTableData();
  this.getUnimpairedCap();
  this.patchForm();
  this.RPTCheckLookUp();
  }

  
  patchForm() {
    if (this.receivedData) {
      // Update the form controls with the received data
      this.rptSimulateForm.patchValue({
        name: this.receivedData[0].fullname,
        cis_no: this.receivedData[0].cis_number
        // Add any other form controls you need to update
      });
    }
  }

  // patchForm() {
  //   if (this.data) {
  //   this.rptSimulateForm.patchValue({
  //     name: this.data[0].fullname,
  //     cis_no: this.data[0].cis
      
  //   });
  // }
  // }


  onSubmit() {
    const session = sessionStorage.getItem('sessionID')?.replaceAll("\"","");
    const userID = sessionStorage.getItem('userID')?.replaceAll("\"","");
    const dataLookup = this.rptSimulateForm.value;

    if (this.rptSimulateForm.valid) {
      const simulatedData = this.rptSimulateForm.value;
      let amount = this.rptSimulateForm.value.principal;
      
      
      if (amount <= this.availBal) {
        this.simulatedDataService.addTemporaryLoan(simulatedData)
        this.simulatedDataService.setSimulationPerformed();
        this.close();
      }
      else {
        const currentSttlValue = parseFloat(this.currentLoan) || 0;
        const amountValue = parseFloat(dataLookup.principal) || 0;
      // Perform the addition
        this.simulatedSttl = currentSttlValue + amountValue;      
        this.simulatedRptTTL = amountValue;

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
      const currentSttlValue = parseFloat(this.currentLoan) || 0;
      const amountValue = parseFloat(dataLookup.principal) || 0;
  
      // Perform the addition
      this.simulatedSttl = currentSttlValue + amountValue;      
      this.simulatedRptTTL = amountValue;


      if (this.simulatedRptTTL > this.availBal) {
        Swal.fire({
          icon: 'error',
          title: 'Loan Breached!',
          text: 'Please Enter Amount not Greater than the Available Balance',
        });
      }

      this.logAction('Add', 'Added Affiliates', true, 'Affiliates');
    }
  }


  close() {
    this._dialogRef.close(true); 
  }


  get amountControl() {
    return this.rptSimulateForm.get('amount');
  }



  RPTCheckLookUp() {
    if (this.receivedData) {

      const dataLookup = this.receivedData[0];

    if (dataLookup.cis_number) {
      let cis = dataLookup.cis_number;
      cisLookUP(cis)
        .then((response) => {
          if (Array.isArray(response.data)) {
            if (response.data.length > 0) {
              let sumPrincipal = { principal: 0, principal_bal: 0, deposit_holdout: 0  };
  
              response.data.forEach((item) => {
                // Calculate the sum for each item
                sumPrincipal.principal += parseFloat(item.principal) || 0;
                sumPrincipal.principal_bal += parseFloat(item.principal_bal) || 0;
                sumPrincipal.deposit_holdout += parseFloat(item.deposit_holdout) || 0;
              });

              // Assign the sum to the class variables
              this.currentSttl = sumPrincipal.principal;
              this.currentRptTTL = sumPrincipal.principal_bal;

              let outstandingBal = sumPrincipal.principal_bal;

              this.currentLoan = outstandingBal - sumPrincipal.deposit_holdout


              // If response.data is an array and not empty, use the first element
              const firstElement = response.data[0];
              let accName = firstElement.name;
  
              // this.rptSimulateForm.patchValue({
              //   name: accName
              // });
            } else {
              // Handle the case when response.data is an empty array
              const accName = response.data.cisName || '';
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
          // Swal.fire({
          //   icon: 'error',
          //   title: 'No CIS Found!',
          //   text: 'CIS Does Not Exist!',
          // });
          this.toggleInputReadOnly();
        });
    }
    }
    
  }
 


  CISlookup() {
    const dataLookup = this.rptSimulateForm.value;
  
    if (dataLookup.cis_no) {
      let cis = dataLookup.cis_no;
      cisLookUP(cis)
        .then((response) => {
          if (Array.isArray(response.data)) {
            if (response.data.length > 0) {
              let sumPrincipal = { principal: 0, principal_bal: 0, deposit_holdout: 0  };
  
              response.data.forEach((item) => {
                // Calculate the sum for each item
                sumPrincipal.principal += parseFloat(item.principal) || 0;
                sumPrincipal.principal_bal += parseFloat(item.principal_bal) || 0;
                sumPrincipal.deposit_holdout += parseFloat(item.deposit_holdout) || 0;
              });

              // Assign the sum to the class variables
              this.currentSttl = sumPrincipal.principal;
              this.currentRptTTL = sumPrincipal.principal_bal;

              let outstandingBal = sumPrincipal.principal_bal;

              this.currentLoan = outstandingBal - sumPrincipal.deposit_holdout


              // If response.data is an array and not empty, use the first element
              const firstElement = response.data[0];
              let accName = firstElement.name;
  
              this.rptSimulateForm.patchValue({
                name: accName
              });
            } else {
              // Handle the case when response.data is an empty array
              const accName = response.data.cisName || '';
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
    this.rptSimulateForm.patchValue({
      name: accName // Assuming you have company_name in the response
      // Add other form controls if needed
    });
  }

  updateTableData(): void {
    let dateString: string;
    const currentDate = new Date();
    let date = currentDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
   

    this.get.getPNData(date, (PNData) => {
      if (PNData) {
        // Use reduce to calculate the sum of "principal" values
       
        this.calculateactualData(PNData);

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

  calculateactualData(actualData: any[]): void {
    const sumPrincipal = actualData.reduce((acc, obj) => {
      acc.principal += parseFloat(obj.principal) || 0;
      acc.principal_bal += parseFloat(obj.principal_bal) || 0;
      acc.holdoutdata += parseFloat(obj.holdoutdata) || 0;
      return acc;
    }, { principal: 0, principal_bal: 0, holdoutdata: 0 });
    
    this.rptBal = sumPrincipal.principal_bal - sumPrincipal.holdoutdata;
  
    // Calculate rptRatio only if unimpairedCap is not zero
    
    this.approvedCapital = this.unimpairedCap * 0.5;
    
    // Recalculate available balance only if approvedCapital is not zero
    if (this.approvedCapital !== 0) {
      this.availBal = this.approvedCapital - this.rptBal;
    } else {
      this.availBal = 0;
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

  });
  
  }

}
