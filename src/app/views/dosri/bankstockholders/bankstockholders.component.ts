import { Component, AfterViewInit, NgZone, ViewChild, ChangeDetectorRef} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { AbstractControl, FormControl, ValidationErrors, ValidatorFn, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';

// Functions Import
import {updateShares} from '../../../functions-files/updateFunctions'

import {delStockholder} from '../../../functions-files/delete/deleteAPI.js';
//Import for Function
import { FetchDataService } from 'src/app/services/fetch/fetch-data.service';


// For Modal
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { StockholdersModalComponent } from 'src/app/modal-dialog/stockholders-modal/stockholders-modal.component';

// Audit Trail
import { AuditTrailService } from '../../../services/auditTrail/audit-trail.service';

// For Exporting to CSV and PDF
import { CsvExportService } from './../../../services/data_extraction/csvexport/csvexport.service';
import { PdfExportService } from './../../../services/data_extraction/pdfexport/pdfexport.service';


export interface Data {
  fullname: string;
  company: string,
  position: String,
  shares: String,
  action: string,
}


@Component({
  selector: 'app-bankstockholders',
  templateUrl: './bankstockholders.component.html',
  styleUrls: ['./bankstockholders.component.scss']
})
export class BankstockholdersComponent {

  sharedData: string | any;

  displayedColumns: string[] = ['name', 'shares', 'amount', 'percentage', 'date_insert', 'action'];
  displayedColumns1: string[] = ['name'];
  dataSource = new MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  constructor(private router: Router,
    public _dialog: MatDialog,  
    private formBuilder: FormBuilder, 
    private http: HttpClient, 
    private changeDetectorRef: ChangeDetectorRef,
    private ngZone: NgZone,
    private get: FetchDataService,
    private auditTrailService: AuditTrailService,
    private pdfExportService: PdfExportService,
    private csvExportService: CsvExportService,)
    {   
}

  

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.sort.sort({
      id: 'date_insert',
      start: 'desc',
      disableClear: false
    });
  }



  ngOnInit() {
    this.updateTableData();
  }


  // Functions
  onRowClick(row: any) {
    // Capture the selected data and navigate to another component with it
    // this.router.navigate(['/details', row.id]);
    // this.router.navigate(['/dri/directorsrelated', row.bn]);
  }


  updateTableData(): void {
    this.get.getStckHolders((stckHldrs) => {
      if (stckHldrs) {
        this.dataSource.data = stckHldrs;
      } else {
        
      }
    });
  }



  downloadCSV(): void {
    const currentDate = new Date();
    let selectedDateFormatted: string = '';
    
    
    const formattedDate = selectedDateFormatted || currentDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
    const filename = `BankStockholders.csv`;
   
    const data = this.dataSource.data.map(item => {
      // Format amount to currency
      const formattedShares = item.shares.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' }) // Remove currency sign
      const formattedAmount = item.amount.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' }) // Remove currency sign

      return {
        'Company Name': item.name,
        'Shares': formattedShares,
        'Total Amount': formattedAmount,
        'Percentage': item.percentage + '%',
        'Date Added': item.date_insert ? new Date(item.date_insert).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) : '',
      };
    });
  
    // Specify the columns to include in the CSV
    const columnsToInclude = [
      'Company Name', 'Shares', 'Total Amount', 'Percentage', 'Date Added'];
    this.csvExportService.BankStockHoldersToCSV(data, filename, columnsToInclude);
  }

  
  
  
  generatePDF(): void {
    const currentDate = new Date();
    let selectedDateFormatted: string = '';
  
    const formattedDate = selectedDateFormatted || currentDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
    const filename = `BankStockholders.pdf`;
    const headerText = formattedDate;
  
    const data = this.dataSource.data.map(item => {
      // Format amount to currency
      const formattedShares = item.shares.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' }).replace(/^(\D+)/, ''); // Remove currency sign
      const formattedAmount = item.amount.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' }).replace(/^(\D+)/, ''); // Remove currency sign

      return {
        'Company Name': item.name,
        'Shares': formattedShares,
        'Total Amount': formattedAmount,
        'Percentage': item.percentage + '%',
        'Date Added': item.date_insert ? new Date(item.date_insert).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) : '',
      };
    });
    
   
    const columnsToInclude = [
      'Company Name', 'Shares', 'Total Amount', 'Percentage', 'Date Added'
    ];
    this.pdfExportService.generateBankStockholderPDF(data, filename, columnsToInclude, headerText);
  }
  
  





  openAddEditForm() {
    const dialogRef = this._dialog.open(StockholdersModalComponent);
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.updateTableData();
        }
      },
    });
  }
  
  openEditForm(data: any, event: any) {
    event.stopPropagation();
    const dialogRef = this._dialog.open(StockholdersModalComponent, {
      data,    
    });
  
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.updateTableData();
        }
      },
    });
  }


  delStockholders(element: any, aff_com_cis_number: any, event: Event) {
    event.stopPropagation();
    const cis_id = element.cis_number;
    
    console.table(element)
    const session = localStorage.getItem('sessionID')?.replaceAll("\"","");
    const userID = localStorage.getItem('userID')?.replaceAll("\"","");
    
    delStockholder(element, session, userID)
      .then((response) => {
        this.ngOnInit();
      })
      .catch((error) => {
        // Swal.fire({
        //   icon: 'error',
        //   title: 'No CIS Found!',
        //   // text: 'Invalid username or password',
        // });
      })
  }
  

}