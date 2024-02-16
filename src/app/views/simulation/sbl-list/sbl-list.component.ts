import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
// Import for Simulation Modal
import {MatDialog} from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { FilterPipe } from 'src/app/pipe/filterPipe/filter.pipe';
//Import for API Function
import { FetchDataService } from 'src/app/services/fetch/fetch-data.service';
//Simulate Loan for SBL
import { SimulatedSBLDataService } from '../../../services/simulatedSBLService/simulated-sbldata.service';
// Service
import { SblLoanSimulateService } from '../../../services/sblLoanSimulate/sbl-loan-simulate.service';
// Save CSV
import { CsvExportService } from './../../../services/data_extraction/csvexport/csvexport.service';
import { PdfExportService } from './../../../services/data_extraction/pdfexport/pdfexport.service';
import { SBLSimulationModalComponent } from 'src/app/modal-dialog/sbl-simulation-modal/sbl-simulation-modal.component';
import { HoldoutAllocationModalComponent } from '../../../modal-dialog/holdout-allocation-modal/holdout-allocation-modal.component';


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
  off_cisnumber: string
}

// Define the structure of the wrapper object that holds both the loan data and the index
interface LoanWrapper {
  loan: Loan;
  index: number;
}


export interface ResultItem {
  id: number;
  aff_com_cis_number: string;
  account_name: string;
  company_name: string;
  date_inserted: string;
  status: number;
  managing_company: string;
  module: string;
  LEVEL: number;
  loan_list: Loan[];
  totalHoldOut?: number;
  totalHoldOutForCard?: number;
}

@Component({
  selector: 'app-sbl-list',
  templateUrl: './sbl-list.component.html',
  styleUrls: ['./sbl-list.component.scss'],
  providers: [FilterPipe],

})
export class SBLListComponent implements OnInit{
  dataSource = new MatTableDataSource<ResultItem>();
  displayedColumns: string[] = ['loan_no', 'account_name', 'loan_security', 'amount_granted', 'date_granted', 'principal_bal', 'deposit_holdout', 'net_holdout', 'payment_status'];

  searchTextLoanList?: FormControl;
  index: any; // to get where should the temporary loan will be push
  temporaryLoans: LoanWrapper[] = [];  // For SBL Simulation
  simulationPerformed: boolean = false;

  available_balance: any;    // => Calculated Balance for simulation
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
  approvedCapital: any;        // => the Loan approved Limit
  sbl: any;
  internalSBL: any;
  net: any;
  available_net: any;
  available_bal: any;
  selectedPN: any;
  UnimpairedDate: any;

  sblIsPositive: boolean = false;
  sblIsNegative: boolean = false;
  totalHoldOut: number = 0;
  finalHoldOut: number = 0;
  totalprincipalAmount = 0;
  netBal = 0;
  totalNetOfHoldOut: number = 0;
  totalNetHoldOut: number = 0;
  
  filterValue: string = '';

  totalHoldOuts: number[] = [];
  result: ResultItem[] = [];

  currentDate?: Date;
  constructor(
    private get: FetchDataService,
    public _dialog: MatDialog,
    private filterPipe: FilterPipe,
    private sblSimulateService: SblLoanSimulateService, 
    private SimulatedtempSBLloan:  SimulatedSBLDataService,   
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private csvExportService: CsvExportService,
    private pdfExportService: PdfExportService
    ) {}

    ngOnInit() {
      this.searchTextLoanList = new FormControl();
      this.loadData();
      this.currentDate = new Date();
    }


    loadData(): void {
      // Fetch data and initialize components
      this.getUnimpairedCap();
      this.updateTableData(['1480005220', '1480005206', '1480012730', '1480000958', '1480007708',
      '1480012027', '1480009097', '1480006526']);
      this.temporaryLoans = this.SimulatedtempSBLloan.getTemporaryLoans();
      this.simulationPerformed = this.SimulatedtempSBLloan.isSimulationPerformed();  
      this.availBal = this.internalSBL 
      this.searchTextLoanList = new FormControl();
    }
    


    // Methods for fetching and processing data
    getUnimpairedCap(): void {
      // Fetch unimpaired capital data
      this.get.getUnimpairedCapital((unimpairedCap) => {
        this.UnimpairedDate = unimpairedCap[0].date;
        this.unimpairedCap = unimpairedCap[0].impared_capital;     
        this.sbl = (this.unimpairedCap * .25);
        this.internalSBL = (this.unimpairedCap * .20);
      })
    }


