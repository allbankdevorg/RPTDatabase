import { Component, AfterViewInit,NgZone,ChangeDetectionStrategy, ViewChild } from '@angular/core';
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
import { SharedService } from '../../dri/dataintegration/shared.service';

// Imports for Functions
import {createAffilDir} from '../../../functions-files/addAffiliatesDir';
import {createAffilOff} from '../../../functions-files/addAffiliatesOfficer'
import {createAffilOffRI} from '../../../functions-files/addAffiliatesOfficerRI';
import {getCompany, getAffiliatesCompany, getAffiliatesDirectors, getAffiliatesOfficers } from '../../../functions-files/getFunctions';
import {deleteDosri, deleteDirector, deleteRelationship} from '../../../functions-files/delFunctions'

@Component({
  selector: 'app-rp-officer-ri',
  templateUrl: './rp-officer-ri.component.html',
  styleUrls: ['./rp-officer-ri.component.scss']
})
export class RpOfficerRIComponent implements AfterViewInit {

  OfftableData: Record<string, any>[] = [];
  affilOfficerForm: FormGroup;
  affilOfficerRIForm: FormGroup;
  compId: any;
  Company: any;
  buttonId: number = 0;
  selectedOffCisNumber: number = 0;
  selectedCompCISNumber: number = 0;
  selectedAffilCompCISNumber: number = 0;
  compN: string = this.sharedService.getCompName();

  // OffdataSource = new MatTableDataSource();
OffdataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  OffdisplayedColumns: string[] = ['FullName', 'Position', "MothersName", "FathersName", "Siblings", 'Spouse', 'Children', 'MotherinLaw', 'FatherinLaw',
                      'stepChild', 'sonDaughterInLaw', 'grandParents', 'grandParentsInLaw', 'sistersInLaw', 'brothersInLaw', 'grandChildren', 'grandChildrenInLaw'];
  
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.OffdataSource.paginator = this.paginator;
    // console.log(this.dataSource.filteredData[0].company);
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
        this.affilOfficerForm = this.formBuilder.group({
          affildcisNumber: [''],
          affildFirstName: [''],
          affildMiddleName: [''],
          affildLastName: [''],
          affildPosition: [''],
        });
        this.affilOfficerRIForm = this.formBuilder.group({
          riCisNumber: [''],
          riFirstName: [''],
          riMiddleName: [''],
          riLastName: [''],
        });
        this.route.params.subscribe(params => {
          this.compId = params['id'];
          const companyName = this.sharedService.getCompName();

          getAffiliatesCompany((affilComp) => {
              // Process the data to count directors related to each company
              const companytoDisplay = companyName;
              // console.log(affilComp);
              const filteredCompany = affilComp.filter((company) => company.aff_com_cis_number === this.compId);
              for (const company of filteredCompany ) {
                const Company = company.aff_com_company_name;
                this.Company = Company;
              }
                // Set the data source for your MatTable
            });
        });
  }
  
    async  ngOnInit() {
      this.updateTableData();
    }

    


  // Functions Below
  updateTableData(): void {
    // Get Officers
    getAffiliatesOfficers((affilOffData) => {
      // const directorIdToDisplay = directorId;
      // console.log(affilOffData);
      // console.log('directorIdToDisplay:', directorIdToDisplay)
      // console.log(companytoDisplay);
      if (affilOffData) {
          const filteredOfficers = affilOffData.filter((director) => director.com_related === this.compId);
          // console.log(filteredOfficers);
          const relationColumn = ['MothersName', 'FathersName', 'Spouse', 'Children', 'MotherinLaw', 'FatherinLaw', 
          'stepChild', 'sonDaughterInLaw', 'grandParents', 'grandParentsInLaw', 'sistersInLaw', 'brothersInLaw', 'grandChildren', 'grandChildrenInLaw'];
          const OfftableData: Record<string, any>[] = [];
          
          for (const officer of filteredOfficers) {
              // const dir_relatedId = director.dir_cisnumber;
              const row: Record<string, any> = {
                  'FullName': `${officer.fname} ${officer.mname}  ${officer.lname}`,
                  'Company': this.Company,
                  'Position': officer.position,
                  'off_CisNumber': officer.off_cisnumber,
                  'comp_CIS': officer.com_related,
              };
              // console.log(officer);
              // Loop through each element in the 'relationColumn' array
              for (let index = 0; index < relationColumn.length; index++) {
                const relationName = relationColumn[index]; // Get the current relation name from the 'relationColumn' array
                if (officer.related_interest) {
                    // Filter 'director.related_interest' array to get related names based on the relation index
                    const relatedNames = officer.related_interest
                        .filter(related => related.relation === index + 1)
                        // Create a full name by concatenating 'fname', 'mname', and 'lname'
                        .map(related => `${related.fname} ${related.mname} ${related.lname}`)
                        // Filter out empty names (names with only whitespace)
                        .filter(name => name.trim() !== '');
            
                    // Assign the 'relatedNames' array to the 'row' object with the key as 'relationName'
                    row[relationName] = relatedNames;
                } else {
                    // Handle the case where director.related_interest is not defined or null
                    row[relationName] = [];
                }
            }
          
            OfftableData.push(row);
              // console.log(OfftableData);
          }
          
        this.OffdataSource.data = OfftableData;

        

          // Trigger change detection
          this.changeDetectorRef.detectChanges();
      }else {
        // Handle the case where affilOffData is null or undefined
        console.error('No Officers');
      }
    });
  }

  // Adding Officers
  
  onAffilOffSubmit() {
    if (this.affilOfficerForm.valid) {
      const offData = this.affilOfficerForm.value;
      const directorId = this.sharedService.getDirectorId();
      const companyName = this.sharedService.getCompName();
      
      // console.log(directData);
      // Call the JavaScript function with form data
      createAffilOff(offData, this.compId); // Pass the entire formData object
      this.ngOnInit();

      console.log(offData);
    }

    this.ngZone.run(() => {
      this.OffdataSource.data = this.OfftableData;
    });

      // Trigger change detection
    this.changeDetectorRef.detectChanges();
    // console.log(this.changeDetectorRef.detectChanges);
    // console.log(this.OffdataSource);
  }

  //Adding Related Interest 
  onRISubmit() {
    const directorId = this.sharedService.getDirectorId();
    const companyName = this.sharedService.getCompName();
    
    if (this.affilOfficerRIForm.valid) {
      const riData = this.affilOfficerRIForm.value;
      
      // Call the JavaScript function with form data
      createAffilOffRI(riData, this.buttonId, this.selectedOffCisNumber); // Pass the entire formData object
      
      this.ngOnInit();

      
    }

    this.ngZone.run(() => {
      // this.dataSource.data = this.tableData;
    });
    
      // Trigger change detection
    this.changeDetectorRef.detectChanges();
    console.log(this.changeDetectorRef.detectChanges);
    console.log(this.OffdataSource);
  }

  setAffilCompOff() {
    this.selectedAffilCompCISNumber = this.compId;
    console.log(this.selectedAffilCompCISNumber)
  }

  setButtonId(id: number, off_cisnumber: number) {
     this.buttonId = id;
     this.selectedOffCisNumber = off_cisnumber;
    console.log(off_cisnumber);
    console.log(id);
    
  }

  setdirRelated() {
    // director = director.dir_related;
    // console.log(director);
  }




}
