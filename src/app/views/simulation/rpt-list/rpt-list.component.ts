import { Component, AfterViewInit, ViewChild, NgZone, ChangeDetectionStrategy, ChangeDetectorRef, QueryList, ElementRef, Renderer2 } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

// Import for Simulation Modal
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { RPTSimulationModalComponent } from 'src/app/modal-dialog/rpt-simulation-modal/rpt-simulation-modal.component';

//Import for API Function
import { FetchDataService } from 'src/app/services/fetch/fetch-data.service';

export interface RPTlist_model {
  loantype: string;
  cis_no: number;
  pn_no: number;
  borrower: string;
  orig_loan: number;
  O_blnc: number;
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
  unimpairedCap: number = 1214764186.16;   //Unimpaired Capital
  definedRptRatio: number = 50;     //Pre defined Percentage
  availRptRatio: any;
  approvedCapital: any;        // => the Loan approved Limit
  
  displayedColumns: string[] = ['cis_no', 'loan_no', 'name', 'principal', 'principal_bal', 'loan_security', 
  'DepositHO', 'netBal', 'tran_date', 'terms', 'purpose', 'intRate'];
  dataSource = new MatTableDataSource<any>([]);
  ToDisplay: string[] = [];

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim().toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  
    // Calculate sums and ratios based on the filtered data
    const filteredData = this.dataSource.filteredData;
    const sumPrincipal = filteredData.reduce((acc, obj) => {
      acc.principal += parseFloat(obj.principal) || 0;
      acc.principal_bal += parseFloat(obj.principal_bal) || 0;
      return acc;
    }, { principal: 0, principal_bal: 0 });
  
    this.rptBal = sumPrincipal.principal;
    const percentage = `${(sumPrincipal.principal / 1214764186.16 * 100).toFixed(2)}%`;
    this.rptRatio = percentage;
    this.subtlOL = sumPrincipal.principal;
    this.subtlOB = sumPrincipal.principal_bal;
    this.ttlRPTOL = sumPrincipal.principal;
    this.ttlRPTOB = sumPrincipal.principal_bal;
  }

  constructor(
    private get: FetchDataService,
    public _dialog: MatDialog,) {

    }

  
  ngOnInit() {
    this.updateTableData();
  }

  updateTableData(): void {
    this.get.getPNData((PNData) => {
      if (PNData) {
        // Use reduce to calculate the sum of "principal" values
        const sumPrincipal = PNData.reduce((acc, obj) => {
          acc.principal += parseFloat(obj.principal) || 0;
          acc.principal_bal += parseFloat(obj.principal_bal) || 0;
          return acc;
        }, { principal: 0, principal_bal: 0 });

        this.rptBal = sumPrincipal.principal;
        const percentage = `${((sumPrincipal.principal / 1214764186.16) * 100).toFixed(2)}`;
        this.rptRatio = percentage;
        this.subtlOL = sumPrincipal.principal;
        this.subtlOB = sumPrincipal.principal_bal;
        this.ttlRPTOL = sumPrincipal.principal;
        this.ttlRPTOB = sumPrincipal.principal_bal;
        this.dataSource.data = PNData;
        this.availRptRatio = `${(this.definedRptRatio - parseFloat(percentage.replace('%', ''))).toFixed(2)}%`;
        this.approvedCapital = this.unimpairedCap * 0.5;
        
        
        this.availBal = this.approvedCapital - sumPrincipal.principal;
      } else {

      }
    });
  }


    // Function to Show the simulation Modal
    openSimulation() {
      const dialogRef = this._dialog.open(RPTSimulationModalComponent, {
        width: '50%', // Set the width as per your requirement
        // Other MatDialog options can be specified here
      });
      dialogRef.afterClosed().subscribe({
        next: (val) => {
          if (val) {
            // this.updateTableData();
          }
        },
      });
    }
}


