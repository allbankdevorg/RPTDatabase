import { Injectable } from '@angular/core';


export interface Loan {
  loan_no: number,
  cis_no: number,
  name: string,
  principal: number,
  principal_bal: number,
  loan_security: string,
  deposit_holdout: number,
  date_granted: any,
  netBal: number
}

@Injectable({
  providedIn: 'root'
})
export class SimulatedDataService {
  private temporaryLoans: Loan[] = [];

  constructor() { }

  addTemporaryLoan(loan: Loan) {
    this.temporaryLoans.push(loan);
    console.log(this.temporaryLoans);
  }

  removeTemporaryLoan(index: number) {
    this.temporaryLoans.splice(index, 1);
  }

  getTemporaryLoans(): Loan[] {
    return this.temporaryLoans;
  }
}
