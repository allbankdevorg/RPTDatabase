import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Idle, DEFAULT_INTERRUPTSOURCES, } from '@ng-idle/core';

import { Keepalive } from '@ng-idle/keepalive'; 
// Services
import { AuthSessionService } from '../authentication/auth-session.service';

import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SessionTimeoutService {

  constructor(private idle: Idle, 
    private router: Router,
    private authService : AuthSessionService,
    private keepalive: Keepalive,
    @Inject(DOCUMENT) private document: Document) {
    // this.setIdleConfig();
    // Reset idle timer on mouse move
    if (this.authService.isAuthenticated()) {
      this.setIdleConfig();
    }
  
}

  public setIdleConfig(): void {
    this.idle.setIdle(10); // 5 minutes
    this.idle.setTimeout(60); // 3 sec
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
    this.keepalive.interval(5); // 15 seconds
    
    // this.document.body.addEventListener('mousemove', () => {
    //   this.resetIdleTimer(); 
    //   console.log("Hover, Idle reset")
    // });
  
    this.idle.onIdleStart.subscribe(() => {
      console.log('Entered idle mode');  
    });
  
    this.idle.onIdleEnd.subscribe(() => {
      console.log('Exited idle mode');
      this.resetIdleTimer();
    });
    

    this.idle.watch();
    this.idle.onIdleEnd.subscribe(() => {
      console.log('No longer idle.');
      this.resetIdleTimer();
    });

    this.idle.onTimeout.subscribe(() => {
      console.log('Session expired!');
      // Implement your logout logic here
      this.timedOut();
    });

  }

  resetIdleTimer(): void {
    this.idle.watch();
    this.keepalive.ping();
  }

  public timedOut(): void {
    // Implement your logout logic here
    // For example, clear authentication-related data and redirect to the login page
    console.log('Logging out...');
    // Clear authentication data (e.g., tokens)
    this.authService.simulateLogout();
    // Redirect to the login page
    // Note: You need to implement the Router or navigate as per your application's structure
    // this.router.navigate(['/login']);
  }
}
