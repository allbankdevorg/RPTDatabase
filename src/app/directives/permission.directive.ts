import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Directive({
  selector: '[appHasPermission]'
})
export class HasPermissionDirective {
  private permissions: string[] = [];
  private allowedRoute: string | undefined;

  @Input() set appHasPermission(value: string) {
    const [permissions] = value.split(';');
    this.permissions = permissions.split(',');
    this.allowedRoute = this.deriveAllowedRoute(); // Call a method to determine the allowed route
    this.updateView();
  }

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private route: ActivatedRoute
  ) {}

  private deriveAllowedRoute(): string | undefined {
    // Implement the logic to determine the allowed route based on user data
    // For example, you might have a property in user data that specifies the route
    // Or you might have a mapping between permissions and routes

    // Replace this logic with your own
    return this.user.authority[0].access.toLowerCase();
  }

  private updateView(): void {
    if (this.checkPermission() && this.checkRoute()) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }

  private checkPermission(): boolean {
    // Check if all specified permissions have a value of 1
    return this.permissions.every(permission => this.user.authority[0][permission] === 1);
  }

  private checkRoute(): boolean {
    // Check if the current route matches the allowed route
    return this.route.snapshot.routeConfig?.path === this.allowedRoute;
  }

  // Replace 'user' with the actual variable representing your user data
  private user = {
    authority: [
      { access: 'users', view: 0, add: 0, edit: 0, delete: 0, maker: 0, approver: 1, reviewer: 0 },
      { access: 'dosri', view: 0, add: 1, edit: 0, delete: 0, maker: 0, approver: 1, reviewer: 0 },
    ]
  };
}
