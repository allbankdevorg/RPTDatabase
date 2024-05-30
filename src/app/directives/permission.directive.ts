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







/************   2    ***************** */

// import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
// import { ActivatedRoute, Router, NavigationEnd, ActivatedRouteSnapshot } from '@angular/router';
// import { filter } from 'rxjs/operators';

// import { AuthSessionService } from '../services/authentication/auth-session.service';
// import { ShareddataService } from '../services/userdata/shareddata.service'; // Adjust the import path



// interface Authority {
//   access?: string;
//   [key: string]: number | string | undefined;
// }

// @Directive({
//   selector: '[appHasPermission]'
// })
// export class HasPermissionDirective {
//   private permissions: string[] = [];
//   private allowedRoute: string | undefined;
//    private user: any; // Change to dynamic user data
//   private jsonData: any;
//   private userData: any;

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
//     this.jsonData =  JSON.parse(this.user) 
//   }

//   ngOnInit(): void {
//     this.router.events
//     .pipe(filter(event => event instanceof NavigationEnd))
//     .subscribe(() => {
      
//     });
//   }



//   private updateView(): void {
//     // // Get the current route from the activated route
//     this.allowedRoute = this.route.snapshot.routeConfig?.path?.toLowerCase() || '';
//     // this.allowedRoute = this.getFullRoute().toLowerCase();
   
//     if (this.checkPermission()) {
//       this.viewContainer.createEmbeddedView(this.templateRef);
//     } else {
//       this.viewContainer.clear();
//     }
//   }


//   private getFullRoute(): string {
//     let fullRoute = '';
//     let currentRoute: ActivatedRouteSnapshot | null = this.route.snapshot;
  
//     while (currentRoute) {
//       const routePath = currentRoute.routeConfig?.path;
//       if (routePath) {
//         fullRoute = routePath + (fullRoute ? '/' : '') + fullRoute;
//       }
//       currentRoute = currentRoute.parent;
//     }
  
//     return fullRoute;
//   }

  

//   // Dynamic User
//     private checkPermission(): boolean {
//     // Ensure that this.user.authority is an array before using find
//     if (Array.isArray(this.jsonData)) {

//       // Find the authority that matches the current route
//       // const matchingAuthority = this.jsonData.find((jsonData: any) => jsonData.access?.toLowerCase() === this.allowedRoute);
//       const matchingAuthority = this.jsonData.find((jsonData: any) => jsonData.navigation?.toLowerCase() === this.allowedRoute);
      
//       // Check if matching authority is found
//       if (matchingAuthority) {
//           // Check if all permissions are granted
//           const allPermissionsGranted = this.permissions.every(permission => matchingAuthority[permission] === 1);
//           return allPermissionsGranted;
//       }
//   }


//   // Handle the case when this.user.authority is not an array or is empty
//   return false;
// }


// }











// import { Directive, Input, TemplateRef, ViewContainerRef, OnInit, OnDestroy } from '@angular/core';
// import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
// import { UserAccessService } from '../services/userAccess/UserAccessService';
// import { BehaviorSubject, Subscription } from 'rxjs';
// import { filter } from 'rxjs/operators';
// import { ChangeDetectorRef } from '@angular/core';

// import { AuthSessionService } from '../services/authentication/auth-session.service';
// import { ShareddataService } from '../services/userdata/shareddata.service'; // Adjust the import path

// interface Authority {
//   access?: string;
//   [key: string]: number | string | undefined;
// }


// @Directive({
//   selector: '[appHasPermission]'
// })
// export class HasPermissionDirective implements OnInit {
//   private permissions: string[] = [];
//   private allowedRoute: string | undefined;
//   private jsonData$ = new BehaviorSubject<any[]>([]);
//   private subscription: Subscription | null = null;
//   private jsonData: any;
//   private userData: any;
//   private user: any;

//   @Input() set appHasPermission(value: string) {
//     this.permissions = value.split(',');
//     this.updateView();
//   }