    updateTableData(cisNumbers: string[]): void {
      // Fetch SBL data and update table
      this.get.getSBL((sblData) => {
        if (sblData) {
          // Use a Set to store unique loan numbers
          const uniqueLoanNumbers = new Set<string>();
    
          // Filter out duplicate loans with the same loan_no within each company's SBL data
          sblData.forEach((entry) => {
            entry.loan_list = entry.loan_list.filter((loan) => {
              if (uniqueLoanNumbers.has(loan.loan_no) || loan.loan_no.includes('2021-02-002354')) {
                // Return false if it's a duplicate
                return false;
              } else {
                
                // Add the loan number to the Set and return true
                uniqueLoanNumbers.add(loan.loan_no);
                return true;
              }
            });
    
            // Filter the loan list based on the array of CIS numbers
            entry.loan_list = entry.loan_list.filter((loan) => {
              return cisNumbers.includes(loan.cis_no);
            });
          });
    
          // Push temporary loan data only once outside the forEach loop
          const tempData = sblData.slice(); // Create a shallow copy of sblData
          if (this.temporaryLoans && this.temporaryLoans.length > 0) {
            // Iterate over each LoanWrapper object and its index
            this.temporaryLoans.forEach((loanWrapper) => {
              const { index, loan } = loanWrapper;
              console.log(loanWrapper);
              if (index < tempData.length) {
                // Check if the index is within the bounds of tempData
                const account = tempData[index];
                account.loan_list.push(loan);
    
                // Calculate net_holdout for each loan in the account's loan_list
                account.loan_list.forEach((loan) => {
                  loan.net_holdout = (parseFloat(loan.principal_bal) || 0) - (parseFloat(loan.deposit_holdout) || 0);
                });
              } else {
                // console.error('Index out of bounds:', index);
              }
            });
    
            this.calculateSimulatedData(tempData); // Calculate simulated data
          }
    
          // Update the MatTableDataSource
          this.dataSource.data = tempData;
    
          console.log(tempData);
        }
      });
    }
    


    applyFilterLoanList(account: any): any[] | undefined {
      if (this.searchTextLoanList && this.searchTextLoanList.value) {
        const filterValue = this.searchTextLoanList.value.toLowerCase();
        
        
        // Adjust the following logic based on your data structure and filter requirements
        return account.loan_list.filter((item: any) =>
          item.loan_no.toLowerCase().includes(filterValue) ||
          item.name.toLowerCase().includes(filterValue) ||
          item.loan_security.toLowerCase().includes(filterValue)
          // Add more fields as needed for your use case
          // ...
        );

        
      
      }
      
      return undefined;

      
    }


    
 

  

  calculateTotalNetHoldOut(loanList): number {
    let sum = 0;
    for (const element of loanList) {
      sum += (element.principal_bal || 0) - (element.deposit_holdout || 0);
    }
    return sum;
  }

  // Method to update the totalNetHoldOut variable
  updateTotalNetHoldOut(account): void {
    this.totalNetHoldOut = this.calculateTotalNetHoldOut(account.loan_list);
  }


  
  calculateSimulatedData(tempData: any[]): void {
    // Calculate sums and ratios based on the filtered data
    const sumPrincipal = tempData.reduce((acc, obj) => {
      acc.principal += parseFloat(obj.principal) || 0;
      acc.principal_bal += parseFloat(obj.principal_bal) || 0;
      acc.deposit_holdout += parseFloat(obj.deposit_holdout) || 0;
      return acc;
    }, { principal: 0, principal_bal: 0, deposit_holdout: 0 });

  }

  
  


calculateLoanListSummary(loanList: Loan[]): any {
  const totalPrincipalBal = loanList.reduce((acc, loan) => acc + loan.principal_bal - this.finalHoldOut, 0);
  
  return {
    totalPrincipalBal,
    singleBorrowersLimit: 0, // Replace with the actual property for single borrower's limit
    availableLimit: 0
  };
}  


print() {
  window.print(); // Call the window.print() method to trigger printing
}



  scrollToUser(name: string) {
    console.log(name);
    const lowerCaseName = name.toLowerCase();
    const elements = document.querySelectorAll('[id]');
    console.log(elements);
  
    for (const element of Array.from(elements)) {
      const elementId = element.id.toLowerCase();
      console.log(elementId.includes(lowerCaseName));
      if (elementId.includes(lowerCaseName)) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        break; // Stop searching after the first match
      }
    }
  }
  
  


  // Function to Show the simulation Modal
  openSimulation(i: number) {
    this.SimulatedtempSBLloan.setindexValue(i);
    const dialogRef = this._dialog.open(SBLSimulationModalComponent, {
      width: '50%', // Set the width as per your requirement
      // Other MatDialog options can be specified here
    });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.ngOnInit();
          // this.updateTableData();
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

  // Setting the Available Balance
  calculateAvailable(Avail: any, totalLoan: any) {
    this.sblSimulateService.setAvailBal(Avail);
    this.sblSimulateService.setTotalLoan(totalLoan)
  }

  resetSimulation(): void {
    this.simulationPerformed = false;   
    this.SimulatedtempSBLloan.resetSimulationPerformed();
    this.ngOnInit();
  }



  exportPDF(): void {
    const data: any[] = this.dataSource.data;
    this.pdfExportService.generateSBLPDF(data);
  }

  
  // exportPDF() {
  //   // Call exportToPDF() or openPDF() as needed
  //   // For example, to open PDF from HTML element with id 'htmlData'
  //   this.pdfExportService.openPDF('htmlData');
  // }


}
