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

  @HostListener('blur')
  onBlur() {
    this.onTouched();
  }

  writeValue(value: any): void {
    const transformedValue = this.toTitleCase(value);
    this.renderer.setProperty(this.el.nativeElement, 'value', transformedValue);
    this.onChange(transformedValue);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
    // Call it initially for empty values
    this.onChange(this.el.nativeElement.value);
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  private toTitleCase(input: string): string {
    return input.replace(/\b\w/gu, (char, index) => {
      // Check if the current character is preceded by a space
      const isAfterSpace = index === 0 || /\s/.test(input[index - 1]);
      return isAfterSpace ? char.toUpperCase() : char;
    });
  }
  
}
