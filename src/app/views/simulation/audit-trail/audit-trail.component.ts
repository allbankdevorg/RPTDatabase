import { Component, ViewChild, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FetchDataService } from 'src/app/services/fetch/fetch-data.service';

import Swal from 'sweetalert2';

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

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dataService: FetchDataService) {}

  ngOnInit() {
    this.loadAuditLogs();
  }

  loadAuditLogs() {
    Swal.fire({
      title: 'Loading...',
      html: 'Please wait while we fetch the data.',
      didOpen: () => {
        Swal.showLoading();
      }
    });
  
    this.dataService.getAuditLogs((auditLogs) => {
      Swal.close(); // Close the loading alert
      if (auditLogs) {
        this.dataSource.data = auditLogs; // Set data directly
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      } else {
        console.warn('No audit logs found.');
      }
    });
  }
  
}
