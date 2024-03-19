import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[preventSpecialCharacters]'
})
export class PreventSpecialCharactersDirective {

  constructor() { }

  @HostListener('keypress', ['$event']) onKeyPress(event: KeyboardEvent) {
    const allowedChars = /[A-Za-z0-9]/; // Regular expression to allow only letters and numbers
    const inputChar = event.key;

    if (!allowedChars.test(inputChar)) {
      event.preventDefault(); // Prevent the character from being entered
    }
  }
}
