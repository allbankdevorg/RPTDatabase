import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BoRIService {
  private boCIS: number = 0;
  private buttonId: number = 0;

  setboCIS(value: number): void {
    this.boCIS = value;
    // console.log('DataService - dirCIS set to:', value);
  }

  setButtonId(value: number): void {
    this.buttonId = value;
    // console.log('DataService - ButtonId set to:', value);
  }


  getboCIS(): number {
    // console.log('DataService - dirCIS set to:', this.dirCIS);
    return this.boCIS;
  }

  getButtonId(): number {
    // console.log('DataService - ButtonId set to:', this.buttonId);
    return this.buttonId;
  }

}
