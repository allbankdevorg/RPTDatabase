import { Component, AfterViewInit,NgZone,ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { MatPaginator } from '@angular/material/paginator';
import { TooltipPosition } from '@angular/material/tooltip';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { ChangeDetectorRef } from '@angular/core';
import { Injectable } from '@angular/core';

// Services
import { DataTransferService } from '../../../services/data-transfer.service';
import { SharedService } from '../../dosri/dataintegration/shared.service';
import {AffiliatesService} from '../../../services/affiliates/affiliates.service'; //Service to set the value of the DirCIS and buttonID in adding RI of Directors

// Imports for Functions
import { createAffilOff, createAffilOffRI} from '../../../functions-files/add/postAPI';
import {getCompany, getAffiliatesCompany, getAffiliatesDirectors, getAffiliatesOfficers } from '../../../functions-files/getFunctions';
import {deleteAffilDir, deleteAffilOff, deleteAffilDirRI, deleteAffilOffRI} from '../../../functions-files/delFunctions'
import {delAffilComDIR} from '../../../functions-files/delete/deleteAPI.js';

// For Exporting to CSV and PDF
import { CsvExportService } from './../../../services/data_extraction/csvexport/csvexport.service';
import { PdfExportService } from './../../../services/data_extraction/pdfexport/pdfexport.service';
// import Papa from 'papaparse';
import { FetchDataService } from 'src/app/services/fetch/fetch-data.service';



// For Modals
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { AffiliatesDirModalComponent } from 'src/app/modal-dialog/affiliates-dir-modal/affiliates-dir-modal.component';
import { DirectorsModalComponent } from 'src/app/modal-dialog/directors-modal/directors-modal.component';
import {AffiliatesDirRIModalComponent} from '../../../modal-dialog/affiliates-dir-ri-modal/affiliates-dir-ri-modal.component'

export interface Child {
  name: string;
}

export interface Siblings {
  name: string;
}

export interface GrandChildren {
  name: string;
}

export interface RI {
  name: string;
}

export interface Data {
  fullname: string;
  company: string, 
  position: String,
  mothersname?: RI[],
  fathersname?: RI[],
  siblings?: Siblings[],
  spouse?: RI[],
  children?: Child[];
  motherinlaw?: RI[],
  fatherinlaw?: RI[],
  stepChild?: RI[],
  sonDaughterInLaw?: RI[],
  grandParents?: RI[],
  grandParentsInLaw?: RI[],
  sistersInLaw?: RI[],
  brothersInLaw?: RI[],
  grandChildren?: GrandChildren[],
  grandChildrenInLaw?: RI[],
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
interface affilDirector {
  id: number;
  com_related: string;
  dir_cisnumber: string;
  fname: string;
  mname: string;
  lname: string;
  position: string;
  related_interest: RelatedInterest[];
}

interface affilOfficer {
  id: number;
  com_related: string;
  dir_cisnumber: string;
  fname: string;
  mname: string;
  lname: string;
  position: string;
  related_interest: RelatedInterest[];
}

interface Person {
  id: number;
  com_related: string;
  dir_cisnumber?: string;
  fname: string;
  mname: string;
  lname: string;
  position: string;
  status?: number;
  related_interest: {
    id: number;
    cis_number: string;
    fname: string;
    mname: string;
    lname: string;
    dir_related: string;
    relation: number;
    date_inserted: string;
    status: number;
  }[];
}


@Component({
  selector: 'app-pac',
  templateUrl: './pac.component.html',
  styleUrls: ['./pac.component.scss']
})
export class PacComponent implements AfterViewInit {
  positionOptions: TooltipPosition = 'right';
  sharedData: string | any;
  affilOfficerForm: FormGroup;
  affilOfficerRIForm: FormGroup;
  selectedOffCisNumber: number = 0;
  selectedCompCISNumber: number = 0;
  compId: any;
  compN: string = this.sharedService.getCompName();
  Company: any;
  selectedAffilCompCISNumber: number = 0;

  tableData: Record<string, any>[] = []; // Define tableData as a class property
  OfftableData: Record<string, any>[] = [];

    // / Populating the dataSource
    dataSource = new MatTableDataSource<any>();
    displayedColumns: string[] = ['FullName', 'Position', "MothersName", "FathersName", "Siblings", 'Spouse', 'Children', 'MotherinLaw', 'FatherinLaw',
              'stepChild', 'sonDaughterInLaw', 'grandParents', 'grandParentsInLaw', 'sistersInLaw', 'brothersInLaw', 'grandChildren', 'grandChildrenInLaw'];
    
    OffdataSource = new MatTableDataSource();
    OffdisplayedColumns: string[] = ['FullName', 'Position', "MothersName", "FathersName", "Siblings", 'Spouse', 'Children', 'MotherinLaw', 'FatherinLaw',
                        'stepChild', 'sonDaughterInLaw', 'grandParents', 'grandParentsInLaw', 'sistersInLaw', 'brothersInLaw', 'grandChildren', 'grandChildrenInLaw'];
            
     directorData: affilDirector[] = [];
     officerData: affilOfficer[] = [];
  
    @ViewChild(MatPaginator) paginator1!: MatPaginator;
    @ViewChild('paginator2') paginator2!: MatPaginator;
    
    ngAfterViewInit() {
      this.dataSource.paginator = this.paginator1;
      this.OffdataSource.paginator = this.paginator2;
    }


    constructor(private router: Router,
      public _dialog: MatDialog,
      private formBuilder: FormBuilder, 
      private http: HttpClient,
      private sharedService: SharedService,
      private dataService: AffiliatesService,
      private dataTransferService: DataTransferService,
      private route: ActivatedRoute,
      private changeDetectorRef: ChangeDetectorRef,
      private ngZone: NgZone,
      private pdfExportService: PdfExportService,
      private csvExportService: CsvExportService,
      private get: FetchDataService)
      {
          this.affilOfficerForm = this.formBuilder.group({
            affiloffcisNumber: [''],
            affiloffFirstName: [''],
            affiloffMiddleName: [''],
            affiloffLastName: [''],
            affiloffPosition: [''],
          });
          this.affilOfficerRIForm = this.formBuilder.group({
            riCisNumber: [''],
            riFirstName: [''],
            riMiddleName: [''],
            riLastName: [''],
          });
          this.route.params.subscribe(params => {
            this.compId = params['id'];
            const companyName = this.sharedService.getCompName();

            this.get.getAffiliatesCompany((affilComp) => {
                // Process the data to count directors related to each company
                const companytoDisplay = companyName;
                const filteredCompany = affilComp.filter((company) => company.aff_com_cis_number === this.compId);
                for (const company of filteredCompany ) {
                  const Company = company.aff_com_company_name;
                  this.Company = Company;
                }
                  // Set the data source for your MatTable
              });
          });
      }

  
async  ngOnInit() {
  this.updateTableData();
  const transformedData = this.transformData(this.dataSource.data);
  // this.getmappedData
}



  // All Functions Below

  updateTableData(): void {
    // Get Directors
    this.get.getAffiliatesDirectors().subscribe((affilDirData) => {

      // if (affilDirData) {
          const filteredDirectors = affilDirData.filter((director) => director.com_related === this.compId);
          const relationColumn = ['MothersName', 'FathersName', 'Siblings', 'Spouse', 'Children', 'MotherinLaw', 'FatherinLaw', 
          'stepChild', 'sonDaughterInLaw', 'grandParents', 'grandParentsInLaw', 'sistersInLaw', 'brothersInLaw', 'grandChildren', 'grandChildrenInLaw'];
          const tableData: Record<string, any>[] = [];
          
          for (const director of filteredDirectors) {
              // const dir_relatedId = director.dir_cisnumber;
              const row: Record<string, any> = {
                  'id': director.id,
                  'FullName': `${director.fname} ${director.mname}  ${director.lname}`,
                  'Company': this.Company,
                  'Position': director.position,
                  'dir_CisNumber': director.dir_cisnumber,
                  'comp_CIS': director.com_related,
              };
              // Loop through each element in the 'relationColumn' array
              for (let index = 0; index < relationColumn.length; index++) {
                const relationName = relationColumn[index]; // Get the current relation name from the 'relationColumn' array
                if (director.related_interest) {
                    // Filter 'director.related_interest' array to get related names based on the relation index
                    const relatedData = director.related_interest
                    .filter(related => related.relation === index + 1)
                    // Create an object with the required properties
                    .map(related => ({
                        fullName: `${related.fname} ${related.mname} ${related.lname}`,
                        cisNumber: related.cis_number,
                        dirRelated: related.dir_related
                    }))
                    // Filter out objects with empty names (names with only whitespace)
                    .filter(data => typeof data.fullName === 'string' && data.fullName.trim() !== '');

            
                    // Assign the 'relatedNames' array to the 'row' object with the key as 'relationName'
                    row[relationName] = relatedData;
                } else {
                    // Handle the case where director.related_interest is not defined or null
                    row[relationName] = [];
                }
            }
          
              tableData.push(row);
          }
          
        // Sort tableData array by 'id' property from lowest to highest
        tableData.sort((a, b) => a['id'] - b['id']);
  
        // Assign tableData to dataSource.data
        this.dataSource.data = tableData;
        console.log(this.dataSource.data);

          this.changeDetectorRef.detectChanges();
    });


    // Get Officers
    this.get.getAffiliatesOfficers().subscribe((affilOffData) => {
      if (affilOffData) {
          const filteredOfficers = affilOffData.filter((director) => director.com_related === this.compId);
          const relationColumn = ['MothersName', 'FathersName', "Siblings", 'Spouse', 'Children', 'MotherinLaw', 'FatherinLaw', 
          'stepChild', 'sonDaughterInLaw', 'grandParents', 'grandParentsInLaw', 'sistersInLaw', 'brothersInLaw', 'grandChildren', 'grandChildrenInLaw'];
          const OfftableData: Record<string, any>[] = [];
          
          for (const officer of filteredOfficers) {
              // const dir_relatedId = director.dir_cisnumber;
              const row: Record<string, any> = {
                  'FullName': `${officer.fname} ${officer.mname}  ${officer.lname}`,
                  'Company': this.Company,
                  'Position': officer.position,
                  'off_CisNumber': officer.off_cisnumber,
                  'comp_CIS': officer.com_related,
              };
              // Loop through each element in the 'relationColumn' array
              for (let index = 0; index < relationColumn.length; index++) {
                const relationName = relationColumn[index]; // Get the current relation name from the 'relationColumn' array
                if (officer.related_interest) {
                    // Filter 'director.related_interest' array to get related names based on the relation index
                    const relatedData = officer.related_interest
                    .filter(related => related.relation === index + 1)
                    // Create an object with the required properties
                    .map(related => ({
                        fullName: `${related.fname} ${related.mname} ${related.lname}`,
                        cisNumber: related.cis_number,
                        offRelated: related.officer_related
                    }))
                    // Filter out objects with empty names (names with only whitespace)
                    .filter(data => typeof data.fullName === 'string' && data.fullName.trim() !== '');

            
                    // Assign the 'relatedNames' array to the 'row' object with the key as 'relationName'
                    row[relationName] = relatedData;
                } else {
                    // Handle the case where director.related_interest is not defined or null
                    row[relationName] = [];
                }
            }
          
            OfftableData.push(row);
          }
          
        this.OffdataSource.data = OfftableData;

        

          // Trigger change detection
          this.changeDetectorRef.detectChanges();
      }else {
        // Handle the case where affilDirData is null or undefined
      }
    });

    
  }



  openAffilDirectorsForm() {
    const dialogRef = this._dialog.open(AffiliatesDirModalComponent);
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.updateTableData();
        }
      },
    });
  }
  
  openEditAffilDirForm(data: any, event: any) {
    event.stopPropagation();
    const dialogRef = this._dialog.open(AffiliatesDirModalComponent, {
      data,    
    });
  
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          // this.getEmployeeList();
        }
      },
    });
  } 



  openAffilDirectorsRIForm() {
    const dialogRef = this._dialog.open(AffiliatesDirRIModalComponent);
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.updateTableData();
        }
      },
    });
  }
  
  openEditAffilDirRIForm(data: any, event: any) {
    event.stopPropagation();
    const dialogRef = this._dialog.open(AffiliatesDirRIModalComponent, {
      data,    
    });
  
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          // this.getEmployeeList();
        }
      },
    });
  }


  
  setButtonId(id: number, dirCisNumber: number) {
    // this.buttonId = id;
    // this.selectedDirCisNumber = dirCisNumber;
    this.dataService.setButtonId(id);
    this.dataService.setDirCIS(dirCisNumber);
 }

 setButtonIds(id: number, OffCisNumber: number) {
  //  this.buttonId = id;
   this.selectedOffCisNumber = OffCisNumber;
}

 setAffilComp() {
   this.selectedAffilCompCISNumber = this.compId;
 }

 setAffilCompOff() {
   this.selectedAffilCompCISNumber = this.compId;
 }

 setdirRelated() {
   // director = director.dir_related;
 }



 onOffRISubmit() {
   const directorId = this.sharedService.getDirectorId();
   const companyName = this.sharedService.getCompName();
   
  //  if (this.affilDirRiForm.valid) {
  //    const OffriData = this.affilOfficerRIForm.value;
     
  //    // Call the JavaScript function with form data
  //    createAffilOffRI(OffriData, this.buttonId, this.selectedOffCisNumber); // Pass the entire formData object
     
  //    this.ngOnInit();

     
  //  }

   this.ngZone.run(() => {
     // this.dataSource.data = this.tableData;
   });
   
     // Trigger change detection
   this.changeDetectorRef.detectChanges();
 }


 

 // Adding Affiliated Company Officers
 
 
 
 onAffilOffSubmit() {
   if (this.affilOfficerForm.valid) {
     const offData = this.affilOfficerForm.value;
     const directorId = this.sharedService.getDirectorId();
     const companyName = this.sharedService.getCompName();
     const session = sessionStorage.getItem('sessionID')?.replaceAll("\"", "");
     const userID = sessionStorage.getItem('userID')?.replaceAll("\"", "");
      
     // Call the JavaScript function with form data
     createAffilOff(offData, this.compId, session, userID); // Pass the entire formData object
     this.ngOnInit();

   }

   this.ngZone.run(() => {
     this.OffdataSource.data = this.OfftableData;
   });

     // Trigger change detection
   this.changeDetectorRef.detectChanges();
 }
 

