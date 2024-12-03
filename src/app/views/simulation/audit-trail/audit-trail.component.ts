import { Component, ViewChild, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FetchDataService } from 'src/app/services/fetch/fetch-data.service';

import Swal from 'sweetalert2';
// Save CSV
import { CsvExportService } from './../../../services/data_extraction/csvexport/csvexport.service';
import { PdfExportService } from './../../../services/data_extraction/pdfexport/pdfexport.service';


@Component({
  selector: 'app-audit-trail',
  templateUrl: './audit-trail.component.html',
  styleUrls: ['./audit-trail.component.scss']
})
export class AuditTrailComponent implements OnInit {
  dataSource = new MatTableDataSource<any>([]);
  dynamicColumns: any[] = [
    { columnDef: 'session_id', header: 'Session ID' },
    { columnDef: 'activity', header: 'Activity' },
    { columnDef: 'user_id', header: 'Initiated By' },
    { columnDef: 'datetime_inserted', header: 'Date Inserted' },
  ];
  displayedColumns: string[] = this.dynamicColumns.map(column => column.columnDef);
  isLoading = true; // Loading state

  startDate: Date | null = null;
  endDate: Date | null = null;
  maxDate = new Date(); // Restrict to today and earlier
  
  dateFilter = (d: Date | null): boolean => {
    const today = new Date().setHours(0, 0, 0, 0);
    return d ? d.getTime() <= today : false;
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private csvExportService: CsvExportService,
    private pdfExportService: PdfExportService,
    private dataService: FetchDataService) {}

  ngOnInit() {
    // this.loadAuditLogs();
  }

  loadAuditLogs() {
    if (this.startDate && this.endDate) {
      Swal.fire({
        title: 'Loading...',
        html: 'Please wait while we fetch the data.',
        didOpen: () => {
          Swal.showLoading();
        }
      });
  
      this.dataService.getAuditLogs((auditLogs) => {
        Swal.close();
        if (auditLogs) {
          const startDateTime = new Date(this.startDate!).setHours(0, 0, 0, 0);
          const endDateTime = new Date(this.endDate!).setHours(23, 59, 59, 999);
  
          const filteredLogs = auditLogs.filter((log: any) => {
            const logDate = new Date(log.datetime_inserted).getTime();
            return logDate >= startDateTime && logDate <= endDateTime;
          });
  
          this.dataSource.data = filteredLogs;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.isLoading = false;
        } else {
          console.warn('No audit logs found.');
        }
      });
    } else {
      Swal.fire('Warning', 'Please select both start and end dates.', 'warning');
    }
  }


  

  downloadCSV(): void {
    const currentDate = new Date();
    let selectedDateFormatted: string = '';
    
    const formattedDate = selectedDateFormatted || currentDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
    const filename = `Audit_Logs_${formattedDate}.csv`;
    
    const data = this.dataSource.data.map(item => ({
      'SESSION ID': item.session_id,
      'ACTIVITY': item.activity,
      'USERNAME': item.user_id,
      'DATE INSERTED': item.datetime_inserted,
      'DATA': item.payload ? JSON.stringify(item.payload.request) : '' // Convert payload object to JSON string
    }));
  
    // Specify the columns to include in the CSV
    const columnsToInclude = ['SESSION ID', 'ACTIVITY', 'USERNAME', 'DATE INSERTED', 'DATA'];
  
    this.csvExportService.exportToCSV(data, filename, columnsToInclude);
  }

  // loadAuditLogs() {
  //   if (this.startDate && this.endDate) {
  //     Swal.fire({
  //       title: 'Loading...',
  //       html: 'Please wait while we fetch the data.',
  //       didOpen: () => {
  //         Swal.showLoading();
  //       }
  //     });

  //     const formattedStartDate = this.startDate.toISOString();
  //     const formattedEndDate = this.endDate.toISOString();

  //     this.dataService.getAuditLogsByDateRange(formattedStartDate, formattedEndDate).subscribe({
  //       next: (auditLogs) => {
  //         Swal.close();
  //         this.dataSource.data = auditLogs || [];
  //         this.dataSource.paginator = this.paginator;
  //         this.dataSource.sort = this.sort;
  //         this.isLoading = false;
  //       },
  //       error: (err) => {
  //         Swal.close();
  //         console.error('Error loading data:', err);
  //       }
  //     });
  //   }
  // }

  // loadAuditLogs() {
  //   Swal.fire({
  //     title: 'Loading...',
  //     html: 'Please wait while we fetch the data.',
  //     didOpen: () => {
  //       Swal.showLoading();
  //     }
  //   });
  
  //   this.dataService.getAuditLogs((auditLogs) => {
  //     Swal.close(); // Close the loading alert
  //     if (auditLogs) {
  //       this.dataSource.data = auditLogs; // Set data directly
  //       this.dataSource.paginator = this.paginator;
  //       this.dataSource.sort = this.sort;
  //     } else {
  //       console.warn('No audit logs found.');
  //     }
  //   });
  // }
  


}
