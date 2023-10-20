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
  // id: number;
  // com_related: string;
  cis_number: string;
  fname: string;
  mname: string;
  lname: string;
  com_cisnumber: string;
  // related_interest: RelatedInterest[];
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

  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['FullName', 'Company', 'Position', "MothersName", "FathersName", 'Spouse', 'Children', 'MotherinLaw', 'FatherinLaw'];
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
  updateTableData(): void {
    getCompany((compData) => {
      console.log(compData);
      // Process the data to count directors related to each company
      getOfficers((Officers) => {
        console.log(Officers);
        
        const relationColumn = ['MothersName', 'FathersName', 'Spouse', 'Children', 'MotherinLaw', 'FatherinLaw'];
        const tableData: Record<string, any>[] = [];
    
        for (const officer of Officers) {
          const officerData = officer.Officers || [];
    
          // Find the company that matches the officer's com_related
          const matchingCompany = compData.find((company) => company.com_cis_number === officer.com_related);
          const companyName = matchingCompany ? matchingCompany.com_company_name : '';
    
          const row: Record<string, any> = {
            'FullName': `${officer.fname} ${officer.mname}  ${officer.lname}`,
            'Company': companyName,
            'Position': officer.position,
            'offc_CisNumber': officer.off_cisnumber,
          };
          tableData.push(row);
        }
        
        this.dataSource.data = tableData;
        // Trigger change detection
        this.changeDetectorRef.detectChanges();
      });

     
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


