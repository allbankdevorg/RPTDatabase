import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {animate, state, style, transition, trigger} from '@angular/animations'
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';

// Services
import { DataTransferService } from '../../services/data-transfer.service';

// Functions Imports
import {callJSFun} from '../../functions-files/javascriptfun.js';
import {getCompany, getDirectors} from '../../functions-files/getFunctions'
import {createDosri} from '../../functions-files/addDosri.js'


// Interfaces
export interface Child {
  name: string;
}


export interface compData {
  com_cis_number: string;
  com_company_name: string,
  date_inserted: String,
  // action: string,
  view: string,
  // children?: Child[];
}

export interface DData {
  dir_cisnumber: string;
  fname: string,
  mname: String,
  lname: string,
  fullname: string,
  view: string,
}

// export interface compData {
//   com_cis_number: string;
//   com_company_name: string;
//   date_inserted: Date;
//   action: string,
//   view: string,
// }


@Component({
  selector: 'app-dri',
  templateUrl: './dri.component.html',
  styleUrls: ['./dri.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

@Injectable({
  providedIn: 'root',
})

export class DRIComponent implements AfterViewInit {
  sharedData: string | any;
  postForm: FormGroup;
  dosriForm: FormGroup;
  data: any = [];

  
  // compDisplayColumns: string[] = [ 'com_cis_number', 'com_company_name', 'date_inserted'];
  // compToDisplayWithExpand = [...this.compDisplayColumns,];
  // expandedElement: compData | null = null;
  // compDataSource = new MatTableDataSource<compData>([]);
  
  compDataSource = new MatTableDataSource<compData>([]);
  ToDisplay: string[] = [];
  columnsToDisplay: string[] = ['expand', 'com_cis_number', 'com_company_name', 'directorCount', 'date_inserted', 'view'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay,];
  expandedElement: compData | null = null;

  DdisplayedColumns: string[] = ['dir_cisnumber', 'directorName', 'position'];
  dDataSource = new MatTableDataSource<DData>([]);


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  

  ngAfterViewInit() {
    this.compDataSource.paginator = this.paginator;
  }

  
  constructor(private router: Router,
              private formBuilder: FormBuilder, 
              private http: HttpClient, 
              private dataTransferService: DataTransferService) {
        this.postForm = this.formBuilder.group({
        title: ['', Validators.required],
        body: ['', Validators.required]
      });
      this.dosriForm = this.formBuilder.group({
        cisNumber: [''],
        accountName: [''],
        companyName: ['']
      });
    }


  ngOnInit(): void {
    callJSFun()

    // Fetch company data
    getCompany((compData) => {
      // Process the data to count directors related to each company
        const companiesWithDirectors = compData.map(company => {
          const directors = company.directors || []; // Ensure there is a directors array
          const directorCount = directors.length;
          return { ...company, directorCount, directors };
        });

        // Set the data source for your MatTable
        this.compDataSource.data = companiesWithDirectors;
      // // Fetch director data
      // getDirectors((DData) => {
      //   // Process the data to count directors related to each company
      //   const companiesWithDirectorCount = compData.map(company => ({
      //     ...company,
      //     directorCount: DData.filter(director => director.com_related === company.com_cis_number).length
      //   }));

      //   // Now, you can use 'companiesWithDirectorCount' in your DataTable
      //   this.compDataSource.data = companiesWithDirectorCount;
      //   console.log(companiesWithDirectorCount);
      // });
    });

    getCompany((compData) => {
      // Fetch director data
      getDirectors((DData) => {
        // Process the data to count directors related to each company
        const companiesWithDirectors: DData[] = compData.map(company => {
          const relatedDirectors = DData.filter(director => director.com_related === company.com_cis_number);
          return { ...company, directorCount: relatedDirectors.length, directors: relatedDirectors };
        });
    
        // Set the data source for your MatTable
        this.dDataSource.data = companiesWithDirectors;
        console.log(companiesWithDirectors)
      });
    });


    



    // getCompany((compData) => {
    //   // Handle the compData in your callback function
    //   console.log(compData);
    //   this.compDataSource.data = compData;
    // });
  //   getCompany((compData) => {
  //     // Fetch director data
  //     getDirectors((DData) => {
  //       // Process the data to count directors related to each company
  //       const companiesWithDirectors: DData[] = compData.map(company => {
  //         const relatedDirectors = DData.filter(director => director.com_related === company.com_cisnumber);
  //         return { ...company, directorCount: relatedDirectors.length, directors: relatedDirectors };
  //       });
    
  //       // Set the data source for your MatTable
  //       this.dDataSource.data = companiesWithDirectors;
  //       console.log(companiesWithDirectors);
  //     });
  //   });
  // }

    // getDirectors((DData) => {
    //   // Handle the compData in your callback function
    //   console.log(DData);
    //   this.dDataSource.data = DData;
    // });
    
    // const requestData = { cmd: 100 };

    // this.http.post<any>('http://10.0.0.208:8090/api/dataTables', requestData)
    // .subscribe((response: any) => {
    //   // Assuming response.result is an array with the Data array you want
    //   const data = response.result[0].Data;
    //   console.log(data);
    //   this.compDataSource.data = data;
    // });

    


  }


onSubmit() {
 
  if (this.dosriForm.valid) {
    const formData = this.dosriForm.value;

    // Call the JavaScript function with form data
    createDosri(formData); // Pass the entire formData object
  }
  
}

  addData() {
    
  }

  onButtonClick() {
    console.log('Show Modal');
    
  }

  onRowClick(row: any) {
    // Capture the selected data and navigate to another component with it
    // this.router.navigate(['/details', row.id]);
    console.log('row has been clicked');
    console.log('Clicked row data:', row);
    this.router.navigate(['/dri/directorsrelated', row.com_cis_number]);
  }
  
}


// Data Sets
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
//     Dname: 'John',
//     position: 'Director',
//     action: '',
//     view: '',
//   },
// ]


