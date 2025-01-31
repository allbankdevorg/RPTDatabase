import { Component, AfterViewInit, ViewChild, NgZone, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { AbstractControl, FormControl, ValidationErrors, ValidatorFn, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import {TooltipPosition} from '@angular/material/tooltip';
import { Injectable } from '@angular/core';

// Services
import { DataTransferService } from '../../../services/data-transfer.service';
import {BoRIService} from '../../../services/bankOfficerRI/bo-ri.service'; //Service to set the value of the DirCIS and buttonID in adding RI of Directors

// Functions Import
import {getOfficers, getCompany, getOfficersRI} from '../../../functions-files/getFunctions'
// import {deleteDOSRIOfficer, deleteDOSRIOfficerRI} from '../../../functions-files/delFunctions'
import {delBankOff, delBankOffRI} from '../../../functions-files/delete/deleteAPI.js';
import { FetchDataService } from 'src/app/services/fetch/fetch-data.service';


// Audit Trail
import { AuditTrailService } from '../../../services/auditTrail/audit-trail.service';
import {AuditTrail} from '../../../model/audit-trail.model';

// For Modal
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { BankofficerModalComponent } from 'src/app/modal-dialog/bankofficer-modal/bankofficer-modal.component';
import { BankofficerRIModalComponent } from 'src/app/modal-dialog/bankofficer-rimodal/bankofficer-rimodal.component';

// For Exporting to CSV and PDF
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
  FullName: string;
  Company: string;
  Position: string;
  MothersName: string;
  FathersName: string;
  Spouse: string;
  Children: string;
  MotherinLaw: string;
  FatherinLaw: string;
  offc_CisNumber: number;
}

interface IUser {
  
}

@Component({
  selector: 'app-bankofficer',
  templateUrl: './bankofficer.component.html',
  styleUrls: ['./bankofficer.component.scss']
})

@Injectable({
  providedIn: 'root',
})

export class BankofficerComponent implements AfterViewInit{

  sharedData: string | any;
  positionOptions: TooltipPosition = 'right';
  
  buttonId: number = 0;
  selectedcomCisNumber: number = 0;
  Company: any;
  CompData: any;
  CompName: any;
  companies:  any = [];
  tableData: Record<string, any>[] = [];
  public officers: Officers[] = [];

  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['cis_num', 'FullName', 'Company', 'Position', "MothersName", "FathersName", 'Spouse', 'Children', 'MotherinLaw', 'FatherinLaw'];
  
  directorData: Officers[] = [];
  

  // @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('relationShipModal', { static: true }) relationShipModal: any;


  

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }


  applyFilter(column: string[], filterValue: string) {
    filterValue = filterValue.trim().toLowerCase();
  
    // Define a custom filter predicate
  const customFilter = (data: any): boolean => {
    for (const column of this.displayedColumns) {
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


  constructor(private router: Router,
          public _dialog: MatDialog,  
          private formBuilder: FormBuilder, 
          private http: HttpClient, 
          private dataService: BoRIService,
          private changeDetectorRef: ChangeDetectorRef,
          private ngZone: NgZone,
          private get: FetchDataService,
          private auditTrailService: AuditTrailService,
          private pdfExportService: PdfExportService,
          private csvExportService: CsvExportService,)
          {
          
    }

  ngOnInit(): void {
    this.updateTableData();
   }

   // Functions Below
   updateTableData(): void {
    this.get.getCompany().subscribe((compData) => {
      if (compData) {
        const relationColumn = ['MothersName', 'FathersName', 'Spouse', 'Children', 'MotherinLaw', 'FatherinLaw'];
        const tableData: Record<string, any>[] = [];
  
        this.get.getOfficers().subscribe((Officers) => {
          for (const officer of Officers) {
            const officerData = officer.Officers || [];
            const matchingCompany = compData.find((company) => company.com_cis_number === officer.com_related);
            const companyName = matchingCompany ? matchingCompany.com_company_name : '';
  
            const row: Record<string, any> = {
              'id': officer.id,
              'cis_num': officer.off_cisnumber,
              'FullName': `${officer.fname} ${officer.mname}  ${officer.lname}`,
              'fname': officer.fname,
              'mname': officer.mname,
              'lname': officer.lname,
              'Company': companyName,
              'Position': officer.position,
              'offc_CisNumber': officer.off_cisnumber,
              'comp_CIS': officer.com_related,
            };
            
            // Loop through each element in the 'relationColumn' array
            for (let index = 0; index < relationColumn.length; index++) {
              const relationName = relationColumn[index]; // Get the current relation name from the 'relationColumn' array
  
              // Filter 'officer.related_interest' array to get related names based on the relation index
              const relatedData = officer.related_interest
                .filter((related) => related.relation === index + 1)
                // Create a full name by concatenating 'fname', 'mname', and 'lname'
                .map((related) => ({
                  id: related.id,
                  fullName: `${related.fname} ${related.mname} ${related.lname}`,
                  cisNumber: related.cis_number,
                  offRelated: related.officer_related
                }))
                // Filter out objects with empty names (names with only whitespace)
                .filter((data) => typeof data.fullName === 'string' && data.fullName.trim() !== '')
                // Sort relatedData array by id from lowest to highest
                .sort((a, b) => a.id - b.id);
  
              // Assign the 'relatedData' array to the 'row' object with the key as 'relationName'
              row[relationName] = relatedData;
            }
  
            tableData.push(row);
          }
  
          // Sort tableData array by 'id' property from lowest to highest
          tableData.sort((a, b) => a['id'] - b['id']);
  
          // Assign tableData to dataSource.data
          this.dataSource.data = tableData;
  
          // Trigger change detection
          this.changeDetectorRef.detectChanges();
        });
      } else {
        // Handle case where compData is empty
      }
    });
  }
 
  
  setButtonId(id: number, offCisNumber: number) {
    this.buttonId = id;
    this.selectedcomCisNumber = offCisNumber;

    this.dataService.setboCIS(offCisNumber);
    this.dataService.setButtonId(id);
    
  }


  openAddEditOffForm() {
    const dialogRef = this._dialog.open(BankofficerModalComponent);
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
    const dialogRef = this._dialog.open(BankofficerModalComponent, {
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
  

  
  

  // Start of Button Click
  onButtonClick() {
    
  }

  delOfficer(row: any, cisNumber: any, offc_CisNumber: any): void {
    const cis_id = row.offc_CisNumber;
    const session = localStorage.getItem('sessionID')?.replaceAll("\"","");
    const userID = localStorage.getItem('userID')?.replaceAll("\"","");

    delBankOff(cis_id, session, userID)
    .then((response) => {
      this.ngOnInit();
    })
    .catch((error) => {
     
    })
  }

  delRelationship(row: any, id: any, officer_related: any): void {
    const data_id = id;
    const session = localStorage.getItem('sessionID')?.replaceAll("\"","");
    const userID = localStorage.getItem('userID')?.replaceAll("\"","");

    delBankOffRI(data_id, session, userID)
    .then((response) => {
      this.ngOnInit();
    })
    .catch((error) => {
     
    })
  }


  setoffcRelated() {
  }



  downloadCSV(): void {
    const currentDate = new Date();
    let selectedDateFormatted: string = '';
    
    
    const formattedDate = selectedDateFormatted || currentDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
    const filename = `BankOfficer_RelatedInterest.csv`;
   
    const data = this.dataSource.data.map(item => {
      // Loop through each array and concatenate full names
      const mothersNames = item.MothersName.map(mother => mother.fullName).join(', ');
      const fathersNames = item.FathersName.map(father => father.fullName).join(', ');
      const spouses = item.Spouse.map(spouse => spouse.fullName).join(', ');
      const childrenNames = item.Children.map(child => child.fullName).join(', ');
      const motherInLaws = item.MotherinLaw.map(motherInLaw => motherInLaw.fullName).join(', ');
      const fatherInLaws = item.FatherinLaw.map(fatherInLaw => fatherInLaw.fullName).join(', ');
  
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
    const headerText = "Bank Officer and Related Interest";
  
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
  
  
    const columnsToInclude = [
      'CIS Number', 'Full Name', 'Company', 'Position', "Mother's Name",
      "Father's Name", 'Spouse', 'Children', 'Mother-In-Law', 'Father-In-Law'
    ];
    this.pdfExportService.generateBankOffPDF(data, filename, columnsToInclude, headerText);
  }
  

  // Show Modal Form
openRIForm() {
  const dialogRef = this._dialog.open(BankofficerRIModalComponent);
  dialogRef.afterClosed().subscribe({
    next: (val) => {
      if (val) {
        this.updateTableData();
      }
    },
  });
}

openEditRIForm(data: any, event: any) {
  event.stopPropagation();
  const dialogRef = this._dialog.open(BankofficerRIModalComponent, {
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
}
