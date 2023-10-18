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
import { SharedService } from './dataintegration/shared.service';

// Functions Imports
import {callJSFun} from '../../functions-files/javascriptfun.js';
import {getCompany, getDirectors} from '../../functions-files/getFunctions'
import {createDosri} from '../../functions-files/addDosri.js'


// Interfaces
export interface compData {
  com_cis_number: string;
  com_company_name: string,
  date_inserted: String,
  view: string,
}

export interface DData {
  dir_cisnumber: string;
  fname: string,
  mname: String,
  lname: string,
  fullname: string,
  view: string,
}



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
              private sharedService: SharedService) {
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
  }


  // All Functions below
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
      const directorId = row.com_cis_number; // Extract the ID from the clicked row
      const companyName = row.com_company_name;
      this.sharedService.setCompName(companyName);
      this.sharedService.setDirectorId(directorId);
      this.sharedService.setCompanyCis(companyName);
      console.log(directorId);
      console.log(companyName);
      console.log('row has been clicked');
      console.log('Clicked row data:', row);
      this.router.navigate(['/dri/directorsrelated', row.com_cis_number]);
    }
    
}
