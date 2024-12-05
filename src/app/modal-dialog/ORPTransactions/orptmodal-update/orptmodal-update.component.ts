import { Component, Inject, OnInit, NgZone, Renderer2} from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, MaxLengthValidator, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { CoreService } from '../../services/core/core.service';
import { ChangeDetectorRef } from '@angular/core';
import { FormArray } from '@angular/forms';

import { catchError, Observable, throwError } from 'rxjs';

import { OrptService } from 'src/app/services/ORPT/orpt.service';

// Functions Imports
// import {callJSFun} from '../../functions-files/javascriptfun.js';
// import {FetchDataService} from '../../services/fetch/fetch-data.service';
// import {getCompany, getDirectors} from '../../../functions-files/getFunctions'
// import {createAffil, cisLookUP} from '../../functions-files/add/postAPI.js'
// import {deleteDosri, deleteDirector, deleteRelationship} from '../../functions-files/delFunctions'

// Audit Trail
// import { AuditTrailService } from '../../services/auditTrail/audit-trail.service';
// import {AuditTrail} from '../../model/audit-trail.model';

// Services
// import {AddServicesService} from '../../services/add/add-services.service';
import { AffiliatesService } from 'src/app/services/affiliates/affiliates.service';
import Swal from 'sweetalert2';

// import {createUser} from '../../functions-files/add/postAPI';


@Component({
  selector: 'app-orptmodal-update',
  templateUrl: './orptmodal-update.component.html',
  styleUrls: ['./orptmodal-update.component.scss']
})
export class ORPTModalUpdateComponent {

  ORPTForm: FormGroup;

  constructor(
    private dataService: OrptService,
    private formBuilder: FormBuilder,
    private _dialogRef: MatDialogRef<ORPTModalUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    // private auditTrailService: AuditTrailService,
    private changeDetectorRef: ChangeDetectorRef,
    private ngZone: NgZone,
    private renderer: Renderer2) 
  {
    this.ORPTForm = this.formBuilder.group({
      rp: ['', [Validators.required]],
      rptype: ['', [Validators.required]],
      nature_of_engagement: ['', [Validators.required, Validators.pattern(/^[A-Za-z\d,.\-\s]+$/)
      ]],
      user: ['']
    });
    _dialogRef.disableClose = true;
  }


  ngOnInit(): void {
    this.ORPTForm.patchValue(this.data);
  }


  handleClick(): void {
    if (this.data) {
      this.onUpdate();
    } else {
      this.onSubmit();
    }
  }

  close() {
    this._dialogRef.close(true); 
  }



  onSubmit() {
    if (this.ORPTForm.valid) {
      // Construct the request body based on the provided structure
      const requestBody = {
        cmd: 30,  // This is the command type you mentioned
        userid: localStorage.getItem('userID'),  // You can retrieve this from form or use a fixed value
        role: localStorage.getItem('role'),  // You can retrieve this dynamically if needed
        request: {
          rp: this.ORPTForm.get('rp')?.value || '',
          rptype: this.ORPTForm.get('rptype')?.value || '',
          nature_of_engagement: this.ORPTForm.get('nature_of_engagement')?.value || '',
          user: localStorage.getItem('user')  // Or you can get this dynamically based on current user
        }
      };
  
      // Call the service with the formatted request body
      this.dataService.addORPT(requestBody)
        .pipe(
          catchError(error => {
            this.handleError('Error Adding Menu!');
            return throwError(() => error);
          })
        )
        .subscribe({
          next: (response) => {
            console.log('Response:', response);
            this.close();
            if (response.result && response.result[0].status === 'success') {
              // this.showSuccess(response.result[0].message); // Display the success message
              this.close(); // Close the form only if insertion is successful
            } else if (response.result && response.result[0].status === 'info') {
              this.handleError(response.result[0]); // Show permission exists message or info
            } else {
              this.handleError('Unexpected response from server');
            }
          },
          error: (error) => {
            console.error('Error details:', error);
            this.handleError('Error Adding Menu!');
          }
        });
    } else {
      this.handleError('Please fill in all required fields correctly');
      console.error('Form is not valid');
    }
  }
  



  onUpdate() {
    // Ensure there's a valid record ID
    if (!this.data?.id) {
      this.handleError('No record ID provided for update');
      return;
    }
  
    if (this.ORPTForm.valid) {
      const id = this.data.id;
      console.log(id);  // Debugging the record ID
  
      // Construct the request body based on your payload structure
      const requestBody = {
        cmd: 814,  // Assuming 4 for update, or set as needed
        userid: localStorage.getItem('userID'),  // You can retrieve this from form or use a fixed value
        role: localStorage.getItem('role'),  // You can retrieve this dynamically if needed
        request: {
          id: id,
          rp: this.ORPTForm.get('rp')?.value || '',
          rptype: this.ORPTForm.get('rptype')?.value || '',
          nature_of_engagement: this.ORPTForm.get('nature_of_engagement')?.value || '',
          user: localStorage.getItem('user')  // You can set dynamically based on current user
        }
      };
  
      // Validate required fields (can be expanded as per your needs)
      if (!this.validateRequestBody(requestBody)) {
        this.handleError('Please fill in all required fields');
        return;
      }
  
        // Call the service to update the menu item
        this.dataService.updateORPT(id, requestBody)
          .pipe(
            catchError(error => {
              console.error('Update error:', error);
  
              // Handle specific error cases based on HTTP status
              if (error.status === 404) {
                this.handleError('Menu not found');
              } else if (error.status === 400) {
                this.handleError('Invalid data provided');
              } else if (error.status === 401) {
                this.handleError('Authentication failed');
              } else {
                this.handleError('Error Updating Menu');
              }
  
              return throwError(() => error);
            })
          )
          .subscribe({
            next: (response) => {
              console.log('Update response:', response);
              // this.showSuccess('Menu updated successfully');
              this.close();
            },
            error: (error) => {
              console.error('Error details:', error);
            }
          });
      
    } else {
      this.handleError('Form validation failed');
      console.error('Form is not valid');
    }
  }



  // Validate the request body
  private validateRequestBody(body: {
    cmd: number;
    userid: any;
    role: any;
    request: {
      rp: any;
      rptype: any;
      nature_of_engagement: any;
      user: any;
    };
  }): boolean {
    return Boolean(
      body.request.rp &&
      body.request.rptype &&
      body.request.nature_of_engagement &&
      body.request.user
    );
  }


  // Handle errors
  handleError(errorMsg: string) {
    Swal.fire({
      icon: 'error',
      title: errorMsg,
      text: "Please try again!",
      confirmButtonText: 'OK'
    });
  }
}
