import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree,
} from '@angular/router';
// import { ToastrService } from 'ngx-toastr';
import { AuthSessionService } from '../services/authentication/auth-session.service';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  
  constructor(public authService: AuthSessionService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | UrlTree | boolean {
    if (!this.authService.isLoggedIn) {
      // Redirect to login page if not logged in
      this.router.navigate(['/login']);
      return false;
    }

    if (route.url.length > 0) {
      let menu = route.url[0].path;
      console.log(menu);
      if (menu === 'maintenance' && this.authService.getRole() !== '4') {
        // User with role other than '4' is trying to access 'maintenance/users'
        // this.toastr.warning('You do not have access to this page.');
        this.router.navigate(['/dashboard']); // Redirect to dashboard
        return false;
      }
    }

    return true;
  
  }
}