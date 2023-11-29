import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appShowIfPermission]'
})
export class ShowIfPermissionDirective {
  private permissions: string[] = [];

  @Input() set appShowIfPermission(value: string) {
    this.permissions = value.split(',');
    this.updateView();
  }

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}

  private updateView(): void {
    if (this.checkPermission()) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }

  private checkPermission(): boolean {
    // Check if any of the specified permissions has a value of 1
    return this.permissions.some(permission => this.user.authority[0][permission] === 1);
  }

  // Replace 'user' with the actual variable representing your user data
  private user = {
    authority: [
      { access: 'Affiliates', view: 1, add: 0, edit: 0, delete: 0, maker: 0, approver: 1, reviewer: 0 },
    ]
  };
}
