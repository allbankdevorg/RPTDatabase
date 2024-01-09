import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';


// Import for Simulation Modal
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { SBLSimulationModalComponent } from 'src/app/modal-dialog/sbl-simulation-modal/sbl-simulation-modal.component';
import {HoldoutAllocationModalComponent} from '../../../modal-dialog/holdout-allocation-modal/holdout-allocation-modal.component'

//Import for API Function
import { FetchDataService } from 'src/app/services/fetch/fetch-data.service';
import { MatTableDataSource } from '@angular/material/table';

import { FilterPipe } from 'src/app/pipe/filterPipe/filter.pipe';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

// Service
import {SblLoanSimulateService} from '../../../services/sblLoanSimulate/sbl-loan-simulate.service'; //Service to set the value of the DirCIS and buttonID in adding RI of Directors

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
  unimpairedCap: number = 1214764186.16;   //Unimpaired Capital
  definedRptRatio: number = 50;     //Pre defined Percentage
  availRptRatio: any;
  approvedCapital: any;        // => the Loan approved Limit
  filterValue: string = '';
  sbl: any;
  internalSBL: any;
  net: any;
  available_net: any;
  available_bal: any;

  sblIsPositive: boolean = false;
sblIsNegative: boolean = false;

// Inside the method where you calculate the summary


  // account: any = {};

  dataSource = new MatTableDataSource<ResultItem>
  displayedColumns: string[] = ['loan_no', 'account_name', 'branch_name', 'loan_security', 'collateral', 'amount_granted', 'date_granted'
  , 'principal_bal', 'hold_out', 'net_holdout', 'payment_status'];


  
  result: ResultItem[] = [];

  constructor(
    private get: FetchDataService,
    public _dialog: MatDialog,
    private filterPipe: FilterPipe,
    private dataService: SblLoanSimulateService,      // => For SBL Simulation
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    ) {
      

    }

    searchTextLoanList = new FormControl<string | null>('');
    account: { loan_list: sblList[] } = { loan_list: [] };
  
  
    applyFilterLoanList(): void {
      const searchText = (this.searchTextLoanList.value || '').toLowerCase();
      this.account.loan_list = this.filterData(this.account.loan_list, searchText);
      
    }
  
    private filterData(data: sblList[], searchText: string): sblList[] {
      return data.filter(
        item => item.name.toLowerCase().includes(searchText) || 
                item.loan_no.toLowerCase().includes(searchText) ||
                // Add other properties as needed for filtering
                true
      );
    }

  ngOnInit() {
    // Additional initialization logic if needed
    this.updateTableData();
    this.sbl = (this.unimpairedCap * .25);
    this.internalSBL = (this.unimpairedCap * .20);
    this.availBal = this.internalSBL 
    // console.log(this.availBal);
    // this.updateTableDatas();
    // this.data = this.getFlattenedData(this.data); 
  }

  updateTableData(): void {
    this.get.getSBL((sblData) => {
      console.log(sblData)
      if (sblData) {
        // this.SBL = sblData;
        // console.log(this.SBL);
        this.dataSource.data = sblData;

        // console.log(this.dataSource.data);
        this.cdr.detectChanges();
        // if (Array.isArray(sblData)) {
        //   sblData.forEach((item) => {

        //     console.log(item);
            
        //   });
        // }
        // else{

        // }
        // Use reduce to calculate the sum of "principal" values
        // const sumPrincipal = sblData.reduce((acc, obj) => {
        //   acc.principal += parseFloat(obj.principal) || 0;
        //   acc.principal_bal += parseFloat(obj.principal_bal) || 0;
        //   return acc;
        // }, { principal: 0, principal_bal: 0 });

        // this.rptBal = sumPrincipal.principal_bal;
        // const percentage = `${((this.rptBal / 1214764186.16) * 100).toFixed(2)}%`;
        // this.rptRatio = percentage;
        // // this.subtlOL = sumPrincipal.principal;
        // // this.subtlOB = this.rptBal;
        // this.ttlRPTOL = sumPrincipal.principal;
        // this.ttlRPTOB = this.rptBal;
        // this.SBL = sblData;
        // console.log(this.SBL);
        // this.availRptRatio = `${(this.definedRptRatio - parseFloat(percentage.replace('%', ''))).toFixed(2)}%`;
        // this.approvedCapital = this.unimpairedCap * 0.5;
        
        // this.availBal = this.approvedCapital - this.rptBal;
      } else {

      }
    });
  }


  calculateLoanListSummary(loanList: Loan[]): any {
    const totalPrincipalBal = loanList.reduce((acc, loan) => acc + loan.principal_bal, 0);
    return {
      totalPrincipalBal,
      singleBorrowersLimit: 0, // Replace with the actual property for single borrower's limit
      availableLimit: 0
    };
  }

  // Sample





  // endof Sample

  // Function to scroll to the card with the specified name
  scrollToUser(name: string) {
    const element = document.getElementById(name);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center'});
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


  allocateHoldOut() {
    const dialogRef = this._dialog.open(HoldoutAllocationModalComponent, {
      width: '30%', // Set the width as per your requirement
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

  // Setting the Available Balance
  calculateAvailable(Avail: any) {
    // this.available_balance = Avail;

    this.dataService.setAvailBal(Avail);
    
  }
  






  
  

}
