// import { Directive, ElementRef, HostListener } from '@angular/core';

// @Directive({
//   selector: '[appNum]'
// })
// export class NumericOnlyDirective {

//   constructor(private el: ElementRef) {}

//   @HostListener('input', ['$event'])
//   onInput(event: any) {
//     const initialValue = this.el.nativeElement.value;
//     this.el.nativeElement.value = initialValue.replace(/[^0-9]*/g, '');
//     if (initialValue !== this.el.nativeElement.value) {
//       event.stopPropagation();
//     }
//   }
// }



import { Directive, ElementRef, HostListener } from '@angular/core';
import Swal from 'sweetalert2';


@Directive({
  selector: '[appNum]'
})
export class NumericOnlyDirective {

  private readonly decimalPattern: RegExp = /^\d*\.?\d{0,2}$/;

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInput(event: any) {
    const inputValue: string = this.el.nativeElement.value;
    
    // If the current value doesn't match the pattern
    if (!this.decimalPattern.test(inputValue)) {
      const cleanedValue = inputValue.replace(/[^0-9.]/g, '');
      
      // Check if there are multiple decimal points or more than 2 decimals
      const parts = cleanedValue.split('.');
      if (parts.length > 2 || (parts[1] && parts[1].length > 2)) {
        Swal.fire({
          icon: 'warning',
          title: 'Invalid Input',
          text: 'Only up to 2 decimal places are allowed.',
          confirmButtonText: 'OK'
        }); // Display alert message
        this.el.nativeElement.value = `${parts[0]}.${parts[1].substring(0, 2)}`;
      } else {
        this.el.nativeElement.value = cleanedValue;
      }
    }
    
    // Stop propagation if the value was modified
    if (inputValue !== this.el.nativeElement.value) {
      event.stopPropagation();
    }
  }
}
