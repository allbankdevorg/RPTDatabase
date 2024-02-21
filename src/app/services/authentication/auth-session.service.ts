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

  
  private intervalId: any;


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
      public _dialog: MatDialog, ) {
      // Start session expiration check interval
      this.startSessionExpirationCheck();
      }

      get isLoggedIn(): boolean {
        const sessionExpireTime = localStorage.getItem('ng2Idle.main.expiry');
        
        // // Set session expiration time to 5 minutes from ng2Idle.main.expiry
        let expiryTimestamp: number | null = null;
        if (sessionExpireTime) {
          expiryTimestamp = Number(sessionExpireTime) + (5 * 60 * 1000); // 5 minutes in milliseconds
        }
        
        // Check if session has expired
        if (expiryTimestamp !== null && Date.now() >= expiryTimestamp) {
          // Clear relevant items from local storage
          localStorage.clear();
          sessionStorage.clear();
        
          // Simulate logout or call your logout function here
          this.simulateLogout();
        
          return false;
        }
        
        // Check if session is still valid
        return !!localStorage.getItem('sessionID') && !!sessionExpireTime && Date.now() < Number(sessionExpireTime);
      }

      

      private startSessionExpirationCheck(): void {
        // Check session expiration every 60 seconds
        this.intervalId = setInterval(() => {
          this.checkSessionExpiration();
        }, 60000);
      }
    
      private stopSessionExpirationCheck(): void {
        clearInterval(this.intervalId);
      }
    
      private checkSessionExpiration(): void {
        const sessionExpireTime = localStorage.getItem('ng2Idle.main.expiry');
        if (sessionExpireTime && Date.now() >= Number(sessionExpireTime)) {
          this.simulateLogout();
        }
      }


  setAuthToken(token: string): void {
    // sessionStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.tokenKey, token)
  }
  
  getAuthToken(): string | null {
    // return sessionStorage.getItem(this.tokenKey);
    return localStorage.getItem(this.tokenKey)
    // return localStorage.getItem('sessionID');
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
