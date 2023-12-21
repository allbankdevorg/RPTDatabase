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

// Imports for Functions
import {createAffilDir, createAffilOff, createRPDIrectorsRelatedInterest, createAffilOffRI} from '../../../functions-files/add/postAPI';
import {getCompany, getAffiliatesCompany, getAffiliatesDirectors, getAffiliatesOfficers } from '../../../functions-files/getFunctions';
import {deleteAffilDir, deleteAffilOff, deleteAffilDirRI, deleteAffilOffRI} from '../../../functions-files/delFunctions'

//For export
import { CsvExportService } from '../../exportservices/csv-export.service';
// import Papa from 'papaparse';
import { FetchDataService } from 'src/app/services/fetch/fetch-data.service';


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
  affilDrctrForm: FormGroup;
  affilDirRiForm: FormGroup;
  affilOfficerForm: FormGroup;
  affilOfficerRIForm: FormGroup;
  buttonId: number = 0;
  selectedDirCisNumber: number = 0;
  selectedOffCisNumber: number = 0;
  selectedCompCISNumber: number = 0;
  compId: any;
  compN: string = this.sharedService.getCompName();
  Company: any;
  selectedAffilCompCISNumber: number = 0;

  tableData: Record<string, any>[] = []; // Define tableData as a class property
  OfftableData: Record<string, any>[] = [];

    // / Populating the dataSource
    dataSource = new MatTableDataSource();
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
      // console.log(this.dataSource.filteredData[0].company);
    }


    constructor(private router: Router,
      private formBuilder: FormBuilder, 
      private http: HttpClient,
      private sharedService: SharedService,
      private dataTransferService: DataTransferService,
      private route: ActivatedRoute,
      private changeDetectorRef: ChangeDetectorRef,
      private ngZone: NgZone,
      private csvExportService: CsvExportService,
      private get: FetchDataService)
      {
          this.affilDrctrForm = this.formBuilder.group({
            affildcisNumber: ['',  [Validators.required]],
            affildFirstName: ['', [Validators.required]],
            affildMiddleName: [''],
            affildLastName: ['', [Validators.required]],
            affildPosition: ['', [Validators.required]],
          });
          this.affilDirRiForm = this.formBuilder.group({
            riCisNumber: [''],
            riFirstName: ['', [Validators.required]],
            riMiddleName: [''],
            riLastName: ['', [Validators.required]],
          });
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
                // console.log(affilComp);
                const filteredCompany = affilComp.filter((company) => company.aff_com_cis_number === this.compId);
                for (const company of filteredCompany ) {
                  const Company = company.aff_com_company_name;
                  this.Company = Company;
                }
                  // Set the data source for your MatTable
              });
          });
      }

