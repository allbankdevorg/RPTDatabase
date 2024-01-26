import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BoRIService {
  private boCIS: number = 0;
  private buttonId: number = 0;

  setboCIS(value: number): void {
    this.boCIS = value;
  }

  setButtonId(value: number): void {
    this.buttonId = value;
  }


  getboCIS(): number {
    return this.boCIS;
  }

  getButtonId(): number {
    return this.buttonId;
  }

}
