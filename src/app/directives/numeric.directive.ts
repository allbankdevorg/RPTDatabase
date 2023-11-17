import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appNum]'
})
export class NumericOnlyDirective {

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInput(event: any) {
    const initialValue = this.el.nativeElement.value;
    this.el.nativeElement.value = initialValue.replace(/[^0-9]*/g, '');
    if (initialValue !== this.el.nativeElement.value) {
      event.stopPropagation();
    }
  }
}