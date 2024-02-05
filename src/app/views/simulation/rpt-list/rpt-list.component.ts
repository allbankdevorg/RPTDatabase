import { Component, AfterViewInit, ViewChild, NgZone, ChangeDetectionStrategy, ChangeDetectorRef, QueryList, ElementRef, Renderer2 } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

// Import for Simulation Modal
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { RPTSimulationModalComponent } from 'src/app/modal-dialog/rpt-simulation-modal/rpt-simulation-modal.component';
import {HoldoutAllocationModalComponent} from '../../../modal-dialog/holdout-allocation-modal/holdout-allocation-modal.component'

//Import for API Function
import { FetchDataService } from 'src/app/services/fetch/fetch-data.service';
import { HoldOutValue } from '../../../functions-files/add/postAPI';
import { SimulatedDataService } from '../../../services/simulatedDataService/simulated-data-service.service';


export interface RPTlist_model {
  loantype: string;
  cis_no: number;
  pn_no: number;
  borrower: string;
  orig_loan: number;
  O_blnc: number;
}

export interface Loan {
  loan_no: number,
  cis_no: number,
  name: string,
  principal: number,
  principal_bal: number,
  loan_security: string,
  deposit_holdout: number,
  date_granted: any,
  netBal: number
}

@Component({
  selector: 'app-rpt-list',
  templateUrl: './rpt-list.component.html',
  styleUrls: ['./rpt-list.component.scss']
})
export class RptListComponent {
  rptBal: any;      // => RPT Balance (Net of Hold-out)
  rptRatio: any;    // => RPT Ratio
  subtlOL: any;     // => SUB-TOTAL Original Loan
  subtlOB: any;     // => SUB-TOTAL Outstanding Balance
  ttlRPTOL: any;    // => TOTAL RPT Original Loan
  ttlRPTOB: any;    // => TOTAL RPT Outstanding Loan
  availBal: any;    // => Remaining Balance of Possible Loan Amount
  unimpairedCap: number = 0;   //Unimpaired Capital
  definedRptRatio: number = 50;     //Pre defined Percentage
  availRptRatio: any;
  approvedCapital: any;  // => the Loan approved Limit
  totalHoldOut: number = 0;
  selectedPN: any;
  UnimpairedDate: any;

  // Simulation
  SimulatedrptBal: any;
  SimulatedrptRatio: any;
  SimulatedavailBal: any;
  SimulatedavailRptRatio: any;
  SimulatedttlRPTOL: any;
  SimulatedttlRPTOB: any;
  SimulatedapprovedCapital: any;

  temporaryLoans?: Loan[];
  
  displayedColumns: string[] = ['loan_no', 'cis_no', 'name', 'principal', 'principal_bal', 'loan_security', 
  'deposit_holdout', 'netBal', 'date_granted', 'terms', 'purpose', 'intRate'];
  dataSource = new MatTableDataSource<any>([]);
  ToDisplay: string[] = [];

  
  @ViewChild(MatSort) sort!: MatSort;


  constructor(
    private get: FetchDataService,
    public _dialog: MatDialog,
    private simulatedDataService: SimulatedDataService) {
       
    }


  
    ngAfterViewInit() {
  
      this.dataSource.sort = this.sort;
  
      this.sort.sort({
        id: 'cis_no',
        start: 'desc',
        disableClear: false
      });
    }


  applyFilter(filterValue: string) {
    filterValue = filterValue.trim().toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  
    // Calculate sums and ratios based on the filtered data
    const filteredData = this.dataSource.filteredData;
    const sumPrincipal = filteredData.reduce((acc, obj) => {
      acc.principal += parseFloat(obj.principal) || 0;
      acc.principal_bal += parseFloat(obj.principal_bal) || 0;
      acc.deposit_holdout += parseFloat(obj.deposit_holdout) || 0;
      return acc;
    }, { principal: 0, principal_bal: 0, deposit_holdout: 0 });
  
    this.rptBal = sumPrincipal.principal_bal - sumPrincipal.deposit_holdout;
    const percentage = `${(this.rptBal / 1214764186.16 * 100).toFixed(2)}%`;
    this.rptRatio = percentage;
    this.subtlOL = sumPrincipal.principal;
    this.subtlOB = this.rptBal
    this.ttlRPTOL = sumPrincipal.principal;
    this.ttlRPTOB = sumPrincipal.principal_bal;

    // this.availBal = this.approvedCapital - this.rptBal;
  }

  

  
  ngOnInit() {
    this.updateTableData();
    this.getUnimpairedCap();
    this.temporaryLoans = this.simulatedDataService.getTemporaryLoans();
    // this.pushTemporaryLoans();
  }


