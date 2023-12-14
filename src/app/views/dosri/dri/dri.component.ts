import { AfterViewInit, Input, Component, ViewChild, NgZone, ChangeDetectionStrategy, ElementRef, Renderer2, ChangeDetectorRef } from '@angular/core';
import { AbstractControl, FormControl, ValidationErrors, ValidatorFn, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {animate, state, style, transition, trigger} from '@angular/animations'
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';



import { DosriModalComponent } from 'src/app/modal-dialog/dosri-modal/dosri-modal.component';
// Services
import { DataTransferService } from '../../../services/data-transfer.service';
import { SessionTimeoutService } from '../../../services/useridle/session-timeout.service';
import { SharedService } from '../dataintegration/shared.service';
import {AuthSessionService} from '../../../services/authentication/auth-session.service'

// Functions Imports
import {callJSFun} from '../../../functions-files/javascriptfun.js';
import {FetchDataService} from '../../../services/fetch/fetch-data.service';
// import {getCompany, getDirectors} from '../../../functions-files/getFunctions'
import {createDosri} from '../../../functions-files/add/postAPI.js'
import {deleteDosri, deleteDirector, deleteRelationship} from '../../../functions-files/delFunctions'


// Audit Trail
import { AuditTrailService } from '../../../services/auditTrail/audit-trail.service';
import {AuditTrail} from '../../../model/audit-trail.model';



import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
// Interfaces
export interface compData {
  com_cis_number: string;
  com_company_name: string,
  directorCount: string;
  date_inserted: String,
  view: string,
  directors: DData[];
}

export interface DData {
  dir_cisnumber: string;
  fname: string,
  mname: String,
  lname: string,
  fullname: string,
  position: string,
  view: string,
}

@Component({
  selector: 'app-dri',
  templateUrl: './dri.component.html',
  styleUrls: ['./dri.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

@Injectable({
  providedIn: 'root',
})

export class DriComponent {
  editData: any = [];
  sharedData: string | any;
  postForm: FormGroup;
  dosriForm: FormGroup;
  data: any = [];
  public visible = false;
  selectedItem: any;

  
  compDataSource = new MatTableDataSource<any>;
  // compDataSource = new MatTableDataSource<compData>([]);
  ToDisplay: string[] = [];
  
  columnsToDisplay: string[] = ['expand', 'com_cis_number', 'com_company_name', 'directorCount', 'date_inserted', 'view'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay,];
  expandedElement: compData | null = null;

  DdisplayedColumns: string[] = ['dir_cisnumber', 'directorName', 'position'];
  dDataSource = new MatTableDataSource<DData>([]);

  
  @ViewChild('editModal') editModal!: ElementRef;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  // @ViewChild('editDosri') editDosri!: ElementRef;
  

  ngAfterViewInit() {
    this.compDataSource.paginator = this.paginator;
  }


  constructor(private router: Router,
    public _dialog: MatDialog,
    private authService: AuthSessionService,
    private idleService: SessionTimeoutService,
    private formBuilder: FormBuilder, 
    private http: HttpClient, 
    private sharedService: SharedService,
    private changeDetectorRef: ChangeDetectorRef,
    private ngZone: NgZone,
    private renderer: Renderer2,
    private el: ElementRef,
    private get: FetchDataService,
    private auditTrailService: AuditTrailService) {
    this.postForm = this.formBuilder.group({
    title: ['', Validators.required],
    body: ['', Validators.required]
    });
    this.dosriForm = this.formBuilder.group({
    cisNumber: ['', [Validators.required]],
    accountName: ['', [Validators.required]],
    companyName: ['', [Validators.required]]
    });

    }



    ngOnInit(): void {
    this.updateTableData();
  }
  

  // All Functions below
  updateTableData(): void {
    // Assuming `getCompany` and `getDirectors` return Observables
    forkJoin([this.get.getCompany(), this.get.getDirectors()]).subscribe({
      next: ([compData, DData]) => {
        // Process the data to count directors related to each company
        const companiesWithDirectors = compData.map(company => {
          const relatedDirectors = DData.filter(director => director.com_related === company.com_cis_number);
          return { ...company, directorCount: relatedDirectors.length, directors: relatedDirectors };
        });
  
        // Update the data source for companies
        this.compDataSource.data = companiesWithDirectors;
        console.log(this.compDataSource.data);
  
        // Update the data source for directors
        this.dDataSource.data = companiesWithDirectors;
        console.log(this.dDataSource.data);
  
        // Trigger change detection
        this.changeDetectorRef.detectChanges();
      },
      error: console.log,
    });
  }
  
  // updateTableData(): void {
  //   this.get.getCompany((compData) => {
  //     // Process the data to count directors related to each company
  //     const companiesWithDirectors = compData.map(company => {
  //       const directors = company.directors || []; // Ensure there is a directors array
  //       const directorCount = directors.length;
  //       return { ...company, directorCount, directors };
  //     });

  //     // Set the data source for your MatTable
  //     this.compDataSource.data = companiesWithDirectors;
  //     console.log(this.compDataSource.data);
  //   });

  //   this.get.getDirectors((DData) => {
  //     this.get.getCompany((compData) => {
  //       // Process the data to count directors related to each company
  //       const companiesWithDirectors = compData.map(company => {
  //         const relatedDirectors = DData.filter(director => director.com_related === company.com_cis_number);
  //         return { ...company, directorCount: relatedDirectors.length, directors: relatedDirectors };
  //       });

  //       // Set the data source for your MatTable
  //       console.log(companiesWithDirectors)
  //       this.dDataSource.data = companiesWithDirectors;
  //       console.log(companiesWithDirectors);
  //       console.log(this.dDataSource.data);
  //       // Trigger change detection
  //       this.changeDetectorRef.detectChanges();
  //     });
  //   });
  // }
  // updateTableData(): void {
  //   getCompany((compData) => {
  //     // Process the data to count directors related to each company
  //       const companiesWithDirectors = compData.map(company => {
  //         const directors = company.directors || []; // Ensure there is a directors array
  //         const directorCount = directors.length;
  //         return { ...company, directorCount, directors };
  //       });

  //       // Set the data source for your MatTable
  //       this.compDataSource.data = companiesWithDirectors;
  //       console.log(this.compDataSource.data);
  //   });

  //     getCompany((compData) => {
  //       // Fetch director data
  //       getDirectors((DData) => {
  //         // Process the data to count directors related to each company
  //         const companiesWithDirectors: DData[] = compData.map(company => {
  //           const relatedDirectors = DData.filter(director => director.com_related === company.com_cis_number);
  //           return { ...company, directorCount: relatedDirectors.length, directors: relatedDirectors };
  //         });
      
  //         // Set the data source for your MatTable
  //         console.log(companiesWithDirectors)
  //         this.dDataSource.data = companiesWithDirectors;
  //         console.log(companiesWithDirectors);
  //         console.log(this.dDataSource.data);
  //       // Trigger change detection
  //       this.changeDetectorRef.detectChanges();
  //       });
        
  //     });
  //  }

   
    addData() {
      
    }

    onButtonClick() {
      console.log('Show Modal');
      
    }
    

    onRowClick(element: any, event: Event) {
      event.stopPropagation();
      console.log(element);
      // Capture the selected data and navigate to another component with it
      // this.router.navigate(['/details', row.id]);
      const directorId = element.com_cis_number; // Extract the ID from the clicked row
      const companyName = element.com_company_name;

      
      this.logAction('View', 'Viewed ' + companyName + " Directors and It's related interest", true, 'DRI');

      this.sharedService.setCompName(companyName);
      this.sharedService.setDirectorId(directorId);
      this.sharedService.setCompanyCis(companyName);
      console.log(directorId);
      console.log(companyName);
      console.log('row has been clicked');
      console.log('Clicked row data:', element);
      this.router.navigate(['/dosri/directorsrelated', directorId]);
    }


    onAccRowClick(element: any) {
      console.log(element);
      // Capture the selected data and navigate to another component with it
      // this.router.navigate(['/details', row.id]);
      const directorId = element.com_cis_number; // Extract the ID from the clicked row
      const companyName = element.com_company_name;

      this.sharedService.setCompName(companyName);
      this.sharedService.setDirectorId(directorId);
      this.sharedService.setCompanyCis(companyName);
      console.log(directorId);
      console.log(companyName);
      console.log('row has been clicked');
      console.log('Clicked row data:', element);
      this.logAction('View', 'Viewed ' + companyName + " Directors and It's related interest", true, 'DRI');
      this.router.navigate(['/dosri/directorsrelated', directorId]);
    }
    

    editDosri(element: any, event: Event): void {
      event.stopPropagation();
      this.visible = !this.visible;
      console.log(element);
      this.selectedItem = element;

      this.editData = {
        com_cis_number: element.com_cis_number,
        com_account_name: element.com_account_name,
        com_company_name: element.com_company_name,
        // Add other properties as needed
      };
    }

    closeEditDosri() {
      this.visible = !this.visible;
    }
  
    handleChange(event: any) {
      this.visible = event;
    }

    edit(){
      console.log('Show Modal');
      console.log("success: Login Successfully");
      const modal = this.editModal.nativeElement;

      if (modal) {
        this.renderer.addClass(modal, 'show');
        this.renderer.setStyle(modal, 'display', 'block');
      }
    }

    onModalClose() {
      console.log('Show Modal');
      console.log("success: Login Successfully");
      const modal = this.editModal.nativeElement;
  
      if (modal) {
        this.renderer.addClass(modal, 'hide');
        this.renderer.setStyle(modal, 'display', 'none');
      }
    }

    delDosri(row: any, comCIS: any, event: Event): void {
      event.stopPropagation();
      // deleteRelationship()
      // console.log(row);
      // console.log(comCIS);
      deleteDosri((dosriId) => {
    
      })
    }


// Show Modal Form
openAddEditEmpForm() {
  const dialogRef = this._dialog.open(DosriModalComponent);
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
  console.log(data);
  const dialogRef = this._dialog.open(DosriModalComponent, {
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



  // Start of Functions for Audit Trail
logAction(actionType: string, details: string, success: boolean, page: string, errorMessage?: string) {
  const auditTrailEntry = this.createAuditTrailEntry(actionType, details, success, page, errorMessage);
  this.logAuditTrail(auditTrailEntry);
}



private createAuditTrailEntry(actionType: string, details: string, success: boolean, page: string, errorMessage?: string): AuditTrail {
  return {
    userId: 'current_user_id',
    userName: 'Current_user',
    timestamp: new Date(),
    actionType,
    details,
    success,
    page, // Include the page information
    errorMessage: errorMessage || '', // Optional: Include error message if available
  };
}


private logAuditTrail(auditTrailEntry: AuditTrail) {
  this.auditTrailService.logAuditTrail(auditTrailEntry).subscribe(() => {
    console.log('Audit trail entry logged successfully.');
  });
  // console.log('Audit trail entry logged successfully.');
}

}
