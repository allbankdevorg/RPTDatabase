import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { FetchDataService } from 'src/app/services/fetch/fetch-data.service';
import { saveAs } from 'file-saver-es';

export interface logDatas {
  aff_com_cis_number: number;
  aff_com_account_name: string;
  aff_com_company_name: string,
  directorCount: string;
  manager: string;
  date_inserted: string;
  view: string;
}

@Component({
  selector: 'app-audit-logs',
  templateUrl: './audit-logs.component.html',
  styleUrls: ['./audit-logs.component.scss']
})
export class AuditLogsComponent implements OnInit, AfterViewInit {
  logsData: any = [];
  logsDataSource = new MatTableDataSource<logDatas>();
  columnsToDisplay: string[] = ['user_id', 'activity', 'datetime_inserted'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.logsDataSource.paginator = this.paginator;
    this.logsDataSource.sort = this.sort;

    this.sort.sort({
      id: 'datetime_inserted',
      start: 'desc',
      disableClear: false
    });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim().toLowerCase();
    this.logsDataSource.filter = filterValue;
  }

  constructor(private get: FetchDataService) {}

  ngOnInit() {
    this.updateTableData();
  }

  updateTableData(): void {
    this.get.getAuditLogs((auditLogs) => {
      if (auditLogs) {
        // console.log(auditLogs);
        this.logsDataSource.data = auditLogs;
        // this.logsDataSource.sort = this.sort;
      } else {
        console.error('No audit logs received');
      }
    });
  }

  exportToCSV(): void {
    const csvData = this.convertToCSV(this.logsDataSource.data);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, 'audit_logs.csv');
  }

  private convertToCSV(data: any[]): string {
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(item => headers.map(header => item[header]).join(','))
    ];
    return csvContent.join('\n');
  }

  downloadCSV(): void {
    this.exportToCSV();
  }
}
