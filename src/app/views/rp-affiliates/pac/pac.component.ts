import { Component, AfterViewInit,NgZone,ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { MatPaginator } from '@angular/material/paginator';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { ChangeDetectorRef } from '@angular/core';
import { Injectable } from '@angular/core';

// Services
import { DataTransferService } from '../../../services/data-transfer.service';
import { SharedService } from '../../dri/dataintegration/shared.service';

// Imports for Functions
import {createAffilDir} from '../../../functions-files/addAffiliatesDir';
import {createRelatedInterest} from '../../../functions-files/addRelatedInterest';
import {getCompany, getAffiliatesCompany, getAffiliatesDirectors, } from '../../../functions-files/getFunctions';
import {deleteDosri, deleteDirector, deleteRelationship} from '../../../functions-files/delFunctions'

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



// export interface Data {
//   bn: string;
//   Nodirectors: string,
//   LDUpdated: String,
//   children?: Child[];
// }

@Component({
  selector: 'app-pac',
  templateUrl: './pac.component.html',
  styleUrls: ['./pac.component.scss']
})
export class PACComponent implements AfterViewInit {
  
  sharedData: string | any;
  affilDrctrForm: FormGroup;
  affilDirRiForm: FormGroup;
  buttonId: number = 0;
  selectedDirCisNumber: number = 0;
  selectedCompCISNumber: number = 0;
  compId: any;
  compN: string = this.sharedService.getCompName();
  Company: any;
  selectedAffilCompCISNumber: number = 0;

  tableData: Record<string, any>[] = []; // Define tableData as a class property

  // displayedColumns: string[] = ['company', 'fullname', 'position', 'mothersname', 'fathersname', 'siblings', 'spouse',
  // 'children', 'motherinlaw', 'fatherinlaw', 'stepChild', 'sonDaughterInLaw', 'grandParents', 'grandParentsInLaw', 'sistersInLaw', 'brothersInLaw', 'grandChildren', 'grandChildrenInLaw'];
  // dataSource = new MatTableDataSource<Data>(ELEMENT_DATA);
  // company = this.dataSource.filteredData[0].company;

  // / Populating the dataSource
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = [ 'Company', 'FullName', 'Position', "MothersName", "FathersName", "Siblings", 'Spouse', 'Children', 'MotherinLaw', 'FatherinLaw',
            'stepChild', 'sonDaughterInLaw', 'grandParents', 'grandParentsInLaw', 'sistersInLaw', 'brothersInLaw', 'grandChildren', 'grandChildrenInLaw'];

   directorData: affilDirector[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    // console.log(this.dataSource.filteredData[0].company);
  }


  constructor(private router: Router,
      private formBuilder: FormBuilder, 
      private http: HttpClient,
      private sharedService: SharedService,
      private dataTransferService: DataTransferService,
      private route: ActivatedRoute,
      private changeDetectorRef: ChangeDetectorRef,
      private ngZone: NgZone)
      {
          this.affilDrctrForm = this.formBuilder.group({
            affildcisNumber: [''],
            affildFirstName: [''],
            affildMiddleName: [''],
            affildLastName: [''],
            affildPosition: [''],
          });
          this.affilDirRiForm = this.formBuilder.group({
            riCisNumber: [''],
            riFirstName: [''],
            riMiddleName: [''],
            riLastName: [''],
          });
          this.route.params.subscribe(params => {
            this.compId = params['id'];
            const companyName = this.sharedService.getCompName();

            getAffiliatesCompany((affilComp) => {
                // Process the data to count directors related to each company
                const companytoDisplay = companyName;
                console.log(affilComp);
                const filteredCompany = affilComp.filter((company) => company.aff_com_cis_number === this.compId);
                for (const company of filteredCompany ) {
                  const Company = company.aff_com_company_name;
                  this.Company = Company;
                }
                  // Set the data source for your MatTable
              });
          });
      }

async getAffilCompanyName(companyId: string): Promise<string> {
  // Call your external JavaScript function to get the company name
  const companyDetails = await getAffiliatesCompany(companyId);
  console.log(companyDetails);
  return companyDetails?.name || 'N/A';
}
  
async  ngOnInit() {
  this.updateTableData();
}



  // All Functions Below

  updateTableData(): void {
    getAffiliatesDirectors((affilDirData) => {
      // const directorIdToDisplay = directorId;
      console.log(affilDirData);
      // console.log('directorIdToDisplay:', directorIdToDisplay)
      // console.log(companytoDisplay);
      if (affilDirData) {
          const filteredDirectors = affilDirData.filter((director) => director.com_related === this.compId);
          console.log(filteredDirectors);
          const relationColumn = ['MothersName', 'FathersName', 'Spouse', 'Children', 'MotherinLaw', 'FatherinLaw', 
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
              console.log(this.Company);
              // Loop through each element in the 'relationColumn' array
              for (let index = 0; index < relationColumn.length; index++) {
                const relationName = relationColumn[index]; // Get the current relation name from the 'relationColumn' array
                if (director.related_interest) {
                    // Filter 'director.related_interest' array to get related names based on the relation index
                    const relatedNames = director.related_interest
                        .filter(related => related.relation === index + 1)
                        // Create a full name by concatenating 'fname', 'mname', and 'lname'
                        .map(related => `${related.fname} ${related.mname} ${related.lname}`)
                        // Filter out empty names (names with only whitespace)
                        .filter(name => name.trim() !== '');
            
                    // Assign the 'relatedNames' array to the 'row' object with the key as 'relationName'
                    row[relationName] = relatedNames;
                } else {
                    // Handle the case where director.related_interest is not defined or null
                    row[relationName] = [];
                }
            }
          
              tableData.push(row);
              console.log(tableData);
          }
          
        this.dataSource.data = tableData;

        

          // Trigger change detection
          this.changeDetectorRef.detectChanges();
      }else {
        // Handle the case where affilDirData is null or undefined
        console.error('No directors');
      }
    });
    
  }

  setButtonId(id: number, dirCisNumber: number) {
    // this.buttonId = id;
    // this.selectedDirCisNumber = dirCisNumber;
    console.log(dirCisNumber);
    
  }

  setAffilComp() {
    this.selectedAffilCompCISNumber = this.compId;
    console.log(this.selectedAffilCompCISNumber)
  }

  setdirRelated() {
    // director = director.dir_related;
    // console.log(director);
  }

  //Adding Related Interest 
  onRISubmit() {
    const directorId = this.sharedService.getDirectorId();
    const companyName = this.sharedService.getCompName();
    
    if (this.affilDirRiForm.valid) {
      const riData = this.affilDirRiForm.value;
      
      // Call the JavaScript function with form data
      createRelatedInterest(riData, this.buttonId, this.selectedDirCisNumber); // Pass the entire formData object
      
      this.ngOnInit();

      
    }

    this.ngZone.run(() => {
      // this.dataSource.data = this.tableData;
    });
    
      // Trigger change detection
    this.changeDetectorRef.detectChanges();
    console.log(this.changeDetectorRef.detectChanges);
    console.log(this.dataSource);
  }


  // Adding Affiliated Company Directors
  onAffilDSubmit() {
    if (this.affilDrctrForm.valid) {
      const directData = this.affilDrctrForm.value;
      const directorId = this.sharedService.getDirectorId();
      const companyName = this.sharedService.getCompName();
      
      console.log(directData);
      // Call the JavaScript function with form data
      createAffilDir(directData, this.compId); // Pass the entire formData object
      this.ngOnInit();

      
    }

    this.ngZone.run(() => {
      this.dataSource.data = this.tableData;
    });

      // Trigger change detection
    this.changeDetectorRef.detectChanges();
    console.log(this.changeDetectorRef.detectChanges);
    console.log(this.dataSource);
  }

}



// Data Sets
// const ELEMENT_DATA: Data[] = [
//   {
//     company: 'Prescription Holdings Limited, Inc.',
//     fullname: "Avelina Caparros Pascua",
//     position: "UBO",
//     mothersname: [
//       { name: 'Rosario I. Caparros (+)'}
//     ],
//     fathersname: [
//       { name: 'Gerardo O. Caparros (+)'}
//     ],
//     siblings: [
//       {name: 'Eugenio I. Caparros (+)'},
//       {name: 'Carmelo I. Caparros (+)'},
//       {name: 'Carmelo I. Caparros (+)'}
//     ],
//     spouse: [
//       {name: 'Deogracias C. Pascua, Jr.'}
//     ],
//     children: [
//       { name: 'Zarah Angeline P. Dilig' },
//     ],
//     motherinlaw: [
//       {name: 'Estelita Centeno Pascua (+)'}
//     ],
//     fatherinlaw: [
//       {name: 'Deogracias D. Pascua, Sr. (+)'}
//     ],
//     stepChild: [],
//     sonDaughterInLaw: [
//       {name: 'Grego C. Dilig'}],
//     grandParents: [],
//     grandParentsInLaw: [],
//     sistersInLaw: [],
//     brothersInLaw: [],
//     grandChildren: [
//       {name: 'Jamie Sky P. Dilig'},
//       {name: 'Lucas Zac P. Dilig'}
//     ],
//     grandChildrenInLaw: [],
//   },
// ];