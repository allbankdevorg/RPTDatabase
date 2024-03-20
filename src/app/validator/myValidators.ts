import { AbstractControl, ValidatorFn } from '@angular/forms';

export function customRequiredValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const isEmpty = control.value === null || control.value === undefined || control.value === '';
    return isEmpty ? { 'customRequired': true } : null;
  };
}