  pushTemporaryLoans() {
    // if (this.temporaryLoans) {
    //   this.temporaryLoans.forEach((loan) => {
    //     this.dataSource.data.push(loan);
    //     console.log(this.dataSource.data);
    //     console.log(this.temporaryLoans);
    //   });
    // }
    
  }

//  updateTableData(): void {
//     this.get.getPNData((PNData) => {
//         if (PNData) {
//             // Filter out entries without a loan_no
//             const filteredPNData = PNData.filter(entry => entry.loan_no);

//             const uniqueCisNumbers = [...new Set(filteredPNData.map((entry) => entry.cis_no))];
            
//             uniqueCisNumbers.forEach((cisNumber) => {
//                 HoldOutValue(cisNumber)
//                 .then((response) => {
//                     // Your existing logic for updating data
//                     // Make sure to use filteredPNData instead of PNData in calculations
//                     const holdOUT = response.result[0].Data[0].hold_out;

//                     if (holdOUT) {
//                         // Distribute hold_out data equally among PN data entries
//                         const entries = filteredPNData.filter((entry) => entry.cis_no === cisNumber);
//                         const holdOutValue = holdOUT || 0;
//                         const holdOutPerCis = entries.length > 0 ? holdOutValue / entries.length : 0;

//                         // Update PN Data with divided hold_out values
//                         entries.forEach((entry) => {
//                             entry.hold_out = Number(holdOutPerCis.toFixed(2));
//                             this.totalHoldOut += entry.hold_out;
//                         });
                        
//                         // Update the dataSource with the combined data
//                         this.dataSource.data = filteredPNData;

//                         // Calculate sums and ratios based on the filtered data
//                         const sumPrincipal = filteredPNData.reduce((acc, obj) => {
//                             acc.principal += parseFloat(obj.principal) || 0;
//                             acc.principal_bal += parseFloat(obj.principal_bal) || 0;
//                             acc.deposit_holdout += parseFloat(obj.deposit_holdout) || 0;
//                             return acc;
//                         }, { principal: 0, principal_bal: 0, deposit_holdout: 0 });
                    
//                         this.rptBal = sumPrincipal.principal_bal - sumPrincipal.deposit_holdout;
//                         const percentage = `${((this.rptBal / this.unimpairedCap) * 100).toFixed(2)}%`;
//                         this.rptRatio = percentage;
//                         this.ttlRPTOL = sumPrincipal.principal;
//                         this.ttlRPTOB = sumPrincipal.principal_bal
//                         this.dataSource.data = filteredPNData;
//                         this.availRptRatio = `${(this.definedRptRatio - parseFloat(percentage.replace('%', ''))).toFixed(2)}%`;
//                         this.approvedCapital = this.unimpairedCap * 0.5;
//                         this.availBal = this.approvedCapital - this.rptBal;

//                     } else {
//                         // Handle error or empty hold_out response
//                     }
//                 })
//                 .catch((error) => {
//                     // Handle error
//                 });
//             });
//         }
//     })
// }

updateTableData(): void {
  this.get.getPNData((PNData) => {
    if (PNData) {
      const uniqueCisNumbers = [...new Set(PNData.map((entry) => entry.cis_no))];
      
      uniqueCisNumbers.forEach((cisNumber) => {
        HoldOutValue(cisNumber) // Pass the entire formData object
        .then((response) => {
          // Log the response when the promise is resolved
          // Handle hold_out data if needed
          
           // Calculate sums and ratios based on the filtered data
           
          this.calculateactualData(PNData);
          
          // Calculate simulated data
        })
        .catch((error) => {
          // Handle error
        });
      });

      
    // Push temporary loan data only once outside the forEach loop
    const tempData = PNData.slice(); // Create a shallow copy of PNData
    if (this.temporaryLoans) {
      tempData.push(...this.temporaryLoans); // Spread the temporary loans array to push each loan individually
    }
    // Update the dataSource with the combined data
    this.dataSource.data = tempData;
    }
  });
}

calculateactualData(actualData: any[]): void {
  const sumPrincipal = actualData.reduce((acc, obj) => {
    acc.principal += parseFloat(obj.principal) || 0;
    acc.principal_bal += parseFloat(obj.principal_bal) || 0;
    acc.deposit_holdout += parseFloat(obj.deposit_holdout) || 0;
    return acc;
  }, { principal: 0, principal_bal: 0, deposit_holdout: 0 });
  
  this.rptBal = sumPrincipal.principal_bal - sumPrincipal.deposit_holdout;
  const percentage = `${((this.rptBal / this.unimpairedCap) * 100).toFixed(2)}%`;
  this.rptRatio = percentage;
  this.ttlRPTOL = sumPrincipal.principal;
  this.ttlRPTOB = sumPrincipal.principal_bal;
  this.availRptRatio = `${(this.definedRptRatio - parseFloat(percentage.replace('%', ''))).toFixed(2)}%`;
  this.approvedCapital = this.unimpairedCap * 0.5;
  this.availBal = this.approvedCapital - this.rptBal;
}


calculateSimulatedData(tempData: any[]): void {
  console.log(tempData);
  if (this.temporaryLoans) {
    tempData.push(...this.temporaryLoans); // Spread the temporary loans array to push each loan individually
  }
  
  // Simulated data calculations go here
  const sumPrincipal = tempData.reduce((acc, obj) => {
    acc.principal += parseFloat(obj.principal) || 0;
    acc.principal_bal += parseFloat(obj.principal_bal) || 0;
    acc.deposit_holdout += parseFloat(obj.deposit_holdout) || 0;
    return acc;
  }, { principal: 0, principal_bal: 0, deposit_holdout: 0 });
  
  this.SimulatedrptBal = sumPrincipal.principal_bal - sumPrincipal.deposit_holdout;
  const percentage = `${((this.SimulatedrptBal / this.unimpairedCap) * 100).toFixed(2)}%`;
  this.SimulatedrptRatio = percentage;
  this.SimulatedttlRPTOL = sumPrincipal.principal;
  this.SimulatedttlRPTOB = sumPrincipal.principal_bal;
  this.SimulatedavailRptRatio = `${(this.definedRptRatio - parseFloat(percentage.replace('%', ''))).toFixed(2)}%`;
  this.SimulatedapprovedCapital = this.unimpairedCap * 0.5;
  // this.SimulatedavailBal = this.SimulatedapprovedCapital - this.SimulatedrptBal;
  this.SimulatedavailBal = Math.max(0, this.SimulatedapprovedCapital - this.SimulatedrptBal);

}

//  updateTableData(): void {
//   this.get.getPNData((PNData) => {
//     if (PNData) {
//       const uniqueCisNumbers = [...new Set(PNData.map((entry) => entry.cis_no))];
      
//       uniqueCisNumbers.forEach((cisNumber) => {
//         HoldOutValue(cisNumber) // Pass the entire formData object
//         .then((response) => {
//           // Log the response when the promise is resolved
//             // const holdOUT = response.result[0].Data[0].hold_out;

//             // if (holdOUT) {
//             //     // Distribute hold_out data equally among PN data entries
//             //     const entries = PNData.filter((entry) => entry.cis_no === cisNumber);
//             //     const holdOutValue = holdOUT || 0;
//             //     const holdOutPerCis = entries.length > 0 ? holdOutValue / entries.length : 0;

//             //     // Update PN Data with divided hold_out values
//             //     entries.forEach((entry) => {
//             //       entry.hold_out = Number(holdOutPerCis.toFixed(2));
//             //       this.totalHoldOut += entry.hold_out;
//             //     });
  
//                 // Update the dataSource with the combined data
                
//                 // Calculate sums and ratios based on the filtered data
//                 const sumPrincipal = PNData.reduce((acc, obj) => {
//                           acc.principal += parseFloat(obj.principal) || 0;
//                           acc.principal_bal += parseFloat(obj.principal_bal) || 0;
//                           acc.deposit_holdout += parseFloat(obj.deposit_holdout) || 0;
//                           return acc;
//                         }, { principal: 0, principal_bal: 0, deposit_holdout: 0 });
                      
//                         this.rptBal = sumPrincipal.principal_bal - sumPrincipal.deposit_holdout;
//                         const percentage = `${((this.rptBal / this.unimpairedCap) * 100).toFixed(2)}%`;
//                         this.rptRatio = percentage;
//                         // this.subtlOL = sumPrincipal.principal;
//                         // this.subtlOB = this.rptBal;
//                         this.ttlRPTOL = sumPrincipal.principal;
//                         this.ttlRPTOB = sumPrincipal.principal_bal
//                         this.dataSource.data = PNData;
//                         this.availRptRatio = `${(this.definedRptRatio - parseFloat(percentage.replace('%', ''))).toFixed(2)}%`;
//                         this.approvedCapital = this.unimpairedCap * 0.5;
                        
//                         this.availBal = this.approvedCapital - this.rptBal;

//               // } else {
//                 // Handle error or empty hold_out response
//               // }

//         })
//         .catch((error) => {
         
//         });
//         if (this.temporaryLoans) {
//           this.temporaryLoans.forEach((loan) => {
//             PNData.push(loan);
//             console.log(PNData);
//             console.log(this.temporaryLoans);
//           });
//         }

//         this.dataSource.data = PNData;
          
//       });
//     }
//   })
// }

    getUnimpairedCap(): void {
      this.get.getUnimpairedCapital((unimpairedCap) => {
          
          this.UnimpairedDate = unimpairedCap[0].date;
          this.unimpairedCap = unimpairedCap[0].impared_capital;

      })
    }


   
    openSimulation() {
      const dialogRef = this._dialog.open(RPTSimulationModalComponent, {
        width: '50%', // Set the width as per your requirement
        // Other MatDialog options can be specified here
      });
      dialogRef.afterClosed().subscribe({
        next: (val) => {
          if (val) {
            this.ngOnInit();
            
            this.calculateSimulatedData(this.dataSource.data);
          }
        },
      });
    }

  
    allocateHoldOut(data: any) {
      this.selectedPN = data;
      const dialogRef = this._dialog.open(HoldoutAllocationModalComponent, {
        width: '40%', // Set the width as per your requirement
        // Other MatDialog options can be specified here
        data,
      });
      dialogRef.afterClosed().subscribe({
        next: (val) => {
          if (val) {
            this.ngOnInit();
            this.selectedPN = null;
            // this.updateTableData();
          }
        },
      });
    }
}


