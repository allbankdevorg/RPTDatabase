import { Component, AfterViewInit, ViewChild, NgZone, ChangeDetectionStrategy, ChangeDetectorRef, ElementRef, Renderer2 } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { MatSort } from '@angular/material/sort';

import { Injectable } from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations'

// Services
import { DataTransferService } from '../../../services/data-transfer.service';
import { SharedservicesService } from './Services/sharedservices.service';
import {AffiliatesService} from '../../../services/affiliates/affiliates.service'; //Service to set the value of the DirCIS and buttonID in adding RI of Directors

// Functions Import
import {createBankOfficer, createBankOfficerRelationship, createAffil} from '../../../functions-files/add/postAPI';
import {getAffiliatesCompanyOfficers, getManagingCompany} from '../../../functions-files/getFunctions';
import {deleteAffiliates} from '../../../functions-files/delFunctions'
import {delAffilComp} from '../../../functions-files/delete/deleteAPI.js';
import { FetchDataService } from 'src/app/services/fetch/fetch-data.service';


// For Modals
import { AffiliatesRPModalComponent } from 'src/app/modal-dialog/affiliates-rpmodal/affiliates-rpmodal.component';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';

// Save CSV
import { CsvExportService } from './../../../services/data_extraction/csvexport/csvexport.service';
import { PdfExportService } from './../../../services/data_extraction/pdfexport/pdfexport.service';


export interface Child {
  name: string;
}

export interface Data {
  fullname: string;
  company: string,
  position: String,
  mothersname: String,
  fathersname: String,
  spouse: String,
  children: String;
  motherinlaw: String,
  fatherinlaw: String,
}

export interface OffData {
  dir_cisnumber: number;
  fname: string;
  mname: string,
  lname: string,
  fullname: string,
  // position: String,
  view: string,
}

interface RelatedInterest {
  id: number;
  cis_number: string;
  fname: string;
  mname: string;
  lname: string;
  dir_related: string;
  relation: number;
  date_inserted: Date;
  status: number;
}

// Interface for the director item
interface Officers {
  // id: number;
  // com_related: string;
  cis_number: string;
  fname: string;
  mname: string;
  lname: string;
  com_cisnumber: string;
  // related_interest: RelatedInterest[];
}

export interface affiliatesData {
  aff_com_cis_number: number;
  aff_com_account_name: string;
  aff_com_company_name: string,
  date_inserted: String,
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
  selector: 'app-rp-officer',
  templateUrl: './rp-officer.component.html',
  styleUrls: ['./rp-officer.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],

})
export class RpOfficerComponent implements AfterViewInit {
  sharedData: string | any;
  
  affForm: FormGroup;
  editAffilForm!: FormGroup;
  compData: any = [];
  boForm: FormGroup;
  boRIForm: FormGroup;
  buttonId: number = 0;
  selectedcomCisNumber: number = 0;
  Company: any;
  CompData: any;
  CompName: any;
  companies:  any = [];
  tableData: Record<string, any>[] = [];
  commandGroups: any[] = [];
  // Modals
  public editAffilvisible = false;
  editAffilData: any = [];

  dataSource = new MatTableDataSource<any>();
  columnsToDisplay: string[] = ['expand', 'aff_com_cis_number', 'aff_com_account_name', 'aff_com_company_name', 'manager', 'officerCount', 'date_inserted', 'view'];
  // columnsToDisplay: string[] = ['FullName', 'Company', 'Position', "MothersName", "FathersName", 'Spouse', 'Children', 'MotherinLaw', 'FatherinLaw'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay,];
  expandedElement: affiliatesData | null = null;

  DdisplayedColumns: string[] = ['aff_com_cis_number', 'fullname', 'position'];
  affilOffdataSource = new MatTableDataSource<any>([]);
  // dataSource = new MatTableDataSource<Data>(ELEMENT_DATA);

