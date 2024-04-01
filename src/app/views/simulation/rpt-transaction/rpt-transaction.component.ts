import { Component, AfterViewInit, ViewChild, TemplateRef, NgZone, ChangeDetectionStrategy, ChangeDetectorRef, QueryList, ElementRef, Renderer2 } from '@angular/core';
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
 'deposit_holdout', 'net_bal', 'date_granted', 'term', 'purpose', 'int_rate', 'int_rate1', 'int_rate2', 'int_rate3'];


 displayedColumns2: string[] = ['cis_no', 'loan_no', 'name', 'principal', 'principal_bal', 'loan_security',
  'deposit_holdout', 'net_bal', 'date_granted', 'term', 'purpose', 'int_rate'];

 displayedColumns3: string[] = ['id', 'branch', 'lessor', 'address', 'payee', 
 'floor_area', 'rent_vat', 'cusa_vat', 'mktg_support', 'monthly', 'annual'];
  
  constructor(
    public _dialog: MatDialog
  ) {

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
      // Handle any additional logic after the dialog is closed
    });
  }
}
