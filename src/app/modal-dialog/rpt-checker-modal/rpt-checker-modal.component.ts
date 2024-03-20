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
  selector: 'app-rpt-checker-modal',
  templateUrl: './rpt-checker-modal.component.html',
  styleUrls: ['./rpt-checker-modal.component.scss']
})
export class RptCheckerModalComponent {

  checkRPTForm: FormGroup;
  @Output() simulateRPT = new EventEmitter<any>();
  RptCheckdata: any[] = [];

  constructor(
    // private rptListComponent: RptListComponent,
    private _dialogRef: MatDialogRef<RptCheckerModalComponent>,
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
        firstName: [''],
        lastName: ['', [customRequiredValidator()]]
      });

  }


  close() {
    this._dialogRef.close(true); 
  }
  


  rptCheck() {
    console.log("rptCheck function called"); // Add logging statement to check if rptCheck function is called
    
    const rpt = this.checkRPTForm.value;
    rptLookup(rpt)
        .then((response) => {
            
            let swalConfig: any = {
                showCancelButton: true,
                confirmButtonText: 'Simulate'
            };
  
            if (response.result && response.result.length > 0) {
                const data = response.result[0].Data;
                
                
                if (data && data.length > 0) {
                    const officerRelated = data[0].officer_related;
                    this.RptCheckdata = data;
  
                    if (officerRelated.startsWith("148")) {
                        swalConfig = {
                            ...swalConfig,
                            icon: 'success',
                            title: 'RPT!',
                            text: 'This is RPT',
                            preConfirm: () => {
                                
                                this.openSimulation();
                                this.close();
                            }
                        };
                    } else {
                        swalConfig = {
                            ...swalConfig,
                            icon: 'error',
                            title: 'Not RPT!',
                            text: 'This is NOT RPT',
                            preConfirm: () => {
                               
                                this.openSimulation();
                                this.close();
                            }
                        };
                    }
                } else {
                    swalConfig = {
                        ...swalConfig,
                        icon: 'error',
                        title: 'Not RPT!',
                        text: 'This is NOT RPT',
                        preConfirm: () => {
                            
                            this.openSimulation();
                            this.close();
                        }
                    };
                }
            } else {
                swalConfig = {
                    ...swalConfig,
                    icon: 'error',
                    title: 'Not RPT!',
                    text: 'This is NOT RPT',
                    preConfirm: () => {
                        
                        this.openSimulation();
                        this.close();
                    }
                };
            }
  
            Swal.fire(swalConfig);
        })
        .catch((error) => {
            
            
            Swal.fire({
                icon: 'error',
                title: 'Not RPT!',
                text: 'This is not RPT!',
                showCancelButton: true,
                confirmButtonText: 'Simulate'
            }).then((result) => {
                if (result.isConfirmed) {
                    this.openSimulation();
                    this.close();
                }
            });
        });
  }
  



//   rptCheck() {
//     const rpt = this.checkRPTForm.value;
//     rptLookup(rpt)
//         .then((response) => {
//             console.log("Response received");
//             // Show success or error modal based on the response
//             if (response.result && response.result.length > 0) {
//                 const data = response.result[0].Data;
//                 if (data && data.length > 0) {
//                     const officerRelated = data[0].officer_related;
//                     this.RptCheckdata = data;

