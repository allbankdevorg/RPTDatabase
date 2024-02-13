import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';


// Import for Simulation Modal
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { SBLSimulationModalComponent } from 'src/app/modal-dialog/sbl-simulation-modal/sbl-simulation-modal.component';
import {HoldoutAllocationModalComponent} from '../../../modal-dialog/holdout-allocation-modal/holdout-allocation-modal.component'

//Import for API Function
import { FetchDataService } from 'src/app/services/fetch/fetch-data.service';
import {HoldOutValue} from '../../../functions-files/add/postAPI';
import { MatTableDataSource } from '@angular/material/table';


import { FilterPipe } from 'src/app/pipe/filterPipe/filter.pipe';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

// Service
import {SblLoanSimulateService} from '../../../services/sblLoanSimulate/sbl-loan-simulate.service'; //Service to set the value of the DirCIS and buttonID in adding RI of Directors

// Save CSV
import { CsvExportService } from './../../../services/data_extraction/csvexport/csvexport.service';
import { PdfExportService } from './../../../services/data_extraction/pdfexport/pdfexport.service';


interface account {
  name: string;
  list: any[];
}

interface LoanIndividual {
  id: number;
  com_related: string;
  off_cisnumber: string;
  fname: string;
  mname: string;
  lname: string;
  position: string;
  status: number;
}

interface sblAccount {
  company_name: string;
  loan_list: MatTableDataSource<sblList>; // Specify the type here
}

interface sblList {
  name: string;
  loan_no: string;
  L_type: string;
  collateral: string;
  amt_granted: string;
  date_booked: string;
  O_blnc: string;
  hold_out: string;
  net_holdout: number;
  payment_status: string;
  loan_list: [];
}

interface Data {
  aff_com_cis_number: string;
  aff_com_account_name: string;
  loan_list_company: any[];
  loan_individual: any[];
}



// ///////

export interface loanData {
  loan_no: number;
  name: string;
  principal: number;
  principal_bal: number;
  loan_security: string;
}

interface companylistData {
  company_name: string;
  account_name: string;
  company_list: [];
}




interface Loan {
  id: number;
  cis_no: string;
  name: string;
  loan_no: string;
  principal: number;
  principal_bal: number;
  date_granted: string;
  created_by: string;
  date_created: string;
  loan_security: string;
  status: number;
  manager: string;
  group: string;
  hold_out: number;
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
  filterValue: string = '';
  sbl: any;
  internalSBL: any;
  net: any;
  available_net: any;
  available_bal: any;
  selectedPN: any;
  UnimpairedDate: any;

  sblIsPositive: boolean = false;
sblIsNegative: boolean = false;

searchTextLoanList: any;
totalHoldOut: number = 0;

finalHoldOut: number = 0;

totalprincipalAmount = 0;
netBal = 0;
totalNetOfHoldOut: number = 0;

// Inside the method where you calculate the summary


  // account: any = {};

  dataSource = new MatTableDataSource<ResultItem>
  displayedColumns: string[] = ['loan_no', 'account_name', 'branch_name', 'loan_security', 'amount_granted', 'date_granted'
  , 'principal_bal', 'deposit_holdout', 'net_holdout', 'payment_status'];


  
  result: ResultItem[] = [];