// async getAffilCompanyName(companyId: string): Promise<string> {
//   // Call your external JavaScript function to get the company name
//   const companyDetails = await getAffiliatesCompany(companyId);
//   console.log(companyDetails);
//   return companyDetails?.name || 'N/A';
// }
  
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
          // console.log(filteredDirectors);
          const relationColumn = ['MothersName', 'FathersName', 'Siblings', 'Spouse', 'Children', 'MotherinLaw', 'FatherinLaw', 
          'stepChild', 'sonDaughterInLaw', 'grandParents', 'grandParentsInLaw', 'sistersInLaw', 'brothersInLaw', 'grandChildren', 'grandChildrenInLaw'];
          const tableData: Record<string, any>[] = [];
          
          for (const director of filteredDirectors) {
              // const dir_relatedId = director.dir_cisnumber;
              const row: Record<string, any> = {
                  'FullName': `${director.fname} ${director.mname}  ${director.lname}`,
                  'Company': this.Company,
                  'Position': director.position,
                  'dir_CisNumber': director.dir_cisnumber,
                  'comp_CIS': director.com_related,
              };
              // console.log(this.Company);
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
              // console.log(tableData);
          }
          
        this.dataSource.data = tableData;

        

          // Trigger change detection
          this.changeDetectorRef.detectChanges();
      // }else {
        // Handle the case where affilDirData is null or undefined
      //   console.error('No directors');
      // }
    });


    // Get Officers
    this.get.getAffiliatesOfficers().subscribe((affilOffData) => {
      // const directorIdToDisplay = directorId;
      // console.log(affilOffData);
      // console.log('directorIdToDisplay:', directorIdToDisplay)
      // console.log(companytoDisplay);
      if (affilOffData) {
          const filteredOfficers = affilOffData.filter((director) => director.com_related === this.compId);
          // console.log(filteredOfficers);
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
              // console.log(this.Company);
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
              // console.log(OfftableData);
          }
          
        this.OffdataSource.data = OfftableData;

        

          // Trigger change detection
          this.changeDetectorRef.detectChanges();
      }else {
        // Handle the case where affilDirData is null or undefined
        // console.error('No directors');
      }
    });

    
  }


  
  setButtonId(id: number, dirCisNumber: number) {
    this.buttonId = id;
    this.selectedDirCisNumber = dirCisNumber;
  //  console.log(dirCisNumber);
  //  console.log(id);
 }

 setButtonIds(id: number, OffCisNumber: number) {
   this.buttonId = id;
   this.selectedOffCisNumber = OffCisNumber;
  // console.log(OffCisNumber);
  // console.log(id);
}

 setAffilComp() {
   this.selectedAffilCompCISNumber = this.compId;
  //  console.log(this.selectedAffilCompCISNumber)
 }

 setAffilCompOff() {
   this.selectedAffilCompCISNumber = this.compId;
  //  console.log(this.selectedAffilCompCISNumber)
 }

 setdirRelated() {
   // director = director.dir_related;
   // console.log(director);
 }

 //Adding Related Interest 
 onDirRISubmit() {
   const directorId = this.sharedService.getDirectorId();
   const companyName = this.sharedService.getCompName();
   
   if (this.affilDirRiForm.valid) {
     const riData = this.affilDirRiForm.value;
     
     // Call the JavaScript function with form data
     createRPDIrectorsRelatedInterest(riData, this.buttonId, this.selectedDirCisNumber); // Pass the entire formData object
     
     this.ngOnInit();

     
   }

   this.ngZone.run(() => {
     this.dataSource.data = this.tableData;
   });
   
     // Trigger change detection
   this.changeDetectorRef.detectChanges();
  //  console.log(this.changeDetectorRef.detectChanges);
  //  console.log(this.dataSource);
 }

 onOffRISubmit() {
   const directorId = this.sharedService.getDirectorId();
   const companyName = this.sharedService.getCompName();
   
   if (this.affilDirRiForm.valid) {
     const OffriData = this.affilOfficerRIForm.value;
     
     // Call the JavaScript function with form data
     createAffilOffRI(OffriData, this.buttonId, this.selectedOffCisNumber); // Pass the entire formData object
     
     this.ngOnInit();

     
   }

   this.ngZone.run(() => {
     // this.dataSource.data = this.tableData;
   });
   
     // Trigger change detection
   this.changeDetectorRef.detectChanges();
  //  console.log(this.changeDetectorRef.detectChanges);
  //  console.log(this.dataSource);
 }


 // Adding Affiliated Company Directors
 onAffilDSubmit() {
   if (this.affilDrctrForm.valid) {
     const directData = this.affilDrctrForm.value;
     const directorId = this.sharedService.getDirectorId();
     const companyName = this.sharedService.getCompName();
     
    //  console.log(directData);
     // Call the JavaScript function with form data
     createAffilDir(directData, this.compId); // Pass the entire formData object
     this.ngOnInit();

     
   }

   this.ngZone.run(() => {
     this.dataSource.data = this.tableData;
   });

     // Trigger change detection
   this.changeDetectorRef.detectChanges();
  //  console.log(this.changeDetectorRef.detectChanges);
  //  console.log(this.dataSource);
 }

 // Adding Affiliated Company Officers
 onAffilOffSubmit() {
   if (this.affilOfficerForm.valid) {
     const offData = this.affilOfficerForm.value;
     const directorId = this.sharedService.getDirectorId();
     const companyName = this.sharedService.getCompName();
     
     // console.log(directData);
     // Call the JavaScript function with form data
     createAffilOff(offData, this.compId); // Pass the entire formData object
     this.ngOnInit();

    //  console.log(offData);
   }

   this.ngZone.run(() => {
     this.OffdataSource.data = this.OfftableData;
   });

     // Trigger change detection
   this.changeDetectorRef.detectChanges();
   // console.log(this.changeDetectorRef.detectChanges);
   // console.log(this.OffdataSource);
 }
 

//Delete Functions
delAffilDirector(element: any, dirAffilCIS: any, dirRelatComCIS: any): void {
//  console.log(element);
//  console.log(dirAffilCIS);
//  console.log(dirRelatComCIS);
 deleteAffilDir((dosriId) => {

 })
}

delAffilDirRI(element: any, cisNum: any, dirRelated: any): void {
 // deleteRelationship()
//  console.log(element);
//  console.log(cisNum);
//  console.log(dirRelated);
//  console.log("Are you sure you want to delete?")
 deleteAffilDirRI((dosriId) => {

 })
} 


delAffilOfficer(element: any, dirAffilCIS: any, offRelatComCIS: any): void {
//  console.log(element);
//  console.log(dirAffilCIS);
//  console.log(offRelatComCIS);
 deleteAffilOff((dosriId) => {

 })
}



delAffilOffRI(element: any, cisNum: any, offRelated: any): void {
//  console.log(element);
//  console.log(cisNum);
//  console.log(offRelated);
 // deleteRelationship()
//  console.log("Are you sure you want to delete?")
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

// exportDataToCsv(data: any[]) {
//   const csv = Papa.unparse(data, {
//     header: true,
//     quotes: true
//   });

//   const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

//   // Create a download link
//   const link = document.createElement('a');
//   link.href = URL.createObjectURL(blob);
//   link.download = 'export.csv';

//   // Append the link to the body and trigger the click event
//   document.body.appendChild(link);
//   link.click();

//   // Clean up
//   document.body.removeChild(link);
// }


  

  
}
