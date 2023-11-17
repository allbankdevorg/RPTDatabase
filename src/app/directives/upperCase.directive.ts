// caps-lock-format.directive.ts
import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appCaps]'
})
export class CapsLockFormatDirective {

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInput(event: any) {
    const initialValue = this.el.nativeElement.value;
    this.el.nativeElement.value = initialValue.toUpperCase();
    if (initialValue !== this.el.nativeElement.value) {
      event.stopPropagation();
    }
  }
}
