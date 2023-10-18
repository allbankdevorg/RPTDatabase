import { Component, AfterViewInit, ViewChild } from '@angular/core';
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
  selectedDirCisNumber: number = 0;
  selectedCompCISNumber: number = 0;
  directorsData: Director[] = []; // This should be populated with your director data
  filteredDirectors: Director[] = [];
  compId: any;

  // Populating the dataSource
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = [ 'FullName', 'Company', 'Position', "MothersName", "FathersName", 'Spouse', 'Children', 'MotherinLaw', 'FatherinLaw'];

   directorData: Director[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(private router: Router,
              private formBuilder: FormBuilder, 
              private http: HttpClient,
              private sharedService: SharedService,
              private dataTransferService: DataTransferService,
              private route: ActivatedRoute,
              private changeDetectorRef: ChangeDetectorRef)
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
      console.log(this.compId);

      
      // Fetch director data and related interests based on companyId
      // Display this data in your component's data tables
    });
  }

  async getCompanyName(companyId: string): Promise<string> {
    // Call your external JavaScript function to get the company name
    const companyDetails = await getCompany(companyId);
    return companyDetails?.name || 'N/A';
  }

  ngOnInit(): void {
    const directorId = this.sharedService.getDirectorId();
    const companyName = this.sharedService.getCompName();
    const companyCIS = this.sharedService.getCompCIS();

    getDirectors((Director) => {
      const directorIdToDisplay = directorId;
      const companytoDisplay = companyName;

      console.log(companytoDisplay);
      const filteredDirectors = Director.filter((director) => director.com_related === directorIdToDisplay);
      
      
      const tableData = filteredDirectors.map(director => {
        const dir_relatedId = director.dir_cisnumber
        console.log(dir_relatedId);
        const row = {
          'FullName': `${director.fname} ${director.mname}  ${director.lname}`,
          'Company': companytoDisplay,
          'Position': director.position,
          'dir_CisNumber': director.dir_cisnumber,
          'comp_CIS': director.com_related,
        };

        row['MothersName'] = director.related_interest
        .filter(related => related.relation === 1) // Assuming 1 is the relation for Mother's Name
        .map(related => `${related.fname} ${related.mname} ${related.lname}`)
        .filter(name => name.trim() !== '');

        row['FathersName'] = director.related_interest
        .filter(related => related.relation === 2) // Assuming 1 is the relation for Mother's Name
        .map(related => `${related.fname} ${related.mname} ${related.lname}`)
        .filter(name => name.trim() !== '');

        row['Spouse'] = director.related_interest
        .filter(related => related.relation === 3) // Assuming 1 is the relation for Mother's Name
        .map(related => `${related.fname} ${related.mname} ${related.lname}`)
        .filter(name => name.trim() !== '');

        row['Children'] = director.related_interest
        .filter(related => related.relation === 4) // Assuming 1 is the relation for Mother's Name
        .map(related => `${related.fname} ${related.mname} ${related.lname}`)
        .filter(name => name.trim() !== '');

        row['MotherinLaw'] = director.related_interest
        .filter(related => related.relation === 5) // Assuming 1 is the relation for Mother's Name
        .map(related => `${related.fname} ${related.mname} ${related.lname}`)
        .filter(name => name.trim() !== '');

        row['FatherinLaw'] = director.related_interest
        .filter(related => related.relation === 6) // Assuming 1 is the relation for Mother's Name
        .map(related => `${related.fname} ${related.mname} ${related.lname}`)
        .filter(name => name.trim() !== '');

        // this.setComp(director.com_related);
        return row;
        
      });
    
      this.dataSource.data = tableData;
      console.log(tableData);
      console.log(filteredDirectors);
    }); 
  }

  generateDisplayedColumns(data: any[]): string[] {
    const columns = new Set<string>();

    data.forEach((item) => {
      Object.keys(item).forEach((key) => {
        columns.add(key);
      });
    });

    return Array.from(columns);
  }


  // All Functions Below
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
  
      // Call the JavaScript function with form data
      createDirectors(directData, this.selectedCompCISNumber); // Pass the entire formData object
    
      this.ngOnInit();
    }
    // Trigger change detection
    this.changeDetectorRef.detectChanges();
  }

  //Adding Related Interest 
  onRISubmit() {
 
    if (this.riForm.valid) {
      const riData = this.riForm.value;
  
      // Call the JavaScript function with form data
      createRelatedInterest(riData, this.buttonId, this.selectedDirCisNumber); // Pass the entire formData object

      this.ngOnInit();

    }
      // Trigger change detection
      this.changeDetectorRef.detectChanges();
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

