import { Component, AfterViewInit, ViewChild, NgZone, ChangeDetectionStrategy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import {TooltipPosition} from '@angular/material/tooltip';

import { MatPaginator } from '@angular/material/paginator';


import { AbstractControl, FormControl, ValidationErrors, ValidatorFn, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { ChangeDetectorRef } from '@angular/core';
import { Injectable } from '@angular/core';

// Services
import { DataTransferService } from '../../../services/data-transfer.service';
import { SharedService } from '../dataintegration/shared.service';
import {DirRIService} from '../../../services/dirRI/dir-ri.service'; //Service to set the value of the DirCIS and buttonID in adding RI of Directors

// Imports for Functions
import {createDirectors} from '../../../functions-files/add/postAPI';
import {createRelatedInterest} from '../../../functions-files/add/postAPI';
import {getCompany, getDirectors} from '../../../functions-files/getFunctions';
// import {deleteDosri, deleteDOSRIDirector, deleteDOSRIDirRelationship} from '../../../functions-files/delFunctions'
import { FetchDataService } from 'src/app/services/fetch/fetch-data.service';
import {delDosriDIR, delDosriDRI} from '../../../functions-files/delete/deleteAPI.js';

// Audit Trail
import { AuditTrailService } from '../../../services/auditTrail/audit-trail.service';
import {AuditTrail} from '../../../model/audit-trail.model';

// For Modal
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { DirectorsRIModalComponent } from 'src/app/modal-dialog/directors-ri-modal/directors-ri-modal.component';
import { DirectorsModalComponent } from 'src/app/modal-dialog/directors-modal/directors-modal.component';
import { forkJoin } from 'rxjs';


// For Exporting to CSV and PDF
import { CsvExportService } from './../../../services/data_extraction/csvexport/csvexport.service';
import { PdfExportService } from './../../../services/data_extraction/pdfexport/pdfexport.service';


export interface Child {
  name: string;
}

// Interface for the related interest item
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
interface Director {
  id: number;
  com_related: string;
  dir_cisnumber: string;
  fname: string;
  mname: string;
  lname: string;
  position: string;
  related_interest: RelatedInterest[];
}

@Component({
  selector: 'app-directorsrelated',
  templateUrl: './directorsrelated.component.html',
  styleUrls: ['./directorsrelated.component.scss']
})

@Injectable({
  providedIn: 'root',
})
export class DirectorsrelatedComponent {
  positionOptions: TooltipPosition = 'right';
  companyDetails: any; //a variable to hold the fetched company details:\
  sharedData: string | any;
  // buttonId: number = 0;
  // selectedDirCisNumber: number = 0;
  selectedCompCISNumber: number = 0;
  directorsData: Director[] = []; // This should be populated with your director data
  filteredDirectors: Director[] = [];
  compId: any;
  compN: string = this.sharedService.getCompName();
  Company: any;

  tableData: Record<string, any>[] = []; // Define tableData as a class property

  
  // Populating the dataSource
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [ 'cis_num', 'FullName', 'Company', 'Position', "MothersName", "FathersName", 'Spouse', 'Children', 'MotherinLaw', 'FatherinLaw'];

   directorData: Director[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  // @ViewChild('relationShipModal', { static: true }) relationShipModal: any;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(private router: Router,
              public _dialog: MatDialog,  
              private http: HttpClient,
              private sharedService: SharedService,
              private dataService: DirRIService,
              private route: ActivatedRoute,
              private changeDetectorRef: ChangeDetectorRef,
              private ngZone: NgZone,
              private get: FetchDataService,
              private pdfExportService: PdfExportService,
              private csvExportService: CsvExportService,
              private auditTrailService: AuditTrailService)
  {
    
    this.updateTableData();
    this.route.params.subscribe(params => {
      this.compId = params['id'];
    const companyName = this.sharedService.getCompName();

      this.get.getCompany().subscribe((compData) => {
        // Process the data to count directors related to each company
        if (compData) {
          const filteredCompany = compData.filter((company) => company.com_cis_number === this.compId);
        
            for (const company of filteredCompany) {
              this.Company = company.com_company_name;
            }
        }else {
          // 
          compData = [];
        }
            
                  
      });
    });
  }

  async getCompanyName(companyId: string): Promise<string> {
    // Call your external JavaScript function to get the company name
    const companyDetails = await getCompany(companyId);
    return companyDetails?.name || 'N/A';
  }

 async  ngOnInit() {
     this.updateTableData();
  }

  // All Functions Below
  updateTableData(): void {
    // Now that you have processed the data, you can fetch directors or perform any other operation
    this.get.getDirectors().subscribe((directors) => {
      if (directors) {
        const filteredDirectors = directors.filter((director) => director.com_related === this.compId);
        const relationColumn = ['MothersName', 'FathersName', 'Spouse', 'Children', 'MotherinLaw', 'FatherinLaw'];
  
        const tableData = filteredDirectors.map((director) => {
          const row: Record<string, any> = {
            'id': director.id,
            'cis_num': director.dir_cisnumber,
            'FullName': `${director.fname} ${director.mname}  ${director.lname}`,
            'Company': this.Company,
            'Position': director.position,
            'dir_CisNumber': director.dir_cisnumber,
            'comp_CIS': director.com_related,
          };
  
          for (let index = 0; index < relationColumn.length; index++) {
            const relationName = relationColumn[index];
  
            // Check if director.related_interest is not null or undefined
            const relatedData = director.related_interest
              ? director.related_interest
                  .filter((related) => related && related.relation === index + 1)
                  .map((related) => ({
                    id: related.id,
                    fullName: `${related.fname || ''} ${related.mname || ''} ${related.lname || ''}`,
                    cisNumber: related.cis_number || '',
                    dirRelated: related.dir_related || '',
                  }))
                  .filter((data) => typeof data.fullName === 'string' && data.fullName.trim() !== '')
                  .sort((a, b) => a.id - b.id) // Sort relatedData array by id from lowest to highest
              : [];
  
            row[relationName] = relatedData;
          }
  
          return row;
        });
        
        // Sort tableData array by 'id' property from lowest to highest
        tableData.sort((a, b) => a['id'] - b['id']);

        this.dataSource = new MatTableDataSource<any>(tableData);
        // this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
  
        // Trigger change detection
        this.changeDetectorRef.detectChanges();
      } else {
        directors = [];
      }
    });
  }
  
  
  setButtonId(id: number, dirCisNumber: number) {
    // Set values in the service
    
    this.dataService.setDirCIS(dirCisNumber);
    this.dataService.setButtonId(id);
    
  }




  setComp() {

    this.selectedCompCISNumber = this.compId;
    
    this.dataService.setCompCIS(this.selectedCompCISNumber);
  }



  // Getting the director_CISnumber
  display(row: any) {
      const directorId = row.com_cis_number; // Extract the ID from the clicked row
      const companyName = row.com_company_name;
      this.sharedService.setCompName(companyName);
      this.sharedService.setDirectorId(directorId);
  }
 
  delDirector(row: any, comp_cis: any, dir_cis: any): void {
    const cis_id = row.dir_CisNumber;
    delDosriDIR(cis_id)
    .then((response) => {
      this.ngOnInit();
    })
    .catch((error) => {
     
    })
  }

  delRelationship(row: any, id: string, dir_related: any): void {
    const data_id = id;
    delDosriDRI(data_id)
    .then((response) => {
      this.ngOnInit();
    })
    .catch((error) => {
     
    })
  }



// Show Modal Form
openAddEditEmpForm() {
  const dialogRef = this._dialog.open(DirectorsRIModalComponent);
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
  const dialogRef = this._dialog.open(DirectorsRIModalComponent, {
    data,    
  });

  dialogRef.afterClosed().subscribe({
    next: (val) => {
      if (val) {

      }
    },
  });
}


openDirectorsForm() {
  const dialogRef = this._dialog.open(DirectorsModalComponent);
  dialogRef.afterClosed().subscribe({
    next: (val) => {
      if (val) {
        this.updateTableData();
      }
    },
  });
}

openEditDirForm(data: any, event: any) {
  event.stopPropagation();
  const dialogRef = this._dialog.open(DirectorsModalComponent, {
    data,    
  });

  dialogRef.afterClosed().subscribe({
    next: (val) => {
      if (val) {
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
    
  });
  
}



downloadCSV(): void {
  const currentDate = new Date();
  let selectedDateFormatted: string = '';
  
  
  const formattedDate = selectedDateFormatted || currentDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
  const filename = `DOSRIDIrectorRelatedInterest.csv`;
 
  const data = this.dataSource.data.map(item => {
    // Loop through each array and concatenate full names
    const mothersNames = item.MothersName.map(mother => mother.fullName).join('\n');
    const fathersNames = item.FathersName.map(father => father.fullName).join('\n');
    const spouses = item.Spouse.map(spouse => spouse.fullName).join('\n');
    const childrenNames = item.Children.map(child => child.fullName).join('\n');
    const motherInLaws = item.MotherinLaw.map(motherInLaw => motherInLaw.fullName).join('\n');
    const fatherInLaws = item.FatherinLaw.map(fatherInLaw => fatherInLaw.fullName).join('\n');
  

    return {
      'CIS Number': item.cis_num,
      'Full Name': item.FullName,
      'Company': item.Company,
      'Position': item.Position,
      "Mother's Name": mothersNames,
      "Father's Name": fathersNames,
      'Spouse': spouses,
      'Children': childrenNames,
      'Mother-In-Law': motherInLaws,
      'Father-In-Law': fatherInLaws
    };
  });

  // Specify the columns to include in the CSV
  const columnsToInclude = [
    'CIS Number', 'Full Name', 'Company', 'Position', "Mother's Name",
    "Father's Name", 'Spouse', 'Children', 'Mother-In-Law', 'Father-In-Law'
  ];
  this.csvExportService.DirectorOfficerRIToCSV(data, filename, columnsToInclude);
}


generatePDF(): void {
  const currentDate = new Date();
  let selectedDateFormatted: string = '';

  const formattedDate = selectedDateFormatted || currentDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
  const filename = `BankOfficer_RelatedInterest.pdf`;
  const headerText = formattedDate;

  const data = this.dataSource.data.map(item => {
    // Loop through each array and concatenate full names
    const mothersNames = item.MothersName.map(mother => mother.fullName).join('\n');
    const fathersNames = item.FathersName.map(father => father.fullName).join('\n');
    const spouses = item.Spouse.map(spouse => spouse.fullName).join('\n');
    const childrenNames = item.Children.map(child => child.fullName).join('\n');
    const motherInLaws = item.MotherinLaw.map(motherInLaw => motherInLaw.fullName).join('\n');
    const fatherInLaws = item.FatherinLaw.map(fatherInLaw => fatherInLaw.fullName).join('\n');
  
    return {
      'CIS Number': item.cis_num,
      'Full Name': item.FullName,
      'Company': item.Company,
      'Position': item.Position,
      "Mother's Name": mothersNames,
      "Father's Name": fathersNames,
      'Spouse': spouses,
      'Children': childrenNames,
      'Mother-In-Law': motherInLaws,
      'Father-In-Law': fatherInLaws
    };
  });

  console.log(data);

  const columnsToInclude = [
    'CIS Number', 'Full Name', 'Company', 'Position', "Mother's Name",
    "Father's Name", 'Spouse', 'Children', 'Mother-In-Law', 'Father-In-Law'
  ];
  this.pdfExportService.generateBankOffPDF(data, filename, columnsToInclude, headerText);
}

}
