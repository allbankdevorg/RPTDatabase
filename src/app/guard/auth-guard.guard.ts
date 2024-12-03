import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree,
} from '@angular/router';
import { AuthSessionService } from '../services/authentication/auth-session.service';
import { Observable } from 'rxjs';
import { FetchDataService } from 'src/app/services/fetch/fetch-data.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  public navItems = []; // Dynamic
  private url: string | undefined;

  constructor(
    private fetchDataService: FetchDataService,
    public authService: AuthSessionService,
    private router: Router
  ) {
    this.getNav();
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | UrlTree | boolean {
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['/login']);
      return false;
    }

    this.url = state.url; // Get the current URL

    if (
      (this.url.startsWith('/maintenance') && this.authService.getRole() !== '4') ||
      (this.url.startsWith('/simulation/audit-trail') && this.authService.getRole() !== '4')
    ) {
      this.router.navigate(['/dashboard']);
      return false;
    }

    return true;
  }

  getNav() {
    this.fetchDataService.getNavi((navItems) => {
      const userRole = this.authService.getRole();

      // Filter menu items based on the user's role
      this.navItems = navItems.filter((item) => {
        const url = item?.url;
        if (!url) return true; // Include if no URL

        // Exclude items for roles that shouldn't access them
        if (
          (url.startsWith('/maintenance') && userRole !== '4') ||
          (url.startsWith('/simulation') && userRole !== '4')
        ) {
          return false;
        }

        // Filter children
        if (item.children && item.children.length > 0) {
          item.children = item.children.filter((childItem) => {
            const childUrl = childItem?.url;
            return !(
              (childUrl.startsWith('/maintenance') && userRole !== '4') ||
              (childUrl.startsWith('/simulation/audit-trail') && userRole !== '4')
            );
          });

          return item.children.length > 0; // Only include parent if it has children
        }

        return true; // Include items without children
      });
    });
  }
}



