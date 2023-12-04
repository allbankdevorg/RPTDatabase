import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Users {
  id: number;
  fName: string;
  mName: string;
  lName: string;
  userName: string;
  password: string;
  email: string;
  mobile: number;
  department: string;
  role: string;
  authority: Permissions[];
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

@Injectable({
  providedIn: 'root'
})
export class DummyDataService {

  getUsers(user): Users[] {
    return [
      {
        id: 1,
        fName: 'Yiorgos Avraamu',
        mName: 'New',
        lName: 'Avraamu',
        userName: 'User1',
        email: 'test@email.com',
        password: 'user1234',
        mobile: 1231244,
        department: 'ITG',
        role: 'Reviewer',
        authority: [
          { access: 'dri', view: 1, add: 0, edit: 0, delete: 0, maker: 0, approver: 0, reviewer: 1 },
          { access: 'directorsrelated/:id', view: 1, add: 1, edit: 1, delete: 0, maker: 0, approver: 0, reviewer: 1 },
          { access: 'bankofficer', view: 1, add: 0, edit: 0, delete: 0, maker: 0, approver: 0, reviewer: 1 },
          { access: 'bankstockholders', view: 1, add: 0, edit: 0, delete: 0, maker: 0, approver: 0, reviewer: 1 },
          { access: 'affiliates', view: 1, add: 0, edit: 0, delete: 0, maker: 0, approver: 0, reviewer: 1 },
          { access: 'affiliates-related-companies', view: 1, add: 0, edit: 0, delete: 0, maker: 0, approver: 0, reviewer: 1 },
          { access: 'other-related-parties', view: 1, add: 0, edit: 0, delete: 0, maker: 0, approver: 0, reviewer: 1 },
          { access: 'rp-officer', view: 1, add: 0, edit: 0, delete: 0, maker: 0, approver: 0, reviewer: 1 },
          { access: 'pac/:id', view: 1, add: 0, edit: 0, delete: 0, maker: 0, approver: 0, reviewer: 1 },
          { access: 'rpofficer-ri/:id', view: 1, add: 0, edit: 0, delete: 0, maker: 0, approver: 0, reviewer: 1 },
          { access: 'users', view: 1, add: 0, edit: 0, delete: 0, maker: 0, approver: 0, reviewer: 1 },
        ] ,
      },
      {
        id: 1,
        fName: 'Yiorgos Avraamu',
        mName: 'New',
        lName: 'Avraamu',
        userName: 'Admin',
        email: 'test@email.com',
        password: 'admin1234',
        mobile: 1231244,
        department: 'ITG',
        role: 'Maker',
        authority: [
          { access: 'dri', view: 0, add: 1, edit: 1, delete: 1, maker: 1, approver: 0, reviewer: 1 },
          { access: 'directorsrelated/:id', view: 0, add: 1, edit: 1, delete: 0, maker: 1, approver: 0, reviewer: 1 },
          { access: 'bankofficer', view: 1, add: 1, edit: 1, delete: 0, maker: 1, approver: 0, reviewer: 1 },
          { access: 'bankstockholders', view: 0, add: 1, edit: 1, delete: 0, maker: 1, approver: 0, reviewer: 1 },
          { access: 'affiliates', view: 0, add: 1, edit: 1, delete: 0, maker: 1, approver: 0, reviewer: 1 },
          { access: 'affiliates-related-companies', view: 0, add: 1, edit: 1, delete: 0, maker: 1, approver: 0, reviewer: 1 },
          { access: 'other-related-parties', view: 0, add: 1, edit: 1, delete: 0, maker: 1, approver: 0, reviewer: 1 },
          { access: 'rp-officer', view: 0, add: 1, edit: 1, delete: 0, maker: 1, approver: 0, reviewer: 1 },
          { access: 'pac/:id', view: 0, add: 1, edit: 1, delete: 0, maker: 1, approver: 0, reviewer: 1 },
          { access: 'rpofficer-ri/:id', view: 0, add: 1, edit: 1, delete: 0, maker: 1, approver: 0, reviewer: 1 },
          { access: 'users', view: 0, add: 1, edit: 1, delete: 0, maker: 1, approver: 0, reviewer: 1 },
        ] ,
      },
    ]
  }
    // {
    //   id: 2,
    //   fName: 'Avraamu',
    //   mName: 'New',
    //   lName: 'Yiorgos',
    //   userName: 'User2',
    //   email: 'test@email.com',
    //   mobile: 123124124,
    //   department: 'ITG',
    //   role: 'maker',
    //   authority: [
    //     { access: 'users', view: 1, add: 1, edit: 0, delete: 0, maker: 0, approver: 1, reviewer: 0 },
    //   ]
    // },
    // {
    //   id: 3,
    //   fName: 'Junel',
    //   mName: 'O',
    //   lName: 'Salarda',
    //   userName: 'Admin',
    //   email: 'admin@test.com',
    //   mobile: 123124124,
    //   department: 'ITG',
    //   role: 'maker',
    //   authority: [
    //     { access: 'Affiliates', view: 1, add: 0, edit: 0, delete: 0, maker: 0, approver: 1, reviewer: 0 },
    //   ]
    // },
    // Add more simulated user data as needed
  // ];

  // getUsers(): Observable<any[]> {
  //   // Simulate fetching data from a database
  //   return of(this.users);
  // }
}


 // private dummyData: Users[] = [
  //         {
  //           id: 1,
  //           fName: 'Yiorgos Avraamu',
  //           mName: 'New',
  //           lName: 'Avraamu',
  //           userName: 'User1',
  //           email: 'test@email.com',
  //           password: 'user1234',
  //           mobile: 1231244,
  //           department: 'ITG',
  //           role: 'Reviewer',
  //           authority: [
  //             { access: 'dri', view: 1, add: 0, edit: 0, delete: 0, maker: 0, approver: 0, reviewer: 1 },
  //             { access: 'directorsrelated/:id', view: 1, add: 1, edit: 1, delete: 0, maker: 0, approver: 0, reviewer: 1 },
  //             { access: 'bankofficer', view: 1, add: 0, edit: 0, delete: 0, maker: 0, approver: 0, reviewer: 1 },
  //             { access: 'bankstockholders', view: 1, add: 0, edit: 0, delete: 0, maker: 0, approver: 0, reviewer: 1 },
  //             { access: 'affiliates', view: 1, add: 0, edit: 0, delete: 0, maker: 0, approver: 0, reviewer: 1 },
  //             { access: 'affiliates-related-companies', view: 1, add: 0, edit: 0, delete: 0, maker: 0, approver: 0, reviewer: 1 },
  //             { access: 'other-related-parties', view: 1, add: 0, edit: 0, delete: 0, maker: 0, approver: 0, reviewer: 1 },
  //             { access: 'rp-officer', view: 1, add: 0, edit: 0, delete: 0, maker: 0, approver: 0, reviewer: 1 },
  //             { access: 'pac/:id', view: 1, add: 0, edit: 0, delete: 0, maker: 0, approver: 0, reviewer: 1 },
  //             { access: 'rpofficer-ri/:id', view: 1, add: 0, edit: 0, delete: 0, maker: 0, approver: 0, reviewer: 1 },
  //             { access: 'users', view: 1, add: 0, edit: 0, delete: 0, maker: 0, approver: 0, reviewer: 1 },
  //           ] ,
  //         },
  //         {
  //           id: 1,
  //           fName: 'Yiorgos Avraamu',
  //           mName: 'New',
  //           lName: 'Avraamu',
  //           userName: 'Admin',
  //           email: 'test@email.com',
  //           password: 'admin1234',
  //           mobile: 1231244,
  //           department: 'ITG',
  //           role: 'Maker',
  //           authority: [
  //             { access: 'dri', view: 0, add: 1, edit: 1, delete: 1, maker: 1, approver: 0, reviewer: 1 },
  //             { access: 'directorsrelated/:id', view: 0, add: 1, edit: 1, delete: 0, maker: 1, approver: 0, reviewer: 1 },
  //             { access: 'bankofficer', view: 1, add: 1, edit: 1, delete: 0, maker: 1, approver: 0, reviewer: 1 },
  //             { access: 'bankstockholders', view: 0, add: 1, edit: 1, delete: 0, maker: 1, approver: 0, reviewer: 1 },
  //             { access: 'affiliates', view: 0, add: 1, edit: 1, delete: 0, maker: 1, approver: 0, reviewer: 1 },
  //             { access: 'affiliates-related-companies', view: 0, add: 1, edit: 1, delete: 0, maker: 1, approver: 0, reviewer: 1 },
  //             { access: 'other-related-parties', view: 0, add: 1, edit: 1, delete: 0, maker: 1, approver: 0, reviewer: 1 },
  //             { access: 'rp-officer', view: 0, add: 1, edit: 1, delete: 0, maker: 1, approver: 0, reviewer: 1 },
  //             { access: 'pac/:id', view: 0, add: 1, edit: 1, delete: 0, maker: 1, approver: 0, reviewer: 1 },
  //             { access: 'rpofficer-ri/:id', view: 0, add: 1, edit: 1, delete: 0, maker: 1, approver: 0, reviewer: 1 },
  //             { access: 'users', view: 0, add: 1, edit: 1, delete: 0, maker: 1, approver: 0, reviewer: 1 },
  //           ] ,
  //         },
  // ]



  // getUsers(): Observable<Users[]> {
  //   return of(this.dummyData);
  // }