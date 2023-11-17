// title-case.directive.ts
import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appTitleCase]'
})
export class TitleCaseDirective {

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event.target.value'])
  onInput(value: string) {
    this.el.nativeElement.value = this.toTitleCase(value);
  }

  private toTitleCase(input: string): string {
    return input.toLowerCase().replace(/\b\w/g, (word) => word.toUpperCase());
  }
}
