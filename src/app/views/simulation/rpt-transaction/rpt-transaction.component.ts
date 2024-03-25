import { Component, AfterViewInit, ViewChild, TemplateRef, NgZone, ChangeDetectionStrategy, ChangeDetectorRef, QueryList, ElementRef, Renderer2 } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import { MatSort } from '@angular/material/sort';


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

  rowData = [
    { id: 1, name: 'John', age: 30 },
    { id: 2, name: 'Alice', age: 25 },
    { id: 3, name: 'Bob', age: 35 }
  ];




  constructor(
    public _dialog: MatDialog
  ) {

  }




  openChecker() {
    const dialogRef = this._dialog.open(RptTransactionModalComponent, {
      data: {
        rptListComponentInstance: this // Pass the instance of RPTListComponent to ModalComponent3
      },
      width: '40%', // Set the width as per your requirement
      position: { top: '3%' }
      // Other MatDialog options can be specified here
    });
    dialogRef.afterClosed().subscribe(result => {

    });
  }
}
