import { Component, Inject, OnInit, Output, EventEmitter,ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CoreService } from '../../services/core/core.service';
import Swal from 'sweetalert2';


// Import for Simulation Modal
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { RPTSimulationModalComponent } from 'src/app/modal-dialog/rpt-simulation-modal/rpt-simulation-modal.component';
import {rptLookup} from '../../functions-files/add/postAPI.js'

import { SimulatedDataService } from '../../services/simulatedDataService/simulated-data-service.service';


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

  DummyData = [
    { "cisNo": 1234, "firstName": "John", "middleName": "A.", "lastName": "Doe" },
    { "cisNo": 5678, "firstName": "Alice", "middleName": "B.", "lastName": "Smith" },
    { "cisNo": 9012, "firstName": "Bob", "middleName": "C.", "lastName": "Johnson" },
    { "cisNo": 3456, "firstName": "Emma", "middleName": "D.", "lastName": "Brown" },
    
    { "cisNo": 1235, "firstName": "John", "middleName": "A.", "lastName": "Doe" },
    { "cisNo": 1236, "firstName": "John", "middleName": "A.", "lastName": "Doe" },
    
    { "cisNo": 5679, "firstName": "Alice", "middleName": "A.", "lastName": "Smith" },
    { "cisNo": 5680, "firstName": "Alice", "middleName": "A.", "lastName": "Smith" },
    
    { "cisNo": 9013, "firstName": "Bob", "middleName": "A.", "lastName": "Johnson" },
    { "cisNo": 9014, "firstName": "Bob", "middleName": "A.", "lastName": "Johnson" },
    
    { "cisNo": 3457, "firstName": "Emma", "middleName": "A.", "lastName": "Brown" },
    { "cisNo": 3458, "firstName": "Emma", "middleName": "A.", "lastName": "Brown" }
  ]


  checkRPTForm: FormGroup;
  RptCheckdata: any[] = [];


  
  @Output() simulateRPT = new EventEmitter<any>();

  constructor(
    // private rptListComponent: RptListComponent,
    private _dialogRef: MatDialogRef<RptTransactionModalComponent>,
    private formBuilder: FormBuilder,
    private simulatedDataService: SimulatedDataService,
    public _dialog: MatDialog, private elementRef: ElementRef,
    @Inject(MAT_DIALOG_DATA) public data: any,) {
    //   this.checkRPTForm = this.formBuilder.group({
    //       firstName: ['', [customRequiredValidator(), 
    //         Validators.maxLength(50), Validators.pattern(/\S+/)]],
    //       lastName: ['', [customRequiredValidator(), 
    //         Validators.maxLength(50), Validators.pattern(/\S+/)]]
    //     });
    this.checkRPTForm = this.formBuilder.group({
        firstName: ['', [Validators.required, Validators.pattern(/\S+/)]],
        lastName: ['', [Validators.required, Validators.pattern(/\S+/)]]
      });

  }


  close() {
    this._dialogRef.close(true); 
  }



  searchQuery: string = '';
  filteredData: any[] = [];

  firstNameQuery: string = '';
  lastNameQuery: string = '';

  search() {
    this.filteredData = this.DummyData.filter(item => {
      const firstNameMatch = item.firstName.toLowerCase().includes(this.firstNameQuery.toLowerCase());
      const lastNameMatch = item.lastName.toLowerCase().includes(this.lastNameQuery.toLowerCase());
      return firstNameMatch && lastNameMatch;
    });
  }


 


}