//Delete Functions

// Unlink Directors of the Affiliates Company
delAffilDirector(row: any, dirAffilCIS: any, dirRelatComCIS: any): void {
  const cis_id = row.dir_CisNumber;
  delAffilComDIR(cis_id)
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


delAffilDirRI(element: any, cisNum: any, dirRelated: any): void {
 deleteAffilDirRI((dosriId) => {

 })
} 


delAffilOfficer(element: any, dirAffilCIS: any, offRelatComCIS: any): void {
 deleteAffilOff((dosriId) => {

 })
}



delAffilOffRI(element: any, cisNum: any, offRelated: any): void {
 deleteAffilOffRI((dosriId) => {

 })
}


// For export
// exportDataToCsv() {
//   const data = this.dataSource.data;
//   const fileName = 'exported_data.csv';
//   this.csvExportService.exportToCsv(data, fileName);
// }

transformData(originalData: any[]): any[] {
  return originalData.map(item => ({
    FullName: item.FullName,
    Company: item.Company,
    Position: item.Position,
    MothersName: this.joinNames(item.MothersName),
    FathersName: this.joinNames(item.FathersName),
    Siblings: this.joinNames(item.Siblings),
    Spouse: this.joinNames(item.Spouse),
    Children: this.joinNames(item.Children),
    MotherinLaw: this.joinNames(item.MotherinLaw),
    FatherinLaw: this.joinNames(item.FatherinLaw),
    stepChild: this.joinNames(item.stepChild),
    sonDaughterInLaw: this.joinNames(item.sonDaughterInLaw),
    grandParents: this.joinNames(item.grandParents),
    grandParentsInLaw: this.joinNames(item.grandParentsInLaw),
    sistersInLaw: this.joinNames(item.sistersInLaw),
    brothersInLaw: this.joinNames(item.brothersInLaw),
    grandChildren: this.joinNames(item.grandChildren),
    grandChildrenInLaw: this.joinNames(item.grandChildrenInLaw),
    // Add similar transformations for other array fields
  }));
}

joinNames(namesArray: any[]): string {
  return namesArray.map(nameObj => nameObj.fullName).join(' ');
}





downloadCSV(): void {
  const currentDate = new Date();
  let selectedDateFormatted: string = '';
  
  
  const formattedDate = selectedDateFormatted || currentDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
  const filename = `${this.Company}DirectorsRelatedInterest.csv`;
 
  const data = this.dataSource.data.map(item => {
    // Loop through each array and concatenate full names
    const mothersNames = item.MothersName.map(mother => mother.fullName).join(', ');
    const fathersNames = item.FathersName.map(father => father.fullName).join(', ');
    const siblings = item.Siblings.map(siblings => siblings.fullName).join(', ');
    const spouses = item.Spouse.map(spouse => spouse.fullName).join(', ');
    const childrenNames = item.Children.map(child => child.fullName).join(', ');
    const motherInLaws = item.MotherinLaw.map(motherInLaw => motherInLaw.fullName).join(', ');
    const fatherInLaws = item.FatherinLaw.map(fatherInLaw => fatherInLaw.fullName).join(', ');
    const stepchild = item.stepChild.map(stepchild => stepchild.fullName).join(', ');
    const sondaughterinlaw = item.sonDaughterInLaw.map(sondaughterinlaw => sondaughterinlaw.fullName).join(', ');
    const grandparents = item.grandParents.map(grandparents => grandparents.fullName).join(', ');
    const grandparentsinlaw = item.grandParentsInLaw.map(grandparentsinlaw => grandparentsinlaw.fullName).join(', ');
    const sistersinlaw = item.sistersInLaw.map(sistersinlaw => sistersinlaw.fullName).join(', ');
    const brothersinlaw = item.brothersInLaw.map(brothersinlaw => brothersinlaw.fullName).join(', ');
    const grandchildren = item.grandChildren.map(grandchildren => grandchildren.fullName).join(', ');
    const grandchildreninlaw = item.grandChildrenInLaw.map(grandchildreninlaw => grandchildreninlaw.fullName).join(', ');
    
    
    
    return {
      'CIS Number': item.dir_CisNumber,
      'Full Name': item.FullName,
      'Position': item.Position,
      "Mother's Name": mothersNames,
      "Father's Name": fathersNames,
      "Siblings": siblings,
      'Spouse': spouses,
      'Children': childrenNames,
      'Mother-In-Law': motherInLaws,
      'Father-In-Law': fatherInLaws,
      'Name of Stepchildren': stepchild,
      'Name of Son/Daughter-In-Law': sondaughterinlaw,
      'Grandparents': grandparents,
      'Grandparents-In-Law': grandparentsinlaw,
      'Sisters-In-Law': sistersinlaw,
      'Brothers-In-Law': brothersinlaw,
      'Grandchildren': grandchildren,
      'Grandchildren-In-Law': grandchildreninlaw
    };
  });

  // Specify the columns to include in the CSV
  const columnsToInclude = [
    'CIS Number', 'Full Name', 'Position', "Mother's Name",
    "Father's Name", 'Siblings', 'Spouse', 'Children', 'Mother-In-Law', 'Father-In-Law',
    'Name of Stepchildren', 'Name of Son/Daughter-In-Law', 'Grandparents', 'Grandparents-In-Law',
    'Sisters-In-Law', 'Brothers-In-Law', 'Grandchildren', 'Grandchildren-In-Law'
  ];
  this.csvExportService.DirectorOfficerRIToCSV(data, filename, columnsToInclude);
}






generatePDF(): void {
  const currentDate = new Date();
  let selectedDateFormatted: string = '';

  const formattedDate = selectedDateFormatted || currentDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
  const filename = `${this.Company}DirectorsRelatedInterest.pdf`;
  // const headerText = formattedDate;
  const headerText = this.Company;

  const data = this.dataSource.data.map(item => {
    // Loop through each array and concatenate full names
    const mothersNames = item.MothersName.map(mother => mother.fullName).join('\n');
    const fathersNames = item.FathersName.map(father => father.fullName).join('\n');
    const siblings = item.Siblings.map(siblings => siblings.fullName).join('\n');
    const spouses = item.Spouse.map(spouse => spouse.fullName).join('\n');
    const childrenNames = item.Children.map(child => child.fullName).join('\n');
    const motherInLaws = item.MotherinLaw.map(motherInLaw => motherInLaw.fullName).join('\n');
    const fatherInLaws = item.FatherinLaw.map(fatherInLaw => fatherInLaw.fullName).join('\n');
    const stepchild = item.stepChild.map(stepchild => stepchild.fullName).join('\n');
    const sondaughterinlaw = item.sonDaughterInLaw.map(sondaughterinlaw => sondaughterinlaw.fullName).join('\n');
    const grandparents = item.grandParents.map(grandparents => grandparents.fullName).join('\n');
    const grandparentsinlaw = item.grandParentsInLaw.map(grandparentsinlaw => grandparentsinlaw.fullName).join('\n');
    const sistersinlaw = item.sistersInLaw.map(sistersinlaw => sistersinlaw.fullName).join('\n');
    const brothersinlaw = item.brothersInLaw.map(brothersinlaw => brothersinlaw.fullName).join('\n');
    const grandchildren = item.grandChildren.map(grandchildren => grandchildren.fullName).join('\n');
    const grandchildreninlaw = item.grandChildrenInLaw.map(grandchildreninlaw => grandchildreninlaw.fullName).join('\n');
    
    
    return {
      'CIS Number': item.dir_CisNumber,
      'Full Name': item.FullName,
      'Position': item.Position,
      "Mother's Name": mothersNames,
      "Father's Name": fathersNames,
      "Siblings": siblings,
      'Spouse': spouses,
      'Children': childrenNames,
      'Mother-In-Law': motherInLaws,
      'Father-In-Law': fatherInLaws,
      'Name of Stepchildren': stepchild,
      'Name of Son/Daughter-In-Law': sondaughterinlaw,
      'Grandparents': grandparents,
      'Grandparents-In-Law': grandparentsinlaw,
      'Sisters-In-Law': sistersinlaw,
      'Brothers-In-Law': brothersinlaw,
      'Grandchildren': grandchildren,
      'Grandchildren-In-Law': grandchildreninlaw
    };
  });

  // Specify the columns to include in the CSV
  const columnsToInclude = [
    'CIS Number', 'Full Name', 'Position', "Mother's Name",
    "Father's Name", 'Siblings', 'Spouse', 'Children', 'Mother-In-Law', 'Father-In-Law',
    'Name of Stepchildren', 'Name of Son/Daughter-In-Law', 'Grandparents', 'Grandparents-In-Law',
    'Sisters-In-Law', 'Brothers-In-Law', 'Grandchildren', 'Grandchildren-In-Law'
  ];
  this.pdfExportService.generateAffDirRI(data, filename, columnsToInclude, headerText);
}

  

  
}
