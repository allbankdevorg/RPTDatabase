import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MyDataService {
  private bnValue: string = '';

  setBnValue(value: string) {
    this.bnValue = value;
  }

  getBnValue(): string {
    return this.bnValue;
  }
  
  constructor() { }
}
