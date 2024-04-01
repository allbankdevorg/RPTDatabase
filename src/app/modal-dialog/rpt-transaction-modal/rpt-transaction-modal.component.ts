import { Component, Inject, OnInit, Output, EventEmitter,ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CoreService } from '../../services/core/core.service';
import Swal from 'sweetalert2';


// Import for Simulation Modal
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { RPTSimulationModalComponent } from 'src/app/modal-dialog/rpt-simulation-modal/rpt-simulation-modal.component';
import {rptIndividualLookup, rptCompanyLookup, rptTransactionLookup} from '../../functions-files/add/postAPI.js'

import { SimulatedDataService } from '../../services/simulatedDataService/simulated-data-service.service';

// MAT-TABLE
import { MatTableDataSource } from '@angular/material/table';

// Custom Validators
import { customRequiredValidator } from './../../validator/myValidators';

import { LettersOnlyDirective } from './../../directives/lettersOnly.directive';
// import { RptListComponent } from '../../../app/views/simulation/rpt-list/rpt-list.component';

@Component({
  selector: 'app-rpt-transaction-modal',
  templateUrl: './rpt-transaction-modal.component.html',
  styleUrls: ['./rpt-transaction-modal.component.scss']
})
export class RptTransactionModalComponent {

 
  

  RptCheckdata: any[] = [];
  checkRPTForm: FormGroup;
  selectedOption: string = 'individual'; // default option
  selectedData: any[] = [];


  @Output() rowDataSelected = new EventEmitter<any>();

  displayedColumns1: string[] = ['cis_number', 'fname', 'lname'];
  dataSource1 = new MatTableDataSource<any>([]);
  ToDisplay1: string[] = [];

  displayedColumns2: string[] = ['cis_number', 'fullname'];
  dataSource2 = new MatTableDataSource<any>([]);
  ToDisplay2: string[] = [];


  isFormValid(): boolean {
    const selectedOptionControl = this.checkRPTForm.get('selectedOption');
    if (selectedOptionControl && selectedOptionControl.value === 'individual') {
      const firstNameControl = this.checkRPTForm.get('firstName');
      const lastNameControl = this.checkRPTForm.get('lastName');
      return !!firstNameControl && !!lastNameControl && firstNameControl.valid && lastNameControl.valid;
    } else {
      const companyNameControl = this.checkRPTForm.get('companyName');
      return !!companyNameControl && companyNameControl.valid;
    }
  }
  
  
  

  constructor(
    // private rptListComponent: RptListComponent,
    private _dialogRef: MatDialogRef<RptTransactionModalComponent>,
    private formBuilder: FormBuilder,
    private simulatedDataService: SimulatedDataService,
    public _dialog: MatDialog, private elementRef: ElementRef,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder) {
    //   this.checkRPTForm = this.formBuilder.group({
    //       firstName: ['', [customRequiredValidator(), 
    //         Validators.maxLength(50), Validators.pattern(/\S+/)]],
    //       lastName: ['', [customRequiredValidator(), 
    //         Validators.maxLength(50), Validators.pattern(/\S+/)]]
    //     });
    this.checkRPTForm = this.formBuilder.group({
        firstName: ['', [Validators.required, Validators.pattern(/\S+/)]],
        lastName: ['', [Validators.required, Validators.pattern(/\S+/)]],
        companyName: ['', [Validators.required, Validators.pattern(/\S+/)]]
      });

    

  }

  ngOnInit() {
    this.checkRPTForm = this.fb.group({
      selectedOption: ['individual'],
      firstName: ['', [Validators.required, Validators.pattern(/\S+/)]],
      lastName: ['', [Validators.required, Validators.pattern(/\S+/)]],
      companyName: ['', [Validators.required, Validators.pattern(/\S+/)]]
    });

    // Listen to the selectedOption form control value changes
    this.checkRPTForm.get('selectedOption')?.valueChanges.subscribe(value => {
      this.selectedOption = value;
     });
  }


  close(dataPass) {
    this._dialogRef.close(dataPass); 
  }



  searchQuery: string = '';
  filteredData: any[] = [];

  firstNameQuery: string = '';
  lastNameQuery: string = '';

  search() {
    // this.filteredData = this.dummyData.filter(item => {
    //   const firstNameMatch = item.firstName.toLowerCase().includes(this.firstNameQuery.toLowerCase());
    //   const lastNameMatch = item.lastName.toLowerCase().includes(this.lastNameQuery.toLowerCase());
    //   return firstNameMatch && lastNameMatch;
    // });
  }



  checkRPT() {
    const rpt = this.checkRPTForm.value;

    if (this.selectedOption == 'individual') {

      rptIndividualLookup(rpt)
        .then((response) => {

              

            if (response.result && response.result.length > 0) {
                const data = response.result[0].Data[0];

                  if (data) {
                    this.dataSource1.data = [data];
                  }
                  else {
                      Swal.fire({
                        icon: 'error',
                        title: 'NO Data Found!',
                        text: 'There is NO Data Matching the Search'
                      });  
                  }
              
            } else {
              Swal.fire({
                icon: 'error',
                title: 'NO Data Found!',
                text: 'There is NO Data Matching the Search'
              });  
            }
  
        })
        .catch((error) => {
            
           
        });
    }

    else if (this.selectedOption == 'company') {
      rptCompanyLookup(rpt)
        .then((response) => {

            if (response.result && response.result.length > 0) {
                const data = response.result[0].Data[0];

                    if (data) {
                      this.dataSource2.data = [data];
                    }
                    else {
                        Swal.fire({
                          icon: 'error',
                          title: 'NO Data Found!',
                          text: 'There is NO Data Matching the Search'
                        });  
                    }
            } else {
              Swal.fire({
                icon: 'error',
                title: 'NO Data Found!',
                text: 'There is NO Data Matching the Search'
              }); 
            }
  
        })
        .catch((error) => {
            
           
        });
    }
    

  }


  selectRow(row: any) {
    let yesterdayDate: string;
    let yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterdayDate = yesterday.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });

    rptTransactionLookup(row, yesterdayDate)
        .then((response) => {

            if (response.result && response.result.length > 0) {
                const data = response.result;
                   this.close(data);

            } else {
                
            }
  
        })
        .catch((error) => {
            
           
        });
    }
  
  

 


}
