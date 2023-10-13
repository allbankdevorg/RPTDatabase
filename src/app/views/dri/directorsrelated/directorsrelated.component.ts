import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { MatPaginator } from '@angular/material/paginator';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


import { Injectable } from '@angular/core';

// Services
import { DataTransferService } from '../../../services/data-transfer.service';

// Imports for Functions
import {createDirectors} from '../../../functions-files/addDirectors';
import {createRelatedInterest} from '../../../functions-files/addRelatedInterest';
import {deleteDosri, deleteDirector, deleteRelationship} from '../../../functions-files/delFunctions'

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
  children?: Child[];
  motherinlaw: String,
  fatherinlaw: String,
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
  
  sharedData: string | any;
  // relationShipModal: any;
  drctrForm: FormGroup;
  riForm: FormGroup;
  buttonId: number = 0;

  displayedColumns: string[] = ['fullname', 'company', 'position', 'mothersname', 'fathersname', 'spouse',
  'children', 'motherinlaw', 'fatherinlaw'];
  dataSource = new MatTableDataSource<Data>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator!: MatPaginator;


  

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }


  constructor(private router: Router,
              private formBuilder: FormBuilder, 
              private http: HttpClient, 
              private dataTransferService: DataTransferService)
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
  }


  ngOnInit(): void {
    
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
const ELEMENT_DATA: Data[] = [
  {
    fullname: "John Doe",
    company: 'All Bank',
    position: 'Executive Director',
    mothersname: 'sample',
    fathersname: 'sample',
    spouse: 'sample',
    children: [
      { name: 'CAMACHO, JAVIER FAUSTO' },
      { name: 'CAMACHO, GERARDO FAUSTO' },
      {name: 'CAMACHO, ELIRITA FAUSTO'},
      {name: 'CAMACHO, REGINA FAUSTO'},
    ],
    motherinlaw: 'sample',
    fatherinlaw: '',
  },
];