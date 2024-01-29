import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ShareddataService } from '../userdata/shareddata.service'; // Adjust the import path

import {DummyDataService, Users} from '../dummyData/dummy-data.service';
import * as localforage from 'localforage';

import {MatDialog, MatDialogConfig} from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class AuthSessionService {
  actualOTP: any
  lastAction = Date.now();
  private tokenKey = 'authToken';
  private username: string | null = null;
  private role: string | null = null;
  userData: any;
  private readonly userDataKey = 'userData';

  constructor(public router: Router, 
      public ngZone: NgZone,
      public usersService: DummyDataService,
      private userDataService: ShareddataService,
      public _dialog: MatDialog, ) {}

  // Returns true when the user is logged in and email is verified
  get isLoggedIn(): boolean {
    const sessionExpireTime = localStorage.getItem('ng2Idle.main.expiry');

    if (sessionExpireTime && Date.now() >= Number(sessionExpireTime)) {
      // Clear relevant items from local storage
      localStorage.clear();
      localStorage.clear();
      // Redirect the user to the login page
      this.router.navigate(['/login']);
      return false;
  }

  return !!localStorage.getItem('sessionID');

    // return !!sessionStorage.getItem('sessionID');
    // return !!localStorage.getItem('sessionID');
    // return !!localStorage.getItem('sessionID') && !!sessionExpireTime && Date.now() < Number(sessionExpireTime);


  }

  setAuthToken(token: string): void {
    // sessionStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.tokenKey, token)
  }
  
  getAuthToken(): string | null {
    // return sessionStorage.getItem(this.tokenKey);
    return localStorage.getItem(this.tokenKey)
  }
  
  removeAuthToken(): void {
    // sessionStorage.removeItem(this.tokenKey);
    localStorage.removeItem('tokenKey');
  }
  
  setUserData(user: any): void {
    // sessionStorage.setItem(this.userDataKey, JSON.stringify(user));
    localStorage.setItem(this.userDataKey, JSON.stringify(user));
  }

  getUserData(): any {
    // const storedUser = sessionStorage.getItem(this.userDataKey);
    
  const storedUser = localStorage.getItem(this.userDataKey);
  if (storedUser) {
    const userObj = JSON.parse(storedUser);
    this.username = userObj.username;
    this.role = userObj.role;
    return storedUser ? JSON.parse(storedUser) : null;
  }

  return { username: '', role: '' };
  }

  clearUserData(): void {
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
  }

  isAuthenticated(): boolean {
    // Check if the user is authenticated based on the presence of a token
    return !!this.getAuthToken();
  }

  // Added for simulating Session

  setSessionData(username: string, role: string): void {
    this.username = username;
    this.role = role;
    localStorage.setItem('user', JSON.stringify({ username, role }));
    // sessionStorage.setItem('user', JSON.stringify({ username, role }));
  }
  
  clearSession(): void {
    this.username = null;
    this.role = null;
    // sessionStorage.removeItem('userData');
    // sessionStorage.removeItem('user');
    // sessionStorage.removeItem('sessionID');
    localStorage.clear();
    sessionStorage.clear();
  }

  getUsername(): string | null {
    if (this.username === null) {
      const storedUser = localStorage.getItem('user');
      // const storedUser = sessionStorage.getItem('user');
      if (storedUser) {
        const userObj = JSON.parse(storedUser);
        this.username = userObj.username;
      }
    }
    return this.username;
  }

  
  getRole(){
    return localStorage.getItem('role') !== null ? localStorage.getItem('role')?.toString() : '';
    // return sessionStorage.getItem('role')!=null?sessionStorage.getItem('role')?.toString():'';
  }

  // getRole(): string | null {
  //   if (this.role === null) {
  //     const storedUser = sessionStorage.getItem('role');
  //     if (storedUser) {
  //       const userObj = JSON.parse(storedUser);
  //       this.role = userObj.role;
  //     }
  //   }
  //   return this.role;
  // }

  // Simulate generating and saving OTP
  generateAndSaveOtp(): string {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    this.actualOTP = otp;
    // localStorage.setItem(this.otpKey, otp);
    return otp;
  }

  // Simulate clearing OTP
  clearOtp(): void {
    localStorage.removeItem(this.otpKey);
    this.isOtpVerified = false;
  }

  // Check if OTP is verified
  isOtpSuccessfullyVerified(): boolean {
    return this.isOtpVerified;
  }


  // Simulate login with static credentials (including passwords)
  simulateLogin(username: string, password: string): Observable<boolean> {
    // Get user data from your dummy data service
    const user: Users[] = this.usersService.getUsers(username);
  
    // Check if the user list is not empty
    if (user.length > 0) {
      // Find the user with matching username and password
      const matchingUser = user.find(user => user.userName === username && user.password === password);
      if (matchingUser) {
        // Set session data and authentication token
        
        const userD: any[] = [{ id: matchingUser.id, userName: matchingUser.userName }];
        localStorage.setItem('user', JSON.stringify(userD));
        // sessionStorage.setItem('user', JSON.stringify(userD));
        // localforage.setItem('user', userD);
        
        this.setAuthToken('yourAuthToken'); // Replace with an actual token
  
        return of(true);
      }
    }
  
    // If no matching user is found or the user list is empty, log failure
    return of(false);
  }
  

  
  // Simulate logout
  simulateLogout(): void {
    this.close();
    this.clearSession();
    this.router.navigate(['/login']);
  }

  resetTimer() {
    this.lastAction = Date.now();  
    // Reset lastAction date
  }

  close() {
    this._dialog.closeAll(); 
  }


  private otpKey = 'otp';
  private isOtpVerified: boolean = false;

  // Simulate OTP verification
  verifyOtp(otp: string): boolean {
    // const storedOtp = localStorage.getItem(this.otpKey);
    this.isOtpVerified = otp === this.actualOTP;
    
    return this.isOtpVerified;
  }

  

  // Check if OTP is verified
  VerefiedOtp(): boolean {
    return this.isOtpVerified;
  }
}
