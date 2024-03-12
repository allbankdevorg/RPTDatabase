import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appLetters]'
})
export class LettersOnlyDirective {
  private regex: RegExp = /^[a-zA-Z\s-.]*$/;

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInput(event: any) {
    const initialValue = this.el.nativeElement.value;
    this.el.nativeElement.value = initialValue.replace(/[^a-zA-Z\s-.]/g, '');
    if (initialValue !== this.el.nativeElement.value) {
      event.stopPropagation();
    }
  }
}