import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appCaps]'
})
export class CapsLockFormatDirective {

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInput(event: any) {
    this.el.nativeElement.value = this.el.nativeElement.value.toUpperCase();
  }
}
