import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthSessionService {

  private tokenKey = 'authToken';
  private username: string | null = null; //Added for simulating Session
  private role: string | null = null; //Added for simulating Session

  constructor() {}

  setAuthToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getAuthToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  removeAuthToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  setUserData(userId: string, userRole: string): void {
    localStorage.setItem('userId', userId);
    localStorage.setItem('userRole', userRole);
  }

  getUserData(): { userId: string; userRole: string } {
    return {
      userId: localStorage.getItem('userId') || '',
      userRole: localStorage.getItem('userRole') || '',
    };
  }

  clearUserData(): void {
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
  }

  isAuthenticated(): boolean {
    // Check if the user is authenticated based on the presence of a token
    return !!this.getAuthToken();
  }



  //Added for simulating Session

  setSessionData(username: string, role: string): void {
    this.username = username;
    this.role = role;
  }

  clearSession(): void {
    this.username = null;
    this.role = null;
  }

  getUsername(): string | null {
    return this.username;
  }

  getRole(): string | null {
    return this.role;
  }


}
