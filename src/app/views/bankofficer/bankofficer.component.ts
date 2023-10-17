import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { Injectable } from '@angular/core';

// Services
import { DataTransferService } from '../../services/data-transfer.service';

// Functions Import
import {createBankOfficer} from '../../functions-files/addBankOfficer';
import {createBankOfficerRelationship} from '../../functions-files/addBankOfficerRelationship';
import {getOfficers, getOfficersRI} from '../../functions-files/getFunctions'

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

@Component({
  selector: 'app-bankofficer',
  templateUrl: './bankofficer.component.html',
  styleUrls: ['./bankofficer.component.scss']
})

@Injectable({
  providedIn: 'root',
})

export class BankofficerComponent implements AfterViewInit {
  
  sharedData: string | any;
  
  boForm: FormGroup;
  boRIForm: FormGroup;
  buttonId: number = 0;

  displayedColumns: string[] = ['fname', 'com_related', 'position', 'mothersname', 'fathersname', 'spouse',
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
            this.boForm = this.formBuilder.group({
              boCisNumber: [''],
              boFirstName: [''],
              boMiddleName: [''],
              boLastName: [''],
              boPosition: [''],
          });
          this.boRIForm = this.formBuilder.group({
            boRICisNumber: [''],
            boRIFirstName: [''],
            boRIMiddleName: [''],
            boRILastName: [''],
        });
    }

  ngOnInit(): void {
    getOfficers((Data) => {
      // Process the data to count directors related to each company
        const companiesWithDirectors = Data.map(company => {
          const directors = company.directors || []; // Ensure there is a directors array
          const directorCount = directors.length;
          return { ...company, directorCount, directors };
        });

        // Set the data source for your MatTable
        this.dataSource.data = companiesWithDirectors;
    });
    getOfficersRI()
  }

  // Functions

  setButtonId(id: number) {
    this.buttonId = id;
  }

  onBOSubmit() {
 
    if (this.boForm.valid) {
      const boData = this.boForm.value;
  
      // Call the JavaScript function with form data
      createBankOfficer(boData); // Pass the entire formData object
    }
  }

  onBORISubmit() {
 
    if (this.boRIForm.valid) {
      const boRIData = this.boRIForm.value;
  
      // Call the JavaScript function with form data
      createBankOfficerRelationship(boRIData); // Pass the entire formData object
    }
  }

  // Start of Button Click
  onButtonClick() {
    console.log('Show Modal Form');
    
  }

  // addBankOfficer() {
  //   createBankOfficer()
  // }

  // addBankOfficerRS() {
  //   createBankOfficerRelationship()
  // }

}


// Data Sets
const ELEMENT_DATA: Data[] = [
  {
    fullname: "John Doe",
    company: 'All Bank',
    position: 'Director',
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
    fatherinlaw: 'sample',
  },
];
