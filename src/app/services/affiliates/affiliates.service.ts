import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AffiliatesService {
  private moduleV: any;

  setmoduleV(value: any): void {
    this.moduleV = value;
  }


  getmoduleV(): any {
    return this.moduleV
  }
}
