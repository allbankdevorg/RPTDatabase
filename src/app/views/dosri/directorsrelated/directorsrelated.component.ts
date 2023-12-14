import { Component, AfterViewInit, ViewChild, NgZone, ChangeDetectionStrategy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import {TooltipPosition} from '@angular/material/tooltip';

import { MatPaginator } from '@angular/material/paginator';


import { AbstractControl, FormControl, ValidationErrors, ValidatorFn, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { ChangeDetectorRef } from '@angular/core';
import { Injectable } from '@angular/core';

// Services
import { DataTransferService } from '../../../services/data-transfer.service';
import { SharedService } from '../dataintegration/shared.service';

// Imports for Functions
import {createDirectors} from '../../../functions-files/add/postAPI';
import {createRelatedInterest} from '../../../functions-files/add/postAPI';
import {getCompany, getDirectors} from '../../../functions-files/getFunctions';
import {deleteDosri, deleteDOSRIDirector, deleteDOSRIDirRelationship} from '../../../functions-files/delFunctions'
import { FetchDataService } from 'src/app/services/fetch/fetch-data.service';


// Audit Trail
import { AuditTrailService } from '../../../services/auditTrail/audit-trail.service';
import {AuditTrail} from '../../../model/audit-trail.model';

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
  styleUrls: ['./directorsrelated.component.scss']
})

