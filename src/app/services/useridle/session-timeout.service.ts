import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Idle, DEFAULT_INTERRUPTSOURCES, } from '@ng-idle/core';

import { Keepalive } from '@ng-idle/keepalive'; 
// Services
import { AuthSessionService } from '../authentication/auth-session.service';

import { DOCUMENT } from '@angular/common';

import { fromEvent } from 'rxjs';
import { throttleTime } from 'rxjs/operators';

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
  if (this.authService.isLoggedIn) {
    this.setIdleConfig();
  }
}

  public setIdleConfig(): void {
    this.idle.setIdle(300); // 5 minutes
    this.idle.setTimeout(5); // 1 second
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
    this.keepalive.interval(5); // 5 seconds
    
  
    this.idle.onIdleStart.subscribe(() => { 
    });
  
    this.idle.onIdleEnd.subscribe(() => {
      this.resetIdleTimer();
    });
    

    this.idle.watch();

    
    this.idle.onTimeout.subscribe(() => {
      // Implement your logout logic here
      // this.timedOut();
    });

  }

  resetIdleTimer(): void {
    this.idle.watch();
    this.keepalive.ping();
    
    this.updateSessionExpireTime();
    
  }

  updateSessionExpireTime(): void {
    const sessionExpireTime = Date.now() + 300000; // 5 minutes in milliseconds
    this.idle.setIdle(sessionExpireTime);
    this.idle.watch();
  }


  public timedOut(): void {
    // Implement your logout logic here
    // Calling the Logout Function
    this.authService.simulateLogout();
  }
}
