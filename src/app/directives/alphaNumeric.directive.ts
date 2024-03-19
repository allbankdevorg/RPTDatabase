import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appAlphanumeric]'
})
export class AlphanumericDirective {

  constructor(private elementRef: ElementRef) { }

  @HostListener('input', ['$event']) onInputChange(event: any) {
    const initialValue = this.elementRef.nativeElement.value;
    const alphanumericValue = initialValue.replace(/[^a-zA-Z0-9]/g, ''); // Add comma (,) to the regular expression

    if (initialValue !== alphanumericValue) {
      this.elementRef.nativeElement.value = alphanumericValue;
      this.elementRef.nativeElement.dispatchEvent(new Event('input'));
    }
  }
}
