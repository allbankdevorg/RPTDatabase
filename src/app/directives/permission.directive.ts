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

    console.log(this.allowedRoute);
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
      { access: 'users', view: 0, add: 1, edit: 1, delete: 0, maker: 1, approver: 0, reviewer: 1 },
      { access: 'bankofficer', view: 1, add: 0, edit: 1, delete: 0, maker: 1, approver: 0, reviewer: 1 },
      { access: 'directorsrelated/:id', view: 1, add: 1, edit: 1, delete: 0, maker: 1, approver: 0, reviewer: 1 },
    ],
  };
}