//   constructor(
//     private templateRef: TemplateRef<any>,
//     private viewContainer: ViewContainerRef,
//     private route: ActivatedRoute,
//     private router: Router,
//     private userAccessService: UserAccessService,
//     private cdRef: ChangeDetectorRef,
//     private authSessionService: AuthSessionService,
//     private userDataService: ShareddataService 
//   ) {
//     this.fetchUserAccess();
//     this.user = localStorage.getItem('userAcces');
//     this.jsonData =  JSON.parse(this.user)
//   }

//   ngOnInit(): void {
//     this.subscription = this.jsonData$.subscribe(() => {
//       this.updateView();
//     });

//     this.router.events
//       .pipe(filter(event => event instanceof NavigationEnd))
//       .subscribe(() => {
//        this.allowedRoute = this.route.snapshot.routeConfig?.path?.toLowerCase() || '';
        
//         // this.updateView();
//         // this.fetchUserAccess();
//       });
//   }

//   ngOnDestroy(): void {
//     if (this.subscription) {
//       this.subscription.unsubscribe();
//     }
//   }

//   fetchUserAccess() {
//     const userId = localStorage.getItem('userID');
//     if (userId) {
//       const cleanUserId = userId.replace(/['"]+/g, '');
//       this.userAccessService.getUserAccess(cleanUserId).subscribe(
//         (response) => {
//           if (response.result[0].message === 'Success') {
//             this.jsonData$.next(response.result[0].user_access);
//             // this.jsonData = response.result[0].user_access;
//             console.log(this.jsonData)
//           } else {
//             console.error('Failed to get user access:', response.result[0].message);
//           }
//         },
//         (error) => {
//           console.error('Error fetching user access:', error instanceof Error ? error.message : 'Unknown error');
//         }
//       );
//     } else {
//       console.error('userID not found in localStorage');
//     }
//   }

//   private updateView(): void {
    
//     console.log(this.allowedRoute);
//     if (this.checkPermission()) {
   
//       this.viewContainer.clear();  // Clear the container to ensure it is re-rendered
//       this.viewContainer.createEmbeddedView(this.templateRef);
//       this.cdRef.detectChanges();  // Trigger change detection
//     } else {
//       this.viewContainer.clear();
//     }
//   }

//   private checkPermission(): boolean {
//     let arrayData = this.jsonData$.getValue();
    
//     // let user: any = localStorage.getItem('userAcces');
//     // this.jsonData =  JSON.parse(user)
//     console.log(arrayData);
    
//     // console.log(arrayData); // This should now log the current data from jsonData$

//     if (Array.isArray(arrayData)) {
//       const matchingAuthority = arrayData.find((jsonData: any) => jsonData.navigation?.toLowerCase() === this.allowedRoute);
//       if (matchingAuthority) {
//         const allPermissionsGranted = this.permissions.every(permission => matchingAuthority[permission] === 1);
//         return allPermissionsGranted;
//       }
//     }
//     return false;
//   }

// }














// import { Directive, Input, TemplateRef, ViewContainerRef, OnInit, OnDestroy } from '@angular/core';
// import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
// import { filter, Subscription } from 'rxjs';
// import { AuthSessionService } from '../services/authentication/auth-session.service';
// import { UserAccessService } from '../services/userAccess/UserAccessService';

// @Directive({
//   selector: '[appHasPermission]'
// })
// export class HasPermissionDirective implements OnInit, OnDestroy {
//   private permissions: string[] = [];
//   private allowedRoute: string | undefined;
//   private jsonData: any[] = [];
//   private routerSubscription: Subscription | null = null;
//   private dataSubscription: Subscription | null = null;

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
//     private userAccessService: UserAccessService 
//   ) {}

//   ngOnInit(): void {
//     // Fetch user access data on initialization
//     this.fetchUserAccessData();

//     // Listen to route changes
//     this.routerSubscription = this.router.events
//       .pipe(filter(event => event instanceof NavigationEnd))
//       .subscribe(() => {
//         this.allowedRoute = this.route.snapshot.routeConfig?.path?.toLowerCase() || '';
//         this.updateView();
//       });
//   }

