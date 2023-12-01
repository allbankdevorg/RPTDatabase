import { Component, AfterViewInit, ViewChild, NgZone, ChangeDetectionStrategy, ChangeDetectorRef, ElementRef, Renderer2 } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { Injectable } from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations'

// Services
import { DataTransferService } from '../../../services/data-transfer.service';
import { SharedservicesService } from './Services/sharedservices.service';

// Functions Import
import {createBankOfficer} from '../../../functions-files/addBankOfficer';
import {createBankOfficerRelationship} from '../../../functions-files/addBankOfficerRelationship';
import {getAffiliatesCompanyOfficers, getManagingCompany} from '../../../functions-files/getFunctions';
import {createAffil} from '../../../functions-files/addAffiliates.js';
import {deleteAffiliates} from '../../../functions-files/delFunctions'

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
  children: String;
  motherinlaw: String,
  fatherinlaw: String,
}

export interface OffData {
  dir_cisnumber: number;
  fname: string;
  mname: string,
  lname: string,
  fullname: string,
  // position: String,
  view: string,
}

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
interface Officers {
  // id: number;
  // com_related: string;
  cis_number: string;
  fname: string;
  mname: string;
  lname: string;
  com_cisnumber: string;
  // related_interest: RelatedInterest[];
}

export interface affiliatesData {
  aff_com_cis_number: number;
  aff_com_account_name: string;
  aff_com_company_name: string,
  date_inserted: String,
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
  selector: 'app-rp-officer',
  templateUrl: './rp-officer.component.html',
  styleUrls: ['./rp-officer.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],

})
export class RpOfficerComponent implements AfterViewInit {
  sharedData: string | any;
  
  affForm: FormGroup;
  editAffilForm!: FormGroup;
  compData: any = [];
  boForm: FormGroup;
  boRIForm: FormGroup;
  buttonId: number = 0;
  selectedcomCisNumber: number = 0;
  Company: any;
  CompData: any;
  CompName: any;
  companies:  any = [];
  tableData: Record<string, any>[] = [];
  commandGroups: any[] = [];
  // Modals
  public editAffilvisible = false;
  editAffilData: any = [];

  dataSource = new MatTableDataSource();
  columnsToDisplay: string[] = ['expand', 'aff_com_cis_number', 'aff_com_account_name', 'aff_com_company_name', 'manager', 'officerCount', 'date_inserted', 'view'];
  // columnsToDisplay: string[] = ['FullName', 'Company', 'Position', "MothersName", "FathersName", 'Spouse', 'Children', 'MotherinLaw', 'FatherinLaw'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay,];
  expandedElement: affiliatesData | null = null;

  DdisplayedColumns: string[] = ['aff_com_cis_number', 'fullname', 'position'];
  affilOffdataSource = new MatTableDataSource<OffData>([]);
  // dataSource = new MatTableDataSource<Data>(ELEMENT_DATA);

