
import { ValidatorFn, AbstractControl } from '@angular/forms';

export function amount(control: AbstractControl): { [key: string]: boolean } | null {
  const value = control.value;
  if (value && /[^0-9.]/.test(value)) {
    return { lettersOnly: true };
  }
  return null;
}