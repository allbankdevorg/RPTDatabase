import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthSessionService } from 'src/app/services/authentication/auth-session.service';
import {Logout} from '../../../functions-files/confirm-logout';
import { SessionTimeoutService } from 'src/app/services/useridle/session-timeout.service';
import { ClassToggleService, HeaderComponent } from '@coreui/angular';

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
})
export class DefaultHeaderComponent extends HeaderComponent {

  @Input() sidebarId: string = "sidebar";

  public newMessages = new Array(4)
  public newTasks = new Array(5)
  public newNotifications = new Array(5)

  constructor(
    private classToggler: ClassToggleService,
    public authService: AuthSessionService,
    private idle: SessionTimeoutService) {
    super();
  }

  ngOnInt() {
    this.idle.timedOut();
    // this.idle.setIdleConfig();
  }

  // Simulate logout
  Logout(): void {
    const userConfirmed = window.confirm("Are You Sure You Want To Logout?");

    if (userConfirmed) {
      this.authService.simulateLogout();
    }
    
  }

}
