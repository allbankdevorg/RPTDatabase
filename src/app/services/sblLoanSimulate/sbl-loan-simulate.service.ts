import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SblLoanSimulateService {

  private availBal: number = 0;
  private totalLoan: number = 0;

  setAvailBal(value: any): void {
    this.availBal = value;
  }


  getAvailBal(): any {
    return this.availBal
  }

  setTotalLoan(value: any): void {
    this.totalLoan = value;
  }


  getTotalLoan(): any {
    return this.totalLoan
  }
}
