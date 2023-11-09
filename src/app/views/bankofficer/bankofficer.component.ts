import { Component, AfterViewInit, ViewChild, NgZone, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
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
import {getOfficers, getCompany, getOfficersRI} from '../../functions-files/getFunctions'

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
  FullName: string;
  Company: string;
  Position: string;
  MothersName: string;
  FathersName: string;
  Spouse: string;
  Children: string;
  MotherinLaw: string;
  FatherinLaw: string;
  offc_CisNumber: number;
  // id: number;
  // com_related: string;
  // cis_number: string;
  // fname: string;
  // mname: string;
  // lname: string;
  // position: string;
  // company: string;
  // com_cisnumber: string;
  // // related_interest: RelatedInterest[];
  // name: string;
  // state: string;
  // registered: string;
  // country: string;
  // usage: number;
  // period: string;
  // payment: string;
  // activity: string;
  // avatar: string;
  // status: string;
  // color: string;
}

interface IUser {
  
}

@Component({
  selector: 'app-bankofficer',
  templateUrl: './bankofficer.component.html',
  styleUrls: ['./bankofficer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

@Injectable({
  providedIn: 'root',
})

export class BankofficerComponent implements AfterViewInit {
  
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
  public officers: Officers[] = [];

  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['FullName', 'Company', 'Position', "MothersName", "FathersName", 'Spouse', 'Children', 'MotherinLaw', 'FatherinLaw'];
  // dataSource = new MatTableDataSource<Data>(ELEMENT_DATA);

  directorData: Officers[] = [];
  

  // @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('relationShipModal', { static: true }) relationShipModal: any;


  

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
  updateTableData(): void {
    getCompany((compData) => {
      console.log(compData);
      // Process the data to count directors related to each company
      getOfficers((Officers) => {
        console.log(Officers);
        const relationColumn = ['MothersName', 'FathersName', 'Spouse', 'Children', 'MotherinLaw', 'FatherinLaw'];
        const tableData: Record<string, any>[] = [];
    
        // for (const officer of Officers) {
        //   const officerData = officer.Officers || [];
    
        //   // Find the company that matches the officer's com_related
        //   const matchingCompany = compData.find((company) => company.com_cis_number === officer.com_related);
        //   const companyName = matchingCompany ? matchingCompany.com_company_name : '';
    
        //   const row: Record<string, any> = {
        //     'FullName': `${officer.fname} ${officer.mname}  ${officer.lname}`,
        //     'Company': companyName,
        //     'Position': officer.position,
        //     'offc_CisNumber': officer.off_cisnumber,
        //   };
        //   tableData.push(row);
        // }

      for (const officer of Officers) {
          // const dir_relatedId = director.dir_cisnumber;
          const officerData = officer.Officers || [];
          // Find the company that matches the officer's com_related
          const matchingCompany = compData.find((company) => company.com_cis_number === officer.com_related);
          const companyName = matchingCompany ? matchingCompany.com_company_name : '';

          const row: Record<string, any> = {
              'FullName': `(${officer.off_cisnumber}) ${officer.fname} ${officer.mname}  ${officer.lname}`,
              'Company': companyName,
              'Position': officer.position,
              'offc_CisNumber': officer.off_cisnumber,
              'comp_CIS': officer.com_related,
          };

          console.log(officer.off_cisnumber);
          // Loop through each element in the 'relationColumn' array
          for (let index = 0; index < relationColumn.length; index++) {
              const relationName = relationColumn[index]; // Get the current relation name from the 'relationColumn' array
              // Filter 'director.related_interest' array to get related names based on the relation index
              const relatedNames = officer.related_interest 
                  .filter(related => related.relation === index + 1)
                  // Create a full name by concatenating 'fname', 'mname', and 'lname'
                  .map(related => `${related.fname} ${related.mname} ${related.lname}`)
                  // Filter out empty names (names with only whitespace)
                  .filter(name => name.trim() !== '');

              // Assign the 'relatedNames' array to the 'row' object with the key as 'relationName'
              row[relationName] = relatedNames;
          }
          tableData.sort((a, b) => a['offc_CisNumber'] - b['offc_CisNumber']);
          tableData.push(row);

          const officers: Officers[] = tableData.map(item => {
            return {
              FullName: item['FullName'],
              Company: item['Company'],
              Position: item['Position'],
              MothersName: item['MothersName'],
              FathersName: item['FathersName'],
              Spouse: item['Spouse'],
              Children: item['Children'],
              MotherinLaw: item['MotherinLaw'],
              FatherinLaw: item['FatherinLaw'],
              offc_CisNumber: item['offc_CisNumber'],

              // Map other properties here
            };
          });

          this.officers = officers;
          console.log(tableData);
      }
        
        this.dataSource.data = tableData;
        console.log(this.officers);
        // Trigger change detection
        this.changeDetectorRef.detectChanges();
      });
      
     console.log(this.tableData);
    });
    


  }

  


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


