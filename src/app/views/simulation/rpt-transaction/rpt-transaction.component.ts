import { Component, AfterViewInit, ViewChild, SimpleChanges, TemplateRef, NgZone, ChangeDetectionStrategy, ChangeDetectorRef, QueryList, ElementRef, Renderer2 } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import { MatSort } from '@angular/material/sort';
import {MatAccordion} from '@angular/material/expansion';


// Import for Simulation Modal
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RptTransactionModalComponent } from 'src/app/modal-dialog/rpt-transaction-modal/rpt-transaction-modal.component';


interface RelatedInterest {
  relation: number;
  fname: string;
  mname: string;
  lname: string;
}


@Component({
  selector: 'app-rpt-transaction',
  templateUrl: './rpt-transaction.component.html',
  styleUrls: ['./rpt-transaction.component.scss']
})
export class RptTransactionComponent {

 selectedData: any;


 @ViewChild(MatAccordion) accordion?: MatAccordion;
 dialogRef?: MatDialogRef<RptTransactionModalComponent>;


//    // Define a mapping object for relation numbers to column headers
//    relationColumnMapping: { [key: number]: string } = {
//     1: 'Mother',
//     2: 'Father',
//     3: 'Siblings',
//     4: 'Spouse',
//     5: 'Children',
//     6: 'Mother-in-Law',
//     7: 'Father-in-Law',
//     8: 'Name of Stepchildren',
//     9: 'Name of Son/Daughter-In-Law',
//     10: 'Grandparents',
//     11: 'Grandparents-In-Law',
//     12: 'Sisters-In-Law',
//     13: 'Brothers-In-Law',
//     14: 'GrandChildren',
//     15: 'Grandchildren-in-Law'
//   };

//   mappedData: any[] = [];

// // Method to map data based on relation
// mapDataByRelation(): void {
//   this.mappedData = [];
//   for (let i = 1; i <= 15; i++) {
//     const data = this.selectedData?.Data_RI.find(item => item.relation === i);
//     this.mappedData.push(data);
//   }
// }

// // Call mapDataByRelation() when selectedData changes
// ngOnChanges(changes: SimpleChanges): void {
//   if (changes['selectedData'] && changes['selectedData'].currentValue) {
//     this.mapDataByRelation();
//   }
// }



 displayedColumns1: string[] = ['cis_no', 'loan_no', 'name', 'principal', 'principal_bal', 'loan_security',
 'deposit_holdout', 'net_bal', 'date_granted', 'term', 'purpose', 'int_rate', 'int_rate1', 'int_rate2', 'int_rate3'];


 displayedColumns2: string[] = ['cis_no', 'loan_no', 'name', 'principal', 'principal_bal', 'loan_security',
  'deposit_holdout', 'net_bal', 'date_granted', 'term', 'purpose', 'int_rate'];

 displayedColumns3: string[] = ['id', 'branch', 'lessor', 'address', 'payee', 
 'floor_area', 'rent_vat', 'cusa_vat', 'mktg_support', 'monthly', 'annual'];
  
  constructor(
    public _dialog: MatDialog
  ) {

  }


  // Method to get the field from the element based on relation
  // Initialize dataFound to false
// dataFound: boolean = false;

// // Modify getElementField method
// getElementField(element: any, relation: number): string | undefined {
//   const data = this.selectedData?.[0]?.Data_RI.find(item => item.relation === relation);
//   if (data && (data.fname || data.mname || data.lname)) {
//     return `${data.fname} ${data.mname} ${data.lname}`.trim();
//   }
//   // If there's no data found or all name fields are empty, return undefined
//   return undefined;
// }




// getElementField(element: any, relation: number): string {
//   const data = this.selectedData?.[0]?.Data_RI.find(item => item.relation === relation);
//   if (data) {
//     return `${data.fname} ${data.mname} ${data.lname}`;
//   }
//   return ''; // Return an empty string if there is no data
// }
// getElementField(element: any, relation: number): string {
//   const data = this.selectedData?.[0]?.Data_RI.find(item => item.relation === relation);
//   // If any data is found, set dataFound to true
//   if (!this.dataFound && data) {
//     this.dataFound = true;
//   }
//   return data ? `${data.fname} ${data.mname} ${data.lname}` : '';
// }

// Method to get the number of relations
// getRelationCount(): number {
//   return this.selectedData?.[0]?.Data_RI?.length || 0;
// }

  // getElementField(element: any, relation: number): string {
  //   const data = this.selectedData?.[0]?.Data_RI.find(item => item.relation === relation);
  //   console.log(data);
  //   return data ? `${data.fname} ${data.mname} ${data.lname}` : 'No Data Available';
  // }

  // getElementField(data: any[], relation: number): string {
  //   const item = data.find(item => item.relation === relation);
  //   return item ? `${item.fname} ${item.mname} ${item.lname}` : '';
  // }
  

  relatedInterests: RelatedInterest[] = [];
  relationColumnMapping: { [key: number]: string } = {
    1: 'Mother',
    2: 'Father',
    3: 'Siblings',
    4: 'Spouse',
    5: 'Children',
    6: 'Mother-in-Law',
    7: 'Father-in-Law',
    8: 'Name of Stepchildren',
    9: 'Name of Son/Daughter-In-Law',
    10: 'Grandparents',
    11: 'Grandparents-In-Law',
    12: 'Sisters-In-Law',
    13: 'Brothers-In-Law',
    14: 'GrandChildren',
    15: 'Grandchildren-in-Law'
  };

  ngOnInit(): void {}

  mapRelatedInterests(data: any[]): void {
    this.relatedInterests = [];
    for (let i = 1; i <= 15; i++) {
      const item = data.find(item => item.relation === i);
      if (item) {
        this.relatedInterests.push(item);
      } 
      else {
        // Push an empty object if no data is found for the relation
        this.relatedInterests.push({ relation: i, fname: '', mname: '', lname: '' });
      }
    }
  }


  getElementField(relation: number): string | undefined {
      const data = this.selectedData?.[0]?.Data_RI.find(item => item.relation === relation);
      if (data && (data.fname || data.mname || data.lname)) {
        return `${data.fname} ${data.mname} ${data.lname}`.trim();
      }
      // If there's no data found or all name fields are empty, return undefined
      return undefined;
    }

  // getElementField(relation: number): string {
  //   const interest = this.relatedInterests.find(item => item.relation === relation);
  //   if (interest) {
  //     return `${interest.fname} ${interest.mname} ${interest.lname}`.trim();
  //   }
  //   return ''; // Return an empty string if no related interest found
  // }


  getRelationCount(): number {
    return this.relatedInterests.length;
  }


  

  openChecker() {
    this.dialogRef = this._dialog.open(RptTransactionModalComponent, {
      data: { rptListComponentInstance: this },
      width: '40%',
      position: { top: '3%' }
    });

    // this.dialogRef.componentInstance.selectRow.subscribe((data) => {
    //   this.selectedData = data;
    //   // Update your parent table with the selected data
    // });

    this.dialogRef.afterClosed().subscribe(result => {
      this.selectedData = result;
      if (result && result[0] && result[0].Data_RI) {
        this.mapRelatedInterests(result[0].Data_RI);
      }
      else {}
     
      // Handle any additional logic after the dialog is closed
    });
  }
}
