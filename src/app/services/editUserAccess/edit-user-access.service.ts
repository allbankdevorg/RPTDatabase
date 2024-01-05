import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EditUserAccessService {
  private userID: any;


  setUserID(value: any): void{
    this.userID = value;
  }


  getUserID(): any {
    return this.userID;
  }
  
}
