import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appDecimalOnly]'
})
export class DecimalOnlyDirective {
  @HostListener('keypress', ['$event']) onKeyPress(event: KeyboardEvent) {
    const pattern = /^[0-9]+(\.?)[0-9]{0,2}$/;
    const inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(event.key)) {
      event.preventDefault();
    }
  }
}