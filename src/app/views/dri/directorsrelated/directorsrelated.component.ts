import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { MatPaginator } from '@angular/material/paginator';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';


import { Injectable } from '@angular/core';

// Services
import { DataTransferService } from '../../../services/data-transfer.service';
import { SharedService } from '../dataintegration/shared.service';

// Imports for Functions
import {createDirectors} from '../../../functions-files/addDirectors';
import {createRelatedInterest} from '../../../functions-files/addRelatedInterest';
import {getCompany, getDirectors} from '../../../functions-files/getFunctions'
import {deleteDosri, deleteDirector, deleteRelationship} from '../../../functions-files/delFunctions'

export interface Child {
  name: string;
}

// export interface Data {
//   com_related: string;
//   dir_cisnumber: string;
//   fname: string;
//   company: string,
//   position: String,
//   mothersname: String,
//   fathersname: String,
//   spouse: String,
//   children?: Child[];
//   motherinlaw: String,
//   fatherinlaw: String,
// }

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
  related_interest: RelatedInterest[];
}


// export interface Data {
//   bn: string;
//   Nodirectors: string,
//   LDUpdated: String,
//   children?: Child[];
// }


@Component({
  selector: 'app-directorsrelated',
  templateUrl: './directorsrelated.component.html',
  styleUrls: ['./directorsrelated.component.scss']
})

@Injectable({
  providedIn: 'root',
})
export class DirectorsrelatedComponent implements AfterViewInit {
  companyDetails: any; //a variable to hold the fetched company details:\
  sharedData: string | any;
  // relationShipModal: any;
  drctrForm: FormGroup;
  riForm: FormGroup;
  buttonId: number = 0;
  directorsData: Director[] = []; // This should be populated with your director data
  filteredDirectors: Director[] = [];

  // dataSource = new MatTableDataSource<Data>(ELEMENT_DATA);
  dataSource = new MatTableDataSource<Director>([]);
  displayedColumns: string[] = ['fname', 'company', 'position', 'mothersname', 'fathersname', 'spouse',
  'children', 'motherinlaw', 'fatherinlaw'];
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;


  

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }


  constructor(private router: Router,
              private formBuilder: FormBuilder, 
              private http: HttpClient,
              private sharedService: SharedService,
              private dataTransferService: DataTransferService,
              private route: ActivatedRoute)
  {
    this.drctrForm = this.formBuilder.group({
      cisNumber: [''],
      dFirstName: [''],
      dMiddleName: [''],
      dLastName: [''],
      dPosition: [''],
    });
    this.riForm = this.formBuilder.group({
      riCisNumber: [''],
      riFirstName: [''],
      riMiddleName: [''],
      riLastName: [''],
    });

    this.route.params.subscribe(params => {
      const companyId = params['id'];
      // Fetch director data and related interests based on companyId
      // Display this data in your component's data tables
    });
  }


  ngOnInit(): void {
    const directorId = this.sharedService.getDirectorId();

    getDirectors((Director) => {
      // Get the directorId to display
        const directorIdToDisplay = directorId;

        // Filter the directors based on directorIdToDisplay
        const filteredDirectors = Director.filter((director) => director.com_related === directorIdToDisplay);

        // Set the data source for your MatTable
        this.dataSource.data = filteredDirectors;
        console.log(filteredDirectors);
    });
    // this.route.params.subscribe(params => {
    //   const companyId = params['companyId'];
    //   // Use the companyId to fetch related data
    //   // this.fetchDataForCompany(companyId);
    // });
    //   // this.dataTransferService.getCompanyData().subscribe((data) => {
    //   //   this.companyDetails = data;
    //   // });

    //   this.dataTransferService.getDirectors().subscribe((data) => {
    //     // this.directorsData = data;
    //     this.dataSource = data;
    //   });
      
    //   // Fetch data using your service
    // this.dataTransferService.getCompanyData().subscribe((data) => {
    //   this.dataSource = data;
    // });
  }
  
  

  // Functions
  setButtonId(id: number) {
    this.buttonId = id;
  }

  onDSubmit() {
 
    if (this.drctrForm.valid) {
      const directData = this.drctrForm.value;
  
      // Call the JavaScript function with form data
      createDirectors(directData); // Pass the entire formData object
    }
  }

  onRISubmit() {
 
    if (this.riForm.valid) {
      const riData = this.riForm.value;
  
      // Call the JavaScript function with form data
      createRelatedInterest(riData, this.buttonId); // Pass the entire formData object
    }
  }

  // Start of Button Click
  onButtonClick() {
    console.log('Show Modal Form');
    
  }

  // addDirectors() {
  //   // createDirectors()
  // }

  // addRelatedInterest() {
  //   // createRelatedInterest()
  // }

  delDosri() {
    // deleteDosri()
  }

  delDirector() {
    // deleteDirector()
  }

  delRelationship() {
    // deleteRelationship()
  }

}


// Data Sets
// const ELEMENT_DATA: Data[] = [
//   {
//     fullname: "John Doe",
//     company: 'All Bank',
//     position: 'Executive Director',
//     mothersname: 'sample',
//     fathersname: 'sample',
//     spouse: 'sample',
//     children: [
//       { name: 'CAMACHO, JAVIER FAUSTO' },
//       { name: 'CAMACHO, GERARDO FAUSTO' },
//       {name: 'CAMACHO, ELIRITA FAUSTO'},
//       {name: 'CAMACHO, REGINA FAUSTO'},
//     ],
//     motherinlaw: 'sample',
//     fatherinlaw: '',
//   },
// ];