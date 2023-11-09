import { Component, AfterViewInit, ViewChild, NgZone, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { Injectable } from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations'

// Services
import { DataTransferService } from '../../services/data-transfer.service';

// Functions Import
import {createBankOfficer} from '../../functions-files/addBankOfficer';
import {createBankOfficerRelationship} from '../../functions-files/addBankOfficerRelationship';
import {getAffiliatesCompanyOfficers} from '../../functions-files/getFunctions'

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

@Component({
  selector: 'app-rp-other-officer',
  templateUrl: './rp-other-officer.component.html',
  styleUrls: ['./rp-other-officer.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class RpOtherOfficerComponent implements AfterViewInit {

  sharedData: string | any;
  
  boForm: FormGroup;
  boRIForm: FormGroup;
  buttonId: number = 0;
  selectedcomCisNumber: number = 0;
  Company: any;
  CompData: any;
  CompName: any;
  companies:  any = [];
  tableData: Record<string, any>[] = [];

  dataSource = new MatTableDataSource();
  columnsToDisplay: string[] = ['expand', 'aff_com_cis_number', 'aff_com_account_name', 'aff_com_company_name', 'aff_managing_company_name', 'officerCount', 'date_inserted', 'view'];
  // columnsToDisplay: string[] = ['FullName', 'Company', 'Position', "MothersName", "FathersName", 'Spouse', 'Children', 'MotherinLaw', 'FatherinLaw'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay,];
  expandedElement: affiliatesData | null = null;

  DdisplayedColumns: string[] = ['aff_com_cis_number', 'fullname', 'aff_com_company_name'];
  affilOffdataSource = new MatTableDataSource<OffData>([]);
  // dataSource = new MatTableDataSource<Data>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator!: MatPaginator;


  

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }


  constructor(private router: Router,
          private formBuilder: FormBuilder, 
          private http: HttpClient, 
          private dataTransferService: DataTransferService,
          private changeDetectorRef: ChangeDetectorRef,
          private ngZone: NgZone)
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
          this.changeDetectorRef.detectChanges();
        });
      }
    });
  }
  // updateTableData(): void {
  //   getCompany((compData) => {
  //     console.log(compData);
  //     // Process the data to count directors related to each company
  //     getOfficers((Officers) => {
  //       console.log(Officers);
        
  //       const relationColumn = ['MothersName', 'FathersName', 'Spouse', 'Children', 'MotherinLaw', 'FatherinLaw'];
  //       const tableData: Record<string, any>[] = [];
    
  //       for (const officer of Officers) {
  //         const officerData = officer.Officers || [];
    
  //         // Find the company that matches the officer's com_related
  //         const matchingCompany = compData.find((company) => company.com_cis_number === officer.com_related);
  //         const companyName = matchingCompany ? matchingCompany.com_company_name : '';
    
  //         const row: Record<string, any> = {
  //           'FullName': `${officer.fname} ${officer.mname}  ${officer.lname}`,
  //           'Company': companyName,
  //           'Position': officer.position,
  //           'offc_CisNumber': officer.off_cisnumber,
  //         };
  //         tableData.push(row);
  //       }
        
  //       this.dataSource.data = tableData;
  //       // Trigger change detection
  //       this.changeDetectorRef.detectChanges();
  //     });

     
  //   });
    


  // }

  


  setButtonId(id: number, comCisNumber: number) {
    this.buttonId = id;
    this.selectedcomCisNumber = comCisNumber;
    console.log(comCisNumber);
    console.log(id);
    
  }
  // setButtonId(id: number) {
  //   this.buttonId = id;
  // }

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
    this.changeDetectorRef.detectChanges();
    console.log(this.changeDetectorRef.detectChanges);
    console.log(this.dataSource);
  }

  onBORISubmit() {
 
    if (this.boRIForm.valid) {
      const boRIData = this.boRIForm.value;
  
      // Call the JavaScript function with form data
      createBankOfficerRelationship(boRIData, this.buttonId, this.selectedcomCisNumber); // Pass the entire formData object
    }
  }

  // Start of Button Click
  onButtonClick() {
    console.log('Show Modal Form');
    
  }


  delRelationship() {
    // deleteRelationship()
  }


  setoffcRelated() {
    // director = director.dir_related;
    // console.log(director);
  }
  // addBankOfficer() {
  //   createBankOfficer()
  // }

  // addBankOfficerRS() {
  //   createBankOfficerRelationship()
  // }
  
  
}



// const Officers_DATA: offData[] = [
//   {
//     cis: 111111,
//     fname: "Officer 1",
//     mname: "M",
//     lname: "Lastname",
//     position: "Sample Position 1",
//     com_cisnumber: 1111
//   },
//   {
//     cis: 222222,
//     fname: "Officer 2",
//     mname: "M",
//     lname: "Lastname",
//     position: "Sample Position 2",
//     com_cisnumber: 2222
//   }
// ]


// const offRIData: OffRIData[] = [
//   {
//     com_cis: 123123,
//     fname: "Interest 1",
//     mname: "M",
//     lname: "Lastname",
//     off_related: 111111,
//     relation: 1
//   },
//   {
//     com_cis: 234234,
//     fname: "Interest 2",
//     mname: "M",
//     lname: "Lastname",
//     off_related: 111111,
//     relation: 2
//   },
//   {
//     com_cis: 345345,
//     fname: "Interest 3",
//     mname: "M",
//     lname: "Lastname",
//     off_related: 111111,
//     relation: 3
//   },
//   {
//     com_cis: 456456,
//     fname: "Interest 1",
//     mname: "M",
//     lname: "Lastname",
//     off_related: 222222,
//     relation: 4
//   },
//   {
//     com_cis: 567567,
//     fname: "Interest 2",
//     mname: "M",
//     lname: "Lastname",
//     off_related: 222222,
//     relation: 5
//   },
//   {
//     com_cis: 678678,
//     fname: "Interest 3",
//     mname: "M",
//     lname: "Lastname",
//     off_related: 222222,
//     relation: 6
//   }
// ]

