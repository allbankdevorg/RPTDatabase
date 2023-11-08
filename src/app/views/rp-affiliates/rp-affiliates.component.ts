import { AfterViewInit, Component, ViewChild, NgZone, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {animate, state, style, transition, trigger} from '@angular/animations'
import {NgFor, NgIf} from '@angular/common';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

import { Injectable } from '@angular/core';
import axios, { AxiosRequestConfig } from 'axios';

// Services
import { SharedservicesService } from './dataintegration/sharedservices.service';

// Functions Import
import {getAffiliatesCompany, getAffiliatesDirectors} from '../../functions-files/getFunctions'
import {createAffil} from '../../functions-files/addAffiliates.js'

export interface Child {
  name: string;
}


export interface affiliatesData {
  aff_com_cis_number: number;
  aff_com_account_name: string;
  aff_com_company_name: string,
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

@Component({
  selector: 'app-rp-affiliates',
  templateUrl: './rp-affiliates.component.html',
  styleUrls: ['./rp-affiliates.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class RpAffiliatesComponent implements AfterViewInit {
  sharedData: string | any;
  affForm: FormGroup;


  //  displayedColumns: string[] = ['bn', 'Nodirectors', 'LDUpdated', 'view'];
  
  affDataSource = new MatTableDataSource<affiliatesData>([]);
  ToDisplay: string[] = [];
  columnsToDisplay: string[] = ['expand', 'aff_com_cis_number', 'aff_com_account_name', 'aff_com_company_name', 'directorCount', 'date_inserted', 'view'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay,];
  expandedElement: affiliatesData | null = null;

  DdisplayedColumns: string[] = ['aff_com_cis_number', 'fullname', 'aff_com_company_name'];
  affilDdataSource = new MatTableDataSource<DData>([]);



  @ViewChild(MatPaginator) paginator!: MatPaginator;


  

  ngAfterViewInit() {
    this.affDataSource.paginator = this.paginator;
  }

  
  

  constructor(private router: Router,
              private formBuilder: FormBuilder, 
              private http: HttpClient,
              private changeDetectorRef: ChangeDetectorRef,
              private ngZone: NgZone,
              private sharedService: SharedservicesService) {
    this.affForm = this.formBuilder.group({
      affilCisNumberM: [''],
      accountName: [''],
      companyName: ['']
    });
  }
  

  ngOnInit() {
    this.updateTableData();
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
  }
  

  onSubmit() {
    if (this.affForm.valid) {
      const formData = this.affForm.value;
      console.log(formData);
      // Call the JavaScript function with form data
      createAffil(formData); // Pass the entire formData object
    }
  }

  onButtonClick() {
    console.log('Add Data');
    
  }

  onRowClick(row: any) {
    console.log(row)
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
}




// Data Sets
// const Directors_DATA: DData[] = [
//   {
//     cis: 1000008792,
//     comN: "Company 1",
//     ofcrName: 'Avelina Caparros Pascua',
//     position: 'UBO',
//     action: '',
//     view: '',
//   },
//   {
//     cis: 1000008792,
//     comN: "Company 1",
//     ofcrName: 'Eva Rose M. Estampador',
//     position: 'Treasurer',
//     action: '',
//     view: '',
//   },
  
//   {
//     cis: 1000008792,
//     comN: "Company 1",
//     ofcrName: 'Momar A. Santos',
//     position: 'Director',
//     action: '',
//     view: '',
//   },

//   {
//     cis: 1000008793,
//     comN: "Company 2",
//     ofcrName: 'Momar A. Santos',
//     position: 'Director',
//     action: '',
//     view: '',
//   },
//   {
//     cis: 1000008793,
//     comN: "Company 2",
//     ofcrName: 'Momar A. Santos',
//     position: 'Director',
//     action: '',
//     view: '',
//   },

//   {
//     cis: 1000008794,
//     comN: "Company 3",
//     ofcrName: 'Avelina Caparros Pascua',
//     position: 'UBO',
//     action: '',
//     view: '',
//   },
//   {
//     cis: 1000008794,
//     comN: "Company 3",
//     ofcrName: 'Eva Rose M. Estampador',
//     position: 'Treasurer',
//     action: '',
//     view: '',
//   },
  
//   {
//     cis: 1000008795,
//     comN: "Company 4",
//     ofcrName: 'Momar A. Santos',
//     position: 'Director',
//     action: '',
//     view: '',
//   },
// ]


// const ELEMENT_DATA: affiliatesData[] = [
//   {
//     cis: 1000008792,
//     cn: "Company 1",
//     type: 'Affiliates',
//     LDUpdated: '2023-10-02 00:00:00',
//     action: '',
//     view: '',
//     // children: Directors_DATA.filter(director => director.cis === cis), // Filter related data
//     // children: [
//     //   { name: 'CAMACHO, JAVIER FAUSTO' },
//     //   { name: 'CAMACHO, GERARDO FAUSTO' },
//     //   {name: 'CAMACHO, ELIRITA FAUSTO'},
//     //   {name: 'CAMACHO, REGINA FAUSTO'},
//     //   {name: 'CAMACHO, ISABEL FAUSTO'},
//     //   {name: 'CAMACHO, RAFAEL FAUSTO'},
//     //   {name: 'CAMACHO, MIGUEL FAUSTO'},
//     // ]
//     // LDUpdated: '2021-11-01 00:00:00',
//   },
//   {
//     cis: 1000008793,
//     cn: "Company 2",
//     type: 'Affiliates',
//     LDUpdated: '2021-11-01 00:00:00',
//     action: '',
//     view: '',
//   },
//   {
//     cis: 1000008794,
//     cn: "Company 3",
//     type: 'Affiliates',
//     LDUpdated: '2021-11-01 00:00:00',
//     action: '',
//     view: '',
//   },
//   {
//     cis: 1000008795,
//     cn: "Company 4",
//     type: 'Affiliates',
//     LDUpdated: '2021-11-01 00:00:00',
//     action: '',
//     view: '',
//   },
// ];

// import { AfterViewInit, Component, ViewChild } from '@angular/core';


// import {animate, state, style, transition, trigger} from '@angular/animations'
// import { MatPaginator } from '@angular/material/paginator';
// import { MatTableDataSource } from '@angular/material/table';
// import { Router } from '@angular/router';

// import { Injectable } from '@angular/core';
// import axios, { AxiosRequestConfig } from 'axios';

// export interface Child {
//   name: string;
// }

// export interface Data {
//   bn: string;
//   Nodirectors: string,
//   LDUpdated: String,
//   action: string,
//   view: string,
//   children?: Child[];
// }

// export interface DData {
//   Cis: string;
//   Dname: string,
//   position: String,
//   action: string,
//   view: string,
// }

// export interface PeriodicElement {
//   name: string;
//   position: number;
//   weight: number;
//   symbol: string;
//   description: string;
// }

// @Component({
//   selector: 'app-dri',
//   templateUrl: './dri.component.html',
//   styleUrls: ['./dri.component.scss'],
//   animations: [
//     trigger('detailExpand', [
//       state('collapsed', style({height: '0px', minHeight: '0'})),
//       state('expanded', style({height: '*'})),
//       transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
//     ]),
//   ],
// })

// @Injectable({
//   providedIn: 'root',
// })

// export class DRIComponent implements AfterViewInit {
//   sharedData: string | any;

//   displayedColumns: string[] = ['action', 'bn', 'Nodirectors', 'LDUpdated', 'view'];
//   dataSource = new MatTableDataSource<Data>(ELEMENT_DATA);

//   DdisplayedColumns: string[] = ['Cis', 'Dname', 'position'];
//   DdataSource = new MatTableDataSource<DData>(Directors_DATA);


//   PdataSource = PELEMENT_DATA;
//   columnsToDisplay = ['name', 'weight', 'symbol', 'position'];
//   columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
//   expandedElement: PeriodicElement | null = null;
//   @ViewChild(MatPaginator) paginator!: MatPaginator;


  

//   ngAfterViewInit() {
//     this.dataSource.paginator = this.paginator;
//   }

  
  

//   constructor(private router: Router) {}
  

  
  

//   //All functions are below
//   //All Function below
//   onButtonClick() {
//     console.log('Add Data');
    
//   }

//   onRowClick(row: any) {
//     // Capture the selected data and navigate to another component with it
//     // this.router.navigate(['/details', row.id]);
//     console.log('row has been clicked');
//     console.log('Clicked row data:', row);
//     this.router.navigate(['/dri/directorsrelated', row.bn]);
//   }
// }

// const PELEMENT_DATA: PeriodicElement[] = [
//   {
//     position: 1,
//     name: 'Hydrogen',
//     weight: 1.0079,
//     symbol: 'H',
//     description: `Hydrogen is a chemical element with symbol H and atomic number 1. With a standard
//         atomic weight of 1.008, hydrogen is the lightest element on the periodic table.`,
//   },
// ]




// // Data Sets
// const ELEMENT_DATA: Data[] = [
//   {
//     bn: "Business001",
//     Nodirectors: '3',
//     LDUpdated: '2023-10-02 00:00:00',
//     action: '',
//     view: '',
//     // children: [
//     //   { name: 'CAMACHO, JAVIER FAUSTO' },
//     //   { name: 'CAMACHO, GERARDO FAUSTO' },
//     //   {name: 'CAMACHO, ELIRITA FAUSTO'},
//     //   {name: 'CAMACHO, REGINA FAUSTO'},
//     //   {name: 'CAMACHO, ISABEL FAUSTO'},
//     //   {name: 'CAMACHO, RAFAEL FAUSTO'},
//     //   {name: 'CAMACHO, MIGUEL FAUSTO'},
//     // ]
//     // LDUpdated: '2021-11-01 00:00:00',
//   },
//   {
//     bn: "Business002",
//     Nodirectors: '4',
//     LDUpdated: '2021-11-01 00:00:00',
//     action: '',
//     view: '',
//   },
//   {
//     bn: "Business003",
//     Nodirectors: '5',
//     LDUpdated: '2021-11-01 00:00:00',
//     action: '',
//     view: '',
//   },
//   {
//     bn: "Business004",
//     Nodirectors: '2',
//     LDUpdated: '2021-11-01 00:00:00',
//     action: '',
//     view: '',
//   },
//   {
//     bn: "Business005",
//     Nodirectors: '3',
//     LDUpdated: '2021-11-01 00:00:00',
//     action: '',
//     view: '',
//   },
//   {
//     bn: "Business006",
//     Nodirectors: '3',
//     LDUpdated: '2021-11-01 00:00:00',
//     action: '',
//     view: '',
//   },
//   {
//     bn: "Business007",
//     Nodirectors: '3',
//     LDUpdated: '2021-11-01 00:00:00',
//     action: '',
//     view: '',
//   },
//   {
//     bn: "Business008",
//     Nodirectors: '3',
//     LDUpdated: '2021-11-01 00:00:00',
//     action: '',
//     view: '',
//   },
//   {
//     bn: "Business009",
//     Nodirectors: '3',
//     LDUpdated: '2021-11-01 00:00:00',
//     action: '',
//     view: '',
//   },
//   {
//     bn: "Business010",
//     Nodirectors: '3',
//     LDUpdated: '2021-11-01 00:00:00',
//     action: '',
//     view: '',
//   },
// ];


// const Directors_DATA: DData[] = [
//   {
//     Cis: "1480001",
//     Dname: '3',
//     position: '2023-10-02 00:00:00',
//     action: '',
//     view: '',
//   },
// ] {


