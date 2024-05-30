// import { Directive, Input, TemplateRef, ViewContainerRef, OnInit } from "@angular/core";
// import { UserAccessService } from '../services/userAccess/UserAccessService';

// @Directive({
//   selector: "[accessControl]",
// })
// export class AccessControlDirective implements OnInit {
//   @Input("accessControlModuleName") moduleName!: string;
//   @Input("accessControlAccessType") accessType!: string;

//   private hasView = false;

//   constructor(
//     private templateRef: TemplateRef<any>,
//     private viewContainer: ViewContainerRef,
//     private auth: UserAccessService
//   ) {}

//   ngOnInit() {
//     const userId: any = localStorage.getItem('userID');
//     if (!userId) {
//       console.error('User ID not found in localStorage');
//       return;
//     }

//     const cleanUserId = userId.replace(/['"]+/g, '');
//     this.auth.getUserAccess(cleanUserId).subscribe(
//       (response: any) => {
//         if (response && response.result && Array.isArray(response.result) && response.result.length > 0) {
//           const userAccess = response.result[0].user_access;
//           const module: any = userAccess.find(access => access.navigation_name === this.moduleName);

//           if (module && module[this.accessType]) {
//             if (!this.hasView) {
//               this.viewContainer.createEmbeddedView(this.templateRef);
//               this.hasView = true;
//             }
//           } else {
//             if (this.hasView) {
//               this.viewContainer.clear();
//               this.hasView = false;
//             }
//           }
//         } else {
//           console.error('Invalid response format:', response);
//         }
//       },
//       (error: any) => {
//         console.error('Failed to fetch user access data', error);
//       }
//     );
//   }
// }




// ****************** 2 Attribute Based Directives*********************//

// import { Directive, Input, OnInit, ElementRef, Renderer2 } from "@angular/core";
// import { UserAccessService } from '../services/userAccess/UserAccessService';

// @Directive({
//   selector: "[accessControl]",
// })
// export class AccessControlDirective implements OnInit {
//   @Input("moduleName") moduleName!: string;
//   @Input("accessType") accessType!: string;

//   constructor(
//     private elementRef: ElementRef,
//     private renderer: Renderer2,
//     private auth: UserAccessService
//   ) {
//     // Hide the element by default
//     this.renderer.setStyle(this.elementRef.nativeElement, 'display', 'none');
//   }

//   ngOnInit() {
//     const userId: any = localStorage.getItem('userID');
//     if (!userId) {
//       // console.error('User ID not found in localStorage');
//       return;
//     }

//     const cleanUserId = userId.replace(/['"]+/g, '');
//     this.auth.getUserAccess(cleanUserId).subscribe(
//       (response: any) => {
//         if (response && response.result && Array.isArray(response.result) && response.result.length > 0) {
//           const userAccess = response.result[0].user_access;
          
//           const module: any = userAccess.find(access => access.navigation_name === this.moduleName);

//           if (module && module[this.accessType]) {
//             this.renderer.setStyle(this.elementRef.nativeElement, 'display', 'inline-block');
//           }
//         } else {
//           // console.error('Invalid response format:', response);
//         }
//       },
//       (error: any) => {
//         // console.error('Failed to fetch user access data', error);
//       }
//     );
//   }
// }



// *********** 3 Working Structural Directives*****************//

// import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from "@angular/core";
// import { UserAccessService } from '../services/userAccess/UserAccessService';

// interface AccessControlContext {
//   moduleName: string;
//   accessType: string;
// }

// @Directive({
//   selector: "[accessControl]",
// })
// export class AccessControlDirective implements OnInit {
//   @Input("accessControl") accessControl!: AccessControlContext;

//   constructor(
//     private templateRef: TemplateRef<any>,
//     private viewContainer: ViewContainerRef,
//     private auth: UserAccessService
//   ) {}

//   ngOnInit() {
//     const userId: any = localStorage.getItem('userID');
//     if (!userId) {
//       this.viewContainer.clear();
//       return;
//     }

//     const cleanUserId = userId.replace(/['"]+/g, '');
//     this.auth.getUserAccess(cleanUserId).subscribe(
//       (response: any) => {
//         if (response && response.result && Array.isArray(response.result) && response.result.length > 0) {
//           const userAccess = response.result[0].user_access;
//           const module: any = userAccess.find(access => access.navigation_name === this.accessControl.moduleName);

//           if (module && module[this.accessControl.accessType]) {
//             this.viewContainer.createEmbeddedView(this.templateRef);
//           } else {
//             this.viewContainer.clear();
//           }
//         } else {
//           this.viewContainer.clear();
//         }
//       },
//       (error: any) => {
//         this.viewContainer.clear();
//       }
//     );
//   }
// }



import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from "@angular/core";
import { UserAccessService } from '../services/userAccess/UserAccessService';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

interface AccessControlContext {
  moduleName: string;
  accessType: string;
}

@Directive({
  selector: "[accessControl]"
})
export class AccessControlDirective implements OnInit {
  @Input("accessControl") accessControl!: AccessControlContext;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private auth: UserAccessService
  ) {}

  ngOnInit() {
    const userId = localStorage.getItem('userID');
    if (!userId) {
      this.clearView();
      return;
    }

    const cleanUserId = userId.replace(/['"]+/g, '');
    this.auth.getUserAccess(cleanUserId).pipe(
      catchError(() => of(null)) // Handle errors gracefully
    ).subscribe((response: any) => {
      if (this.hasAccess(response)) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else {
        this.clearView();
      }
    });
  }

  private hasAccess(response: any): boolean {
    if (response && response.result && Array.isArray(response.result) && response.result.length > 0) {
      const userAccess = response.result[0].user_access;
      const module: any = userAccess.find(access => access.navigation_name === this.accessControl.moduleName);
      return module && module[this.accessControl.accessType];
    }
    return false;
  }

  private clearView(): void {
    this.viewContainer.clear();
  }
}