//                     if (officerRelated.startsWith("148")) {
//                         // Show success message for RPT
//                         Swal.fire({
//                             icon: 'success',
//                             title: 'RPT!',
//                             text: 'This is RPT',
//                             showCancelButton: true,
//                             confirmButtonText: 'Simulate'
//                         }).then((result) => {
//                             console.log("Success Swal callback");
//                             if (result.isConfirmed) {
//                                 // Handle the user's confirmation
//                                 this.RptCheckdata = data;
//                                 this.openSimulation();
//                                 this.close();
//                                 console.log("1");
//                                 // Optionally, perform any actions based on the user's confirmation
//                             } else {
//                                 // Handle the user's cancellation (if necessary)
//                             }
//                         });
//                     } else {
//                         // Show error message for non-RPT
//                         Swal.fire({
//                             icon: 'error',
//                             title: 'Not RPT!',
//                             text: '',
//                             showCancelButton: true,
//                             confirmButtonText: 'Simulate'
//                         }).then((result) => {
//                             console.log("Error Swal callback");
//                             if (result.isConfirmed) {
//                                 this.openSimulation();
//                                 this.close();
//                                 console.log("2");
//                                 // Handle the user's confirmation
//                                 // this.openSimulation();
//                                 // Optionally, perform any actions based on the user's confirmation
//                             } else {
//                                 // Handle the user's cancellation (if necessary)
//                             }
//                         });
//                     }
//                 } else {
//                     Swal.fire({
//                         icon: 'error',
//                         title: 'Not RPT!',
//                         text: '',
//                         showCancelButton: true,
//                         confirmButtonText: 'Simulate'
//                     }).then((result) => {
//                         console.log("No Data Swal callback");
//                         if (result.isConfirmed) {
//                             // Handle the user's confirmation
//                             this.openSimulation();
//                             this.close();
//                             console.log("3");
//                             // Optionally, perform any actions based on the user's confirmation
//                         } else {
//                             // Handle the user's cancellation (if necessary)
//                         }
//                     });
//                 }
//             } else {
//                 Swal.fire({
//                     icon: 'error',
//                     title: 'Not RPT!',
//                     text: '',
//                     showCancelButton: true,
//                     confirmButtonText: 'Simulate'
//                 }).then((result) => {
//                     console.log("No Result Swal callback");
//                     if (result.isConfirmed) {
//                         // Handle the user's confirmation
//                         this.openSimulation();
//                         this.close();
//                         console.log("4");
//                         // Optionally, perform any actions based on the user's confirmation
//                     } else {
//                         // Handle the user's cancellation (if necessary)
//                     }
//                 });
//             }
//         })
//         .catch((error) => {
//             // Show error modal based on error
//             Swal.fire({
//                 icon: 'error',
//                 title: 'Not RPT!',
//                 text: 'This is not RPT!',
//                 showCancelButton: true,
//                 confirmButtonText: 'Simulate'
//             }).then((result) => {
//                 console.log("Error callback");
//                 if (result.isConfirmed) {
//                     // Handle the user's confirmation
//                     this.openSimulation();
//                     this.close();
//                     console.log("5");
//                     // Optionally, perform any actions based on the user's confirmation
//                 } else {
//                     // Handle the user's cancellation (if necessary)
//                 }
//             });
//         });
// }


//   rptCheck() {
//     const rpt = this.checkRPTForm.value;
//     rptLookup(rpt)
//         .then((response) => {
//             // Show success or error modal based on the response
//             if (response.result && response.result.length > 0) {
//                 const data = response.result[0].Data;
//                 if (data && data.length > 0) {
//                     const officerRelated = data[0].officer_related;
//                     this.RptCheckdata = data;

//                     if (officerRelated.startsWith("148")) {
//                         // Show success message for RPT
//                         Swal.fire({
//                             icon: 'success',
//                             title: 'RPT!',
//                             text: 'This is RPT',
//                             showCancelButton: true,
//                             confirmButtonText: 'Simulate'
//                         }).then((result) => {
//                             if (result.isConfirmed) {
//                                 // Handle the user's confirmation
//                                 this.RptCheckdata = data;
//                                 this.openSimulation();
//                                 this.close();
//                                 console.log("1");
//                                 // Optionally, perform any actions based on the user's confirmation
//                             } else {
//                                 // Handle the user's cancellation (if necessary)
//                                                                // Optionally, perform any actions based on the user's cancellation
//                             }
//                         });
//                     } else {
//                         // Show error message for non-RPT
//                         Swal.fire({
//                             icon: 'error',
//                             title: 'Not RPT!',
//                             text: '',
//                             showCancelButton: true,
//                             confirmButtonText: 'Simulate'
//                         }).then((result) => {
//                             if (result.isConfirmed) {
//                                 this.openSimulation();
//                                 this.close();
//                                 console.log("2");
//                                 // Handle the user's confirmation
//                                 // this.openSimulation();
//                                 // Optionally, perform any actions based on the user's confirmation
//                             } else {
//                                 // Handle the user's cancellation (if necessary)
                                
