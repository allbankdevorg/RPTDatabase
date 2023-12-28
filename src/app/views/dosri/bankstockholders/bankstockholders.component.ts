import { Component, AfterViewInit, NgZone, ViewChild, ChangeDetectorRef} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { AbstractControl, FormControl, ValidationErrors, ValidatorFn, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

// Functions Import
import {updateShares} from '../../../functions-files/updateFunctions'


//Import for Function
import { FetchDataService } from 'src/app/services/fetch/fetch-data.service';


// For Modal
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { StockholdersModalComponent } from 'src/app/modal-dialog/stockholders-modal/stockholders-modal.component';

// Audit Trail
import { AuditTrailService } from '../../../services/auditTrail/audit-trail.service';


export interface Data {
  fullname: string;
  company: string,
  position: String,
  shares: String,
  action: string,
}


@Component({
  selector: 'app-bankstockholders',
  templateUrl: './bankstockholders.component.html',
  styleUrls: ['./bankstockholders.component.scss']
})
export class BankstockholdersComponent {

  sharedData: string | any;

  displayedColumns: string[] = ['name', 'shares', 'amount', 'percentage', 'date_insert', 'action'];
  displayedColumns1: string[] = ['name'];
  dataSource = new MatTableDataSource<Data>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;


  constructor(private router: Router,
    public _dialog: MatDialog,  
    private formBuilder: FormBuilder, 
    private http: HttpClient, 
    private changeDetectorRef: ChangeDetectorRef,
    private ngZone: NgZone,
    private get: FetchDataService,
    private auditTrailService: AuditTrailService)
    {   
}

  

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }



  ngOnInit() {
    this.updateTableData();
  }


  // Functions
  onRowClick(row: any) {
    // Capture the selected data and navigate to another component with it
    // this.router.navigate(['/details', row.id]);
    console.log('Show Update Modal Form');
    // this.router.navigate(['/dri/directorsrelated', row.bn]);
  }


  updateTableData(): void {
    this.get.getStckHolders((stckHldrs) => {
      if (stckHldrs) {
        this.dataSource.data = stckHldrs;
      } else {
        console.error('No bankstock holder received');
      }
    });
  }


  openAddEditForm() {
    const dialogRef = this._dialog.open(StockholdersModalComponent);
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.updateTableData();
        }
      },
    });
  }
  
  openEditForm(data: any, event: any) {
    event.stopPropagation();
    // console.log(data);
    const dialogRef = this._dialog.open(StockholdersModalComponent, {
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
  

}


// Data Sets






  