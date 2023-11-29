import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DummyDataService {

  private users = [
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
        { access: 'Affiliates',  view: 1, add: 0, edit: 1, delete: 0, maker: 1, approver: 0, reviewer: 1 },
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
        { access: 'Affiliates', view: 1, add: 0, edit: 0, delete: 0, maker: 0, approver: 1, reviewer: 0 },
      ]
    },
    {
      id: 3,
      fName: 'Junel',
      mName: 'O',
      lName: 'Salarda',
      userName: 'Admin',
      email: 'admin@test.com',
      mobile: 123124124,
      department: 'ITG',
      role: 'maker',
      authority: [
        { access: 'Affiliates', view: 1, add: 0, edit: 0, delete: 0, maker: 0, approver: 1, reviewer: 0 },
      ]
    },
    // Add more simulated user data as needed
  ];

  getUsers(): Observable<any[]> {
    // Simulate fetching data from a database
    return of(this.users);
  }
}