//                                 // Optionally, perform any actions based on the user's cancellation
//                             }
//                         });
//                     }
//                 } else {
//                   Swal.fire({
//                     icon: 'error',
//                     title: 'Not RPT!',
//                     text: '',
//                     showCancelButton: true,
//                     confirmButtonText: 'Simulate'
//                 }).then((result) => {
//                     if (result.isConfirmed) {
//                         // Handle the user's confirmation
//                         this.openSimulation();
//                         this.close();
//                         console.log("3");
//                         // Optionally, perform any actions based on the user's confirmation
//                     } else {
//                         // Handle the user's cancellation (if necessary)
                               
//                         // Optionally, perform any actions based on the user's cancellation
//                     }
//                 });
//                 }
//             } else {
//               Swal.fire({
//                 icon: 'error',
//                 title: 'Not RPT!',
//                 text: '',
//                 showCancelButton: true,
//                 confirmButtonText: 'Simulate'
//             }).then((result) => {
//                 if (result.isConfirmed) {
//                     // Handle the user's confirmation
//                     this.openSimulation();
//                     this.close();
//                     console.log("4");
//                     // Optionally, perform any actions based on the user's confirmation
//                 } else {
//                     // Handle the user's cancellation (if necessary)
                             
//                     // Optionally, perform any actions based on the user's cancellation
//                 }
//             });
//             }
//         })
//         .catch((error) => {
//             // Show error modal based on error
//             Swal.fire({
//                 icon: 'error',
//                 title: 'Not RPT!',
//                 text: 'This is not RPT!',
//                 showCancelButton: true,
//                 confirmButtonText: 'Simulate'
//             }).then((result) => {
//                 if (result.isConfirmed) {
//                     // Handle the user's confirmation
//                     this.openSimulation();
//                     this.close();
//                     console.log("5");
//                     // Optionally, perform any actions based on the user's confirmation
//                 } else {
//                     // Handle the user's cancellation (if necessary)
                               
//                     // Optionally, perform any actions based on the user's cancellation
//                 }
//             });
//         });
// }






// openSimulation() {
//     console.log(this.RptCheckdata)
//   const dialogRef = this._dialog.open(RPTSimulationModalComponent, {
//     data: this.RptCheckdata,
//     width: '50%', // Set the width as per your requirement
//     // Other MatDialog options can be specified here
//   });
//   dialogRef.afterClosed().subscribe({
//     next: (val) => {
//       if (val) {
//         // this.ngOnInit();
        
//         // this.calculateSimulatedData(this.dataSource.data);
//       }
//     },
//   });
// }

openSimulation() {
    console.log("Opening Simulation from RPT-Checker");
        // console.log("fdsd")
        if (this.RptCheckdata && this.RptCheckdata.length > 0) { // Check if RptCheckdata is not null/undefined and has elements
            
            let formData = this.RptCheckdata[0];

            // console.log(formData);
            let IndiData = [
                {
                cis_no: formData.cis_number,
                fname: formData.fname,
                lname: formData.lname,
                fullname: formData.firstName + ' ' + formData.lastName,
                officer_related: ""
                }
            ]

            this.simulatedDataService.triggerFunction(this.RptCheckdata);
            // this.simulatedDataService.sendData(this.RptCheckdata);
        } else {
            let formData = this.checkRPTForm.value;

            let IndiData = [
                {
                cis_no: "",
                fname: formData.firstName,
                lname: formData.lastName,
                fullname: formData.firstName + ' ' + formData.lastName,
                officer_related: ""
                }
            ]

            this.simulatedDataService.triggerFunction(IndiData);
            // this.simulatedDataService.sendData(IndiData);
        }
    }

}