import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthSessionService {

  private tokenKey = 'authToken';

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
}
