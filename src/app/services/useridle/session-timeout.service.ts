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
    this.setIdleConfig();
    // Reset idle timer on mouse move
    
  
}

ngOninit () {
  if (this.authService.isAuthenticated()) {
    this.setIdleConfig();
  }
}

  public setIdleConfig(): void {
    this.idle.setIdle(5); // 5 seconds
    this.idle.setTimeout(300); // 5 minutes
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
    this.keepalive.interval(5); // 5 seconds
    
    // this.document.body.addEventListener('mousemove', () => {
    //   this.resetIdleTimer(); 
    //   console.log("Hover, Idle reset")
    // });
  
    this.idle.onIdleStart.subscribe(() => {
      // console.log('Entered idle mode');  
    });
  
    this.idle.onIdleEnd.subscribe(() => {
      // console.log('Exited idle mode');
      this.resetIdleTimer();
    });
    

    this.idle.watch();

    this.idle.onIdleEnd.subscribe(() => {
      // console.log('No longer idle.');
      this.resetIdleTimer();
    });

    this.idle.onTimeout.subscribe(() => {
      // console.log('Session expired!');
      // Implement your logout logic here
      this.timedOut();
    });

  }

  resetIdleTimer(): void {
    this.idle.watch();
    this.keepalive.ping();
    this.updateSessionExpireTime();
    // Update session expire time on user activity
    // Check for session expiration before performing any critical operations
    
      // Update session expire time on user activity
      
  }

  updateSessionExpireTime(): void {
    const sessionExpireTime = Date.now() + 300000; // 5 minutes in milliseconds
    localStorage.setItem('sessionExpireTime', sessionExpireTime.toString());
  }

  isSessionExpired(): boolean {
    const sessionExpireTime = localStorage.getItem('sessionExpireTime');
    return !!sessionExpireTime && Date.now() >= Number(sessionExpireTime);
    
  }

  public timedOut(): void {
    // Implement your logout logic here
    // console.log('Logging out...');
    // Calling the Logout Function
    this.authService.simulateLogout();
  }
}
