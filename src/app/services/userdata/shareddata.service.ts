import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShareddataService {
  
  private userDataKey = 'userData';

  private userDataSubject = new BehaviorSubject<any>(null);
  userData$ = this.userDataSubject.asObservable();

  getUserData(): any {
    const storedUserData = localStorage.getItem(this.userDataKey);
    return storedUserData ? JSON.parse(storedUserData) : null;
  }

  setUserData(user: any): void {
    sessionStorage.setItem(this.userDataKey, JSON.stringify(user));
    this.userDataSubject.next(user);
  }

  clearUserData(): void {
    sessionStorage.removeItem(this.userDataKey);
    this.userDataSubject.next(null);
  }
}
