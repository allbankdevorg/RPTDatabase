import { ValidatorFn, AbstractControl } from '@angular/forms';

export function lettersOnly(control: AbstractControl): { [key: string]: boolean } | null {
  const value = control.value;
  if (value && /[^a-zA-Z ,.]/.test(value)) {
    return { lettersOnly: true };
  }
  return null;
}

// export function patternValidator(patterns: { pattern: RegExp, message: string }[]): ValidatorFn {
//   return (control: AbstractControl): { [key: string]: any } | null => {
//     if (!patterns || patterns.length === 0) {
//       return null; // No patterns provided, validation passes
//     }

//     const inputValue: string = control.value;
//     for (const { pattern, message } of patterns) {
//       if (pattern.test(inputValue)) {
//         return null; // Validation passed
//       }
//     }

//     // If none of the patterns match, return error with the first pattern's message
//     return { 'patternMismatch': { message: patterns[0].message } };
//   };




  
// }
