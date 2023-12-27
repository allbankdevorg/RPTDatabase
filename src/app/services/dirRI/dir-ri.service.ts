import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class DirRIService {
  private dirCIS: number = 0;
  private buttonId: number = 0;
  private compCIS: number = 0;

  setDirCIS(value: number): void {
    this.dirCIS = value;
    // console.log('DataService - dirCIS set to:', value);
  }

  setButtonId(value: number): void {
    this.buttonId = value;
    // console.log('DataService - ButtonId set to:', value);
  }

  setCompCIS(value: number): void {
    this.compCIS = value;
    // console.log('DataService - compCIS set to:', value);
  }

  getDirCIS(): number {
    // console.log('DataService - dirCIS set to:', this.dirCIS);
    return this.dirCIS;
  }

  getButtonId(): number {
    // console.log('DataService - ButtonId set to:', this.buttonId);
    return this.buttonId;
  }

  getCompCIS(): number {
    // console.log('DataService - compCIS set to:', this.compCIS);
    return this.compCIS;
  }

  
}
