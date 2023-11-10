import { AfterViewInit, Component, ViewChild, NgZone, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import {animate, state, style, transition, trigger} from '@angular/animations'
import {NgFor, NgIf} from '@angular/common';

import { MatOption } from '@angular/material/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {FormArray, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Router } from '@angular/router';

import { Injectable } from '@angular/core';
import axios, { AxiosRequestConfig } from 'axios';

// Services
import { SharedservicesService } from './dataintegration/sharedservices.service';

// Functions Import
import {getAffiliatesCompany, getAffiliatesDirectors, getManagingCompany} from '../../functions-files/getFunctions'
import {createAffil} from '../../functions-files/addAffiliates.js'

export interface Child {
  name: string;
}


export interface affiliatesData {
  aff_com_cis_number: number;
  aff_com_account_name: string;
  aff_com_company_name: string,
  manager: string;
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

interface Command {
  value: string;
  viewValue: string;
}

interface commandGroup {
  disabled?: boolean;
  name: string;
  command: Command[];
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
  compData: any = [];
  // commandGroups: commandGroup[] = []; // Moved initialization here
  commandGroups: any[] = [];
  //  displayedColumns: string[] = ['bn', 'Nodirectors', 'LDUpdated', 'view'];
  
  affDataSource = new MatTableDataSource<affiliatesData>([]);
  ToDisplay: string[] = [];
  columnsToDisplay: string[] = ['expand', 'aff_com_cis_number', 'aff_com_account_name', 'aff_com_company_name', 'manager', 'directorCount', 'date_inserted', 'view'];
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
      companyName: [''],
      commandControl: ['']
    });
    // Initialize the commandGroups array based on your data
    this.initializeCommandGroups();
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
        // console.log(this.affDataSource)
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

    getManagingCompany((mngComp) => {
      this.compData = mngComp;
    this.commandGroups = []; // Clear the existing commandGroups
    console.log(this.compData);

      if (mngComp) {
        const data = mngComp;
        console.log(data);
        data.forEach(item => {
          // Create a commandGroup item with value and viewValue
          const commandGroup = {
            value: item.aff_com_cis_number,
            viewValue: item.aff_com_company_name,
          };

          // Add the command group to the array
          this.commandGroups.push(commandGroup);
        });
      }
      // const data = this.compData.result[0].Data;
      // console.log(mngComp);
    })
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

  editaffiliates(row: any) {
    console.log(row);
    // this.affForm.affilCisNumberM.value
    
  }

  /// This method initializes the commandGroups array
  initializeCommandGroups() {
    
  }
}



