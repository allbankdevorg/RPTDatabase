// import { Directive, Input, TemplateRef, ViewContainerRef, OnDestroy } from '@angular/core';
// import { ActivatedRoute, Router, NavigationEnd, ActivatedRouteSnapshot } from '@angular/router';
// import { filter, takeUntil } from 'rxjs/operators';
// import { Subject } from 'rxjs';

// import { AuthSessionService } from '../services/authentication/auth-session.service';
// import { ShareddataService } from '../services/userdata/shareddata.service'; // Adjust the import path

// interface Authority {
//   access?: string;
//   [key: string]: number | string | undefined;
// }

// @Directive({
//   selector: '[appHasPermission]'
// })
// export class HasPermissionDirective implements OnDestroy {
//   private permissions: string[] = [];
//   private allowedRoute: string | undefined;
//   private user: any; // Change to dynamic user data
//   private jsonData: any;
//   private userData: any;
//   private destroy$: Subject<void> = new Subject<void>();

//   @Input() set appHasPermission(value: string) {
//     this.permissions = value.split(',');
//     this.updateView();
//   }
  
//   constructor(
//     private templateRef: TemplateRef<any>,
//     private viewContainer: ViewContainerRef,
//     private route: ActivatedRoute,
//     private router: Router,
//     private authSessionService: AuthSessionService,
//     private userDataService: ShareddataService 
//   ) {
//     // Dynamic Data
//     this.user = localStorage.getItem('userAcces');
//     this.jsonData =  JSON.parse(this.user);

//     this.router.events
//       .pipe(
//         filter(event => event instanceof NavigationEnd),
//         takeUntil(this.destroy$)
//       )
//       .subscribe(() => {
//         // this.updateView();
//       });
//   }

//   ngOnDestroy(): void {
//     this.destroy$.next();
//     this.destroy$.complete();
//   }

//   private updateView(): void {
//     // Get the current route from the activated route
//     this.allowedRoute = this.route.snapshot.routeConfig?.path?.toLowerCase() || '';

//     if (this.checkPermission()) {
//       this.viewContainer.createEmbeddedView(this.templateRef);
//     } else {
//       this.viewContainer.clear();
//     }
//   }

//   // Dynamic User
//   private checkPermission(): boolean {
//     // Ensure that this.user.authority is an array before using find
//     if (Array.isArray(this.jsonData)) {
//       // Find the authority that matches the current route
//       const matchingAuthority = this.jsonData.find((jsonData: any) => jsonData.navigation?.toLowerCase() === this.allowedRoute);
//       // Check if matching authority is found
//       if (matchingAuthority) {
//         // Check if all permissions are granted
//         const allPermissionsGranted = this.permissions.every(permission => matchingAuthority[permission] === 1);
//         return allPermissionsGranted;
//       }
//     }
//     // Handle the case when this.user.authority is not an array or is empty
//     return false;
//   }
// }









import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd, ActivatedRouteSnapshot } from '@angular/router';
import { filter } from 'rxjs/operators';

import { AuthSessionService } from '../services/authentication/auth-session.service';
import { ShareddataService } from '../services/userdata/shareddata.service'; // Adjust the import path



interface Authority {
  access?: string;
  [key: string]: number | string | undefined;
}

@Directive({
  selector: '[appHasPermission]'
})
export class HasPermissionDirective {
  private permissions: string[] = [];
  private allowedRoute: string | undefined;
   private user: any; // Change to dynamic user data
  private jsonData: any;
  private userData: any;

  @Input() set appHasPermission(value: string) {
    this.permissions = value.split(',');
    this.updateView();
  }
  
  
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private route: ActivatedRoute,
    private router: Router,
    private authSessionService: AuthSessionService,
    private userDataService: ShareddataService 
  ) {

    // Dynamic Data
    this.user = localStorage.getItem('userAcces');
    this.jsonData =  JSON.parse(this.user) 
  }

  ngOnInit(): void {
    this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe(() => {
      
    });
  }



  private updateView(): void {
    // // Get the current route from the activated route
    this.allowedRoute = this.route.snapshot.routeConfig?.path?.toLowerCase() || '';
    // this.allowedRoute = this.getFullRoute().toLowerCase();
   
    if (this.checkPermission()) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }


  private getFullRoute(): string {
    let fullRoute = '';
    let currentRoute: ActivatedRouteSnapshot | null = this.route.snapshot;
  
    while (currentRoute) {
      const routePath = currentRoute.routeConfig?.path;
      if (routePath) {
        fullRoute = routePath + (fullRoute ? '/' : '') + fullRoute;
      }
      currentRoute = currentRoute.parent;
    }
  
    return fullRoute;
  }

  

  // Dynamic User
    private checkPermission(): boolean {
    // Ensure that this.user.authority is an array before using find
    if (Array.isArray(this.jsonData)) {

      // Find the authority that matches the current route
      // const matchingAuthority = this.jsonData.find((jsonData: any) => jsonData.access?.toLowerCase() === this.allowedRoute);
      const matchingAuthority = this.jsonData.find((jsonData: any) => jsonData.navigation?.toLowerCase() === this.allowedRoute);
      
      // Check if matching authority is found
      if (matchingAuthority) {
          // Check if all permissions are granted
          const allPermissionsGranted = this.permissions.every(permission => matchingAuthority[permission] === 1);
          return allPermissionsGranted;
      }
  }


  // Handle the case when this.user.authority is not an array or is empty
  return false;
}


}


