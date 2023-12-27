import { AfterViewInit, Component, ViewChild, NgZone, ChangeDetectionStrategy, ChangeDetectorRef, ElementRef, Renderer2 } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import {animate, state, style, transition, trigger} from '@angular/animations'
import {NgFor, NgIf} from '@angular/common';

import { MatOption } from '@angular/material/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import {FormArray, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Router } from '@angular/router';

import { Injectable } from '@angular/core';
import axios, { AxiosRequestConfig } from 'axios';

// Services
import { SharedservicesService } from './../dataintegration/sharedservices.service';
import {AffiliatesService} from '../../../services/affiliates/affiliates.service'; //Service to set the value of the DirCIS and buttonID in adding RI of Directors
import {delAffilComp} from '../../../functions-files/delete/deleteAPI.js';
// Functions Import
import {getAffiliatesCompany, getAffiliatesDirectors, getManagingCompany} from '../../../functions-files/getFunctions';
import {createAffil} from '../../../functions-files/add/postAPI';
import {deleteAffiliates} from '../../../functions-files/delFunctions';

// File Saver
import { saveAs } from 'file-saver-es';
import { FetchDataService } from 'src/app/services/fetch/fetch-data.service';

// Audit Trail
import { AuditTrailService } from '../../../services/auditTrail/audit-trail.service';
import {AuditTrail} from '../../../model/audit-trail.model';



import { AffiliatesModalComponent } from 'src/app/modal-dialog/affiliates-modal/affiliates-modal.component';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';

export interface Child {
  name: string;
}


export interface affiliatesData {
  aff_com_cis_number: number;
  aff_com_account_name: string;
  aff_com_company_name: string,
  directorCount
  manager: string;
  date_inserted: String,
  view: string,
}

export interface DData {
  dir_cisnumber: number;
  fname: string;
  mname: string,
  lname: string,
  fullname: string,
  // position: String,
  view: string,
}

interface Command {
  value: string;
  viewValue: string;
}

interface commandGroup {
  disabled?: boolean;
  name: string;
  command: Command[];
}

