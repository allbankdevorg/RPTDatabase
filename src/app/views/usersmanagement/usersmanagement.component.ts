import { Component, AfterViewInit, ViewChild, NgZone, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator'


interface Users {
  fName: string;
  mName: string;
  lName: string;
  userName: string;
  email: string;
  mobile: number;
}

@Component({
  selector: 'app-usersmanagement',
  templateUrl: './usersmanagement.component.html',
  styleUrls: ['./usersmanagement.component.scss']
})
export class UsersmanagementComponent {
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


  @ViewChild(MatPaginator) paginator!: MatPaginator;


  ngAfterViewInit() {
    // this.Users = this.paginator;
  }
}

