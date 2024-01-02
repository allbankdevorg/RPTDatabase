import { Component, AfterViewInit, ViewChild, NgZone, ChangeDetectionStrategy, ChangeDetectorRef, QueryList, ElementRef, Renderer2 } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { AbstractControl, FormControl, ValidationErrors, ValidatorFn, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {animate, state, style, transition, trigger} from '@angular/animations'

// service
// import { SessionTimeoutService } from '../../../services/useridle/session-timeout.service';
import {AuthSessionService} from '../../../services/authentication/auth-session.service'

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

  DdisplayedColumns: string[] = ['nav_id', 'view', 'add', 'edit', 'delete', 'maker', 'approver', 'reviewer'];
  permissionDataSource = new MatTableDataSource<Permissions>();

  // userDataSource = new MatTableDataSource();
  // displayedColumns: string[] =['view', 'access', 'add'];
  // permiColumnsToDisplay: string[] =  ]
  // columnsToDisplayWithExpand = [...this.permiColumnsToDisplay,];
  // expandedElement: permissions | null = null;

  // Use the sample data in your component
  // dataSource = new MatTableDataSource<permissions>();
  // private originalData: Users;
  // userData: Users;
  

  @ViewChild('usersModal') usersModal!: ElementRef;
  @ViewChild('paginator1') paginator1!: MatPaginator;
  @ViewChild('paginator2') paginator2!: MatPaginator;

  constructor(private formBuilder: FormBuilder,
    public _dialog: MatDialog,
    private authService: AuthSessionService,
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
  }

  // Call this method whenever there is user activity
  onUserActivity(): void {
    // this.idleService.resetIdleTimer();
  }


  ngOnInit() {
    
    this.updateTableData();
    // console.log(this.userDataSource.data);
    // this.dataSource.data = SAMPLE_DATA;
    // console.log(this.dataSource.data)
  }




  updateTableData(): void {
    this.get.getUserList((usersList) => {
      if (usersList) {
        this.userDataSource.data = usersList;
        console.log(usersList);
      } else {
        console.error('No Users received');
      }
    });
  }


  getUserAccess(row): void {
    const userid = row.username
    console.log(userid);
    userAccess(userid) // Pass the entire formData object
      .then((response) => {
        console.log(response);
        this.permissionDataSource.data = response.result[0].user_access;
        console.log(this.permissionDataSource.data);
        const userPerm = response.result[0].user_access
      })
      .catch((error) => {
       
      });
  }
  


 


  
// updateTableData(): void {
//   // const User = this.users
//   const UsersData = SAMPLE_DATA.map(user => {
//     // const permissions: Permissions = {
//     //   access: user.authority[0].access,
//     //   view: user.authority[0].view,
//     //   add: user.authority[0].add,
//     //   edit: user.authority[0].edit,
//     //   delete: user.authority[0].delete,
//     //   maker: user.authority[0].maker,
//     //   approver: user.authority[0].approver,
//     //   reviewer: user.authority[0].reviewer,
//     // };
//     // return { ...user };
//   });

//   // Set the data source for your MatTable for users
//   this.userDataSource.data = UsersData;
//   // console.log('Users Data:', this.userDataSource.data);



//   // Update permissions data
//   // Set the data source for your MatTable for permissions
//   // this.permissionDataSource.data = ACCESS_DATA;
//   // console.log('Permissions Data:', this.permissionDataSource.data);


  
// }





// Function to update checkbox values in the data object
// updateDatabase(permission: number) {
//   // const value = this.userDataSource[0].authority[0][permission] === 1 ? 0 : 1;
//   // this.userDataSource[0].authority[0][permission] = value;

//   // console.log(value);
//   console.log(this.authority[0][permission]);
// }

// updateDatabase(permission: Permissions, propertyName: any) {
//   // Convert the checkbox state to 0 or 1 for the specified property
//   permission[propertyName] = permission[propertyName] === 1 ? 0 : 1;
//     permission = JSON.parse(JSON.stringify(this.originalData)); // Reset the userData with a deep copy
    
//     this.userData = JSON.parse(JSON.stringify(this.originalData)); // Reset userData with a deep copy

//     // Manually trigger change detection
//     this.cdr.detectChanges();

//     // console.log(this.userData);
  
//   // Assuming you have a service for handling database interactions
//   // Replace 'yourService' with the actual service name
//   // this.yourService.updatePermissions(permission).subscribe(
//   //   response => {
//   //     console.log('Database updated successfully', response);
//   //   },
//   //   error => {
//   //     console.error('Error updating database', error);
//   //   }
//   // );
// }

updateDatabase(permission: Permissions, propertyName: any) {}

// Show Modal Form
openViewUserModal(data: any, event: any) {
  event.stopPropagation();
  // console.log(data);
  const dialogRef = this._dialog.open(ViewUsersModalComponent, {
    data,    
  });

  dialogRef.afterClosed().subscribe({
    next: (val) => {
      if (val) {
        // this.getEmployeeList();
        // console.log("Successs");
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
  console.log(data);
  event.stopPropagation();
  // console.log(data);
  const dialogRef = this._dialog.open(UsersModalComponent, {
    data,    
  });

  dialogRef.afterClosed().subscribe({
    next: (val) => {
      if (val) {
        // this.getEmployeeList();
        // console.log("Successs");
      }
    },
  });
}


  // editUsers(user: any): void {
  //   this.editvisible = !this.editvisible;
  //   console.log(user);
  //   this.editData = {
  //     fname: user.fName,
  //     mname: user.mName,
  //     lname: user.lName,
  //     email: user.email,
  //     username: user.userName,
  //     mobile: user.mobile
  //     // Add other properties as needed
  //   };
  // }

  // editUsers(row: any): void {
  //   this.editvisible = !this.editvisible;
  //   // console.log(row);
  //   // console.log(this.commandGroups);
  //   const selectedDept = row.Dept;
  //   // console.log('Selected Department:', selectedDept);
  //    // Check if the selectedManager exists in the commandGroups
  //    const isValidDept = this.commandGroups.some(group => {
  //     // console.log('Group Value:', group.value);
  //     return group.value === selectedDept;
  //   });
  
  //   // console.log('IsValidDepartment:', isValidDept);
  


  // // Set the value only if it's a valid manager
  // if (isValidDept) {
  //   this.userForm.get('commandControl')?.setValue(selectedDept);
    
  // } else {
  //   // Optionally, handle the case where the manager is not valid
  //   // console.error('Invalid Department:', isValidDept);
  //   // console.log(this.userForm);
  // }

  //   this.editUserData = {
  //     fName: row.Fname,
  //     mName: row.Mname,
  //     lName: row.Lname,
  //     email: row.Email,
  //     dept: row.Dept,
  //     mobile: row.Mobile,
  //     userName: row.Uname,
  //     // Add other properties as needed
  //   };

  //   // console.log(this.editUserData);
    
  // }

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
    // console.log("Are you sure you want to delete?")
    deleteDosri((dosriId) => {
  
    })
  }


  onButtonClick() {
    // console.log('Show Modal');
    // console.log("success: Login Successfully");
    const modal = this.usersModal.nativeElement;

    if (modal) {
      this.renderer.addClass(modal, 'show');
      this.renderer.setStyle(modal, 'display', 'block');
    }
  }

  onModalClose() {
    // console.log('Show Modal');
    // console.log("success: Login Successfully");
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
      // console.log('Button IDs:', buttonIds);
      return buttonIds;
    }
  

    return [];
  }

}


// let SAMPLE_DATA: Users[] = [
//   {
//     id: 1,
//     fName: 'Yiorgos Avraamu',
//     mName: 'New',
//     lName: 'Avraamu',
//     userName: 'User1',
//     email: 'test@email.com',
//     mobile: 1231244,
//     department: 'ITG',
//     role: '1',
//     authority: [
//       { access: 'Affiliates',  view: 1, add: 1, edit: 1, delete: 1, maker: 1, approver:1, reviewer: 1 },
//       { access: 'users',  view: 1, add: 1, edit: 1, delete: 0, maker: 1, approver: 0, reviewer: 1 },
//       { access: 'dri',  view: 1, add: 1, edit: 1, delete: 0, maker: 1, approver: 0, reviewer: 1 },
//       { access: 'bankofficer',  view: 1, add: 1, edit: 1, delete: 0, maker: 1, approver: 0, reviewer: 1 },
//       { access: 'directorsrelated/:id',  view: 1, add: 1, edit: 1, delete: 0, maker: 1, approver: 0, reviewer: 1 },
//     ]

    
//   },
//   {
//     id: 2,
//     fName: 'Avraamu',
//     mName: 'New',
//     lName: 'Yiorgos',
//     userName: 'User2',
//     email: 'test@email.com',
//     mobile: 123124124,
//     department: 'ITG',
//     role: '5',
//     authority: [
//       { access: 'Affiliates', view: 1, add: 0, edit: 0, delete: 0, maker: 0, approver: 1, reviewer: 0 },
//     ]
//   },



//   // Add more rows as needed
// ];


// const ACCESS_DATA: Permissions[] = [
//   {
    
//     access: 'Affiliates',  view: 1, add: 0, edit: 1, delete: 0, maker: 1, approver: 0, reviewer: 1 
//   },
//   {
//     access: 'Affiliates',  view: 1, add: 0, edit: 1, delete: 0, maker: 1, approver: 0, reviewer: 0 
//   },
// ]