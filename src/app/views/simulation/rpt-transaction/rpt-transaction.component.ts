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
  names?: string[];
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


 displayedColumns1: string[] = ['cis_no', 'loan_no', 'name', 'principal', 'principal_bal', 'loan_security',
 'holdoutdata', 'net_bal', 'date_granted', 'term', 'purpose', 'int_rate', 'int_rate1', 'int_rate2', 'int_rate3'];


 displayedColumns2: string[] = ['cis_no', 'loan_no', 'name', 'principal', 'principal_bal', 'loan_security',
  'holdoutdata', 'net_bal', 'date_granted', 'term', 'purpose', 'int_rate'];

 displayedColumns3: string[] = ['id', 'branch', 'lessor', 'address', 'payee', 
 'floor_area', 'rent_vat', 'cusa_vat', 'mktg_support', 'monthly', 'annual'];
  
  constructor(
    public _dialog: MatDialog
  ) {

  }



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
    let hasData = false; // Flag to track if any data is available
  
    for (let i = 1; i <= 15; i++) {
      const items = data.filter(item => item.relation === i);
      if (items.length > 0) {
        hasData = true; // Set the flag to true if any data is found
        const names = items.map(item => `${item.fname} ${item.mname} ${item.lname}`);
        this.relatedInterests.push({ relation: i, fname: '', mname: '', lname: '', names: names });
      } else {
        // Push an object with an empty array for names
        this.relatedInterests.push({ relation: i, fname: '', mname: '', lname: '', names: [] });
      }
    }
  
    // If no data is available for any relation, push "No Data Available" to all names arrays
    if (!hasData) {
      this.relatedInterests.forEach(interest => {
        interest.names = ['No Data Available'];
      });
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

  getRelationCount(): number {
    return this.relatedInterests.length;
  }

  getRelationName(relation: number): string {
    return this.relationColumnMapping[relation] || 'Unknown'; // Provide a default value if the relation is not found
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
