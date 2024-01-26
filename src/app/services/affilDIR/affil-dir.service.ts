import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AffilDIRService {
  private dirCIS: number = 0;
  private buttonId: number = 0;
  private compCIS: number = 0;

  setDirCIS(value: number): void {
    this.dirCIS = value;
    
  }

  setButtonId(value: number): void {
    this.buttonId = value;
    
  }

  setCompCIS(value: number): void {
    this.compCIS = value;
    
  }

  getDirCIS(): number {
    
    return this.dirCIS;
  }

  getButtonId(): number {
    
    return this.buttonId;
  }

  getCompCIS(): number {
    
    return this.compCIS;
  }

}
