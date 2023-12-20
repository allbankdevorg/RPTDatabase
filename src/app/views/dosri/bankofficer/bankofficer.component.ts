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
import {deleteDOSRIOfficer, deleteDOSRIOfficerRI} from '../../../functions-files/delFunctions'
import { FetchDataService } from 'src/app/services/fetch/fetch-data.service';


// Audit Trail
import { AuditTrailService } from '../../../services/auditTrail/audit-trail.service';
import {AuditTrail} from '../../../model/audit-trail.model';

// For Modal
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { BankofficerModalComponent } from 'src/app/modal-dialog/bankofficer-modal/bankofficer-modal.component';
import { BankofficerRIModalComponent } from 'src/app/modal-dialog/bankofficer-rimodal/bankofficer-rimodal.component';

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

  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['FullName', 'Company', 'Position', "MothersName", "FathersName", 'Spouse', 'Children', 'MotherinLaw', 'FatherinLaw'];
  
  directorData: Officers[] = [];
  

  // @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('relationShipModal', { static: true }) relationShipModal: any;


  

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }


  constructor(private router: Router,
          public _dialog: MatDialog,  
          private formBuilder: FormBuilder, 
          private http: HttpClient, 
          private dataService: BoRIService,
          private changeDetectorRef: ChangeDetectorRef,
          private ngZone: NgZone,
          private get: FetchDataService,
          private auditTrailService: AuditTrailService)
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
          const relationColumn = ['MothersName', 'FathersName', 'Spouse', 'Children', 'MotherinLaw', 'FatherinLaw'];
          const tableData: Record<string, any>[] = [];
  
          for (const officer of Officers) {
            const officerData = officer.Officers || [];
  
            const matchingCompany = compData.find((company) => company.com_cis_number === officer.com_related);
  
            const companyName = matchingCompany ? matchingCompany.com_company_name : '';
  
            const row: Record<string, any> = {
                  'FullName': `(${officer.off_cisnumber}) ${officer.fname} ${officer.mname}  ${officer.lname}`,
                  'Company': companyName,
                  'Position': officer.position,
                  'offc_CisNumber': officer.off_cisnumber,
                  'comp_CIS': officer.com_related,
            };
  
            console.log(officer.off_cisnumber);
            // Loop through each element in the 'relationColumn' array
            for (let index = 0; index < relationColumn.length; index++) {
                const relationName = relationColumn[index]; // Get the current relation name from the 'relationColumn' array
                // Filter 'director.related_interest' array to get related names based on the relation index
                const relatedData = officer.related_interest 
                    .filter(related => related.relation === index + 1)
                    // Create a full name by concatenating 'fname', 'mname', and 'lname'
                    .map(related => ({
                      fullName: `${related.fname} ${related.mname} ${related.lname}`,
                      cisNumber: related.cis_number,
                      offRelated: related.officer_related
                  }))
                  // Filter out objects with empty names (names with only whitespace)
                  .filter(data => typeof data.fullName === 'string' && data.fullName.trim() !== '');
    
                // Assign the 'relatedNames' array to the 'row' object with the key as 'relationName'
                row[relationName] = relatedData;
            }
  
            tableData.sort((a, b) => a['offc_CisNumber'] - b['offc_CisNumber']);
            tableData.push(row);
  
            const officers: Officers[] = tableData.map(item => {
              return {
                FullName: item['FullName'],
                Company: item['Company'],
                Position: item['Position'],
                MothersName: item['MothersName'],
                FathersName: item['FathersName'],
                Spouse: item['Spouse'],
                Children: item['Children'],
                MotherinLaw: item['MotherinLaw'],
                FatherinLaw: item['FatherinLaw'],
                offc_CisNumber: item['offc_CisNumber'],
  
                // Map other properties here
              };
            });
  
            this.officers = officers;
            console.log(tableData);
        }
          
          this.dataSource.data = tableData;
          console.log(this.officers);
          // Trigger change detection
          this.changeDetectorRef.detectChanges();
        });
      }else {
        
      }
      
      
    //  console.log(this.tableData);
    })
  }
  
  setButtonId(id: number, offCisNumber: number) {
    this.buttonId = id;
    this.selectedcomCisNumber = offCisNumber;
    console.log(offCisNumber);
    console.log(id);

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
    console.log(data);
    const dialogRef = this._dialog.open(BankofficerModalComponent, {
      data,    
    });
  
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          // this.getEmployeeList();
          console.log("Successs");
        }
      },
    });
  }
  

  
  

  // Start of Button Click
  onButtonClick() {
    console.log('Show Modal Form');
    
  }

  delOfficer(element: any, cisNumber: any, offc_CisNumber: any) {
    console.log(element);
    console.log('CIS Number:', cisNumber);
    console.log('Off_related:', offc_CisNumber);
    // delete Officer
    deleteDOSRIOfficer((dosriId) => {

    })
  }

  delRelationship(element: any, cisNumber: any, officer_related: any): void {
    // deleteRelationship
    console.log(element);
    console.log('CIS Number:', cisNumber);
    console.log('Off_related:', officer_related);
    // console.log('CIS Number:', cis_number);
    // console.log('dir_related:', dir_related);
    console.log("Are you sure you want to delete?")
    deleteDOSRIOfficerRI((dosriId) => {

    })
  }


  setoffcRelated() {
    // director = director.dir_related;
    // console.log(director);
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
  console.log(data);
  const dialogRef = this._dialog.open(BankofficerRIModalComponent, {
    data,    
  });

  dialogRef.afterClosed().subscribe({
    next: (val) => {
      if (val) {
        // this.getEmployeeList();
        console.log("Successs");
      }
    },
  });
}


  // // Start of Functions for Audit Trail
  //  logAction(actionType: string, details: string, success: boolean, page: string, errorMessage?: string) {
  //   const auditTrailEntry = this.createAuditTrailEntry(actionType, details, success, page, errorMessage);
  //   this.logAuditTrail(auditTrailEntry);
  // }
  
  
  
  // private createAuditTrailEntry(actionType: string, details: string, success: boolean, page: string, errorMessage?: string): AuditTrail {
  //   return {
  //     userId: 'current_user_id',
  //     userName: 'Current_user',
  //     timestamp: new Date(),
  //     actionType,
  //     details,
  //     success,
  //     page, // Include the page information
  //     errorMessage: errorMessage || '', // Optional: Include error message if available
  //   };
  // }
  
  
  // private logAuditTrail(auditTrailEntry: AuditTrail) {
  //   this.auditTrailService.logAuditTrail(auditTrailEntry).subscribe(() => {
  //     console.log('Audit trail entry logged successfully.');
  //   });
  //   // console.log('Audit trail entry logged successfully.');
  // }
}
