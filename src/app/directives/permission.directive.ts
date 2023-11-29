import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Directive({
  selector: '[appHasPermission]'
})
export class HasPermissionDirective {
  private permissions: string[] = [];
  private allowedRoute: string | undefined;

  @Input() set appHasPermission(value: string) {
    this.permissions = value.split(',');
    this.updateView();
  }
  
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // Subscribe to route changes
    // this.router.events.pipe(
    //   filter(event => event instanceof NavigationEnd)
    // ).subscribe(() => {
    //   this.updateView();
    // });
  }

  private updateView(): void {
    // Get the current route from the activated route
    this.allowedRoute = this.route.snapshot.routeConfig?.path?.toLowerCase() || '';
    
    if (this.checkPermission()) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }

  private checkPermission(): boolean {
    // Find the authority that matches the current route
    const matchingAuthority = this.user.authority.find(authority => authority.access.toLowerCase() === this.allowedRoute);

    // Check if matching authority is found
    if (matchingAuthority) {
        // Check if all permissions are granted
        const allPermissionsGranted = this.permissions.every(permission => matchingAuthority[permission] === 1);
        return allPermissionsGranted;
    }

    return false;
}

  // Replace 'user' with the actual variable representing your user data
  private user = {
    id: 1,
    fName: 'Yiorgos Avraamu',
    mName: 'New',
    lName: 'Avraamu',
    userName: 'User1',
    email: 'test@email.com',
    mobile: 1231244,
    department: 'ITG',
    role: 'maker',
    authority: [
      { access: 'dri', view: 0, add: 1, edit: 1, delete: 0, maker: 1, approver: 0, reviewer: 1 },
      { access: 'users', view: 1, add: 1, edit: 1, delete: 0, maker: 1, approver: 0, reviewer: 1 },
      { access: 'bankofficer', view: 1, add: 1, edit: 1, delete: 0, maker: 1, approver: 0, reviewer: 1 },
    ],
  };
}







// import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { forEach } from 'lodash-es';

// @Directive({
//   selector: '[appHasPermission]'
// })
// export class HasPermissionDirective {
//   private permissions: string[] = [];
//   private allowedRoute: string[] = [];

//   @Input() set appHasPermission(value: string) {
//     const [permissions, route] = value.split(';');
//     this.permissions = permissions.split(',');
//     this.allowedRoute = this.deriveAllowedRoute(); // Call a method to determine the allowed route
//     this.updateView();
//   }
  
//   constructor(
//     private templateRef: TemplateRef<any>,
//     private viewContainer: ViewContainerRef,
//     private route: ActivatedRoute
//   ) {}


//   private deriveAllowedRoute(): string[] {
//     // Assign an array of lowercase access values to allowedRoute
//     return this.user.authority.map(authority => authority.access.toLowerCase());
//   }

// //   private deriveAllowedRoute(): void {
// //     // Implement the logic to determine the allowed route based on user data
// //     // For example, you might have a property in user data that specifies the route
// //     // Or you might have a mapping between permissions and routes

// //     // Replace this logic with your own
// //     this.allowedRoute = this.user.authority.map(authority => authority.access.toLowerCase());
// // }

//   private updateView(): void {
//     if (this.checkPermission() && this.checkRoute()) {
//       this.viewContainer.createEmbeddedView(this.templateRef);
//     } else {
//       this.viewContainer.clear();
//     }
//   }

//     // Check if all specified permissions have a value of 1
//     private checkPermission(): boolean {
//       // Check if any authority meets the conditions
//       // const hasPermission = this.user.authority.some(authority =>
        
//       // );
    
//       // Return true if any authority meets the conditions, otherwise false
//       return this.permissions.every(permission => this.user.authority[1][permission] === 1)
//     }
    
  

//   private checkRoute(): boolean {
//     // Check if the current route matches the allowed route
//     const routeConfig = this.route.snapshot.routeConfig;
//   return routeConfig ? this.allowedRoute.includes(routeConfig.path ?? '') : false;
//  }

//   // Replace 'user' with the actual variable representing your user data
//   private user = {
//     id: 1,
//     fName: 'Yiorgos Avraamu',
//     mName: 'New',
//     lName: 'Avraamu',
//     userName: 'User1',
//     email: 'test@email.com',
//     mobile: 1231244,
//     department: 'ITG',
//     role: 'maker',
//     authority: [
//       { access: 'dri', view: 0, add: 1, edit: 1, delete: 0, maker: 1, approver: 0, reviewer: 1 },
//       { access: 'users', view: 1, add: 1, edit: 1, delete: 0, maker: 1, approver: 0, reviewer: 1 },
//       { access: 'bankofficer', view: 1, add: 1, edit: 1, delete: 0, maker: 1, approver: 0, reviewer: 1 },
//     ],
//   };
// }



// import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';

// @Directive({
//   selector: '[appHasPermission]'
// })
// export class HasPermissionDirective {
//   private permissions: string[] = [];
//   private allowedRoute: string | undefined;

//   @Input() set appHasPermission(value: string) {
//     const [permissions, route] = value.split(';');
//     this.permissions = permissions.split(',');
//     this.allowedRoute = this.deriveAllowedRoute(); // Call a method to determine the allowed route
//     this.updateView();
//   }
  
//   constructor(
//     private templateRef: TemplateRef<any>,
//     private viewContainer: ViewContainerRef,
//     private route: ActivatedRoute
//   ) {}


//    private deriveAllowedRoute(): string | undefined {
//     // Implement the logic to determine the allowed route based on user data
//     // For example, you might have a property in user data that specifies the route
//     // Or you might have a mapping between permissions and routes

//     // Replace this logic with your own
//     return this.user.authority[0].access.toLowerCase();
//   }


//   private updateView(): void {
//     if (this.checkPermission() && this.checkRoute()) {
//       this.viewContainer.createEmbeddedView(this.templateRef);
//     } else {
//       this.viewContainer.clear();
//     }
//   }

//   private checkPermission(): boolean {
//     // Check if all specified permissions have a value of 1
//     return this.permissions.every(permission => this.user.authority[2][permission] === 1);
//     // return this.user.authority.every(access => {
//     //   return this.permissions.every(permission => access[permission] === 1);
//     // });
//   }


//   private checkRoute(): boolean {
//     // Check if the current route matches the allowed route
//     // return this.route.snapshot.routeConfig?.path === this.allowedRoute;

//     const routeConfig = this.route.snapshot.routeConfig;
  
//   if (routeConfig) {
//     console.log(routeConfig);
//     return routeConfig.path === this.allowedRoute;
//   }

//   // Handle the case where routeConfig is undefined
//   return false;
//   }

//   // Replace 'user' with the actual variable representing your user data
//   private user = {
//     id: 1,
//       fName: 'Yiorgos Avraamu',
//       mName: 'New',
//       lName: 'Avraamu',
//       userName: 'User1',
//       email: 'test@email.com',
//       mobile: 1231244,
//       department: 'ITG',
//       role: 'maker',
//       authority: [
//         { access: 'dri',  view: 0, add: 1, edit: 1, delete: 0, maker: 1, approver: 0, reviewer: 1 },
//         { access: 'users',  view: 1, add: 0, edit: 1, delete: 0, maker: 1, approver: 0, reviewer: 1 },
//         { access: 'bankofficer',  view: 1, add: 1, edit: 1, delete: 0, maker: 1, approver: 0, reviewer: 1 },
//       ]
//   };
// }