  @ViewChild('editAffilModal') editAffilModal!: ElementRef;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }


  constructor(private router: Router,
          private formBuilder: FormBuilder, 
          private http: HttpClient, 
          private dataTransferService: DataTransferService,
          private cdr: ChangeDetectorRef,
          private ngZone: NgZone,
          private sharedService: SharedservicesService )
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
        this.affForm = this.formBuilder.group({
          affilCisNumberM: [''],
          accountName: [''],
          companyName: [''],
          commandControl: ['']
        });
    }

  ngOnInit(): void {
    this.updateTableData();
   }



  // Functions Below
  updateTableData() {
    getAffiliatesCompanyOfficers((affilCompOff) => {
      if (affilCompOff) {
        // Process the data to count directors related to each company
        const companiesWithDirectors = affilCompOff.map(company => {
          const officers = company.officers || []; // Ensure there is a directors array
          const officerCount = officers.length;
          // console.log(directorCount);
          return { ...company, officerCount, officers };
        });
  
        // Set the data source for your MatTable
        this.dataSource.data = companiesWithDirectors;
        console.log(companiesWithDirectors);
      }
    });
  
    getAffiliatesCompanyOfficers((affilCompOff) => {
      if (affilCompOff) {
        // Fetch director data
        getAffiliatesCompanyOfficers((affilCompOff) => {

          // Process the data to count directors related to each company
          const affiliatesWithDirectors: OffData[] = affilCompOff.map(company => {
            const affiliatesOfficers = affilCompOff.filter(officer => officer.com_related === company.aff_com_account_name);
            return { ...company, officerCount: affiliatesOfficers.length, officers: affiliatesOfficers };
          });
          
          // Set the data source for your MatTable
          console.log(affiliatesWithDirectors)
          this.affilOffdataSource.data = affiliatesWithDirectors;
          // Trigger change detection
          this.cdr.detectChanges();
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

  setButtonId(id: number, comCisNumber: number) {
    this.buttonId = id;
    this.selectedcomCisNumber = comCisNumber;
    console.log(comCisNumber);
    console.log(id);
    
  }


  onBOSubmit() {
 
    if (this.boForm.valid) {
      const boData = this.boForm.value;
  
      // Call the JavaScript function with form data
      createBankOfficer(boData); // Pass the entire formData object
    }


    this.ngZone.run(() => {
      this.dataSource.data = this.tableData;
    });

      // Trigger change detection
    this.cdr.detectChanges();
    console.log(this.cdr.detectChanges);
    console.log(this.dataSource);
  }

  onBORISubmit() {
 
    if (this.boRIForm.valid) {
      const boRIData = this.boRIForm.value;
  
      // Call the JavaScript function with form data
      createBankOfficerRelationship(boRIData, this.buttonId, this.selectedcomCisNumber); // Pass the entire formData object
    }
  }

  onSubmit() {
    if (this.affForm.valid) {
      const formData = this.affForm.value;
      console.log(formData);
      // Call the JavaScript function with form data
      createAffil(formData); // Pass the entire formData object
    }
  }

  // Start of Button Click
  onButtonClick() {
    console.log('Show Modal Form');
    
  }

  onRowClick(row: any, event: Event) {
    event.stopPropagation();
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
    this.router.navigate(['/arp/rpofficer-ri', directorId]);
  }


  delAffiliates(row: any, aff_com_cis_number: any, event: Event) {
    event.stopPropagation();
    // deleteRelationship()
    console.log(row);
    console.log(aff_com_cis_number);
    // console.log(comCIS);
    deleteAffiliates((dosriId) => {
  
    })
  }


  setoffcRelated() {
    // director = director.dir_related;
    // console.log(director);
  }


  editAffil(row: any, event: Event) {
    event.stopPropagation();
    this.editAffilvisible = !this.editAffilvisible;
    console.log(row);
    console.log(this.commandGroups);
    const selectedManager = row.managing_company;
    console.log('Selected Manager:', selectedManager);
     // Check if the selectedManager exists in the commandGroups
     const isValidManager = this.commandGroups.some(group => {
      console.log('Group Value:', group.value);
      return group.value === selectedManager;
    });
  
    console.log('IsValidManager:', isValidManager);
  


  // Set the value only if it's a valid manager
  if (isValidManager) {
    this.affForm.get('commandControl')?.setValue(selectedManager);
    console.log(this.affForm);
  } else {
    // Optionally, handle the case where the manager is not valid
    console.error('Invalid manager:', selectedManager);
  }

    this.editAffilData = {
      com_cis_number: row.aff_com_cis_number,
      com_account_name: row.aff_com_account_name,
      com_company_name: row.aff_com_company_name,
      // Add other properties as needed
    };
    
  }

  closeEditAffil() {
    this.editAffilvisible = !this.editAffilvisible;
  }

  handleChange(event: any) {
    this.editAffilvisible = event;
  }
}
