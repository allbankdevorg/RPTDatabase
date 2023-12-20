import { Directive, ElementRef, HostListener,  Renderer2, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';


@Directive({
  selector: '[appCaps]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CapsLockFormatDirective),
      multi: true
    }
  ]
})
export class CapsLockFormatDirective implements ControlValueAccessor {

  onChange: any = () => {};
  onTouched: any = () => {};

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('input', ['$event.target.value'])
  onInput(value: string) {
    const transformedValue = this.toCapsCase(value);
    this.renderer.setProperty(this.el.nativeElement, 'value', transformedValue);
    this.onChange(transformedValue);
  }

  @HostListener('blur')
  onBlur() {
    this.onTouched();
  }

  writeValue(value: any): void {
    const transformedValue = this.toCapsCase(value);
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

  private toCapsCase(input: string): string {
    return input.toUpperCase().replace(/\b\w/g, (word) => word.toUpperCase());
  }

  // @HostListener('input', ['$event'])
  // onInput(event: any) {
  //   this.el.nativeElement.value = this.el.nativeElement.value.toUpperCase();
  // }
}
