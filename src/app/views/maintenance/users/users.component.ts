import { Component, AfterViewInit, ViewChild, NgZone, ChangeDetectionStrategy, ChangeDetectorRef, QueryList, ElementRef, Renderer2 } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator'
import { FormGroup, FormBuilder } from '@angular/forms';
import {animate, state, style, transition, trigger} from '@angular/animations'

// service
import { SessionTimeoutService } from '../../../services/useridle/session-timeout.service';

// Imports for Functions
import {deleteDosri, deleteDirector, deleteRelationship} from '../../../functions-files/delFunctions'

interface Users {
  id: number;
  fName: string;
  mName: string;
  lName: string;
  userName: string;
  email: string;
  mobile: number;
  department: string;
  role: string;
  authority: any[];
}

export interface UPermiData {
  permissions: string;
  access: string;
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class UsersComponent {
  public users: Users[] = [
    {
      id: 1,
      fName: 'Yiorgos Avraamu',
      mName: 'New',
      lName: 'Avraamu',
      userName: 'User1',
      email: 'test@email.com',
      mobile: 1231244,
      department: 'ITG',
      role: 'maker',
      authority: [
        {access: 'create', 
        permissions: true},
        {access: 'delete', 
        permissions: true}

      ]

      
    },
    {
      id: 2,
      fName: 'Avraamu',
      mName: 'New',
      lName: 'Yiorgos',
      userName: 'User2',
      email: 'test@email.com',
      mobile: 123124124,
      department: 'ITG',
      role: 'maker',
      authority: [
        {permissions: 'create', 
        access: true},
        {permissions: 'delete', 
        access: true}
      ]
    },
  ]

  buttonConfigurations = {
    maker: ['add', 'edit', 'delete'],
    reviewer: ['view'],
    // ... add more roles as needed
  };

  public addvisible = false;
  public editvisible = false;
  usersForm!: FormGroup;
  hide = true;
  editData: any = [];
  commandGroups: any[] = [];

  userDataSource = new MatTableDataSource();
  displayedColumns: string[] = [ 'expand', 'Fname', 'Mname', 'Lname', 'Uname',
  'Email', 'Mobile', 'Dept', 'view'];
  // permiColumnsToDisplay: string[] = ['permissions', 'access']
  // columnsToDisplayWithExpand = [...this.permiColumnsToDisplay,];
  expandedElement: UPermiData | null = null;


  

  @ViewChild('usersModal') usersModal!: ElementRef;
  // @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('paginator') paginator!: MatPaginator;

  constructor(private formBuilder: FormBuilder,
    private renderer: Renderer2,
    private el: ElementRef,
    private idleService: SessionTimeoutService) {
  }

  ngAfterViewInit() {
    // this.users.paginator = this.paginator;
    // this.Users = this.paginator;
  }

  // Call this method whenever there is user activity
  onUserActivity(): void {
    this.idleService.resetIdleTimer();
  }


  ngOnInit() {
    this.usersForm = this.formBuilder.group({
      otp1: [''],
      otp2: [''],
      otp3: [''],
      otp4: [''],
      otp5: [''],
      otp6: [''],
      otp7: [''],
      commandControl: ['']
      // Add more form controls as needed
    });
    this.updateTableData();
    console.log(this.userDataSource);
  }


  // updateTableData(): void {
  //   this.userDataSource.data = this.users
  // }



  // Functions
updateTableData(): void {
  const User = this.users

  const permissionColumn = ['permissions', 'access']
  const tableData: Record<string, any>[] = [];

  for (const users of User) {
    // const dir_relatedId = director.dir_cisnumber;
    const row: Record<string, any> = {
        'Fname': users.fName,
        'Mname': users.mName,
        'Lname': users.lName,
        'Uname': users.userName,
        'Email': users.email,
        'Mobile': users.mobile,
        'Dept': users.department
        
    };
    // Loop through each element in the 'relationColumn' array
    for (let index = 0; index < permissionColumn.length; index++) {
        const authority = permissionColumn[index]; // Get the current relation name from the 'relationColumn' array
        // Filter 'director.related_interest' array to get related names based on the relation index
        const permiData = users.authority
        
        .filter(permitted => permitted.permissions === index + 1)
        // Create an object with the required properties
        .map(permitted => ({
            permissions: permitted.permissions,
            access: permitted.access,
        }))
        // Filter out objects with empty names (names with only whitespace)
        // .filter(data => typeof data.fullName === 'string' && data.fullName.trim() !== '');

              // Assign the 'relatedNames' array to the 'row' object with the key as 'relationName'
              row[authority] = permiData;
              console.log(permiData);
    }

    tableData.push(row);

}

this.userDataSource.data = tableData;
console.log(this.userDataSource.data);
// Trigger change detection
// this.changeDetectorRef.detectChanges();
}

  addUsers() {
    this.addvisible = !this.addvisible;
  }

  editUsers(user: any): void {
    this.editvisible = !this.editvisible;
    console.log(user);
    this.editData = {
      fname: user.fName,
      mname: user.mName,
      lname: user.lName,
      email: user.email,
      username: user.userName,
      mobile: user.mobile
      // Add other properties as needed
    };
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
    console.log("Are you sure you want to delete?")
    deleteDosri((dosriId) => {
  
    })
  }


  onButtonClick() {
    console.log('Show Modal');
    console.log("success: Login Successfully");
    const modal = this.usersModal.nativeElement;

    if (modal) {
      this.renderer.addClass(modal, 'show');
      this.renderer.setStyle(modal, 'display', 'block');
    }
  }

  onModalClose() {
    console.log('Show Modal');
    console.log("success: Login Successfully");
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
      console.log('Button IDs:', buttonIds);
      return buttonIds;
    }
  

    return [];
  }

}