  @ViewChild('editAffilModal') editAffilModal!: ElementRef;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  constructor(private router: Router,
    public _dialog: MatDialog,
    private formBuilder: FormBuilder, 
    private http: HttpClient, 
    private dataTransferService: DataTransferService,
    private dataService: AffiliatesService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private sharedService: SharedservicesService,
    private get: FetchDataService,
    private csvExportService: CsvExportService,
    private pdfExportService: PdfExportService )
    {
      this.boForm = this.formBuilder.group({
        boCisNumber: [''],
        boFirstName: [''],
        boMiddleName: [''],
        boLastName: [''],
        boPosition: [''],
    });
    this.boRIForm = this.formBuilder.group({
      boRICisNumber: [''],
      boRIFirstName: [''],
      boRIMiddleName: [''],
      boRILastName: [''],
  });
  this.affForm = this.formBuilder.group({
    affilCisNumberM: [''],
    accountName: [''],
    companyName: [''],
    commandControl: ['']
  });
}

ngOnInit(): void {
this.updateTableData();
}

  


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;

    this.dataSource.sort = this.sort;

    this.sort.sort({
      id: 'date_inserted',
      start: 'desc',
      disableClear: false
    });
  }


  applyFilter(column: string[], filterValue: string) {
    filterValue = filterValue.trim().toLowerCase();
  
    // Define a custom filter predicate
  const customFilter = (data: any): boolean => {
    for (const column of this.columnsToDisplay) {
      const columnValue = data[column]?.toString().toLowerCase();
      if (columnValue && columnValue.includes(filterValue)) {
        return true; // If any of the specified columns match, return true
      }
    }
    return false; // If no match is found in any column, return false
  };

  // Set the custom filter predicate for the specified columns
  this.dataSource.filterPredicate = customFilter;

  // Apply the filter
  this.dataSource.filter = filterValue;
  }

  



  // Functions Below
  updateTableData() {
    this.get.getAffiliatesCompanyOfficers((affilCompOff) => {
      if (affilCompOff) {
        // Process the data to count directors related to each company
        const companiesWithDirectors = affilCompOff.map(company => {
          const officers = company.officers || []; // Ensure there is a directors array
          const officerCount = officers.length;
          return { ...company, officerCount, officers };
        });
  
        // Set the data source for your MatTable
        this.dataSource.data = companiesWithDirectors;
      }
    });
  
    this.get.getAffiliatesCompanyOfficers((affilCompOff) => {
      if (affilCompOff) {
        // Fetch director data
        this.get.getAffiliatesCompanyOfficers((affilCompOff) => {

          // Process the data to count directors related to each company
          const affiliatesWithDirectors: OffData[] = affilCompOff.map(company => {
            const affiliatesOfficers = affilCompOff.filter(officer => officer.com_related === company.aff_com_account_name);
            return { ...company, officerCount: affiliatesOfficers.length, officers: affiliatesOfficers };
          });
          
          // Set the data source for your MatTable
          this.affilOffdataSource.data = affiliatesWithDirectors;
          // Trigger change detection
          this.cdr.detectChanges();
        });
      }
    });

    this.get.getManagingCompany((mngComp) => {
      this.compData = mngComp;
    this.commandGroups = []; // Clear the existing commandGroups

      if (mngComp) {
        const data = mngComp;
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
    })
  }

  setButtonId(id: number, comCisNumber: number) {
    this.buttonId = id;
    this.selectedcomCisNumber = comCisNumber;
  }


  onBOSubmit() {
 
    if (this.boForm.valid) {
      const boData = this.boForm.value;
  
      // Call the JavaScript function with form data
      createBankOfficer(boData); // Pass the entire formData object
    }


    this.ngZone.run(() => {
      this.dataSource.data = this.tableData;
    });

      // Trigger change detection
    this.cdr.detectChanges();
  }

  onBORISubmit() {
 
    if (this.boRIForm.valid) {
      const boRIData = this.boRIForm.value;
  
      // Call the JavaScript function with form data
      createBankOfficerRelationship(boRIData, this.buttonId, this.selectedcomCisNumber); // Pass the entire formData object
    }
  }

  onSubmit() {
    if (this.affForm.valid) {
      const formData = this.affForm.value;
      const session = sessionStorage.getItem('sessionID')?.replaceAll("\"", "");
     const userID = sessionStorage.getItem('userID')?.replaceAll("\"", "");
      
      // Call the JavaScript function with form data
      createAffil(formData, session, userID); // Pass the entire formData object
    }
  }

  // Start of Button Click
  onButtonClick() {
    
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
    this.router.navigate(['/arp/rpofficer-ri', directorId]);
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


  // Show Modal Form
openAddEditEmpForm() {
  const dialogRef = this._dialog.open(AffiliatesRPModalComponent);
  dialogRef.afterClosed().subscribe({
    next: (val) => {
      if (val) {
        this.ngOnInit();
      }
    },
  });
}

openEditForm(data: any, event: any) {
  event.stopPropagation();
  const dialogRef = this._dialog.open(AffiliatesRPModalComponent, {
    data,    
  });

  dialogRef.afterClosed().subscribe({
    next: (val) => {
      if (val) {
        this.ngOnInit();
      }
    },
  });
}


  editAffil(row: any, event: Event) {
    event.stopPropagation();
    this.editAffilvisible = !this.editAffilvisible;
    const selectedManager = row.managing_company;

     // Check if the selectedManager exists in the commandGroups
     const isValidManager = this.commandGroups.some(group => {
      return group.value === selectedManager;
    });
  

  // Set the value only if it's a valid manager
  if (isValidManager) {
    this.affForm.get('commandControl')?.setValue(selectedManager);
  } else {
    // Optionally, handle the case where the manager is not valid
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


  downloadCSV(): void {
    const currentDate = new Date();
    let selectedDateFormatted: string = '';
      
    const formattedDate = selectedDateFormatted || currentDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
    const filename = `RelatedPartyOfficert.csv`;
  
    const rowData = this.dataSource.data.flatMap(item => {
      const companyRow = {
        'CIS NUMBER': item.aff_com_cis_number,
        'COMPANY NAME': item.aff_com_company_name,
        'MANAGING COMPANY': item.manager,
        'Number of Officer': item.officerCount,
      };
  
      const officerHeaderRow = {
        'CIS NUMBER': '', 
        'COMPANY NAME': 'CIS Number',
        'MANAGING COMPANY': 'Officers Name',
        'Number of Officer': 'Position'// Empty cell for alignment
      };
  
      const officerRows = item.officers.map((officer, index) => ({
         'CIS NUMBER': '',
        'COMPANY NAME': officer.off_cisnumber, 
        'MANAGING COMPANY': `${officer.fname} ${officer.mname} ${officer.lname}`, // Empty cell for alignment
        'Number of Officer': officer.position
      }));
  
      return [companyRow, officerHeaderRow, ...officerRows];
    });
  
    const columnsToInclude = ['CIS NUMBER', 'COMPANY NAME', 'MANAGING COMPANY', 'Number of Officer'];
    this.csvExportService.DirectorsOfficerRIToCSV(rowData, filename, columnsToInclude);
  }
  

  generatePDF(): void {
    const currentDate = new Date();
    let selectedDateFormatted: string = '';
    
  
    const formattedDate = selectedDateFormatted || currentDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
    const filename = `RelatedPartyOfficer.pdf`;
    const headerText = formattedDate;
  
    const rowData = this.dataSource.data.flatMap(item => {
      const companyRow = {
        'CIS NUMBER': item.aff_com_cis_number,
        'COMPANY NAME': item.aff_com_company_name,
        'MANAGING COMPANY': item.manager,
        'Number of Officer': item.officerCount,
      };
  
      const officerHeaderRow = {
        'CIS NUMBER': '', 
        'COMPANY NAME': 'CIS Number',
        'MANAGING COMPANY': 'Officers Name',
        'Number of Officer': 'Position'
      };
  
      const officerRows = item.officers.map((officer, index) => ({
         'CIS NUMBER': '',
        'COMPANY NAME': officer.off_cisnumber, 
        'MANAGING COMPANY': `${officer.fname} ${officer.mname} ${officer.lname}`, // Empty cell for alignment
        'Number of Officer': officer.position
      }));
  
      return [companyRow, officerHeaderRow, ...officerRows];
    });
  
    const columnsToInclude = ['CIS NUMBER', 'COMPANY NAME', 'MANAGING COMPANY', 'Number of Officer'];
    
    this.pdfExportService.exportRPOfficerToPDF(rowData, filename, columnsToInclude, headerText);
  }
}
