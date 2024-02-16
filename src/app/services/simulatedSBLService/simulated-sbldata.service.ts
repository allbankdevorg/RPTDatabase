import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';

export interface Loan {
  loan_no: number,
  cis_no: number,
  name: string,
  principal: number,
  principal_bal: number,
  loan_security: string,
  deposit_holdout: number,
  date_granted: any,
  net_holdout: number,
  off_cisnumber: string,
}

export interface LoanWrapper {
  loan: Loan;
  index: number;
}

@Injectable({
  providedIn: 'root'
})
export class SimulatedSBLDataService {
  private temporaryLoans: LoanWrapper[] = [];
  private simulationPerformed: boolean = false;
  private indexValue?: number;

  constructor(private router: Router) {
    // Subscribe to router events to reset the state on navigation start
    this.router.events.pipe(
      filter(event => event instanceof NavigationStart)
    ).subscribe(() => {
      this.resetSimulationPerformed();
    });
  }

  setSimulationPerformed() {
    this.simulationPerformed = true;
  }

  isSimulationPerformed(): boolean {
    return this.simulationPerformed;
  }

  resetSimulationPerformed() {
    this.simulationPerformed = false;
    this.clearTemporaryLoans();
  }

  addTemporaryLoan(index: number, loan: Loan) {
    this.temporaryLoans.push({ loan, index });
  }

  setindexValue(indexValue: number) {
    this.indexValue = indexValue;
  }

  getindexValue() {
    return this.indexValue;
  }

  removeTemporaryLoan(index: number) {
    this.temporaryLoans.splice(index, 1);
  }

  clearTemporaryLoans(): void {
    this.temporaryLoans = [];
  }

  getTemporaryLoans(): LoanWrapper[] {
    return this.temporaryLoans;
  }


}
