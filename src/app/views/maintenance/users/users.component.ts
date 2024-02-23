import { Component, AfterViewInit, ViewChild, NgZone, ChangeDetectionStrategy, ChangeDetectorRef, QueryList, ElementRef, Renderer2 } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { AbstractControl, FormControl, ValidationErrors, ValidatorFn, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { MatSort } from '@angular/material/sort';

// service
// import { SessionTimeoutService } from '../../../services/useridle/session-timeout.service';
import {AuthSessionService} from '../../../services/authentication/auth-session.service';
import {EditUserAccessService} from '../../../services/editUserAccess/edit-user-access.service';
// Imports for Functions
import {deleteDosri, deleteDirector, deleteRelationship} from '../../../functions-files/delFunctions'

//For Modals
import { UsersModalComponent } from 'src/app/modal-dialog/users-modal/users-modal.component';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {UsersAddModalComponent} from '../../../modal-dialog/users-add-modal/users-add-modal.component';
import { ViewUsersModalComponent } from 'src/app/modal-dialog/view-users-modal/view-users-modal.component';
//Import for Function
import { FetchDataService } from 'src/app/services/fetch/fetch-data.service';
import { userAccess} from '../../../functions-files/add/postAPI';

interface Users {
  username: string;
  role: number;
  status: number;
  date_inserted: any;
  mobile_no: number;
  authority: Permissions[];
}

export interface UPermiData {
  permissions: string;
  access: string;
}

export interface Command {
  value: string;
  viewValue: string;
}

export interface commandGroup {
  disabled?: boolean;
  name: string;
  command: Command[];
}

export interface Permissions {
  access: string;
  view: number;
  add: number;
  edit: number;
  delete: number;
  maker: number;
  approver: number;
  reviewer: number;
}



@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class UsersComponent {
  


  buttonConfigurations = {
    maker: ['add', 'edit', 'delete'],
    reviewer: ['view'],
    // ... add more roles as needed
  };

  public addvisible = false;
  public editvisible = false;
  otpForm!: FormGroup;
  hide = true;
  editData: any = [];
  commandGroups: any[] = [];
  editUserData: any = [];
  eUserForm: any = [];
  



  userDataSource = new MatTableDataSource<Users>();
  ToDisplay: string[] = [];
  columnsToDisplay: string[] = ['expand', 'username', 'role', 'status', 'date_inserted', 'mobile_no', 'action'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay,];
  expandedElement: Users | null = null;

  DdisplayedColumns: string[] = ['navigation_name', 'view', 'add', 'edit', 'delete', 'maker', 'approver', 'reviewer'];
  permissionDataSource = new MatTableDataSource<Permissions>();

  @ViewChild('usersModal') usersModal!: ElementRef;
  @ViewChild('paginator1') paginator1!: MatPaginator;
  @ViewChild('paginator2') paginator2!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private formBuilder: FormBuilder,
    public _dialog: MatDialog,
    private authService: AuthSessionService,
    private userAccessService: EditUserAccessService,
    private renderer: Renderer2,
    private el: ElementRef,
    private get: FetchDataService,
    private zone: NgZone,
    private cdr: ChangeDetectorRef) {
      
      this.eUserForm = this.formBuilder.group({
        fName: [''],
        mName: [''],
        lName: [''],
        uEmail: [''],
        uMobile: [''],
        commandControl: [''],
        userName: [''],
        uPass: ['']
      });
      // this.userData = { ...SAMPLE_DATA[0] }; // Shallow copy for initial rendering
    // this.originalData = JSON.parse(JSON.stringify(this.userData)); // Deep copy
  }

  ngAfterViewInit() {
    this.userDataSource.paginator = this.paginator2;
    this.permissionDataSource.paginator = this.paginator1;

    this.userDataSource.sort = this.sort;
    this.sort.sort({
      id: 'date_inserted',
      start: 'desc',
      disableClear: false
    });
  }

  // Call this method whenever there is user activity
  onUserActivity(): void {
    // this.idleService.resetIdleTimer();
  }


  ngOnInit() {
    
    this.updateTableData();
  }




  updateTableData(): void {
    this.get.getUserList((usersList) => {
      if (usersList) {
        this.userDataSource.data = usersList;
      } else {
        
      }
    });
  }


  getUserAccess(row): void {
    const userid = row.username
    userAccess(userid) // Pass the entire formData object
      .then((response) => {
        this.permissionDataSource.data = response.result[0].user_access;
        const userPerm = response.result[0].user_access
      })
      .catch((error) => {
       
      });
  }
  

  setUserID(row) {
    let userID = row.username
    this.userAccessService.setUserID(userID);
  }

 


  
updateDatabase(permission: Permissions, propertyName: any) {}

// Show Modal Form
openViewUserModal(data: any, event: any) {
  event.stopPropagation();
  const dialogRef = this._dialog.open(ViewUsersModalComponent, {
    data,    
  });

  dialogRef.afterClosed().subscribe({
    next: (val) => {
      if (val) {
        // this.getEmployeeList();
      }
    },
  });
}



  // Show Modal Form
  openAddEditUserForm() {
  const dialogRef = this._dialog.open(UsersAddModalComponent);
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
  const dialogRef = this._dialog.open(UsersModalComponent, {
    data,    
  });

  dialogRef.afterClosed().subscribe({
    next: (val) => {
      if (val) {
        // this.getEmployeeList();
      }
    },
  });
}



  closeUsersModal() {
    this.editvisible = !this.editvisible;
  }

  addUsersChange(event: any) {
    this.addvisible = event;
  }

  editUsersChange(event: any) {
    this.editvisible = event;
  }

  delRelationship(): void {
    // deleteRelationship()
    deleteDosri((dosriId) => {
  
    })
  }


  onButtonClick() {
    const modal = this.usersModal.nativeElement;

    if (modal) {
      this.renderer.addClass(modal, 'show');
      this.renderer.setStyle(modal, 'display', 'block');
    }
  }

  onModalClose() {
    const modal = this.usersModal.nativeElement;

    if (modal) {
      this.renderer.addClass(modal, 'hide');
      this.renderer.setStyle(modal, 'display', 'none');
    }
  }



  // Function to initialize buttons based on user role and ID
  initializeButtons(userId: number, userRole: string): string[] {
    const userButtons = this.buttonConfigurations['maker'];

    if (userButtons) {
      const buttonIds = userButtons.map(button => `${button}-${userId}`);
      return buttonIds;
    }
  

    return [];
  }

}

