import { Component, ViewChild, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FetchDataService } from 'src/app/services/fetch/fetch-data.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-orptransactions',
  templateUrl: './orptransactions.component.html',
  styleUrls: ['./orptransactions.component.scss']
})
export class ORPtransactionsComponent {

  dataSource = new MatTableDataSource<any>([]);

  dynamicColumns: any[] = [
    { columnDef: 'rp', header: 'RP' },
    { columnDef: 'rptype', header: 'RP Type' },
    { columnDef: 'nature_of_engagement', header: 'Nature of Engagement' },
    { columnDef: 'createddate', header: 'Date Created' },
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
  
    this.dataService.getORPT((ORPT) => {
      Swal.close(); // Close the loading alert
      if (ORPT) {
        this.dataSource.data = ORPT; // Set data directly
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      } else {
        console.warn('No audit logs found.');
      }
    });
  }

}
