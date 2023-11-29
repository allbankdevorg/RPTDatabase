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

// Functions Import
import {getAffiliatesCompany, getAffiliatesDirectors, getManagingCompany} from '../../../functions-files/getFunctions';
import {createAffil} from '../../../functions-files/addAffiliates.js';
import {deleteAffiliates} from '../../../functions-files/delFunctions';

// File Saver
import { saveAs } from 'file-saver';


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
  affForm: FormGroup;
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
  }


  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.affDataSource.filter = filterValue;
  }

  
  updateDisplayedData() {
    // Implement logic to update displayed data based on current page
    // For example, slice your data array to display only the relevant items for the current page
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayedData = this.affDataSource.data.slice(startIndex, endIndex);
  }

  constructor(private router: Router,
    private formBuilder: FormBuilder, 
    private http: HttpClient,
    private changeDetectorRef: ChangeDetectorRef,
    private ngZone: NgZone,
    private sharedService: SharedservicesService,
    private renderer: Renderer2,
    private el: ElementRef) {
this.affForm = this.formBuilder.group({
affilCisNumberM: ['', [Validators.required]],
accountName: ['', [Validators.required]],
companyName: ['', [Validators.required]],
commandControl: ['', [Validators.required]]
});
// Initialize the commandGroups array based on your data
this.initializeCommandGroups();
}


ngOnInit() {
this.updateTableData();
console.log(this.displayedData)
}


//All functions are below
updateTableData() {
getAffiliatesCompany((affilComp) => {
if (affilComp) {
// Process the data to count directors related to each company
const companiesWithDirectors = affilComp.map(company => {
const directors = company.directors || []; // Ensure there is a directors array
const directorCount = directors.length;
// console.log(directorCount);
return { ...company, directorCount, directors };
});

// Set the data source for your MatTable
this.affDataSource.data = companiesWithDirectors;
// console.log(this.affDataSource)
}
});

getAffiliatesCompany((affilComp) => {
if (affilComp) {
// Fetch director data
getAffiliatesDirectors((affilDirData) => {
// Process the data to count directors related to each company
const affiliatesWithDirectors: DData[] = affilComp.map(company => {
  const affiliatesDirectors = affilDirData.filter(director => director.com_related === company.aff_com_account_name);
  return { ...company, directorCount: affiliatesDirectors.length, directors: affiliatesDirectors };
});

// Set the data source for your MatTable
console.log(affiliatesWithDirectors)
this.affilDdataSource.data = affiliatesWithDirectors;
// Trigger change detection
this.changeDetectorRef.detectChanges();
});
}
});

getManagingCompany((mngComp) => {
this.compData = mngComp;
this.commandGroups = []; // Clear the existing commandGroups
console.log(this.compData);

if (mngComp) {
const data = mngComp;
console.log(data);
data.forEach(item => {
// Create a commandGroup item with value and viewValue
const commandGroup = {
  value: item.aff_com_cis_number,
  viewValue: item.aff_com_company_name,
};

// Add the command group to the array
this.commandGroups.push(commandGroup);
});
}
// const data = this.compData.result[0].Data;
// console.log(mngComp);
})


// Fetching of Directors and Related Interest

}



onSubmit() {
if (this.affForm.valid) {
const formData = this.affForm.value;
console.log(formData);
// Call the JavaScript function with form data
createAffil(formData, this.moduleV); // Pass the entire formData object
}
}

onButtonClick(module: any) {
console.log('Add Data');
console.log(module);
this.moduleV = module;
}

onRowClick(row: any, event: Event) {
event.stopPropagation();
// Capture the selected data and navigate to another component with it
const directorId = row.aff_com_cis_number; // Extract the ID from the clicked row
const companyName = row.aff_com_company_name;

this.sharedService.setCompName(companyName);
this.sharedService.setDirectorId(directorId);
this.sharedService.setCompanyCis(companyName);
console.log(directorId);
console.log(companyName);
console.log('row has been clicked');
// 
console.log('row has been clicked');
console.log('Clicked row data:', row);
this.router.navigate(['/rp-affiliates/pac', directorId]);
}


/// This method initializes the commandGroups array
initializeCommandGroups() {

}

editaffiliates(row: any) {
console.log(row);
console.log('Show Modal');
console.log("success: Login Successfully");
const modal = this.editAffilModal.nativeElement;

if (modal) {
this.renderer.addClass(modal, 'show');
this.renderer.setStyle(modal, 'display', 'block');
}
}

onModalClose() {
console.log('Show Modal');
console.log("success: Login Successfully");
const modal = this.editAffilModal.nativeElement;

if (modal) {
this.renderer.addClass(modal, 'hide');
this.renderer.setStyle(modal, 'display', 'none');
}
}

delAffiliates(row: any, aff_com_cis_number: any, event: Event) {
event.stopPropagation();
// deleteRelationship()
console.log(row);
console.log(aff_com_cis_number);
// console.log(comCIS);
deleteAffiliates((dosriId) => {

})
}



editAffil(row: any, event: Event) {
event.stopPropagation();
this.editAffilvisible = !this.editAffilvisible;
console.log(row);
console.log(this.commandGroups);
const selectedManager = row.managing_company;
console.log('Selected Manager:', selectedManager);
// Check if the selectedManager exists in the commandGroups
const isValidManager = this.commandGroups.some(group => {
console.log('Group Value:', group.value);
return group.value === selectedManager;
});

console.log('IsValidManager:', isValidManager);



// Set the value only if it's a valid manager
if (isValidManager) {
this.affForm.get('commandControl')?.setValue(selectedManager);
console.log(this.affForm);
} else {
// Optionally, handle the case where the manager is not valid
console.error('Invalid manager:', selectedManager);
}

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

}
