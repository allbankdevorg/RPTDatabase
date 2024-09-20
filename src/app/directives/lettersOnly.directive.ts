import { Directive, ElementRef, HostListener, ViewChild, AfterViewInit } from '@angular/core';
import { AbstractControl, ControlContainer, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[appLetters]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: LettersOnlyDirective,
      multi: true
    }
  ]
})
export class LettersOnlyDirective implements Validator, AfterViewInit {
  private regex: RegExp = /^[a-zA-ZÑñ\s-.,()]*$/;
  private control!: AbstractControl;
  private previousValue: string = '';

  constructor(private el: ElementRef, private controlContainer: ControlContainer) {}

  ngAfterViewInit() {
    this.control = this.controlContainer.control!.get(this.el.nativeElement.getAttribute('formControlName'))!;
  }

  @HostListener('input', ['$event'])
  onInput(event: any) {
    const currentValue = this.el.nativeElement.value;
    
    // Check if the current value matches the pattern
    if (this.regex.test(currentValue)) {
      this.previousValue = currentValue; // Update the previous value
    } else {
      // If the current value doesn't match the pattern, revert to the previous value
      this.el.nativeElement.value = this.previousValue;
    }

    // Set the value to null if it doesn't match the pattern
    if (currentValue !== this.el.nativeElement.value) {
      this.control.markAsUntouched();
      this.control.markAsPristine();
      event.stopPropagation();
    }
  }

  validate(control: AbstractControl): ValidationErrors | null {
    const isValid = this.regex.test(control.value);
    return isValid ? null : { 'onlyLetters': true };
  }
}
