import { Component, AfterViewInit, ViewChild, NgZone, ChangeDetectionStrategy, ChangeDetectorRef, QueryList, ElementRef, Renderer2 } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import { MatSort } from '@angular/material/sort';

// Import for Simulation Modal
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { RPTSimulationModalComponent } from 'src/app/modal-dialog/rpt-simulation-modal/rpt-simulation-modal.component';
import {HoldoutAllocationModalComponent} from '../../../modal-dialog/holdout-allocation-modal/holdout-allocation-modal.component'

//Import for API Function
import { FetchDataService } from 'src/app/services/fetch/fetch-data.service';
import { HoldOutValue } from '../../../functions-files/add/postAPI';
import { SimulatedDataService } from '../../../services/simulatedDataService/simulated-data-service.service';

// Save CSV
import { CsvExportService } from './../../../services/data_extraction/csvexport/csvexport.service';

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

  simulationPerformed: boolean = false;
  temporaryLoans?: Loan[];

  events: string[] = [];

  //Variable to hold the selected date
  selectedDate: Date | null = null;

  // Variable to determine whether to display real-time or historical data
  displayHistoricalData: boolean = false;

  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    this.events.push(`${type}: ${event.value}`);
    console.log(event.value);
  }
  
  displayedColumns: string[] = ['loan_no', 'cis_no', 'name', 'principal', 'principal_bal', 'loan_security', 
  'deposit_holdout', 'netBal', 'date_granted', 'terms', 'purpose', 'int_rate'];
  dataSource = new MatTableDataSource<any>([]);
  ToDisplay: string[] = [];

  
  @ViewChild(MatSort) sort!: MatSort;


  constructor(
    private get: FetchDataService,
    public _dialog: MatDialog,
    private simulatedDataService: SimulatedDataService,
    private csvExportService: CsvExportService) {
       
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
    this.simulationPerformed = this.simulatedDataService.isSimulationPerformed();
    // this.pushTemporaryLoans();
  }



  updateTableData(): void {
    let dateString: string;
    const currentDate = new Date();
    let date = currentDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
    console.log(date); // Output: "02/07/2024" // Initialize to today's date
    
    if (this.selectedDate !== null) {
      date = this.selectedDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
    } else {
      date = currentDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
    }
    
    // Convert the dateString back to a Date object
    // 
    this.get.getPNData(date, (PNData) => {
      if (PNData) {
        const uniqueCisNumbers = [...new Set(PNData.map((entry) => entry.cis_no))];
        
        uniqueCisNumbers.forEach((cisNumber) => {
          HoldOutValue(cisNumber)
            .then((response) => {
              this.calculateactualData(PNData);
            })
            .catch((error) => {
              // Handle error
            });
        });
  
        // Push temporary loan data only once outside the forEach loop
        const tempData = PNData.slice(); // Create a shallow copy of PNData
        if (this.temporaryLoans) {
          tempData.push(...this.temporaryLoans);
          tempData.forEach((loan) => {
            loan.netBal = (loan.principal_bal || 0) - (loan.deposit_holdout || 0);
          });
            this.calculateSimulatedData(tempData); // Spread the temporary loans array to push each loan individually
           // Only calculate simulated data if temporary loan data is pushed
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
  
    // Calculate rptRatio only if unimpairedCap is not zero
    if (this.unimpairedCap !== 0) {
      const percentage = `${((this.rptBal / this.unimpairedCap) * 100).toFixed(2)}%`;
      this.rptRatio = percentage;
      this.availRptRatio = `${(this.definedRptRatio - parseFloat(percentage.replace('%', ''))).toFixed(2)}%`;
    } else {
      this.rptRatio = 'N/A';
      this.availRptRatio = 'N/A';
    }
  
    this.ttlRPTOL = sumPrincipal.principal;
    this.ttlRPTOB = sumPrincipal.principal_bal;
    this.approvedCapital = this.unimpairedCap * 0.5;
    
    // Recalculate available balance only if approvedCapital is not zero
    if (this.approvedCapital !== 0) {
      this.availBal = this.approvedCapital - this.rptBal;
    } else {
      this.availBal = 0;
    }
  }
  
  calculateSimulatedData(tempData: any[]): void {
    // Calculate sums and ratios based on the filtered data
    const sumPrincipal = tempData.reduce((acc, obj) => {
      acc.principal += parseFloat(obj.principal) || 0;
      acc.principal_bal += parseFloat(obj.principal_bal) || 0;
      acc.deposit_holdout += parseFloat(obj.deposit_holdout) || 0;
      return acc;
    }, { principal: 0, principal_bal: 0, deposit_holdout: 0 });
  
    // Update simulated balance
    this.SimulatedrptBal = sumPrincipal.principal_bal - sumPrincipal.deposit_holdout;
  
    // Calculate ratios only if unimpairedCap is not zero
    if (this.unimpairedCap !== 0) {
      const percentage = `${((this.SimulatedrptBal / this.unimpairedCap) * 100).toFixed(2)}%`;
      this.SimulatedrptRatio = percentage;
      this.SimulatedavailRptRatio = `${(this.definedRptRatio - parseFloat(percentage.replace('%', ''))).toFixed(2)}%`;
    } else {
      this.SimulatedrptRatio = 'N/A';
      this.SimulatedavailRptRatio = 'N/A';
    }
  
    this.SimulatedttlRPTOL = sumPrincipal.principal;
    this.SimulatedttlRPTOB = sumPrincipal.principal_bal;
    this.SimulatedapprovedCapital = this.unimpairedCap * 0.5;
    
    // Recalculate available balance only if SimulatedapprovedCapital is not zero
    if (this.SimulatedapprovedCapital !== 0) {
      this.updateSimulatedBalances();
    } else {
      this.SimulatedavailBal = 0;
    }
  }
  
  updateSimulatedBalances(): void {
    // Recalculate available balance after adding temporary loan data only if SimulatedrptBal is not zero
    if (this.SimulatedrptBal !== 0) {
      const simulatedavailBal = Math.max(0, this.SimulatedapprovedCapital - this.SimulatedrptBal);
      
      // Update available balance
      this.SimulatedavailBal = simulatedavailBal;
    
    } else {
      this.SimulatedavailBal = 0;
    }
  }
  
  




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

    downloadCSV(): void {
      const currentDate = new Date();
      let selectedDateFormatted: string = '';
      
      if (this.selectedDate) {
        selectedDateFormatted = this.selectedDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
      }
      
      console.log(selectedDateFormatted);
      const formattedDate = selectedDateFormatted || currentDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
      const filename = `RPT_List_${formattedDate}.csv`;
      console.log(filename);
    
      const data = this.dataSource.data.map(item => ({
        'CIS NUMBER': item.cis_no,
        'PN/LOAN NUMBER': item.loan_no,
        'BORROWER/GROUP': item.name,
        'ORIGINAL LOAN': item.principal,
        'OUTSTANDING BALANCE': item.principal_bal,
        'DEPOSIT HOLDOUT': item.deposit_holdout,
        'NET BALANCE': item.netBal || '', // If netBal is undefined, make it blank
        'LOAN SECURITY': item.loan_security,
        'TRANSACTION DATE': item.date_granted ? new Date(item.date_granted).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) : '', // Format date as MM/dd/yyyy if not blank
      }));
    
      // Specify the columns to include in the CSV
      const columnsToInclude = ['CIS NUMBER', 'PN/LOAN NUMBER', 'BORROWER/GROUP', 'ORIGINAL LOAN', 'OUTSTANDING BALANCE', 'DEPOSIT HOLDOUT', 'NET BALANCE', 'LOAN SECURITY', 'TRANSACTION DATE'];
    
      this.csvExportService.exportToCSV(data, filename, columnsToInclude);
    }
    
    
    
    // Event handler for date selection
    onDateSelected(event: MatDatepickerInputEvent<Date>) {
      if (event.value) {
        this.selectedDate = event.value;
        // Determine whether to display historical data based on the selected date
        this.displayHistoricalData = this.selectedDate <= new Date();
        // Update the data source for the DataTable
        this.updateTableData();
      }
    }

    
    
    
    


    resetSimulation(): void {
      this.simulationPerformed = false;   
      this.simulatedDataService.resetSimulationPerformed();
      this.ngOnInit();
    }
}


