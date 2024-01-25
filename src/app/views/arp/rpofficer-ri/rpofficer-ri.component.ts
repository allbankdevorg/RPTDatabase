import { Component, AfterViewInit,NgZone,ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';


import { MatPaginator } from '@angular/material/paginator';
import { TooltipPosition } from '@angular/material/tooltip';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { ChangeDetectorRef } from '@angular/core';
import { Injectable } from '@angular/core';

// Services
import { DataTransferService } from '../../../services/data-transfer.service';
import { SharedservicesService } from '../../arp/rp-officer/Services/sharedservices.service';
import {AffiliatesService} from '../../../services/affiliates/affiliates.service'; //Service to set the value of the DirCIS and buttonID in adding RI of Directors

// Imports for Functions
import {createAffilDir, createAffilOff, createAffilOffRI} from '../../../functions-files/add/postAPI';
import {getCompany, getManagingCompany, getAffiliatesDirectors, getAffiliatesOfficers } from '../../../functions-files/getFunctions';
import {deleteAffilOff, deleteAffilOffRI} from '../../../functions-files/delFunctions'

// For Modals
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { AffiliatesDirModalComponent } from 'src/app/modal-dialog/affiliates-dir-modal/affiliates-dir-modal.component';
import { DirectorsModalComponent } from 'src/app/modal-dialog/directors-modal/directors-modal.component';
import {AffiliatesOffModalComponent} from '../../../modal-dialog/affiliates-off-modal/affiliates-off-modal.component'
import {AffiliatesOffRIModalComponent} from '../../../modal-dialog/affiliates-off-ri-modal/affiliates-off-ri-modal.component'
import { FetchDataService } from 'src/app/services/fetch/fetch-data.service';

@Component({
  selector: 'app-rpofficer-ri',
  templateUrl: './rpofficer-ri.component.html',
  styleUrls: ['./rpofficer-ri.component.scss']
})
export class RPOfficerRIComponent implements AfterViewInit {

  positionOptions: TooltipPosition = 'right';
  OfftableData: Record<string, any>[] = [];
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
    public _dialog: MatDialog,
    private formBuilder: FormBuilder, 
    private http: HttpClient,
    private sharedService: SharedservicesService,
    private dataService: AffiliatesService,
    private dataTransferService: DataTransferService,
    private route: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,
    private ngZone: NgZone,
    private get: FetchDataService)
    {
        this.route.params.subscribe(params => {
          this.compId = params['id'];
          const companyName = this.sharedService.getCompName();
         
          this.get.getAffiliatesCompanyOfficers((mngComp) => {
              // Process the data to count directors related to each company
              const companytoDisplay = companyName;
              // console.log(affilComp);
              const filteredCompany = mngComp.filter((company) => company.aff_com_cis_number === this.compId);
              for (const company of filteredCompany ) {
                const Company = company.aff_com_company_name;
                this.Company = Company;

                
              }
              // console.log(mngComp);
              // console.log(filteredCompany);
              // console.log(this.Company);
                // Set the data source for your MatTable
            });
        });
  }
  
    async  ngOnInit() {
     await this.updateTableData();
     
    }

    


  // Functions Below
  async updateTableData(): Promise<void> {
    // Get Officers
    getAffiliatesOfficers((affilOffData) => {
      // const directorIdToDisplay = directorId;
      // console.log(affilOffData);
      // console.log('directorIdToDisplay:', directorIdToDisplay)
      // console.log(companytoDisplay);
      if (affilOffData) {
          const filteredOfficers = affilOffData.filter((director) => director.com_related === this.compId);
          // console.log(filteredOfficers);
          const relationColumn = ['MothersName', 'FathersName', "Siblings", 'Spouse', 'Children', 'MotherinLaw', 'FatherinLaw', 
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
                    const relatedData = officer.related_interest
                    .filter(related => related.relation === index + 1)
                    // Create an object with the required properties
                    .map(related => ({
                        fullName: `${related.fname} ${related.mname} ${related.lname}`,
                        cisNumber: related.cis_number,
                        offRelated: related.officer_related
                    }))
                    // Filter out objects with empty names (names with only whitespace)
                    .filter(data => typeof data.fullName === 'string' && data.fullName.trim() !== '');

            
                    // Assign the 'relatedNames' array to the 'row' object with the key as 'relationName'
                    row[relationName] = relatedData;
                } else {
                    // Handle the case where director.related_interest is not defined or null
                    row[relationName] = [];
                }
            }
          
            OfftableData.push(row);
              // console.log(OfftableData);
          }
          
        this.OffdataSource.data = OfftableData;

        
        // console.log(OfftableData);
        // console.log(this.Company);

          // Trigger change detection
          this.changeDetectorRef.detectChanges();
      }else {
        // Handle the case where affilOffData is null or undefined
        // console.error('No Officers');
      }
    });
  }

  // Adding Officers
  openAffilOfficersForm() {
    const dialogRef = this._dialog.open(AffiliatesOffModalComponent);
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.updateTableData();
        }
      },
    });
  }
  
  openEditAffilOfficersForm(data: any, event: any) {
    event.stopPropagation();
    console.log(data);
    const dialogRef = this._dialog.open(AffiliatesOffModalComponent, {
      data,    
    });
  
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          // this.getEmployeeList();
          console.log("Successs");
        }
      },
    });
  } 



  openAffilOfficerRIForm() {
    const dialogRef = this._dialog.open(AffiliatesOffRIModalComponent);
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.updateTableData();
        }
      },
    });
  }
  
  openEditAffilOfficerRIForm(data: any, event: any) {
    event.stopPropagation();
    console.log(data);
    const dialogRef = this._dialog.open(AffiliatesOffRIModalComponent, {
      data,    
    });
  
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          // this.getEmployeeList();
          console.log("Successs");
        }
      },
    });
  }
  

  

  setAffilCompOff() {
    this.selectedAffilCompCISNumber = this.compId;
    // console.log(this.selectedAffilCompCISNumber)
  }

  setButtonId(id: number, off_cisnumber: number) {
     this.buttonId = id;
     this.selectedOffCisNumber = off_cisnumber;

     this.dataService.setButtonId(id);
     this.dataService.setDirCIS(off_cisnumber);
    // console.log(off_cisnumber);
    // console.log(id);
    
  }

  setdirRelated() {
    // director = director.dir_related;
    // console.log(director);
  }


  // Delete Functions
  delAffilOfficer(element: any, dirAffilCIS: any, offRelatComCIS: any): void {
    // console.log(element);
    // console.log(dirAffilCIS);
    // console.log(offRelatComCIS);
    deleteAffilOff((dosriId) => {
  
    })
  }
  
  
  
  delAffilOffRI(element: any, cisNum: any, offRelated: any): void {
    // console.log(element);
    // console.log(cisNum);
    // console.log(offRelated);
    // deleteRelationship()
    // console.log("Are you sure you want to delete?")
    deleteAffilOffRI((dosriId) => {
  
    })
  }
  
}
