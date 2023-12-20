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
    // Static Data
      // this.userData = this.user
      // this.user = this.authSessionService.getUserData();

    // Dynamic Data
    this.user = sessionStorage.getItem('userAcces');
    this.jsonData =  JSON.parse(this.user) 
    // console.log(this.jsonData);
  }

  ngOnInit(): void {
    this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe(() => {
      this.updateView();
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
      // console.log(this.jsonData)

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

  // Static Data
  // private checkPermission(): boolean {
  //   // Ensure that this.user.authority is an array before using find
  //   if (Array.isArray(this.userData.authority)) {
  //       // console.log(this.userData.authority);
  //     // console.log(this.jsonData)
  //     // Find the authority that matches the current route
  //     const matchingAuthority = this.userData.authority.find((authority: Authority) => authority.access?.toLowerCase() === this.allowedRoute);
  //     // console.log(sessionStorage.getItem('userAccess'))
  //     // console.log(this.allowedRoute);
  //     // console.log(matchingAuthority);

  //     // Check if matching authority is found
  //     if (matchingAuthority) {
  //         // Check if all permissions are granted
  //         const allPermissionsGranted = this.permissions.every(permission => matchingAuthority[permission] === 1);
  //         return allPermissionsGranted;
  //     }
  // }

  // Handle the case when this.user.authority is not an array or is empty
  return false;
}



  // Replace 'user' with the actual variable representing your user data
  // private user = {
  //   id: 1,
  //   fName: 'Yiorgos Avraamu',
  //   mName: 'New',
  //   lName: 'Avraamu',
  //   userName: 'User1',
  //   email: 'test@email.com',
  //   mobile: 1231244,
  //   department: 'ITG',
  //   role: 'maker',
  //   authority: [
  //     { access: 'dri', view: 1, add: 1, edit: 1, delete: 1, maker: 1, approver: 0, reviewer: 1 },
  //     { access: 'directorsrelated/:id', view: 0, add: 1, edit: 1, delete: 0, maker: 1, approver: 0, reviewer: 1 },
  //     { access: 'bankofficer', view: 1, add: 1, edit: 1, delete: 0, maker: 1, approver: 0, reviewer: 1 },
  //     { access: 'bankstockholders', view: 0, add: 1, edit: 1, delete: 0, maker: 1, approver: 0, reviewer: 1 },
  //     { access: 'affiliates', view: 0, add: 1, edit: 1, delete: 0, maker: 1, approver: 0, reviewer: 1 },
  //     { access: 'affiliates-related-companies', view: 0, add: 1, edit: 1, delete: 0, maker: 1, approver: 0, reviewer: 1 },
  //     { access: 'other-related-parties', view: 0, add: 1, edit: 1, delete: 0, maker: 1, approver: 0, reviewer: 1 },
  //     { access: 'rp-officer', view: 0, add: 1, edit: 1, delete: 0, maker: 1, approver: 0, reviewer: 1 },
  //     { access: 'pac/:id', view: 0, add: 1, edit: 1, delete: 0, maker: 1, approver: 0, reviewer: 1 },
  //     { access: 'rpofficer-ri/:id', view: 0, add: 1, edit: 1, delete: 0, maker: 1, approver: 0, reviewer: 1 },
  //     { access: 'users', view: 0, add: 1, edit: 1, delete: 0, maker: 1, approver: 0, reviewer: 1 },
  //   ] ,
  // };

}


