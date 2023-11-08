import { Component, AfterViewInit, ViewChild, NgZone, ChangeDetectionStrategy } from '@angular/core';
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
import { SharedService } from '../dataintegration/shared.service';

// Imports for Functions
import {createDirectors} from '../../../functions-files/addDirectors';
import {createRelatedInterest} from '../../../functions-files/addRelatedInterest';
import {getCompany, getDirectors} from '../../../functions-files/getFunctions';
import {deleteDosri, deleteDirector, deleteRelationship} from '../../../functions-files/delFunctions'

export interface Child {
  name: string;
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
interface Director {
  id: number;
  com_related: string;
  dir_cisnumber: string;
  fname: string;
  mname: string;
  lname: string;
  position: string;
  related_interest: RelatedInterest[];
}


@Component({
  selector: 'app-directorsrelated',
  templateUrl: './directorsrelated.component.html',
  styleUrls: ['./directorsrelated.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
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
  selectedDirCisNumber: number = 0;
  selectedCompCISNumber: number = 0;
  directorsData: Director[] = []; // This should be populated with your director data
  filteredDirectors: Director[] = [];
  compId: any;
  compN: string = this.sharedService.getCompName();
  Company: any;

  tableData: Record<string, any>[] = []; // Define tableData as a class property

  
  // Populating the dataSource
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = [ 'FullName', 'Company', 'Position', "MothersName", "FathersName", 'Spouse', 'Children', 'MotherinLaw', 'FatherinLaw'];

   directorData: Director[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('relationShipModal', { static: true }) relationShipModal: any;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
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
      this.compId = params['id'];
    const companyName = this.sharedService.getCompName();

      getCompany((compData) => {
        // Process the data to count directors related to each company
        const companytoDisplay = companyName;
        
        const filteredCompany = compData.filter((company) => company.com_cis_number === this.compId);
        
        for (const company of filteredCompany ) {
          const Company = company.com_company_name;
          this.Company = Company;
        }
          // Set the data source for your MatTable
      });
    });
  }

  async getCompanyName(companyId: string): Promise<string> {
    // Call your external JavaScript function to get the company name
    const companyDetails = await getCompany(companyId);
    return companyDetails?.name || 'N/A';
  }

 async  ngOnInit() {
     this.updateTableData();
  }

  // All Functions Below

  updateTableData(): void {
    getDirectors((Director) => {
      // const directorIdToDisplay = directorId;
      
      // console.log('directorIdToDisplay:', directorIdToDisplay)
      // console.log(companytoDisplay);
      const filteredDirectors = Director.filter((director) => director.com_related === this.compId);
      
      const relationColumn = ['MothersName', 'FathersName', 'Spouse', 'Children', 'MotherinLaw', 'FatherinLaw'];
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
          // Loop through each element in the 'relationColumn' array
          for (let index = 0; index < relationColumn.length; index++) {
              const relationName = relationColumn[index]; // Get the current relation name from the 'relationColumn' array
              // Filter 'director.related_interest' array to get related names based on the relation index
              const relatedNames = director.related_interest 
                  .filter(related => related.relation === index + 1)
                  // Create a full name by concatenating 'fname', 'mname', and 'lname'
                  .map(related => `${related.fname} ${related.mname} ${related.lname}`)
                  // Filter out empty names (names with only whitespace)
                  .filter(name => name.trim() !== '');

              // Assign the 'relatedNames' array to the 'row' object with the key as 'relationName'
              row[relationName] = relatedNames;
          }
      
          tableData.push(row);
      }
      
     this.dataSource.data = tableData;

      // Trigger change detection
      this.changeDetectorRef.detectChanges();
    });
    
  }

  
  setButtonId(id: number, dirCisNumber: number) {
    this.buttonId = id;
    this.selectedDirCisNumber = dirCisNumber;
    console.log(dirCisNumber);
    
  }

  setComp() {
    this.selectedCompCISNumber = this.compId;
    console.log(this.selectedCompCISNumber)
  }


  setdirRelated() {
    // director = director.dir_related;
    // console.log(director);
  }

  // Adding Directors
  onDSubmit() {
 
    if (this.drctrForm.valid) {
      const directData = this.drctrForm.value;
      const directorId = this.sharedService.getDirectorId();
      const companyName = this.sharedService.getCompName();
    
      // Call the JavaScript function with form data
      createDirectors(directData, this.selectedCompCISNumber); // Pass the entire formData object
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

  //Adding Related Interest 
  onRISubmit() {
    const directorId = this.sharedService.getDirectorId();
    const companyName = this.sharedService.getCompName();
    
    if (this.riForm.valid) {
      const riData = this.riForm.value;
      
      // Call the JavaScript function with form data
      createRelatedInterest(riData, this.buttonId, this.selectedDirCisNumber); // Pass the entire formData object
      
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

  //Showing Modal
  onButtonClick() {
    console.log('Show Modal Form');
    
  }

  // Getting the director_CISnumber
  display(row: any) {
      const directorId = row.com_cis_number; // Extract the ID from the clicked row
      const companyName = row.com_company_name;
      this.sharedService.setCompName(companyName);
      this.sharedService.setDirectorId(directorId);
      console.log(directorId);
      console.log(companyName);
      console.log('row has been clicked');
      console.log('Clicked row data:', row);
  }


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

