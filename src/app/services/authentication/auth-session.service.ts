import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ShareddataService } from '../userdata/shareddata.service'; // Adjust the import path

import {DummyDataService, Users} from '../dummyData/dummy-data.service';
@Injectable({
  providedIn: 'root'
})
export class AuthSessionService {
  lastAction = Date.now();
  private tokenKey = 'authToken';
  private username: string | null = null;
  private role: string | null = null;
  userData: any;
  private readonly userDataKey = 'userData';

  constructor(public router: Router, 
      public ngZone: NgZone,
      public usersService: DummyDataService,
      private userDataService: ShareddataService ) {}

  // Returns true when the user is logged in and email is verified
  get isLoggedIn(): boolean {
    return !!sessionStorage.getItem('user');
  }

  setAuthToken(token: string): void {
    sessionStorage.setItem(this.tokenKey, token);
  }
  
  getAuthToken(): string | null {
    return sessionStorage.getItem(this.tokenKey);
  }
  
  removeAuthToken(): void {
    sessionStorage.removeItem(this.tokenKey);
  }
  
  setUserData(user: any): void {
    sessionStorage.setItem(this.userDataKey, JSON.stringify(user));
  }

  getUserData(): any {
    const storedUser = sessionStorage.getItem(this.userDataKey);
  if (storedUser) {
    const userObj = JSON.parse(storedUser);
    this.username = userObj.username;
    this.role = userObj.role;
    // console.log(storedUser);
    return storedUser ? JSON.parse(storedUser) : null;
  }

  console.log(storedUser);
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
    sessionStorage.setItem('user', JSON.stringify({ username, role }));
  }
  
  clearSession(): void {
    this.username = null;
    this.role = null;
    sessionStorage.removeItem('userData');
    sessionStorage.removeItem('user');
  }

  getUsername(): string | null {
    if (this.username === null) {
      const storedUser = sessionStorage.getItem('user');
      if (storedUser) {
        const userObj = JSON.parse(storedUser);
        this.username = userObj.username;
      }
    }
    return this.username;
  }

  getRole(): string | null {
    if (this.role === null) {
      const storedUser = sessionStorage.getItem('user');
      if (storedUser) {
        const userObj = JSON.parse(storedUser);
        this.role = userObj.role;
      }
    }
    return this.role;
  }

  // Simulate generating and saving OTP
  generateAndSaveOtp(): string {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    localStorage.setItem(this.otpKey, otp);
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
    console.log(user);
    console.log(username, password)
  
    // Check if the user list is not empty
    if (user.length > 0) {
      // Find the user with matching username and password
      const matchingUser = user.find(user => user.userName === username && user.password === password);
      console.log(matchingUser);
      if (matchingUser) {
        // Set session data and authentication token
        sessionStorage.setItem('user', JSON.stringify(matchingUser));
        
        this.setAuthToken('yourAuthToken'); // Replace with an actual token
  
        console.log('Login successful!'); // Log success
        this.userDataService.setUserData(matchingUser);
  
        // this.userDataService.setUserAuthority(matchingAuthority);  
  
        return of(true);
      }
    }
  
    // If no matching user is found or the user list is empty, log failure
    console.log('Login failed!');
    return of(false);
  }
  

  // Simulate login with static credentials (including passwords)
  // simulateLogin(username: string, password: string): Observable<boolean> {
  //   // Simulate checking credentials against a backend (hardcoded for simplicity)
  //   const storedCredentials = {
  //     'admin': { password: 'admin1234', role: 'admin' },
  //     // Add more usernames, passwords, and roles as needed
  //   };
  
  //   const storedUser = storedCredentials[username];
  //   console.log(storedUser);
  //   console.log('Entered Username:', username);


  
  //   if (storedUser && storedUser.password === password) {
  //     // Simulate getting user info from a backend
  //     const userId = '1'; // Replace with actual user ID
  //     const userRole = storedUser.role; // Use the role from stored credentials
  
  //     // Set session data and authentication token
  //     this.setSessionData(username, userRole);
  //     this.setAuthToken('yourAuthToken'); // Replace with an actual token
      
  //     console.log('Login successful!'); // Log success

  //     return of(true);
  //   } else {
  //     console.log('Login failed!'); // Log failure
  //     console.log(storedUser);
  //     return of(false);
  //   }
  // }
  

  // Simulate logout
  simulateLogout(): void {
    this.clearSession();
    this.removeAuthToken();
    this.router.navigate(['/login']);
  }

  resetTimer() {
    this.lastAction = Date.now();  
    console.log('Timer Reset')
    // Reset lastAction date
  }



  private otpKey = 'otp';
  private isOtpVerified: boolean = false;

  // Simulate OTP verification
  verifyOtp(otp: string): boolean {
    const storedOtp = localStorage.getItem(this.otpKey);
    this.isOtpVerified = otp === storedOtp;
    
    return this.isOtpVerified;
  }

  

  // Check if OTP is verified
  VerefiedOtp(): boolean {
    return this.isOtpVerified;
  }
}
