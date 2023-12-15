// title-case.directive.ts
import { Directive, ElementRef, HostListener, Renderer2, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: '[appTitleCase]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TitleCaseDirective),
      multi: true
    }
  ]
})
export class TitleCaseDirective implements ControlValueAccessor {

  onChange: any = () => {};
  onTouched: any = () => {};

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('input', ['$event.target.value'])
  onInput(value: string) {
    const transformedValue = this.toTitleCase(value);
    this.renderer.setProperty(this.el.nativeElement, 'value', transformedValue);
    this.onChange(transformedValue);
  }

  writeValue(value: any): void {
    const transformedValue = this.toTitleCase(value);
    this.renderer.setProperty(this.el.nativeElement, 'value', transformedValue);
    this.onChange(transformedValue);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  private toTitleCase(input: string): string {
    return input.toLowerCase().replace(/\b\w/g, (word) => word.toUpperCase());
  }
}