@Injectable({
  providedIn: 'root',
})
export class DirectorsrelatedComponent {
  positionOptions: TooltipPosition = 'right';
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
              private ngZone: NgZone,
              private get: FetchDataService,
              private auditTrailService: AuditTrailService)
  {
    this.drctrForm = this.formBuilder.group({
      cisNumber: ['', [Validators.required]],
      dFirstName: ['', [Validators.required]],
      dMiddleName: [''],
      dLastName: ['', [Validators.required]],
      dPosition: ['', [Validators.required]],
    });
    this.riForm = this.formBuilder.group({
      riCisNumber: [''],
      riFirstName: ['', [Validators.required]],
      riMiddleName: [''],
      riLastName: ['', [Validators.required]],
    });
    
    this.updateTableData();
    this.route.params.subscribe(params => {
      this.compId = params['id'];
    const companyName = this.sharedService.getCompName();

      this.get.getCompany().subscribe((compData) => {
        // Process the data to count directors related to each company
            const filteredCompany = compData.filter((company) => company.com_cis_number === this.compId);
        
            for (const company of filteredCompany) {
              this.Company = company.com_company_name;
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
     // Now that you have processed the data, you can fetch directors or perform any other operation
     this.get.getDirectors().subscribe((directors) => {
      const filteredDirectors = directors.filter((director) => director.com_related === this.compId);

      const relationColumn = ['MothersName', 'FathersName', 'Spouse', 'Children', 'MotherinLaw', 'FatherinLaw'];

      const tableData = filteredDirectors.map((director) => {
        const row: Record<string, any> = {
          'FullName': `${director.fname} ${director.mname}  ${director.lname}`,
          'Company': this.Company,
          'Position': director.position,
          'dir_CisNumber': director.dir_cisnumber,
          'comp_CIS': director.com_related,
        };
    
        for (let index = 0; index < relationColumn.length; index++) {
          const relationName = relationColumn[index];
          const relatedData = director.related_interest
            .filter(related => related.relation === index + 1)
            .map(related => ({
              fullName: `${related.fname} ${related.mname} ${related.lname}`,
              cisNumber: related.cis_number,
              dirRelated: related.dir_related
            }))
            .filter(data => typeof data.fullName === 'string' && data.fullName.trim() !== '');
    
          row[relationName] = relatedData;
        }
    
        return row;
      });
    
      this.dataSource = new MatTableDataSource(tableData);
      // this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    
      // Trigger change detection
      this.changeDetectorRef.detectChanges();
    });
    
  }
  // updateTableData(): void {
  //   getDirectors((Director) => {
  //     // const directorIdToDisplay = directorId;
  //     console.log(Director);
  //     // console.log('directorIdToDisplay:', directorIdToDisplay)
  //     // console.log(companytoDisplay);
  //     const filteredDirectors = Director.filter((director) => director.com_related === this.compId);
      
  //     const relationColumn = ['MothersName', 'FathersName', 'Spouse', 'Children', 'MotherinLaw', 'FatherinLaw'];
  //     const tableData: Record<string, any>[] = [];
      
  //     for (const director of filteredDirectors) {
  //         // const dir_relatedId = director.dir_cisnumber;
  //         const row: Record<string, any> = {
  //             'FullName': `${director.fname} ${director.mname}  ${director.lname}`,
  //             'Company': this.Company,
  //             'Position': director.position,
  //             'dir_CisNumber': director.dir_cisnumber,
  //             'comp_CIS': director.com_related,
  //         };
  //         // Loop through each element in the 'relationColumn' array
  //         for (let index = 0; index < relationColumn.length; index++) {
  //             const relationName = relationColumn[index]; // Get the current relation name from the 'relationColumn' array
  //             // Filter 'director.related_interest' array to get related names based on the relation index
  //             const relatedData = director.related_interest
  //             .filter(related => related.relation === index + 1)
  //             // Create an object with the required properties
  //             .map(related => ({
  //                 fullName: `${related.fname} ${related.mname} ${related.lname}`,
  //                 cisNumber: related.cis_number,
  //                 dirRelated: related.dir_related
  //             }))
  //             // Filter out objects with empty names (names with only whitespace)
  //             .filter(data => typeof data.fullName === 'string' && data.fullName.trim() !== '');

  //                   // Assign the 'relatedNames' array to the 'row' object with the key as 'relationName'
  //                   row[relationName] = relatedData;

  //         }
      
  //         tableData.push(row);

  //     }
      
  //    this.dataSource.data = tableData;
  //     console.log(this.dataSource.data);
  //     // Trigger change detection
  //     this.changeDetectorRef.detectChanges();
  //   });
    
  // }

  
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
      createDirectors(directData, this.selectedCompCISNumber)
      .then((response) => {
        this.logAction('Add', 'Successfuly Added Director', true, 'directorsrelated');
        this.updateTableData();
      })
      .catch((error) => {
        this.logAction('Add', 'Failed Adding Director', false, 'directorsrelated');
        this.updateTableData();
      }); // Pass the entire formData object
      



      
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
      createRelatedInterest(riData, this.buttonId, this.selectedDirCisNumber) // Pass the entire formData object
      .then((response) => {
        this.logAction('Add', 'Successfuly Added Related Interest', true, 'directorsrelated');
        this.updateTableData();
      })
      .catch((error) => {
        this.logAction('Add', 'Failed Adding Related Interest', false, 'directorsrelated');
        this.updateTableData();
        console.log(this.dataSource);
      });

      
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
 
  delDirector(element: any, cisNumber: any, dirCisNumber: any) {
    // console.log(element);
    // console.log('CIS Number:', cisNumber);
    // console.log('dir_related:', dirCisNumber);
    // deleteDirector
    deleteDOSRIDirector((dosriId) => {

    })
  }

  delRelationship(element: any, cis_number: string, dir_related: any): void {
    // deleteRelationship()
    // console.log(element);
    // console.log('CIS Number:', cis_number);
    // console.log('dir_related:', dir_related);
    // console.log("Are you sure you want to delete?")
    deleteDOSRIDirRelationship((dosriId) => {

    })
  }



  



    // Start of Functions for Audit Trail
logAction(actionType: string, details: string, success: boolean, page: string, errorMessage?: string) {
  const auditTrailEntry = this.createAuditTrailEntry(actionType, details, success, page, errorMessage);
  this.logAuditTrail(auditTrailEntry);
}



private createAuditTrailEntry(actionType: string, details: string, success: boolean, page: string, errorMessage?: string): AuditTrail {
  return {
    userId: 'current_user_id',
    userName: 'Current_user',
    timestamp: new Date(),
    actionType,
    details,
    success,
    page, // Include the page information
    errorMessage: errorMessage || '', // Optional: Include error message if available
  };
}


private logAuditTrail(auditTrailEntry: AuditTrail) {
  this.auditTrailService.logAuditTrail(auditTrailEntry).subscribe(() => {
    console.log('Audit trail entry logged successfully.');
  });
  // console.log('Audit trail entry logged successfully.');
}

}