//   ngOnDestroy(): void {
//     // Unsubscribe to avoid memory leaks
//     if (this.routerSubscription) {
//       this.routerSubscription.unsubscribe();
//     }
//     if (this.dataSubscription) {
//       this.dataSubscription.unsubscribe();
//     }
//   }

//   private fetchUserAccessData(): void {
//     const userId: any = localStorage.getItem('userID');
//     if (!userId) {
//       console.error('User ID not found in localStorage');
//       return;
//     }

//     this.dataSubscription = this.userAccessService.getUserAccess(userId).subscribe(
//       (response: any) => {
//         console.log('Raw response from API:', response);
//         // Assuming response.result[0].user_access contains the data
//         if (response && response.result && response.result.length > 0 && response.result[0].user_access) {
//           this.jsonData = response.result[0].user_access;
//         } else {
//           console.error('Unexpected response format or empty user_access:', response);
//           this.jsonData = []; // Ensure jsonData is an array
//         }
//         this.updateView(); // Update the view with the new data
//       },
//       (error: any) => {
//         console.error('Failed to fetch user access data', error);
//       }
//     );
//   }

//   private updateView(): void {
//     this.viewContainer.clear();
//     console.log('Current jsonData:', this.jsonData);
//     if (this.checkPermission()) {
//       this.viewContainer.createEmbeddedView(this.templateRef);
//     }
//   }

//   private checkPermission(): boolean {
//     // Ensure that this.jsonData is an array
//     if (Array.isArray(this.jsonData)) {
//       // Find the authority that matches the current route
//       const matchingAuthority = this.jsonData.find((data: any) => data.navigation?.toLowerCase() === this.allowedRoute);
//       console.log('Matching authority for route', this.allowedRoute, ':', matchingAuthority);
//       // Check if matching authority is found
//       if (matchingAuthority) {
//         // Check if all permissions are granted
//         return this.permissions.every(permission => matchingAuthority[permission] === 1);
//       }
//     }
//     // Return false if no matching authority is found or jsonData is not an array
//     return false;
//   }
// }











import { Directive, Input, TemplateRef, ViewContainerRef, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ChangeDetectorRef } from '@angular/core';
import { UserAccessService } from '../services/userAccess/UserAccessService';

interface Authority {
  navigation?: string;
  [key: string]: number | string | undefined;
}

@Directive({
  selector: '[appHasPermission]'
})
export class HasPermissionDirective implements OnInit, OnDestroy {
  private permissions: string[] = [];
  private allowedRoute: string | undefined;
  private userAccessData: Authority[] = [];
  private routerSubscription: Subscription | null = null;
  private dataSubscription: Subscription | null = null;

  @Input() set appHasPermission(value: string) {
    this.permissions = value.split(',');
    this.updateView();
  }

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private route: ActivatedRoute,
    private router: Router,
    private userAccessService: UserAccessService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchUserAccessData();

    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.allowedRoute = this.route.snapshot.routeConfig?.path?.toLowerCase() || '';
      });
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  private fetchUserAccessData(): void {
    const userId = localStorage.getItem('userID');
    if (!userId) {
      console.error('User ID not found in localStorage');
      return;
    }

    const cleanUserId = userId.replace(/['"]+/g, '');
    this.dataSubscription = this.userAccessService.getUserAccess(cleanUserId).subscribe(
      (response: any) => {
        if (response && response.result && response.result.length > 0 && response.result[0].user_access) {
          this.userAccessData = response.result[0].user_access;
        } else {
          console.error('Unexpected response format or empty user_access:', response);
          this.userAccessData = [];
        }
        this.updateView();
      },
      (error: any) => {
        console.error('Failed to fetch user access data', error);
      }
    );
  }

  private updateView(): void {
    this.viewContainer.clear();
    if (this.checkPermission()) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.cdRef.detectChanges();
    }
  }

  private checkPermission(): boolean {
    if (Array.isArray(this.userAccessData)) {
      const matchingAuthority = this.userAccessData.find((data: Authority) => data.navigation?.toLowerCase() === this.allowedRoute);
      if (matchingAuthority) {
        return this.permissions.every(permission => matchingAuthority[permission] === 1);
      }
    }
    return false;
  }
}

