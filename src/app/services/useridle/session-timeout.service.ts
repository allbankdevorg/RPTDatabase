import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Idle, DEFAULT_INTERRUPTSOURCES, } from '@ng-idle/core';
// Services
import { AuthSessionService } from '../authentication/auth-session.service';
@Injectable({
  providedIn: 'root'
})
export class SessionTimeoutService {

  constructor(private idle: Idle, 
    private router: Router,
    private authService : AuthSessionService) {
    this.setIdleConfig();
  }

  private setIdleConfig(): void {
    // this.idle.setIdle(5); // 5 minutes
    this.idle.setTimeout(3); // 3 sec
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
    // this.keepalive.interval(15); // 15 seconds
    
    this.idle.watch();
    this.idle.onIdleEnd.subscribe(() => {
      console.log('No longer idle.');
      this.resetIdleTimer();
    });

    this.idle.onTimeout.subscribe(() => {
      console.log('Session expired!');
      // Implement your logout logic here
      // this.timedOut();
    });

  }

  resetIdleTimer(): void {
    this.idle.watch();
    // this.keepalive.ping();
  }

  public timedOut(): void {
    // Implement your logout logic here
    // For example, clear authentication-related data and redirect to the login page
    console.log('Logging out...');
    // Clear authentication data (e.g., tokens)
    this.authService.simulateLogout();
    // Redirect to the login page
    // Note: You need to implement the Router or navigate as per your application's structure
    this.router.navigate(['/login']);
  }
}
