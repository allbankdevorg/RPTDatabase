import { AbstractControl, ValidatorFn } from '@angular/forms';

// Custom validator function for letters and spaces only
export function patternValidator(pattern: RegExp): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const isValid = pattern.test(control.value);
    return isValid ? null : { pattern: { value: control.value } };
  };
}