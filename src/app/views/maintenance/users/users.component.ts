import { Component, AfterViewInit, ViewChild, NgZone, ChangeDetectionStrategy, ChangeDetectorRef, QueryList, ElementRef, Renderer2 } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator'
import { FormGroup, FormBuilder } from '@angular/forms';


// Imports for Functions
import {deleteDosri, deleteDirector, deleteRelationship} from '../../../functions-files/delFunctions'

interface Users {
  fName: string;
  mName: string;
  lName: string;
  userName: string;
  email: string;
  mobile: number;
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {
  public users: Users[] = [
    {
      fName: 'Yiorgos Avraamu',
      mName: 'New',
      lName: 'Avraamu',
      userName: 'User1',
      email: 'test@email.com',
      mobile: 1231244,
    },
    {
      fName: 'Avraamu',
      mName: 'New',
      lName: 'Yiorgos',
      userName: 'User2',
      email: 'test@email.com',
      mobile: 123124124,
    },
  ]

  public addvisible = false;
  public editvisible = false;
  usersForm!: FormGroup;
  hide = true;
  editData: any = [];
  
  dataSource = new MatTableDataSource();

  

  @ViewChild('usersModal') usersModal!: ElementRef;
  // @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('paginator') paginator!: MatPaginator;

  constructor(private formBuilder: FormBuilder,
    private renderer: Renderer2,
    private el: ElementRef) {
  }

  ngAfterViewInit() {
    // this.users.paginator = this.paginator;
    // this.Users = this.paginator;
  }


  ngOnInit() {
    this.usersForm = this.formBuilder.group({
      otp1: [''],
      otp2: [''],
      otp3: [''],
      otp4: [''],
      otp5: [''],
      otp6: [''],
      otp7: ['']
      // Add more form controls as needed
    });
  }



  // Functions
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

}