@Component({
  selector: 'app-affiliates',
  templateUrl: './affiliates.component.html',
  styleUrls: ['./affiliates.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AffiliatesComponent implements AfterViewInit {
  sharedData: string | any;
  
  editAffilForm!: FormGroup;
  compData: any = [];
  moduleV: any;
  // commandGroups: commandGroup[] = []; // Moved initialization here
  commandGroups: any[] = [];
  //  displayedColumns: string[] = ['bn', 'Nodirectors', 'LDUpdated', 'view'];
  // Modals
  public editAffilvisible = false;
  editAffilData: any = [];
  pageSize = 5;  // Set the default page size
  currentPage = 0;  // Initialize the current page
  selectedItem: any;

  headers: any[] = ['Full Name', 'Company', 'Position', "Mother's Name", "Father's Name", "Name of Siblings", 'Name of Spouse', 'Name of Children', 
  'Name of Mother-In-Law', 'Name of Father-In-Law', 'Name of Stepchildren', 'Name of Son/Daughter-In-Law', 'Grandparents', 'Grandparents-in-law',
  'Sisters-in-law', 'Brothers-in-law', 'Grandchildren', 'Grandchildren-in-law']

  displayedData: affiliatesData[] = [];
  affDataSource = new MatTableDataSource<affiliatesData>([]);
  ToDisplay: string[] = [];
  columnsToDisplay: string[] = ['expand', 'aff_com_cis_number', 'aff_com_account_name', 'aff_com_company_name', 'directorCount', 'date_inserted', 'view'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay,];
  expandedElement: affiliatesData | null = null;

  DdisplayedColumns: string[] = ['aff_com_cis_number', 'fullname', 'aff_com_company_name'];
  affilDdataSource = new MatTableDataSource<DData>([]);


  @ViewChild('editAffilModal') editAffilModal!: ElementRef;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  

  ngAfterViewInit() {
    this.affDataSource.paginator = this.paginator;
    this.affDataSource.sort = this.sort;

    this.sort.sort({
      id: 'date_inserted',
      start: 'desc',
      disableClear: false
    });
  }


  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.affDataSource.filter = filterValue;
  }


  constructor(private router: Router,
    public _dialog: MatDialog,
    private formBuilder: FormBuilder, 
    private http: HttpClient,
    private changeDetectorRef: ChangeDetectorRef,
    private ngZone: NgZone,
    private sharedService: SharedservicesService,
    private dataService: AffiliatesService,
    private renderer: Renderer2,
    private el: ElementRef,
    private get: FetchDataService,
    private auditTrailService: AuditTrailService) {

// Initialize the commandGroups array based on your data
this.initializeCommandGroups();
}


ngOnInit() {
this.updateTableData();
// console.log(this.displayedData)
}



//All functions are below

updateTableData() {
  // Fetching data for Affiliates with Officers
  this.get.getAffiliatesCompany((affilCompOff) => {
    if (affilCompOff) {
      // Process the data to count officers related to each company
      const companiesWithOfficers = affilCompOff.map(company => {
        const directors = company.directors || [];
        const directorCount = directors.length;
        return { ...company, directorCount, directors };
      });

      // Set the data source for your MatTable
      this.affDataSource.data = companiesWithOfficers;
      // console.log(companiesWithOfficers);
    }
  });

  // Fetching managing companies
  this.get.getManagingCompany((mngComp) => {
    this.compData = mngComp;
    this.commandGroups = [];

    if (mngComp) {
      const data = mngComp;
      data.forEach(item => {
        const commandGroup = {
          value: item.aff_com_cis_number,
          viewValue: item.aff_com_company_name,
        };
        this.commandGroups.push(commandGroup);
      });
    }
  });
}




onButtonClick(module: any) {
// console.log('Add Data');
// console.log(module);
this.moduleV = module;

this.dataService.setmoduleV(module);

}

onRowClick(row: any, event: Event) {
event.stopPropagation();
// Capture the selected data and navigate to another component with it
const directorId = row.aff_com_cis_number; // Extract the ID from the clicked row
const companyName = row.aff_com_company_name;


this.dataService.setCompCIS(directorId);

this.sharedService.setCompName(companyName);
this.sharedService.setDirectorId(directorId);
this.sharedService.setCompanyCis(companyName);
this.router.navigate(['/arp/pac', directorId]);
}


/// This method initializes the commandGroups array
initializeCommandGroups() {

}

editaffiliates(row: any) {
const modal = this.editAffilModal.nativeElement;

if (modal) {
this.renderer.addClass(modal, 'show');
this.renderer.setStyle(modal, 'display', 'block');
}
}

onModalClose() {
// console.log('Show Modal');
// console.log("success: Login Successfully");
const modal = this.editAffilModal.nativeElement;

if (modal) {
this.renderer.addClass(modal, 'hide');
this.renderer.setStyle(modal, 'display', 'none');
}
}

delAffiliates(row: any, aff_com_cis_number: any, event: Event) {
event.stopPropagation();
const cis_id = row.aff_com_cis_number
event.stopPropagation();

delAffilComp(cis_id)
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



editAffil(row: any, event: Event) {
event.stopPropagation();
this.editAffilvisible = !this.editAffilvisible;
// console.log(row);
// console.log(this.commandGroups);
const selectedManager = row.managing_company;
// console.log('Selected Manager:', selectedManager);
// Check if the selectedManager exists in the commandGroups
const isValidManager = this.commandGroups.some(group => {
// console.log('Group Value:', group.value);
return group.value === selectedManager;
});



this.editAffilData = {
com_cis_number: row.aff_com_cis_number,
com_account_name: row.aff_com_account_name,
com_company_name: row.aff_com_company_name,
// Add other properties as needed
};

}

closeEditAffil() {
this.editAffilvisible = !this.editAffilvisible;
}

handleChange(event: any) {
this.editAffilvisible = event;
}



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







// Show Modal Form
openAddEditEmpForm() {
  const dialogRef = this._dialog.open(AffiliatesModalComponent);
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
  // console.log(data);
  const dialogRef = this._dialog.open(AffiliatesModalComponent, {
    data,    
  });

  dialogRef.afterClosed().subscribe({
    next: (val) => {
      if (val) {
        // this.getEmployeeList();
        // console.log("Successs");
      }
    },
  });
}







  // Start of Functions for Audit Trail
  logAction(actionType: string, details: string, success: boolean, page: string, errorMessage?: string) {
    const auditTrailEntry = this.createAuditTrailEntry(actionType, details, success, page, errorMessage);
    this.logAuditTrail(auditTrailEntry);
  }
  
  
  
  private createAuditTrailEntry(actionType: string, details: string, success: boolean, page: string, errorMessage?: string): AuditTrail {
    return {
      userId: 'current_user_id',
      userName: 'Current_user',
      timestamp: new Date(),
      actionType,
      details,
      success,
      page, // Include the page information
      errorMessage: errorMessage || '', // Optional: Include error message if available
    };
  }
  
  
  private logAuditTrail(auditTrailEntry: AuditTrail) {
    this.auditTrailService.logAuditTrail(auditTrailEntry).subscribe(() => {
      // console.log('Audit trail entry logged successfully.');
    });
    // console.log('Audit trail entry logged successfully.');
  }
}
