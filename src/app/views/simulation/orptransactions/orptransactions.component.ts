import { Component, AfterViewInit, ViewChild, NgZone, ChangeDetectionStrategy, ChangeDetectorRef, QueryList, ElementRef, Renderer2 } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { AbstractControl, FormControl, ValidationErrors, ValidatorFn, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { MatSort } from '@angular/material/sort';

import { OrptService } from 'src/app/services/ORPT/orpt.service';
import { ORPTModalUpdateComponent } from 'src/app/modal-dialog/ORPTransactions/orptmodal-update/orptmodal-update.component';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-orptransactions',
  templateUrl: './orptransactions.component.html',
  styleUrls: ['./orptransactions.component.scss']
})
export class ORPtransactionsComponent {

  
  ORPT: any[] = [];
  dataSource = new MatTableDataSource<any>([]);

  dynamicColumns: any[] = [
    { columnDef: 'rp', header: 'RP' },
    { columnDef: 'rptype', header: 'RP Type' },
    { columnDef: 'nature_of_engagement', header: 'Nature of Engagement' },
    { columnDef: 'createddate', header: 'Date Created' },
    { columnDef: 'actions', header: 'Actions' },
  ];
  displayedColumns: string[] = this.dynamicColumns.map(column => column.columnDef);
  isLoading = true; // Loading state

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    public _dialog: MatDialog,
    private dataService: OrptService) {}

  ngOnInit() {
    this.fetchORPT();
  }




  fetchORPT() {
    const cmd = 905;

    this.dataService.getORPT(cmd).subscribe(data => {
      // console.log("API Response:", data); // Check the response structure
      const result = data.result && data.result[0]; // Extract the first result object
      this.ORPT = result && result.Data ? result.Data : []; // Use the Data array if it exists
      
      // Apply any transformations if needed
      this.ORPT = this.ORPT.map(orpt => ({
          ...orpt,
          // Apply additional properties or transformations if required
      }));

      this.dataSource.data = this.ORPT; // Assign the menus to the data source
      // console.log("DataSource Data:", this.dataSource.data);
    });
  }


   // Show Modal Form
   openAddEditUserForm() {
    const dialogRef = this._dialog.open(ORPTModalUpdateComponent);
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.ngOnInit();
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Data added successfully.',
            confirmButtonText: 'OK'
          });
          // Perform any actions if needed after modal closes
        }
      },
    });
  }


  updateORPT(data: any) {
    console.log(data);
    const dialogRef = this._dialog.open(ORPTModalUpdateComponent, {
      width: '40%',
      data
    });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.ngOnInit();
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Updated successfully.',
            confirmButtonText: 'OK'
          });
          // Perform any actions if needed after modal closes
        }
      },
    });
  }



  deleteORPT(id: number) {
    // Display confirmation dialog with SweetAlert
    Swal.fire({
      title: 'Are you sure?',
      text: 'Are you sure you want to delete this file? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        // Construct the request body based on your payload structure
        const requestBody = {
          cmd: 815,
          userid: localStorage.getItem('userID'),
          role: localStorage.getItem('role'),
          request: {
            id: id,
            user: localStorage.getItem('user')
          }
        };
  
        // Call the delete method in dataService
        this.dataService.deleteORPT(requestBody).subscribe(
          (response: any) => {
            this.ngOnInit(); // Reinitialize component or fetch updated data
  
            // Display success message with SweetAlert
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'The item has been deleted successfully.',
              confirmButtonText: 'OK'
            });
          },
          (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: 'There was an error deleting the file.',
              confirmButtonText: 'OK'
            });
            console.error('Error deleting the item:', error); // Log the error for debugging
          }
        );
      }
    });
  }
  


  // deleteORPT(id: number) {
  //   // Display confirmation dialog with SweetAlert
  //   Swal.fire({
  //     title: 'Are you sure?',
  //     text: 'Are you sure you want to delete this File? This action cannot be undone.',
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Yes, delete it!'
  //   }).then((result) => {
  //     if (result.isConfirmed) {

  //       const id = id;
  //       console.log(id);  // Debugging the record ID
    
  //       // Construct the request body based on your payload structure
  //       const requestBody = {
  //         cmd: 814,  // Assuming 4 for update, or set as needed
  //         userid: localStorage.getItem('userID'),  // You can retrieve this from form or use a fixed value
  //         role: localStorage.getItem('role'),  // You can retrieve this dynamically if needed
  //         request: {
  //           id: id,
  //           rp: this.ORPTForm.get('rp')?.value || '',
  //           rptype: this.ORPTForm.get('rptype')?.value || '',
  //           nature_of_engagement: this.ORPTForm.get('nature_of_engagement')?.value || '',
  //           user: localStorage.getItem('user')  // You can set dynamically based on current user
  //         }
  //       };
        
  //         // Call the deleteAFS method in compDisc
  //         this.dataService.deleteORPT(id, [],).subscribe(
  //           (response: any) => {
  //             // Reinitialize component or fetch updated data
  //             this.ngOnInit();
  
  //             // Display success message with SweetAlert
  //             Swal.fire({
  //               icon: 'success',
  //               title: 'Deleted!',
  //               text: 'The item has been deleted successfully.',
  //               confirmButtonText: 'OK'
  //             }).then(() => {
  //               // Optionally, perform additional actions after success
  //               // For example, refreshing data or navigating
  //             });
  //           },
  //           error => {
  //             // Display error message with SweetAlert
  //             Swal.fire({
  //               icon: 'error',
  //               title: 'Error!',
  //               text: 'There was an error deleting the file.',
  //               confirmButtonText: 'OK'
  //             });
  
  //             // Optionally log the error
  //             // console.error('Error deleting the item:', error);
  //           }
  //         );
        
  //     }
  //   });
  // }

}