  constructor(
    private get: FetchDataService,
    public _dialog: MatDialog,
    private filterPipe: FilterPipe,
    private dataService: SblLoanSimulateService,      // => For SBL Simulation
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private csvExportService: CsvExportService,
    private pdfExportService: PdfExportService
    ) {
      

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


    
  totalHoldOuts: number[] = [];

  ngOnInit() {
    // Additional initialization logic if needed
    this.getUnimpairedCap();
    this.updateTableData();
    this.availBal = this.internalSBL 
    this.searchTextLoanList = new FormControl();
    // this.updateTableDatas();
    // this.data = this.getFlattenedData(this.data);  
    // Call the calculateTotalNetOfHoldOut method
  // this.calculateTotalNetOfHoldOut();
  }

  totalNetHoldOut: number = 0;

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

  // updateTableData(): void {
  //   // Initialize totalHoldOut for each account
    
  
  //   this.get.getSBL((sblData) => {
  //     if (sblData) {
  //       const uniqueCisNumbers = [...new Set(sblData.flatMap((entry) => entry.loan_list.map(loan => loan.cis_no)))];
  
  
  //       this.dataSource.data = sblData;
  
  //       // Calculate sums and ratios based on the filtered data
  //       const sumPrincipal = sblData.reduce((acc, obj) => {
  //         acc.principal += parseFloat(obj.principal) || 0;
  //         acc.principal_bal += parseFloat(obj.principal_bal) || 0;
  //         return acc;
  //       }, { principal: 0, principal_bal: 0 });
  
  //       // Calculate ratios and other values using this.totalHoldOut
  //       this.rptBal = sumPrincipal.principal_bal - this.totalHoldOut;
  //       const percentage = `${((this.rptBal / 1214764186.16) * 100).toFixed(2)}%`;
  
  //     } else {
  //       // Handle case where sblData is empty
  //     }
  //   });
  // }





  updateTableData(): void {
    // Initialize totalHoldOut for each account
    this.get.getSBL((sblData) => {
      if (sblData) {
        // Use a Set to store unique loan numbers
        const uniqueLoanNumbers = new Set<string>();
  
        // Filter out duplicate loans with the same loan_no within each company's SBL data
        sblData.forEach((entry) => {
          entry.loan_list = entry.loan_list.filter((loan) => {
            if (uniqueLoanNumbers.has(loan.loan_no)) {
              // Return false if it's a duplicate
              return false;
            } else {
              // Add the loan number to the Set and return true
              uniqueLoanNumbers.add(loan.loan_no);
              return true;
            }
          });
        });
  
        this.dataSource.data = sblData;
  
        // Calculate sums and ratios based on the filtered data
        const sumPrincipal = sblData.reduce((acc, obj) => {
          acc.principal += parseFloat(obj.principal) || 0;
          acc.principal_bal += parseFloat(obj.principal_bal) || 0;
          return acc;
        }, { principal: 0, principal_bal: 0 });
  
        // Calculate ratios and other values using this.totalHoldOut
        this.rptBal = sumPrincipal.principal_bal - this.totalHoldOut;
        const percentage = `${((this.rptBal / 1214764186.16) * 100).toFixed(2)}%`;
      } else {
        // Handle case where sblData is empty
      }
    });
  }
  
 

  
  getUnimpairedCap(): void {
    this.get.getUnimpairedCapital((unimpairedCap) => {
        
        this.UnimpairedDate = unimpairedCap[0].date;
        this.unimpairedCap = unimpairedCap[0].impared_capital;
        
        this.sbl = (this.unimpairedCap * .25);
        this.internalSBL = (this.unimpairedCap * .20);

    })
  }



calculateLoanListSummary(loanList: Loan[]): any {
  const totalPrincipalBal = loanList.reduce((acc, loan) => acc + loan.principal_bal - this.finalHoldOut, 0);
  
  return {
    totalPrincipalBal,
    singleBorrowersLimit: 0, // Replace with the actual property for single borrower's limit
    availableLimit: 0
  };
}  



  scrollToUser(name: string) {
    const lowerCaseName = name.toLowerCase();
    const elements = document.querySelectorAll('[id]');
  
    for (const element of Array.from(elements)) {
      const elementId = element.id.toLowerCase();
  
      if (elementId.includes(lowerCaseName)) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        break; // Stop searching after the first match
      }
    }
  }
  
  


  // Function to Show the simulation Modal
  openSimulation() {
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
    this.dataService.setAvailBal(Avail);
    this.dataService.setTotalLoan(totalLoan)
  }

  generatePDF() {}
  

  // generatePDF(): void {
  //   const elementId = 'htmlData'; // Replace 'htmlData' with the ID of the element you want to convert to PDF
  //   const fileName = 'your-file-name.pdf'; // Replace 'your-file-name' with the desired file name

  //   this.pdfExportService.generatePDF(elementId, fileName);
  // }

  // public generatePDF(): void {
  //   const htmlDataElement = document.getElementById('htmlData');
  
  //   if (htmlDataElement) {
  //     const htmlContent = htmlDataElement.innerHTML;
  //     this.pdfExportService.generatePDF(htmlContent, 'output.pdf');
  //   } else {
  //     console.error("Element with ID 'htmlData' not found.");
  //   }
  // }
  




  
  

}
