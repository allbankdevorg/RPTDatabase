import { AfterViewInit, Component, ViewChild, NgZone, ChangeDetectionStrategy, ChangeDetectorRef, ElementRef, Renderer2 } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import {animate, state, style, transition, trigger} from '@angular/animations'

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';


// Services
import { SharedservicesService } from '../../arp/dataintegration/sharedservices.service';

// Functions Import
import { FetchDataService } from 'src/app/services/fetch/fetch-data.service';

// File Saver
import { saveAs } from 'file-saver-es';

export interface logDatas {
  aff_com_cis_number: number;
  aff_com_account_name: string;
  aff_com_company_name: string,
  directorCount
  manager: string;
  date_inserted: String,
  view: string,
}


@Component({
  selector: 'app-audit-logs',
  templateUrl: './audit-logs.component.html',
  styleUrls: ['./audit-logs.component.scss']
})
export class AuditLogsComponent {
  logsData: any = [];

  displayedData: logDatas[] = [];
  logsDataSource = new MatTableDataSource<logDatas>([]);
  ToDisplay: string[] = [];
  columnsToDisplay: string[] = ['date_inserted', 'action_name', 'user_name'];
 

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  ngAfterViewInit() {
    this.logsDataSource.paginator = this.paginator;
    this.logsDataSource.sort = this.sort;
  }


  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.logsDataSource.filter = filterValue;
  }


  constructor(private router: Router,
    private formBuilder: FormBuilder, 
    private http: HttpClient,
    private changeDetectorRef: ChangeDetectorRef,
    private ngZone: NgZone,
    private sharedService: SharedservicesService,
    private renderer: Renderer2,
    private el: ElementRef,
    private get: FetchDataService) {}

  
    ngOnInit() {
      this.updateTableData();
      console.log(this.displayedData)
      }


  //All functions are below
  updateTableData() {}




  // Functions for exporting to CSV
exportToCSV(data: any[], filename: string): void {
  const csvData = this.convertToCSV(data);
  const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
  saveAs(blob, filename);
  }
  
  private convertToCSV(data: any[]): string {
  // Implement logic to convert your data to CSV format
  // For simplicity, let's assume data is an array of objects
  
  const headers = Object.keys(data[0]);
  const csvContent = [
  headers.join(','),
  ...data.map(item => headers.map(header => item[header]).join(','))
  ];
  
  return csvContent.join('\n');
  }


  downloadCSV(): void {}

  
}
